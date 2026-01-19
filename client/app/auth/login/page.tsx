import Link from 'next/link'
import { LoginForm } from "@/components/auth/login-form"
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@/constants/routes'
import Image from 'next/image'

const LoginPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 flex flex-col justify-center items-center">
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2">
          <Image
            src='/icon-192x192.png'
            alt='logo'
            width={120}
            height={120}
          />
        </Link>
        <p className="text-lg font-bold text-persian-blue-500">
          Sign in to Calento with your work calendar
        </p>
      </div>

      <LoginForm className="w-full" />

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={AUTH_ROUTES.REGISTER} className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <Link
          href={AUTH_ROUTES.FORGOT_PASSWORD}
          className="text-sm text-muted-foreground hover:text-primary hover:underline block transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
