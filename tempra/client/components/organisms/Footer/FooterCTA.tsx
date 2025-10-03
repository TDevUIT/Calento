export const FooterCTA: React.FC = () => {
    const features = [
      "100% free",
      "No credit card",
      "Privacy-first AI"
    ];
  
    const trusts = [
      { label: "Works with Google & Outlook" },
      { label: "Bank-level security" },
      { label: "10,000+ users" }
    ];
  
    return (
      <div className="w-full bg-gradient-to-br from-[#0c7057] to-[#0f8c6a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get started for free
          </h3>
  
          <p className="text-lg text-white/80 mb-8">
            Connect your calendar in under 2 minutes
          </p>
  
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {features.map((f) => (
              <span key={f} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 
                    1.414l-8 8a1 1 0 01-1.414 
                    0l-4-4a1 1 0 011.414-1.414L8 
                    12.586l7.293-7.293a1 1 0 011.414 
                    0z" clipRule="evenodd" />
                </svg>
                {f}
              </span>
            ))}
          </div>
  
          <button className="bg-white text-[#0c7057] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition flex items-center gap-2 mx-auto">
            <span>Start Free - Connect Calendar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
  
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {trusts.map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-300 rounded-full"></span>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  