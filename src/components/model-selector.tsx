'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Sparkles } from 'lucide-react';

export interface ModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

interface ModelSelectorProps {
  config: ModelConfig;
  onChange: (config: ModelConfig) => void;
}

const modelInfo = {
  'gpt-4o': {
    name: 'GPT-4o',
    description: 'Most capable model, best for complex bugs',
    icon: Brain,
    badge: 'Premium',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  },
  'gpt-4': {
    name: 'GPT-4',
    description: 'Powerful and accurate, great for all tasks',
    icon: Sparkles,
    badge: 'Advanced',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'Fast and efficient, balanced performance',
    icon: Zap,
    badge: 'Recommended',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/50',
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Quick responses, good for simple fixes',
    icon: Zap,
    badge: 'Fast',
    badgeColor: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  },
};

export function ModelSelector({ config, onChange }: ModelSelectorProps) {
  const [localConfig, setLocalConfig] = useState<ModelConfig>(config);

  const updateConfig = (updates: Partial<ModelConfig>) => {
    const newConfig = { ...localConfig, ...updates };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const currentModel = modelInfo[config.model as keyof typeof modelInfo] || modelInfo['gpt-4o-mini'];
  const ModelIcon = currentModel.icon;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-lg">AI Model Configuration</CardTitle>
        </div>
        <CardDescription>
          Customize AI model and parameters for optimal results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="text-gray-400">Select Model</Label>
          <Select
            value={config.model}
            onValueChange={(value) => updateConfig({ model: value })}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modelInfo).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <info.icon className="w-4 h-4" />
                    <span>{info.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Model Info Card */}
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <ModelIcon className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-gray-300">{currentModel.name}</span>
              </div>
              <Badge className={currentModel.badgeColor}>
                {currentModel.badge}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">{currentModel.description}</p>
          </div>
        </div>

        {/* Temperature Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-400">Temperature</Label>
            <span className="text-sm text-gray-500">{config.temperature.toFixed(1)}</span>
          </div>
          <Slider
            value={[config.temperature]}
            onValueChange={([value]) => updateConfig({ temperature: value })}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Precise (0.0)</span>
            <span>Balanced (0.5)</span>
            <span>Creative (1.0)</span>
          </div>
          <p className="text-xs text-gray-500">
            Lower values make output more focused and deterministic. Higher values increase randomness.
          </p>
        </div>

        {/* Max Tokens Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-400">Max Tokens</Label>
            <span className="text-sm text-gray-500">{config.maxTokens}</span>
          </div>
          <Slider
            value={[config.maxTokens]}
            onValueChange={([value]) => updateConfig({ maxTokens: value })}
            min={500}
            max={4000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>500</span>
            <span>2000</span>
            <span>4000</span>
          </div>
          <p className="text-xs text-gray-500">
            Maximum length of the generated response. Higher values allow longer fixes.
          </p>
        </div>

        {/* Cost Estimate */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 Tip: Start with GPT-4o Mini for quick tests, then use GPT-4o for complex bugs
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
