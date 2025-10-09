import Link from "next/link";
import { FOOTER_BOTTOM } from '@/constants/footer.constants';

export const FooterBottom: React.FC = () => {
    return (
        <div className="w-full  py-8 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-cod-gray-600 dark:text-cod-gray-400 transition-colors duration-300">
                            {FOOTER_BOTTOM.copyright}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                        {FOOTER_BOTTOM.links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-cod-gray-600 dark:text-cod-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-1">
                            <span className="text-cod-gray-600 dark:text-cod-gray-400" aria-hidden="true">📧</span>
                            <a 
                                href={`mailto:${FOOTER_BOTTOM.email}`}
                                className="text-cod-gray-600 dark:text-cod-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                {FOOTER_BOTTOM.email}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};