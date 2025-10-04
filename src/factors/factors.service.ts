import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface Factor {
  id: string;
  name: string;
  category: 'material' | 'process' | 'energy' | 'transport' | 'endOfLife';
  value: number;
  unit: string;
  source: string;
  confidence: number;
  region: string;
  lastUpdated: Date;
  metadata: Record<string, any>;
}

export interface FactorSearchRequest {
  query: string;
  category?: string;
  region?: string;
  minConfidence?: number;
  limit?: number;
}

@Injectable()
export class FactorsService {
  private factors: Factor[] = [
    {
      id: 'steel_primary_co2',
      name: 'Steel Primary Production CO2',
      category: 'material',
      value: 2.1,
      unit: 'kg CO2/kg',
      source: 'WorldSteel Association',
      confidence: 0.95,
      region: 'Global',
      lastUpdated: new Date(),
      metadata: { process: 'Primary', material: 'Steel' },
    },
    {
      id: 'aluminum_secondary_co2',
      name: 'Aluminum Secondary Production CO2',
      category: 'material',
      value: 0.8,
      unit: 'kg CO2/kg',
      source: 'Aluminum Association',
      confidence: 0.92,
      region: 'Global',
      lastUpdated: new Date(),
      metadata: { process: 'Secondary', material: 'Aluminum' },
    },
    {
      id: 'electricity_grid_intensity',
      name: 'Grid Electricity Carbon Intensity',
      category: 'energy',
      value: 0.5,
      unit: 'kg CO2/kWh',
      source: 'IEA',
      confidence: 0.88,
      region: 'Global',
      lastUpdated: new Date(),
      metadata: { source: 'Grid' },
    },
    {
      id: 'truck_transport_co2',
      name: 'Truck Transport CO2',
      category: 'transport',
      value: 0.1,
      unit: 'kg CO2/km/kg',
      source: 'EPA',
      confidence: 0.85,
      region: 'US',
      lastUpdated: new Date(),
      metadata: { method: 'Truck', capacity: 'Heavy' },
    },
    {
      id: 'steel_recycling_rate',
      name: 'Steel Recycling Rate',
      category: 'endOfLife',
      value: 0.75,
      unit: 'fraction',
      source: 'BIR',
      confidence: 0.90,
      region: 'Global',
      lastUpdated: new Date(),
      metadata: { material: 'Steel', process: 'Recycling' },
    },
  ];

  async getAllFactors(): Promise<Factor[]> {
    return this.factors;
  }

  async getFactorById(id: string): Promise<Factor> {
    const factor = this.factors.find(f => f.id === id);
    if (!factor) {
      throw new NotFoundException(`Factor with ID ${id} not found`);
    }
    return factor;
  }

  async searchFactors(request: FactorSearchRequest): Promise<Factor[]> {
    let results = this.factors;

    // Filter by query
    if (request.query) {
      const query = request.query.toLowerCase();
      results = results.filter(factor => 
        factor.name.toLowerCase().includes(query) ||
        factor.category.toLowerCase().includes(query) ||
        factor.source.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (request.category) {
      results = results.filter(factor => factor.category === request.category);
    }

    // Filter by region
    if (request.region) {
      results = results.filter(factor => 
        factor.region.toLowerCase().includes(request.region!.toLowerCase())
      );
    }

    // Filter by confidence
    if (request.minConfidence) {
      results = results.filter(factor => factor.confidence >= request.minConfidence!);
    }

    // Apply limit
    if (request.limit) {
      results = results.slice(0, request.limit);
    }

    return results;
  }

  async createFactor(factorData: Omit<Factor, 'id' | 'lastUpdated'>): Promise<Factor> {
    if (!factorData.name || !factorData.category || !factorData.value) {
      throw new BadRequestException('Name, category, and value are required');
    }

    const factor: Factor = {
      id: this.generateId(),
      ...factorData,
      lastUpdated: new Date(),
    };

    this.factors.push(factor);
    return factor;
  }

  async updateFactor(id: string, updateData: Partial<Factor>): Promise<Factor> {
    const factorIndex = this.factors.findIndex(f => f.id === id);
    if (factorIndex === -1) {
      throw new NotFoundException(`Factor with ID ${id} not found`);
    }

    this.factors[factorIndex] = {
      ...this.factors[factorIndex],
      ...updateData,
      lastUpdated: new Date(),
    };

    return this.factors[factorIndex];
  }

  async deleteFactor(id: string): Promise<void> {
    const factorIndex = this.factors.findIndex(f => f.id === id);
    if (factorIndex === -1) {
      throw new NotFoundException(`Factor with ID ${id} not found`);
    }

    this.factors.splice(factorIndex, 1);
  }

  async getFactorsByCategory(category: string): Promise<Factor[]> {
    return this.factors.filter(factor => factor.category === category);
  }

  async getFactorStatistics(): Promise<any> {
    const categories = [...new Set(this.factors.map(f => f.category))];
    const regions = [...new Set(this.factors.map(f => f.region))];
    
    const stats = {
      total: this.factors.length,
      byCategory: categories.map(cat => ({
        category: cat,
        count: this.factors.filter(f => f.category === cat).length,
      })),
      byRegion: regions.map(region => ({
        region,
        count: this.factors.filter(f => f.region === region).length,
      })),
      averageConfidence: this.factors.reduce((sum, f) => sum + f.confidence, 0) / this.factors.length,
      lastUpdated: new Date(Math.max(...this.factors.map(f => f.lastUpdated.getTime()))),
    };

    return stats;
  }

  async validateFactor(factorData: any): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!factorData.name || factorData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!factorData.category || !['material', 'process', 'energy', 'transport', 'endOfLife'].includes(factorData.category)) {
      errors.push('Valid category is required');
    }

    if (typeof factorData.value !== 'number' || factorData.value < 0) {
      errors.push('Value must be a positive number');
    }

    if (!factorData.unit || factorData.unit.trim().length === 0) {
      errors.push('Unit is required');
    }

    if (factorData.confidence && (factorData.confidence < 0 || factorData.confidence > 1)) {
      errors.push('Confidence must be between 0 and 1');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

