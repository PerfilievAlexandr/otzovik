import {
  Controller,
  Post,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @Delete('user/:id')
  async deleteUserById(@Param('id') id: string): Promise<string> {
    return this.authService.deleteUserById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: UserDto) {
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: UserDto) {
    const { email } = await this.authService.validateUser(
      dto.login,
      dto.password,
    );
    return await this.authService.login(email);
  }
}
