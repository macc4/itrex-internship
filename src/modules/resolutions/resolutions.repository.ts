import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateResolutionDto } from './dto/create-resolution.dto';
import { GetResolutionsFilterDto } from './dto/get-resolutions-filter.dto';
import { Resolution } from './resolution.entity';

@EntityRepository(Resolution)
export class ResolutionsRepository extends Repository<Resolution> {
  //
  // Create a new resolution
  //

  async createResolution(
    createResolutionDto: CreateResolutionDto,
  ): Promise<Resolution> {
    const { patientId, doctorId, text } = createResolutionDto;

    const resolution = this.create({
      patient_id: patientId,
      doctor_id: doctorId,
      text,
      expiry: createResolutionDto.expiryDate,
    });

    await this.save(resolution);

    return resolution;
  }

  //
  // Get all resolutions with an optional query
  //

  async getResolutions(
    filterDto: GetResolutionsFilterDto,
  ): Promise<Resolution[]> {
    const { patientId, doctorId } = filterDto;
    const query = this.createQueryBuilder('resolution');

    if (patientId) {
      query.andWhere('resolution.patient_id = :patientId', { patientId });
    }

    if (doctorId) {
      query.andWhere('resolution.doctor_id = :doctorId', { doctorId });
    }

    query.andWhere(
      new Brackets((qb) => {
        qb.where('resolution.expiry IS NULL').orWhere(
          'resolution.expiry > Now()',
        );
      }),
    );

    const resolutions = await query.getMany();

    return resolutions;
  }

  //
  // Get resolution by id
  //

  async getResolutionById(id: number): Promise<Resolution> {
    const resolution = await this.findOne(id);

    return resolution;
  }

  //
  // Delete resolution by id
  //

  async deleteResolutionById(id: number): Promise<number> {
    const resolution = await this.delete(id);

    return resolution.affected;
  }
}
