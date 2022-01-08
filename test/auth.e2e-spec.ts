import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserDto } from '../src/auth/dto/user.dto';
import { USER_ALREADY_EXISTS_ERROR } from '../src/auth/auth.constants';

const registerData: UserDto = {
  login: 'e@m.ru',
  password: '1234',
};

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerData)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expect(createdId).toBeDefined();
      });
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(registerData)
      .expect(200)
      .then(({ body }: request.Response) => {
        token = body.access_token;
        expect(token).toBeDefined();
      });
  });

  it('/auth/register (POST) error', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerData)
      .expect(400, {
        statusCode: 400,
        message: USER_ALREADY_EXISTS_ERROR,
        error: 'Bad Request',
      });
  });

  it('/auth/user/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/auth/user/${createdId}`)
      .expect(200);
  });

  afterAll(() => {
    const prismaService = new PrismaService();
    prismaService.$disconnect();
  });
});
