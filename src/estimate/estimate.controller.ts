import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('estimate')
@Controller('estimate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EstimateController {
  @Post()
  @ApiOperation({ summary: 'Estimate LCA parameters' })
  async estimate(@Body() estimateDto: any) {
    return { message: 'Estimate endpoint - to be implemented' };
  }
}

