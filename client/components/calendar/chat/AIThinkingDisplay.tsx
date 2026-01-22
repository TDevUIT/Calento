'use client';

import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AIThinkingData {
    understanding?: string;
    dataRetrieved?: string[];
    reasoning?: string[];
    conclusion?: string;
}

interface AIThinkingDisplayProps {
    thinking: AIThinkingData;
    defaultExpanded?: boolean;
}

export const AIThinkingDisplay = ({ thinking, defaultExpanded = false }: AIThinkingDisplayProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (!thinking.understanding && !thinking.reasoning?.length && !thinking.conclusion) {
        return null;
    }

    return (
        <div className="bg-purple-50/50 border border-purple-200 rounded-lg overflow-hidden mb-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-purple-100/50 transition-colors"
                aria-expanded={isExpanded}
            >
                <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                        AI Reasoning Process
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-purple-600" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-purple-600" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 py-3 space-y-3 border-t border-purple-200 bg-white/50">
                    {thinking.understanding && (
                        <div>
                            <h4 className="text-xs font-semibold text-purple-900 mb-1.5 uppercase tracking-wide">
                                1. Understanding
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {thinking.understanding}
                            </p>
                        </div>
                    )}

                    {thinking.dataRetrieved && thinking.dataRetrieved.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-purple-900 mb-1.5 uppercase tracking-wide">
                                2. Data Retrieved
                            </h4>
                            <ul className="space-y-1">
                                {thinking.dataRetrieved.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-purple-600 mt-0.5">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {thinking.reasoning && thinking.reasoning.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-purple-900 mb-1.5 uppercase tracking-wide">
                                3. Reasoning
                            </h4>
                            <ul className="space-y-1.5">
                                {thinking.reasoning.map((step, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className="text-purple-600 font-medium mt-0.5">{idx + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {thinking.conclusion && (
                        <div>
                            <h4 className="text-xs font-semibold text-purple-900 mb-1.5 uppercase tracking-wide">
                                4. Conclusion
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {thinking.conclusion}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
