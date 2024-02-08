import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  @Get('search')
  async findOne(@Query('name') name: string) {
    return await this.servicesService.findOne(name);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return await this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.servicesService.remove(id);
  }
}
