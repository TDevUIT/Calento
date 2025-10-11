'use client';

import { cn } from '@/lib/utils'
import type { RegistrationStep } from '@/types/auth.types'

type ProgressIndicatorProps = {
  currentStep: RegistrationStep
  totalSteps?: number
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-3 md:mb-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "h-1.5 md:h-2 rounded-full transition-all duration-300",
            step === currentStep 
              ? "w-6 md:w-8 bg-primary" 
              : "w-1.5 md:w-2 bg-gray-300 dark:bg-gray-600",
            step < currentStep && "bg-primary/60"
          )}
        />
      ))}
    </div>
  )
}
