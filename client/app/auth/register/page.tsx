import { RegisterForm } from "@/components/auth/register-form"
import Image from 'next/image'
import DashboardPreview from '@/components/organisms/sections/DashboardPreview'
import { REGISTER_CTA } from '@/constants/footer.constants'

const RegisterPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex-none p-8 lg:p-10 xl:p-12 text-black relative z-10">
          <div className="max-w-lg">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-4 tracking-wider uppercase">
              {REGISTER_CTA.badge}
            </p>
            
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight text-black dark:text-gray-50">
              {REGISTER_CTA.title.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h2>
            
            <p className="text-blue-950 dark:text-blue-300 text-base lg:text-lg leading-relaxed">
              {REGISTER_CTA.description}
            </p>
          </div>
        </div>
        
        <div className="flex-1 relative px-6 pb-6 pt-4">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-black/10 dark:border-white/10 shadow-2xl">
            <DashboardPreview />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-8 xl:p-10 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center space-y-3 flex flex-col justify-center items-center">
            <Image 
              src='/icon-192x192.png'
              alt='logo'
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Join Calento</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your AI-powered calendar assistant
              </p>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:items-center text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Start managing time smarter</h1>
            <p className="text-base text-muted-foreground">
              Free forever • AI-powered • Setup in 2 minutes
            </p>
          </div>
          <RegisterForm className="w-full" />
        </div>
      </div>

      {/* <div className="hidden lg:block absolute top-[22%] left-[52%] -translate-x-1/2 -translate-y-1/2 z-10 opacity-80 dark:opacity-60 pointer-events-none">
        <Image 
          src='/images/dashed-arrow-icon.png'
          width={140}
          height={140}
          alt="Decorative dashed arrow pointing to Google login button"
          className="w-32 h-auto transition-all duration-300 rotate-12"
        />
      </div> */}
    </div>
  )
}

export default RegisterPage
