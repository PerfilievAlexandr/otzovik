import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PageModel } from './page.model';
import { FindPageDto } from './dto/find-page.dto';

@Controller('page')
export class PageController {
  @Post('create')
  async create(@Body() dto: Omit<PageModel, '_id'>) {

  }

  @Get(':id')
  async get(@Param('id') id: string) {

  }

  @Delete(':id')
  async delete(@Param('id') id: string) {

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: PageModel) {

  }

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindPageDto) {

  }
}
