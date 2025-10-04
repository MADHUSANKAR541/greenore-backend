import { Injectable, BadRequestException } from '@nestjs/common';

export interface LCACalculationRequest {
  material: {
    type: string;
    composition: Record<string, number>;
    properties: Record<string, any>;
  };
  route: {
    process: string;
    parameters: Record<string, any>;
    efficiency: number;
  };
  energy: {
    sources: Array<{ type: string; percentage: number; carbonIntensity: number }>;
    renewable: number;
  };
  transport: {
    distance: number;
    method: string;
    carbonIntensity: number;
  };
  endOfLife: {
    recyclingRate: number;
    disposalMethod: string;
    recoveryEfficiency: number;
  };
}

export interface LCAResults {
  carbonFootprint: {
    total: number;
    breakdown: {
      material: number;
      energy: number;
      transport: number;
      endOfLife: number;
    };
    unit: string;
  };
  energyConsumption: {
    total: number;
    breakdown: {
      process: number;
      transport: number;
      auxiliary: number;
    };
    unit: string;
  };
  waterConsumption: {
    total: number;
    breakdown: {
      process: number;
      cooling: number;
      cleaning: number;
    };
    unit: string;
  };
  circularityScore: {
    total: number;
    breakdown: {
      materialEfficiency: number;
      energyRecovery: number;
      wasteReduction: number;
      recyclingRate: number;
    };
  };
}

@Injectable()
export class CalculateService {
  async calculateLCA(request: LCACalculationRequest): Promise<LCAResults> {
    if (!request.material || !request.route) {
      throw new BadRequestException('Material and route data are required');
    }

    // Mock LCA calculation - in real implementation, this would use OpenLCA or similar
    const results = this.performLCACalculation(request);
    
    return results;
  }

  private performLCACalculation(request: LCACalculationRequest): LCAResults {
    // Mock calculation logic
    const materialImpact = this.calculateMaterialImpact(request.material);
    const energyImpact = this.calculateEnergyImpact(request.energy, request.route);
    const transportImpact = this.calculateTransportImpact(request.transport);
    const endOfLifeImpact = this.calculateEndOfLifeImpact(request.endOfLife);

    const carbonFootprint = {
      total: materialImpact.co2 + energyImpact.co2 + transportImpact.co2 + endOfLifeImpact.co2,
      breakdown: {
        material: materialImpact.co2,
        energy: energyImpact.co2,
        transport: transportImpact.co2,
        endOfLife: endOfLifeImpact.co2,
      },
      unit: 'kg CO2e/kg material',
    };

    const energyConsumption = {
      total: energyImpact.energy + transportImpact.energy,
      breakdown: {
        process: energyImpact.energy * 0.8,
        transport: transportImpact.energy,
        auxiliary: energyImpact.energy * 0.2,
      },
      unit: 'MJ/kg material',
    };

    const waterConsumption = {
      total: materialImpact.water + energyImpact.water,
      breakdown: {
        process: materialImpact.water * 0.7,
        cooling: energyImpact.water * 0.8,
        cleaning: materialImpact.water * 0.3,
      },
      unit: 'L/kg material',
    };

    const circularityScore = this.calculateCircularityScore(request);

    return {
      carbonFootprint,
      energyConsumption,
      waterConsumption,
      circularityScore,
    };
  }

  private calculateMaterialImpact(material: any): { co2: number; water: number } {
    // Mock material impact calculation
    const baseCO2 = 2.1; // kg CO2/kg
    const baseWater = 150; // L/kg
    
    return {
      co2: baseCO2 * (1 + Math.random() * 0.2 - 0.1), // ±10% variation
      water: baseWater * (1 + Math.random() * 0.2 - 0.1),
    };
  }

  private calculateEnergyImpact(energy: any, route: any): { co2: number; energy: number; water: number } {
    // Mock energy impact calculation
    const baseEnergy = 25.5; // MJ/kg
    const renewableFactor = energy.renewable / 100;
    const carbonIntensity = energy.sources.reduce((acc: number, source: any) => 
      acc + source.carbonIntensity * source.percentage / 100, 0);
    
    return {
      co2: baseEnergy * carbonIntensity * (1 - renewableFactor * 0.5),
      energy: baseEnergy * route.efficiency,
      water: baseEnergy * 0.1, // 0.1 L/MJ
    };
  }

  private calculateTransportImpact(transport: any): { co2: number; energy: number } {
    // Mock transport impact calculation
    const distance = transport.distance || 100; // km
    const carbonIntensity = transport.carbonIntensity || 0.1; // kg CO2/km/kg
    
    return {
      co2: distance * carbonIntensity,
      energy: distance * 0.5, // MJ/km/kg
    };
  }

  private calculateEndOfLifeImpact(endOfLife: any): { co2: number } {
    // Mock end-of-life impact calculation
    const recyclingRate = endOfLife.recyclingRate || 0.75;
    const recoveryEfficiency = endOfLife.recoveryEfficiency || 0.8;
    
    return {
      co2: -0.5 * recyclingRate * recoveryEfficiency, // Negative = avoided emissions
    };
  }

  private calculateCircularityScore(request: LCACalculationRequest): any {
    const materialEfficiency = request.route.efficiency || 0.85;
    const energyRecovery = (request.energy.renewable / 100) * 0.8;
    const wasteReduction = request.endOfLife.recyclingRate * 0.9;
    const recyclingRate = request.endOfLife.recyclingRate;

    return {
      total: Math.round((materialEfficiency + energyRecovery + wasteReduction + recyclingRate) / 4 * 100),
      breakdown: {
        materialEfficiency: Math.round(materialEfficiency * 100),
        energyRecovery: Math.round(energyRecovery * 100),
        wasteReduction: Math.round(wasteReduction * 100),
        recyclingRate: Math.round(recyclingRate * 100),
      },
    };
  }

  async getCalculationHistory(): Promise<any[]> {
    // Mock calculation history
    return [
      {
        id: 1,
        material: 'Steel',
        process: 'Primary',
        timestamp: new Date(),
        carbonFootprint: 2.1,
        energyConsumption: 25.5,
        circularityScore: 65,
      },
      {
        id: 2,
        material: 'Aluminum',
        process: 'Secondary',
        timestamp: new Date(Date.now() - 86400000),
        carbonFootprint: 0.8,
        energyConsumption: 8.2,
        circularityScore: 85,
      },
    ];
  }
}

