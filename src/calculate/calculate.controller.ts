import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('calculate')
@Controller('calculate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalculateController {
  @Post()
  @ApiOperation({ summary: 'Calculate LCA results' })
  async calculate(@Body() calculateDto: any) {
    return { message: 'Calculate endpoint - to be implemented' };
  }
}

