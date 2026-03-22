import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new rural producer and their farms' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all registered producers' })
  findAll() {
    return this.producersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific producer' })
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a producer and their farms' })
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a producer from the system' })
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
