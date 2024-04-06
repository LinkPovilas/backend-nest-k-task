import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  findOne(clientId: number) {
    return this.clientsRepository.findOne({ where: { client_id: clientId } });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return this.clientsRepository.save({ ...client, ...updateClientDto });
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client) {
      throw new BadRequestException('Client not found');
    }
    return this.clientsRepository.delete({ id: client.id });
  }
}
