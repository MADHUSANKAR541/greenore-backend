import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('factors')
@Controller('factors')
export class FactorsController {
  @Get()
  @ApiOperation({ summary: 'Get all factors' })
  async findAll() {
    return { message: 'Factors endpoint - to be implemented' };
  }

  @Post()
  @ApiOperation({ summary: 'Create new factor' })
  async create(@Body() createFactorDto: any) {
    return { message: 'Create factor - to be implemented' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get factor by ID' })
  async findOne(@Param('id') id: string) {
    return { message: `Get factor ${id} - to be implemented` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update factor' })
  async update(@Param('id') id: string, @Body() updateFactorDto: any) {
    return { message: `Update factor ${id} - to be implemented` };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete factor' })
  async remove(@Param('id') id: string) {
    return { message: `Delete factor ${id} - to be implemented` };
  }
}

