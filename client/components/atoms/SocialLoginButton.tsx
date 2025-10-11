'use client';

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { cn } from '@/lib/utils'
import { SOCIAL_PROVIDER_LABELS } from '@/constants/auth.constants'

export type SocialProvider = 'google' | 'microsoft'

export type SocialLoginButtonProps = {
  provider: SocialProvider
  onClick?: () => void
  disabled?: boolean
  isComingSoon?: boolean
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false,
  isComingSoon = false,
}) => {
  const label = SOCIAL_PROVIDER_LABELS[provider]
  
  const renderIcon = () => {
    if (provider === 'google') {
      return <FcGoogle className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
    }
    
    return (
      <Image
        src={`/images/${provider}.svg`}
        alt={label}
        width={20}
        height={20}
        className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6"
      />
    )
  }

  return (
    <div className="relative w-full max-w-sm">
      {isComingSoon && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-semibold z-10 shadow-sm">
          Soon
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={disabled || isComingSoon}
        onClick={onClick}
        className={cn(
          'w-full px-1.5 justify-start font-medium rounded-[4px] border shadow-sm transition-all duration-200 h-11 md:h-12 lg:h-11 2xl:h-12',
          provider === 'google' && !isComingSoon && 'bg-persian-blue-500 hover:bg-persian-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-md',
          (disabled || isComingSoon) && 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed',
        )}
      >
        <div className="flex items-center justify-center mr-2 bg-white rounded-[2px] px-1.5 md:px-2 lg:px-2.5 2xl:px-2.5 py-1 md:py-1.5 lg:py-2 2xl:py-2">
          {renderIcon()}
        </div>
        <span className={cn(
          'font-medium',
          provider === 'google' && !isComingSoon && 'text-white',
          'text-xs md:text-sm lg:text-xs 2xl:text-sm'
        )}>
          {label}
        </span>
      </Button>
    </div>
  )
}
