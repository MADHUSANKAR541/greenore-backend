import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface EstimationRequest {
  material: string;
  process: string;
  region?: string;
  technologyLevel?: string;
  missingFields: string[];
}

export interface EstimationResult {
  field: string;
  mean: number;
  p05: number;
  p50: number;
  p95: number;
  confidence: number;
  drivers: string[];
  provenance: string;
}

@Injectable()
export class EstimateService {
  constructor() {}

  async estimateMissingData(request: EstimationRequest): Promise<EstimationResult[]> {
    if (!request.material || !request.process) {
      throw new BadRequestException('Material and process are required');
    }

    // Mock estimation logic - in real implementation, this would use ML models
    const results: EstimationResult[] = [];

    for (const field of request.missingFields) {
      const estimation = this.generateEstimation(field, request);
      results.push(estimation);
    }

    return results;
  }

  private generateEstimation(field: string, request: EstimationRequest): EstimationResult {
    // Mock data based on field type
    const baseValues = {
      'co2e_kg_per_kg': { mean: 2.1, variance: 0.5 },
      'energy_mj_per_kg': { mean: 25.5, variance: 5.0 },
      'water_l_per_kg': { mean: 150, variance: 30 },
      'recycling_rate': { mean: 0.75, variance: 0.1 },
      'material_efficiency': { mean: 0.85, variance: 0.05 },
    };

    const base = baseValues[field] || { mean: 1.0, variance: 0.2 };
    const mean = base.mean;
    const stdDev = Math.sqrt(base.variance);
    
    return {
      field,
      mean: Math.round(mean * 100) / 100,
      p05: Math.round((mean - 1.645 * stdDev) * 100) / 100,
      p50: Math.round(mean * 100) / 100,
      p95: Math.round((mean + 1.645 * stdDev) * 100) / 100,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      drivers: this.getDrivers(field, request),
      provenance: 'USEEIO + LCI Database + ML Model',
    };
  }

  private getDrivers(field: string, request: EstimationRequest): string[] {
    const driverMap = {
      'co2e_kg_per_kg': ['Energy mix', 'Process efficiency', 'Transport distance'],
      'energy_mj_per_kg': ['Process type', 'Technology level', 'Scale'],
      'water_l_per_kg': ['Process cooling', 'Material washing', 'Waste treatment'],
      'recycling_rate': ['Collection infrastructure', 'Sorting technology', 'Market demand'],
      'material_efficiency': ['Process optimization', 'Quality control', 'Equipment age'],
    };

    return driverMap[field] || ['Process parameters', 'Regional factors', 'Technology level'];
  }

  async getEstimationHistory(): Promise<any[]> {
    // Mock history - in real implementation, this would query database
    return [
      {
        id: 1,
        material: 'Steel',
        process: 'Primary',
        timestamp: new Date(),
        fields: ['co2e_kg_per_kg', 'energy_mj_per_kg'],
        confidence: 0.85,
      },
      {
        id: 2,
        material: 'Aluminum',
        process: 'Secondary',
        timestamp: new Date(Date.now() - 86400000),
        fields: ['recycling_rate', 'material_efficiency'],
        confidence: 0.92,
      },
    ];
  }
}

