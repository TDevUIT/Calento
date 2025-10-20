'use client';

import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

type PasswordStrengthIndicatorProps = {
  password: string;
  minLength?: number;
  showDetails?: boolean;
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  minLength = 6,
  showDetails = true,
}) => {
  const strength = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: 'Not entered',
        color: 'bg-gray-300',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600',
        checks: {
          minLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        },
      };
    }

    const checks = {
      minLength: password.length >= minLength,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    if (score === 5) {
      return {
        score: 4,
        label: 'Very strong',
        color: 'bg-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        checks,
      };
    } else if (score >= 4) {
      return {
        score: 3,
        label: 'Strong',
        color: 'bg-green-500',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        textColor: 'text-green-700 dark:text-green-400',
        checks,
      };
    } else if (score >= 3) {
      return {
        score: 2,
        label: 'Medium',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        checks,
      };
    } else if (score >= 2) {
      return {
        score: 1,
        label: 'Weak',
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        textColor: 'text-orange-700 dark:text-orange-400',
        checks,
      };
    } else {
      return {
        score: 0,
        label: 'Very weak',
        color: 'bg-red-500',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        textColor: 'text-red-700 dark:text-red-400',
        checks,
      };
    }
  }, [password, minLength]);

  if (!password) return null;

  return (
    <div className="mt-2 relative">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Password strength:
          </span>
          <span className={`text-xs font-semibold ${strength.textColor}`}>
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1 h-1.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-300 ${
                i < strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {showDetails && (
        <div className={`absolute top-full left-0 right-0 mt-2 p-2.5 rounded-lg border ${strength.bgColor} border-gray-200 dark:border-gray-700 shadow-lg z-10 animate-in slide-in-from-top-2 duration-200`}>
          <p className="text-[10px] md:text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password requirements:
          </p>
          <div className="space-y-1">
            <RequirementItem
              met={strength.checks.minLength}
              text={`At least ${minLength} characters`}
            />
            <RequirementItem
              met={strength.checks.hasUpperCase}
              text="Uppercase letter (A-Z)"
            />
            <RequirementItem
              met={strength.checks.hasLowerCase}
              text="Lowercase letter (a-z)"
            />
            <RequirementItem
              met={strength.checks.hasNumber}
              text="Number (0-9)"
            />
            <RequirementItem
              met={strength.checks.hasSpecialChar}
              text="Special character (!@#$%...)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

type RequirementItemProps = {
  met: boolean;
  text: string;
};

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => {
  return (
    <div className="flex items-center gap-1.5">
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
      )}
      <span
        className={`text-[10px] md:text-xs ${
          met
            ? 'text-emerald-700 dark:text-emerald-400 font-medium'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {text}
      </span>
    </div>
  );
};
