'use client';

import * as React from 'react'
import { ArrowLeft } from 'lucide-react'
import { ICON_SIZES } from '@/constants/auth.constants'

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
      <ArrowLeft className={ICON_SIZES.navigation} />
    </button>
  )
}
