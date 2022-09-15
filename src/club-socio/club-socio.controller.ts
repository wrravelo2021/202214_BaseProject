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
import { plainToInstance } from 'class-transformer';
import { SocioDto } from 'src/socio/socio.dto';
import { SocioEntity } from 'src/socio/socio.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
  constructor(private readonly clubSocioService: ClubSocioService) {}

  @Post(':clubId/members/:socioId')
  async addArtworkMuseum(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.clubSocioService.addMemberToClub(clubId, socioId);
  }

  @Get(':clubId/members')
  async findMembersFromClub(@Param('clubId') clubId: string) {
    return await this.clubSocioService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:socioId')
  async findMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.clubSocioService.findMemberFromClub(clubId, socioId);
  }

  @Put(':clubId/members')
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body() sociosDto: SocioDto[],
  ) {
    const socios = plainToInstance(SocioEntity, sociosDto);
    return await this.clubSocioService.updateMembersFromClub(clubId, socios);
  }

  @Delete(':clubId/members/:socioId')
  @HttpCode(204)
  async deleteArtworkMuseum(
    @Param('clubId') clubId: string,
    @Param('socioId') socioId: string,
  ) {
    return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
  }
}
