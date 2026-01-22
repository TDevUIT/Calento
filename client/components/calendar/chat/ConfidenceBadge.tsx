'use client';

import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
    confidence: ConfidenceLevel;
    className?: string;
}

export const ConfidenceBadge = ({ confidence, className = '' }: ConfidenceBadgeProps) => {
    const config = {
        high: {
            icon: CheckCircle2,
            label: 'High Confidence',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
        },
        medium: {
            icon: HelpCircle,
            label: 'Medium Confidence',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-600',
            borderColor: 'border-yellow-200',
        },
        low: {
            icon: AlertCircle,
            label: 'Low Confidence',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-700',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-200',
        },
    };

    const currentConfig = config[confidence];
    const Icon = currentConfig.icon;

    return (
        <Badge
            variant="outline"
            className={`gap-1.5 ${currentConfig.bgColor} ${currentConfig.textColor} ${currentConfig.borderColor} border ${className}`}
        >
            <Icon className={`h-3.5 w-3.5 ${currentConfig.iconColor}`} />
            <span className="text-xs font-medium">{currentConfig.label}</span>
        </Badge>
    );
};
