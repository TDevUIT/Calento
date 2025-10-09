import Image from "next/image";
import MiniDashboard from "./MiniDashboard";
import { FOOTER_CTA } from '@/constants/footer.constants';

export const FooterCTA: React.FC = () => {
  
    return (
      <div className="w-full py-4">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-4xl overflow-hidden max-w-7xl mx-auto flex justify-between">
          <div className="flex flex-col lg:flex-row items-center min-h-[400px] relative">
            <div className="flex-1 p-6 lg:p-10 text-white">
              <div className="max-w-lg">
                <p className={FOOTER_CTA.badge.className}>
                  {FOOTER_CTA.badge.text}
                </p>
                
                <h2 className={FOOTER_CTA.title.className}>
                  {FOOTER_CTA.title.text.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
                </h2>
                
                <p className={FOOTER_CTA.description.className}>
                  {FOOTER_CTA.description.text}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {FOOTER_CTA.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <a 
                  href={FOOTER_CTA.button.href}
                  className={FOOTER_CTA.button.className}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {FOOTER_CTA.button.text}
                </a>
              </div>
            </div>
            <div className="absolute top-0 -right-6">
              <Image 
                src='/images/dashed-arrow-icon.png'
                width={180}
                height={180}
                alt="Decorative dashed arrow pointing to dashboard"
                className="opacity-80"
              />
            </div>
            
           
          </div>
          <div className="h-[400px] w-[600px] flex-shrink-0">
                <MiniDashboard />
            </div>
        </div>
      </div>
    );
  };
  