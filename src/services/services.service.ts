import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma.service';
import { Service } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * create service.
   *
   * @param {CreateServiceDto} createServiceDto - the data to create a new service
   * @return {Promise<{ messge: string, service: Service }>} a Promise containing an object with a message and the created service
   */
  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<{ messge: string; service: Service }> {
    try {
      const service = await this.prisma.service.create({
        data: { ...createServiceDto },
      });

      return {
        messge: 'service created!',
        service,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('service with this name already exists');
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * A function to find all services.
   *
   * @return {Promise<Service[]>} The list of services found
   */
  async findAll(): Promise<Service[]> {
    try {
      const services = await this.prisma.service.findMany();

      if (!services || services.length === 0) {
        throw new NotFoundException('any service found');
      }

      return services;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  /**
   * A function to find a service by name.
   *
   * @param {string} name - the name of the service to find
   * @return {Promise<{ message: string, service: Service }>} an object containing a message and the service found
   */
  async findOne(name: string): Promise<{ message: string; service: Service }> {
    try {
      const services = await this.findAll();

      const service = services.find((service) => service.label.includes(name));

      if (!service) {
        throw new NotFoundException('service not found');
      }
      return {
        message: 'service found',
        service,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  /**
   * A function to update a service.
   *
   * @param {number} id - description of parameter
   * @param {UpdateServiceDto} updateServiceDto - description of parameter
   * @return {Promise<{ message: string, service: unknown }>} description of return value
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<{ message: string; service: unknown }> {
    try {
      const service = await this.prisma.service.update({
        where: {
          id,
        },
        data: {
          ...updateServiceDto,
        },
      });

      if (!service) {
        throw new NotFoundException();
      }
      return {
        message: 'service updated',
        service,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException("can't find any service with this id");
      }
      console.error('error: ', error);
      throw new BadRequestException(error);
    }
  }

  /**
   * A function to delete a service.
   *
   * @param {number} id - description of parameter
   * @return {Promise<{message: string, service: any}>} description of return value
   */
  async remove(id: number): Promise<{ message: string; service: any }> {
    try {
      const service = await this.prisma.service.delete({
        where: {
          id,
        },
      });
      return {
        message: 'service deleted',
        service,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2025') {
        throw new BadRequestException("can't find any service with this id");
      }
      throw new BadRequestException(error);
    }
  }
}
