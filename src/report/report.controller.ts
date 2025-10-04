import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('report')
@Controller('report')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportController {
  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async findAll() {
    return { message: 'Reports endpoint - to be implemented' };
  }

  @Post()
  @ApiOperation({ summary: 'Generate new report' })
  async generate(@Body() generateDto: any) {
    return { message: 'Generate report - to be implemented' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  async findOne(@Param('id') id: string) {
    return { message: `Get report ${id} - to be implemented` };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download report' })
  async download(@Param('id') id: string) {
    return { message: `Download report ${id} - to be implemented` };
  }
}

