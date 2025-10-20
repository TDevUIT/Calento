import { RegisterForm } from "@/components/auth/register-form"
import Image from 'next/image'
import DashboardPreview from '@/components/organisms/sections/DashboardPreview'
import { REGISTER_CTA } from '@/constants/footer.constants'

const RegisterPage = () => {
  return (
    <div className="min-h-screen md:max-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      <div className="hidden lg:flex lg:w-[50%] xl:w-[52%] 2xl:w-[55%] relative overflow-hidden">
      <div className="flex-1 p-6 lg:p-8 xl:p-9 2xl:p-10 text-black relative">
        <div className="max-w-full lg:max-w-md xl:max-w-md 2xl:max-w-lg">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-3 tracking-wider uppercase">
            {REGISTER_CTA.badge}
          </p>
          
          <h2 className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-black dark:text-gray-50">
            {REGISTER_CTA.title.split('\n').map((line: string, index: number) => (
              <span key={index}>
                {line}
                {index === 0 && <br />}
              </span>
            ))}
          </h2>
          
          <p className="text-blue-950 dark:text-blue-300 mb-2 sm:mb-4 text-sm sm:text-base leading-relaxed">
            {REGISTER_CTA.description}
          </p>
        </div>
      </div>
        <div className="absolute inset-0 top-56 2xl:top-60 -bottom-60">
          <div className="w-full h-full p-3">
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-black">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8 2xl:p-10 bg-background mt-34">
        <div className="w-full max-w-lg space-y-4 sm:space-y-5 md:space-y-6">
          <div className="lg:hidden text-center space-y-2 sm:space-y-3 flex flex-col justify-center items-center">
            <Image 
              src='/icon-192x192.png'
              alt='logo'
              width={60}
              height={60}
              className="rounded-lg sm:w-[72px] sm:h-[72px]"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Join Calento</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Your AI-powered calendar assistant
              </p>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:items-center text-center space-y-2 xl:space-y-2.5 2xl:space-y-3">
            <h1 className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-foreground">Start managing time smarter</h1>
            <p className="text-sm xl:text-sm 2xl:text-base text-muted-foreground">
              Free forever â€¢ AI-powered â€¢ Setup in 2 minutes
            </p>
          </div>
          <RegisterForm className="w-full" />
        </div>
      </div>

      <div className="hidden lg:block opacity-90 dark:opacity-70 absolute top-[34%] left-[56%] xl:left-[57.5%] 2xl:left-[60%] 2xl:top-[40%] transform -translate-x-1/2 -translate-y-1/2 z-[9999] transition-all duration-300">
          <Image 
            src='/images/dashed-arrow-icon.png'
            width={150}
            height={150}
            alt="Decorative dashed arrow pointing to dashboard"
            className="opacity-80 dark:opacity-60 lg:w-[120px] lg:h-[120px] xl:w-[130px] xl:h-[130px] 2xl:w-[160px] 2xl:h-[160px] transition-all duration-300"
          />
        </div>
    </div>
  )
}

export default RegisterPage
