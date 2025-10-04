import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export enum ScenarioStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class CreateScenarioDto {
  @ApiProperty({ description: 'Scenario name', example: 'Steel Production Optimization' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Scenario description', example: 'Comprehensive LCA analysis for steel production' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Material configuration', type: 'object', additionalProperties: true })
  @IsObject()
  material: {
    type: string;
    composition: Record<string, number>;
    properties: Record<string, any>;
  };

  @ApiProperty({ description: 'Production route configuration', type: 'object', additionalProperties: true })
  @IsObject()
  route: {
    process: string;
    parameters: Record<string, any>;
    efficiency: number;
  };

  @ApiProperty({ description: 'Energy configuration', type: 'object', additionalProperties: true })
  @IsObject()
  energy: {
    sources: Array<{ type: string; percentage: number; carbonIntensity: number }>;
    renewable: number;
  };

  @ApiProperty({ description: 'Transportation configuration', type: 'object', additionalProperties: true })
  @IsObject()
  transport: {
    distance: number;
    method: string;
    carbonIntensity: number;
  };

  @ApiProperty({ description: 'End of life configuration', type: 'object', additionalProperties: true })
  @IsObject()
  endOfLife: {
    recyclingRate: number;
    disposalMethod: string;
    recoveryEfficiency: number;
  };

  @ApiProperty({ description: 'Scenario tags', type: [String], example: ['Steel', 'Production', 'Optimization'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateScenarioDto {
  @ApiProperty({ description: 'Scenario name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Scenario description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Material configuration', required: false })
  @IsObject()
  @IsOptional()
  material?: any;

  @ApiProperty({ description: 'Production route configuration', required: false })
  @IsObject()
  @IsOptional()
  route?: any;

  @ApiProperty({ description: 'Energy configuration', required: false })
  @IsObject()
  @IsOptional()
  energy?: any;

  @ApiProperty({ description: 'Transportation configuration', required: false })
  @IsObject()
  @IsOptional()
  transport?: any;

  @ApiProperty({ description: 'End of life configuration', required: false })
  @IsObject()
  @IsOptional()
  endOfLife?: any;

  @ApiProperty({ description: 'Scenario tags', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class ScenarioResponseDto {
  @ApiProperty({ description: 'Scenario ID' })
  id: string;

  @ApiProperty({ description: 'Scenario name' })
  name: string;

  @ApiProperty({ description: 'Scenario description' })
  description?: string;

  @ApiProperty({ description: 'Scenario status', enum: ScenarioStatus })
  status: ScenarioStatus;

  @ApiProperty({ description: 'Circularity score (0-100)' })
  circularityScore: number;

  @ApiProperty({ description: 'Carbon footprint (kg CO2/kg material)' })
  carbonFootprint: number;

  @ApiProperty({ description: 'Energy consumption (MJ/kg material)' })
  energyConsumption: number;

  @ApiProperty({ description: 'Water consumption (L/kg material)' })
  waterConsumption: number;

  @ApiProperty({ description: 'Scenario tags' })
  tags: string[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Last run timestamp' })
  lastRunAt?: Date;

  @ApiProperty({ description: 'Analysis results', required: false })
  results?: {
    lcaResults: any;
    circularityMetrics: any;
    optimizationSuggestions: any;
  };
}
