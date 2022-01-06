import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('create')
  async create(@Body() dto: CreateReviewDto): Promise<ReviewModel> {
    return await this.reviewService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.reviewService.delete(id);
  }

  @Get('by-product/:productId')
  async get(@Param('productId') productId: string): Promise<ReviewModel[]> {
    return await this.reviewService.findByProductId(productId);
  }

  @Delete('by-product/:productId')
  async deleteByProductId(
    @Param('productId') productId: string,
  ): Promise<number> {
    return await this.reviewService.deleteByProductId(productId);
  }
}
