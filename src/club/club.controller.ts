import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { plainToInstance } from 'class-transformer';
import { ClubDto } from './club.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async findAll() {
    return await this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return await this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: ClubDto) {
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.create(club);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return await this.clubService.delete(clubId);
  }
}
