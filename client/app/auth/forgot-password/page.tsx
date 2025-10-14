import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AUTH_ROUTES } from '@/constants/routes'

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a reset link
        </p>
      </div>
      
      {/* Reset Form */}
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="h-11"
            required
          />
        </div>
        
        <Button type="submit" className="w-full h-11">
          Send reset link
        </Button>
      </form>
      
      {/* Back to Login */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href={AUTH_ROUTES.LOGIN} className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
