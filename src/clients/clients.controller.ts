import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':clientId')
  findOne(@Param('clientId') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':clientId')
  update(
    @Param('clientId') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':clientId')
  remove(@Param('clientId') id: string) {
    return this.clientsService.remove(+id);
  }
}
