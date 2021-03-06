import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReviewModule } from '../src/review/review.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserDto } from '../src/auth/dto/user.dto';

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title',
  description: 'It is description',
  rating: 5,
  productId: uuidv4(),
};

const loginData: UserDto = {
  login: 'w@m.ru',
  password: '1234',
};

describe('ReviewModule (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ReviewModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData);
    token = body.access_token;
  });

  it('/review/create (POST)', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body.id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/by-product/:productId (GET)', () => {
    return request(app.getHttpServer())
      .get(`/review/by-product/${uuidv4()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/review/${uuidv4()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    const prismaService = new PrismaService();
    prismaService.$disconnect();
  });
});
