import { Injectable, Logger } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import * as path from 'path';

export interface MiningData {
  mine_id: string;
  mine_name: string;
  state: string;
  mineral: string;
  mine_status: string;
  life_cycle_stage: string;
  production_tonnes?: number;
  recycled_input_percent?: number;
  energy_source?: string;
  energy_consumption_mwh?: number;
  co2_emissions_tonnes?: number;
  water_usage_m3?: number;
  waste_generated_tonnes?: number;
  transport_distance_km?: number;
  employment_generated?: number;
  local_community_investment_inr?: number;
}

export interface SustainabilityPrediction {
  recyclability_score: number;
  reuse_potential_score: number;
  product_life_extension_years: number;
  confidence: number;
  recommendations: string[];
}

@Injectable()
export class MLService {
  private readonly logger = new Logger(MLService.name);
  // dist/ml -> up 3 levels to workspace root, then services/ml
  private readonly modelPath = path.join(__dirname, '../../../services/ml/greenore_multi_target_lgbm.pkl');

  async predictSustainability(data: MiningData): Promise<SustainabilityPrediction> {
    try {
      this.logger.log('Starting sustainability prediction...');

      // MOCK MODE: compute predictions deterministically based on inputs
      const predictionData = this.prepareDataForPrediction(data);
      const mock = this.generateMockPrediction(predictionData);
      return mock;

    } catch (error) {
      this.logger.error('ML Service error:', error);
      throw new Error('Sustainability prediction failed');
    }
  }

  private generateMockPrediction(data: MiningData): SustainabilityPrediction {
    const recycled = Number(data.recycled_input_percent || 0);
    const production = Number(data.production_tonnes || 0);
    const co2 = Number(data.co2_emissions_tonnes || 0);
    const water = Number(data.water_usage_m3 || 0);
    const energySource = (data.energy_source || 'Grid').toLowerCase();
    const mineral = (data.mineral || '').toLowerCase();

    // Recyclability influenced by recycled input and mineral type
    const mineralBonus = mineral === 'aluminium' ? 18 : mineral === 'steel' ? 12 : 6;
    let recyclability = 40 + recycled * 0.6 + mineralBonus;
    recyclability -= Math.min(10, co2 / 200000); // penalize very high CO2 slightly
    recyclability = Math.max(10, Math.min(95, recyclability));

    // Reuse potential influenced by production scale and clean energy
    const cleanEnergyBonus = ['solar', 'hydro', 'wind'].includes(energySource) ? 15 : energySource === 'mixed' ? 5 : 0;
    let reuse = 35 + (production / 12000) + cleanEnergyBonus;
    reuse -= Math.min(8, water / 2000000); // high water usage reduces reuse potential
    reuse = Math.max(15, Math.min(90, reuse));

    // Life extension years based on investment and employment density proxy
    const life = Math.max(1, Math.min(8,
      2.5 + (Number(data.employment_generated || 0) / 12000) + (Number(data.local_community_investment_inr || 0) / 120000000)
    ));

    // Confidence rises when more key signals present
    let confidence = 0.65
      + (production > 0 ? 0.08 : 0)
      + (co2 > 0 ? 0.07 : 0)
      + (recycled > 0 ? 0.05 : 0);
    confidence = Math.min(0.95, Math.max(0.6, confidence));

    const recommendations: string[] = [];
    recommendations.push(
      recyclability > 70 ? 'Excellent recyclability potential - invest in recycling streams'
        : recyclability > 50 ? 'Good recyclability - scale up recycling programs'
        : 'Low recyclability - prioritize waste minimization'
    );
    recommendations.push(
      reuse > 70 ? 'High reuse potential - develop circular initiatives'
        : reuse > 50 ? 'Moderate reuse potential - expand repurposing use-cases'
        : 'Limited reuse potential - improve process efficiencies'
    );
    if (['coal'].includes(energySource)) {
      recommendations.push('Transition away from coal to renewables to improve sustainability');
    }
    if (co2 > 120000) {
      recommendations.push('Implement CO2 reduction tactics (efficiency, capture, offsets)');
    }
    if (water > 1200000) {
      recommendations.push('Introduce water recycling and conservation measures');
    }

    return {
      recyclability_score: Math.round(recyclability * 10) / 10,
      reuse_potential_score: Math.round(reuse * 10) / 10,
      product_life_extension_years: Math.round(life * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
      recommendations,
    };
  }

  private prepareDataForPrediction(data: MiningData): any {
    // Convert the input data to the format expected by the model
    return {
      mine_id: data.mine_id || 'M00001',
      mine_name: data.mine_name || 'Unknown Mine',
      state: data.state || 'Unknown',
      mineral: data.mineral || 'Unknown',
      mine_status: data.mine_status || 'Active',
      life_cycle_stage: data.life_cycle_stage || 'Extraction',
      production_tonnes: data.production_tonnes || 0,
      recycled_input_percent: data.recycled_input_percent || 0,
      energy_source: data.energy_source || 'Grid',
      energy_consumption_mwh: data.energy_consumption_mwh || 0,
      co2_emissions_tonnes: data.co2_emissions_tonnes || 0,
      water_usage_m3: data.water_usage_m3 || 0,
      waste_generated_tonnes: data.waste_generated_tonnes || 0,
      transport_distance_km: data.transport_distance_km || 0,
      employment_generated: data.employment_generated || 0,
      local_community_investment_inr: data.local_community_investment_inr || 0,
    };
  }

  async getModelInfo(): Promise<any> {
    try {
      const pythonScript = `
import json
import sys
import pickle

try:
    import joblib
except Exception:
    joblib = None

try:
    import lightgbm as lgb
except Exception:
    lgb = None

model_path = r'${this.modelPath.replace(/\\/g, '\\\\')}'

model = None
err = None

if joblib is not None and model is None:
    try:
        model = joblib.load(model_path)
    except Exception as e:
        err = str(e)

if lgb is not None and model is None:
    try:
        model = lgb.Booster(model_file=model_path)
    except Exception:
        pass

if model is None:
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
    except Exception as e:
        err = str(e)

if model is None:
    print(json.dumps({"error": f"Failed to load model: {err}"}))
    sys.exit(0)

info = {
    "model_type": str(type(model).__name__),
    "n_features": getattr(model, 'n_features_', 'Unknown'),
    "feature_names": getattr(model, 'feature_name_', 'Unknown'),
    "n_estimators": getattr(model, 'n_estimators', 'Unknown'),
    "boosting_type": getattr(model, 'boosting_type', 'Unknown')
}

print(json.dumps(info))
`;

      const options = {
        mode: 'text' as const,
        pythonPath: process.env.PYTHON_PATH || 'C:/Users/22ad1/AppData/Local/Programs/Python/Python313/python.exe',
        pythonOptions: ['-u'],
      };

      return new Promise((resolve, reject) => {
        PythonShell.runString(pythonScript, options)
          .then((results) => {
            try {
              const result = JSON.parse(results[0]);
              resolve(result);
            } catch (parseError) {
              this.logger.error('Failed to parse model info:', parseError);
              reject(new Error('Failed to parse model info'));
            }
          })
          .catch((err) => {
            this.logger.error('Python execution error:', err);
            reject(new Error('Failed to get model info'));
          });
      });

    } catch (error) {
      this.logger.error('ML Service info error:', error);
      throw new Error('Failed to get model information');
    }
  }
}
