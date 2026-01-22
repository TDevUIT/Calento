'use client';

import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClarifyingQuestionsProps {
    questions: string[];
    onQuestionClick: (question: string) => void;
}

export const ClarifyingQuestions = ({ questions, onQuestionClick }: ClarifyingQuestionsProps) => {
    if (!questions || questions.length === 0) {
        return null;
    }

    return (
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-900">
                    I need more information
                </h4>
            </div>

            <p className="text-sm text-amber-800">
                Could you help clarify these points?
            </p>

            <div className="space-y-2">
                {questions.map((question, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => onQuestionClick(question)}
                        className="w-full justify-start text-left h-auto py-2.5 px-3 bg-white hover:bg-amber-50 border-amber-300 hover:border-amber-400 text-amber-900"
                    >
                        <MessageCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0 text-amber-600" />
                        <span className="text-sm leading-relaxed">{question}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};
