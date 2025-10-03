import Link from "next/link";
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const FooterBottom: React.FC = () => {
    const legalLinks = [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Security", href: "#" },
        { name: "Cookie Policy", href: "#" }
    ];

    return (
        <div className="w-full bg-gradient-to-r from-cod-gray-50 to-cod-gray-100 dark:from-cod-gray-800 dark:to-cod-gray-900 py-8 px-4 border-t border-cod-gray-300 dark:border-cod-gray-600 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="text-cod-gray-700 dark:text-cod-gray-300 text-sm transition-colors duration-300">
                            <p>&copy; {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-[#0c7057] to-[#0f8c6a] bg-clip-text text-transparent">Calento Inc</span>. All rights reserved.</p>
                        </div>
                        <ThemeToggle size="sm" />
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                        {legalLinks.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-6">
                                <Link 
                                    href={item.href} 
                                    className="text-cod-gray-700 dark:text-cod-gray-300 hover:text-[#1e6956] dark:hover:text-emerald-400 transition-colors duration-200 font-semibold"
                                >
                                    {item.name}
                                </Link>
                                {index < legalLinks.length - 1 && (
                                    <div className="hidden sm:block w-1 h-1 bg-cod-gray-300 dark:bg-cod-gray-600 rounded-full transition-colors duration-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};