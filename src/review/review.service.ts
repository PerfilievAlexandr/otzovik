import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto): Promise<ReviewModel> {
    return await this.prisma.review.create({ data: dto });
  }

  async delete(id: string): Promise<string> {
    const { id: deleteId } = await this.prisma.review.delete({ where: { id } });

    if (!deleteId) {
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }

    return deleteId;
  }

  async findByProductId(productId: string): Promise<ReviewModel[]> {
    return await this.prisma.review.findMany({
      where: { productId },
    });
  }

  async deleteByProductId(productId: string): Promise<number> {
    const { count } = await this.prisma.review.deleteMany({
      where: { productId },
    });

    return count;
  }
}
