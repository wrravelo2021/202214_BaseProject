import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
@Injectable()
export class ClubSocioService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    club.socios = [...club.socios, socio];
    return await this.clubRepository.save(club);
  }

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return club.socios;
  }

  async findMemberFromClub(
    clubId: string,
    socioId: string,
  ): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const socioClub: SocioEntity = club.socios.find((e) => e.id === socio.id);

    if (!socioClub)
      throw new BusinessLogicException(
        'The socio with the given id is not associated to the club',
        BusinessError.PRECONDITION_FAILED,
      );

    return socioClub;
  }

  async updateMembersFromClub(
    clubId: string,
    sociosIds: string[],
  ): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const newSocios = [];
    for (let i = 0; i < sociosIds.length; i++) {
      const socio: SocioEntity = await this.socioRepository.findOne({
        where: { id: sociosIds[i] },
      });

      if (!socio)
        throw new BusinessLogicException(
          'The socio with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      newSocios.push(socio);
    }

    club.socios = newSocios;
    return await this.clubRepository.save(club);
  }

  async deleteMemberFromClub(clubId: string, socioId: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id: socioId },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The socio with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const clubSocio: SocioEntity = club.socios.find((e) => e.id === socio.id);

    if (!clubSocio)
      throw new BusinessLogicException(
        'The socio with the given id is not associated to the club',
        BusinessError.PRECONDITION_FAILED,
      );

    club.socios = club.socios.filter((e) => e.id !== socioId);
    await this.clubRepository.save(club);
  }
}
