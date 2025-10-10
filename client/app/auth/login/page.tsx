import Link from 'next/link'
import { LoginForm } from "@/components/auth/login-form"
import Image from 'next/image'

const LoginPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 flex flex-col justify-center items-center">
        <Image 
          src='/icon-192x192.png'
          alt='logo'
          width={120}
          height={120}
        />
        <p className="text-lg font-bold text-persian-blue-500">
          Sign in to Calento with your work calendar
        </p>
      </div>
    
      <LoginForm className="w-full" />
    
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage