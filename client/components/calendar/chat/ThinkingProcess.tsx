'use client';

import { CheckCircle2, Loader2, Clock, Calendar, Search, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ThinkingStep {
  id: string;
  status: 'pending' | 'active' | 'completed';
  label: string;
  icon?: string;
}

interface ThinkingProcessProps {
  steps: ThinkingStep[];
}

const iconMap = {
  search: Search,
  calendar: Calendar,
  clock: Clock,
  zap: Zap,
};

export const ThinkingProcess = ({ steps }: ThinkingProcessProps) => {
  const [visibleSteps, setVisibleSteps] = useState<ThinkingStep[]>([]);

  useEffect(() => {
    setVisibleSteps([]);
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        setVisibleSteps((prev) => {
          if (prev.find(s => s.id === step.id)) return prev;
          return [...prev, step];
        });
      }, index * 200);
    });
  }, [steps]);

  if (visibleSteps.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visibleSteps.map((step) => {
        const Icon = step.icon ? iconMap[step.icon as keyof typeof iconMap] : Clock;
        
        return (
          <div
            key={step.id}
            className="flex items-center gap-2 text-sm animate-in slide-in-from-left duration-300"
          >
            {step.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : step.status === 'active' ? (
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin flex-shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
            )}
            
            <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${
              step.status === 'completed' ? 'text-gray-600' :
              step.status === 'active' ? 'text-blue-600' :
              'text-gray-400'
            }`} />
            
            <span className={`${
              step.status === 'completed' ? 'text-gray-900' :
              step.status === 'active' ? 'text-blue-600 font-medium' :
              'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
