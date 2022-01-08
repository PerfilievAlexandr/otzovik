import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { UserModel } from './user.model';
import {
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.prisma.auth.findMany({});
  }

  async deleteUserById(id: string): Promise<string> {
    const { id: userId } = await this.prisma.auth.delete({
      where: { id },
    });

    return userId;
  }

  async createUser(dto: UserDto) {
    const newUser = await this.findUser(dto.login);

    if (newUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS_ERROR);
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(dto.password, salt);

    return await this.prisma.auth.create({
      data: { email: dto.login, password: hashedPassword },
    });
  }

  async findUser(email: string): Promise<UserModel> {
    return await this.prisma.auth.findFirst({
      where: { email },
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
