'use client';

import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
  onClick: () => void
  label?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick,
  label = 'Go back'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-0 p-1.5 md:p-2 hover:bg-muted rounded-full transition-colors"
      aria-label={label}
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
    </button>
  )
}
