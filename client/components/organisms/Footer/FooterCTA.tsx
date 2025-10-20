import Image from "next/image";
import MiniDashboard from "./MiniDashboard";
import { FOOTER_CTA } from '@/constants/footer.constants';
import Link from "next/link";

export const FooterCTA: React.FC = () => {
  
    return (
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden max-w-7xl mx-auto shadow-xl dark:shadow-2xl dark:shadow-purple-900/50 transition-all duration-300">
          <div className="flex flex-col lg:flex-row">
            
            <div className="flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 text-white relative">
              <div className="max-w-full lg:max-w-lg xl:max-w-xl">
                <p className="text-xs font-semibold text-blue-200 dark:text-blue-300 mb-3 tracking-wider uppercase">
                  {FOOTER_CTA.badge}
                </p>
                
                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-white dark:text-gray-50">
                  {FOOTER_CTA.title.split('\n').map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
                </h2>
                
                <p className="text-blue-100 dark:text-blue-200 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  {FOOTER_CTA.description}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mb-6">
                  {FOOTER_CTA.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400 dark:text-green-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-white dark:text-gray-100">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={FOOTER_CTA.button.href}
                  className="bg-white dark:bg-gray-100 text-blue-700 dark:text-blue-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg dark:shadow-xl flex items-center justify-center sm:inline-flex gap-2 w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {FOOTER_CTA.button.text}
                </Link>
              </div>

              <div className="hidden lg:block absolute top-4 xl:top-2 -right-4 xl:right-4 opacity-60 dark:opacity-40">
                <Image 
                  src='/images/dashed-arrow-icon.png'
                  width={150}
                  height={150}
                  alt="Decorative dashed arrow pointing to dashboard"
                  className="opacity-80 dark:opacity-60 xl:w-[150px] xl:h-[150px] transition-opacity duration-300"
                />
              </div>
            </div>
            
            <div className="hidden md:block md:h-[350px] md:w-full lg:h-[400px] lg:w-[500px] xl:w-[600px] lg:flex-shrink-0">
              <MiniDashboard />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
