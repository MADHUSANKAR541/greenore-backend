import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ScenariosService } from './scenarios.service';
import { CreateScenarioDto, UpdateScenarioDto, ScenarioResponseDto } from './dto/scenario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('scenarios')
@Controller('scenarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new scenario' })
  @ApiResponse({ status: 201, description: 'Scenario created successfully', type: ScenarioResponseDto })
  async create(@Body() createScenarioDto: CreateScenarioDto): Promise<ScenarioResponseDto> {
    return this.scenariosService.create(createScenarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all scenarios' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Scenarios retrieved successfully', type: [ScenarioResponseDto] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ): Promise<{ scenarios: ScenarioResponseDto[]; total: number; page: number; limit: number }> {
    return this.scenariosService.findAll({ page, limit, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scenario by ID' })
  @ApiParam({ name: 'id', description: 'Scenario ID' })
  @ApiResponse({ status: 200, description: 'Scenario retrieved successfully', type: ScenarioResponseDto })
  @ApiResponse({ status: 404, description: 'Scenario not found' })
  async findOne(@Param('id') id: string): Promise<ScenarioResponseDto> {
    return this.scenariosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update scenario' })
  @ApiParam({ name: 'id', description: 'Scenario ID' })
  @ApiResponse({ status: 200, description: 'Scenario updated successfully', type: ScenarioResponseDto })
  @ApiResponse({ status: 404, description: 'Scenario not found' })
  async update(
    @Param('id') id: string,
    @Body() updateScenarioDto: UpdateScenarioDto,
  ): Promise<ScenarioResponseDto> {
    return this.scenariosService.update(id, updateScenarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete scenario' })
  @ApiParam({ name: 'id', description: 'Scenario ID' })
  @ApiResponse({ status: 200, description: 'Scenario deleted successfully' })
  @ApiResponse({ status: 404, description: 'Scenario not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.scenariosService.remove(id);
    return { message: 'Scenario deleted successfully' };
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Run scenario analysis' })
  @ApiParam({ name: 'id', description: 'Scenario ID' })
  @ApiResponse({ status: 200, description: 'Scenario analysis started' })
  async runAnalysis(@Param('id') id: string): Promise<{ message: string; jobId: string }> {
    return this.scenariosService.runAnalysis(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get scenario analysis status' })
  @ApiParam({ name: 'id', description: 'Scenario ID' })
  @ApiResponse({ status: 200, description: 'Scenario status retrieved' })
  async getStatus(@Param('id') id: string): Promise<{ status: string; progress: number; results?: any }> {
    return this.scenariosService.getStatus(id);
  }
}
