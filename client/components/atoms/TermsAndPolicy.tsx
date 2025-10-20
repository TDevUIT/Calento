'use client';

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { POLICY_LINKS } from '@/constants/auth.constants'

type TermsAndPolicyProps = {
  text?: string
  className?: string
}

export const TermsAndPolicy: React.FC<TermsAndPolicyProps> = ({
  text = 'By signing in, you agree to our',
  className = 'text-xs',
}) => {
  return (
    <p className={cn('text-center text-muted-foreground leading-relaxed', className)}>
      {text}{' '}
      <Link 
        href={POLICY_LINKS.terms}
        className="text-primary hover:underline font-medium"
      >
        Terms of Service
      </Link>
      {' '}and{' '}
      <Link 
        href={POLICY_LINKS.privacy}
        className="text-primary hover:underline font-medium"
      >
        Privacy Policy
      </Link>
      .
    </p>
  )
}
