import { Button } from "@/components/ui/button";
import { LandingCardGrid } from "@/components/layout/LandingCardGrid";
import { EnterpriseSection } from "@/components/layout/EnterpriseSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-10 py-6 bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-[#f3e8ff] w-6 h-6 flex items-center justify-center">
              <span className="block w-3 h-3 bg-[#7c3aed] rounded-full"></span>
            </span>
            <span className="text-2xl font-bold text-gray-900">tempra</span>
          </span>
        </div>
        <nav className="flex gap-6 text-base">
          <span className="cursor-pointer">Product <span className="text-xs">▼</span></span>
          <span className="cursor-pointer">Solutions <span className="text-xs">▼</span></span>
          <span className="cursor-pointer">Resources <span className="text-xs">▼</span></span>
          <span className="cursor-pointer">Pricing</span>
          <span className="cursor-pointer">Enterprise</span>
        </nav>
        <div className="flex items-center gap-6">
          <span className="text-gray-500 cursor-pointer">Contact Sales</span>
          <span className="text-gray-500 cursor-pointer">Log In</span>
          <Button variant="default" size="lg" className="rounded-full px-6 py-2 bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-white relative overflow-hidden">
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl z-10">
          <div className="flex gap-2 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#4285F4" /><text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" dy=".3em">G</text></svg>
              Calendar
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#0078D4" /><text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" dy=".3em">O</text></svg>
              Outlook
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Get your time<br />back with AI.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            #1 AI calendar app for <a href="#" className="text-blue-500 underline">individuals</a>, <a href="#" className="text-blue-500 underline">teams</a>, and <a href="#" className="text-blue-500 underline">organizations</a>.
          </p>
          <Button variant="default" size="lg" className="rounded-full px-8 py-4 bg-green-500 text-white text-lg font-semibold hover:bg-green-600 mb-4">Get started – free forever!</Button>
          <ul className="mb-2 text-gray-700 text-base list-none pl-0">
            <li className="flex items-center gap-2 mb-1">
              <span className="text-green-500 font-bold">✓</span> Yes, it's 100% free! <a href="#" className="underline text-gray-500">Here's how it works</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span> We don't train AI on your data
            </li>
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-2xl h-[420px] relative flex items-center justify-center p-8">
            {/* Nền gradient mờ phía sau */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-green-200 to-purple-300 rounded-2xl shadow-lg opacity-40 backdrop-blur-md border border-white/30"></div>
            {/* Focus Time Goal chỉ nằm phía trên, không bị mờ */}
            <div className="relative z-10 bg-white rounded-xl shadow-lg px-10 py-8 flex flex-col items-center w-full max-w-md border mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-600 font-bold text-2xl">Focus Time</span>
                <span className="font-semibold text-xl text-gray-800">Weekly Goal</span>
                <span className="ml-2 text-blue-600">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#4F5BD5" /><path d="M10 17l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>
              <div className="w-full flex items-center gap-2 mb-2">
                <input type="range" min="0" max="40" value="20" className="w-full accent-blue-600" readOnly />
                <span className="text-gray-700 font-semibold text-lg">20 hrs</span>
              </div>
            </div>
          </div>
        </div>
        {/* Gradient background shape */}
        <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-br from-blue-400 via-green-300 to-purple-400 opacity-30 pointer-events-none" style={{ borderTopLeftRadius: '40% 60%' }} />
      </section>

      {/* Focus Time Stats Section */}
      <section className="w-full py-16 px-4 bg-[#f4f7ff] border-t border-b border-[#4f5bd5]">
        <div className="max-w-6xl mx-auto">
          <p className="text-lg text-gray-600 mb-4">Deleting meetings doesn't work – you need to prioritize focus time.</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10">
            Reclaim <span className="text-green-500">395</span> hours of focus time/user every year
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-4xl font-bold text-green-500">7,6</span>
              <div className="text-gray-700 mt-2">more focus time<br />hours/week</div>
            </div>
            <div>
              <span className="text-4xl font-bold text-green-500">2,3</span>
              <div className="text-gray-700 mt-2">fewer unnecessary<br />meetings/week</div>
            </div>
            <div>
              <span className="text-4xl font-bold text-green-500">4,5</span>
              <div className="text-gray-700 mt-2">fewer overtime<br />hours/week</div>
            </div>
            <div>
              <span className="text-4xl font-bold text-green-500">60%</span>
              <div className="text-gray-700 mt-2">less unproductive<br />context switching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Card Section */}
      <LandingCardGrid />
      <EnterpriseSection />

      <Footer />
    </main>
  );
}