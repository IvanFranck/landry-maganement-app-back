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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AccessTokenAuthGuard } from 'src/auth/guards/access-token-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenValidatedRequestInterface } from '@/common/interfaces/access-token-validated-request.interface';

@ApiTags('services')
@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBody({ type: CreateServiceDto })
  @ApiCreatedResponse({ description: 'service créé!' })
  @ApiBadRequestResponse({ description: 'un service avec ce nom existe déja' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.servicesService.create(createServiceDto, req);
  }

  @Get()
  async findAll(@Req() req: any) {
    console.log('service controller', req.user);
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
