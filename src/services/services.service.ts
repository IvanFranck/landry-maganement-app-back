import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma.service';
import { Service } from '@prisma/client';
import { ResponseInterface } from '@/common/interfaces/response.interface';
import { AccessTokenValidatedRequestInterface } from '@/common/interfaces/access-token-validated-request.interface';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A function to create a new service.
   *
   * @param {CreateServiceDto} createServiceDto The service data
   * @param {AccessTokenValidatedRequestInterface} request The validated request object
   * @return {Promise<ResponseInterface<Service>>} The created service
   */
  async create(
    createServiceDto: CreateServiceDto,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<ResponseInterface<Service>> {
    const id = request.user.sub;
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          services: {
            create: createServiceDto,
          },
        },
        select: {
          services: true,
        },
      });

      return {
        message: 'service créé!',
        data: user.services[0],
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('un service avec ce nom existe déja');
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
