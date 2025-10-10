import { FooterSection } from './FooterSection';
import { Logo } from '@/components/ui/logo';
import { FOOTER_SECTIONS, FOOTER_BRAND, SOCIAL_PLATFORMS } from '@/constants/footer.constants';
import { SocialPlatformWithIcon } from './SocialIcons';

export const FooterLinks: React.FC = () => {
    return (
        <div className="w-full py-16 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="hidden lg:grid grid-cols-6 gap-12 items-start">
                    <div className="col-span-2">
                        <div className="mb-6">
                            <Logo size="lg" />
                        </div>
                        <p className="text-cod-gray-700 dark:text-cod-gray-300 mb-6 font-medium transition-colors duration-300 text-sm leading-relaxed">
                            {FOOTER_BRAND.description}
                        </p>
                        
                        <div className="flex gap-2">
                            {SOCIAL_PLATFORMS.slice(0, 5).map((platformData) => {
                                const platform = SocialPlatformWithIcon(platformData);
                                return (
                                    <a
                                        key={platform.name}
                                        href={platform.href}
                                        className={`p-2 bg-white dark:bg-cod-gray-700 text-cod-gray-700 dark:text-cod-gray-300 rounded-lg transition-all duration-300 hover:scale-105 border border-cod-gray-200 dark:border-cod-gray-600 hover:border-transparent ${platform.color}`}
                                        aria-label={platform.name}
                                        title={platform.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {platform.icon}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="col-span-4 grid grid-cols-4 gap-8">
                        {FOOTER_SECTIONS.map((section) => (
                            <FooterSection
                                key={section.title}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:hidden space-y-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <Logo size="lg" />
                        </div>
                        <p className="text-cod-gray-700 dark:text-cod-gray-300 mb-6 font-medium transition-colors duration-300 text-sm leading-relaxed">
                            {FOOTER_BRAND.description}
                        </p>
                        
                        <div className="flex justify-center gap-2 mb-6">
                            {SOCIAL_PLATFORMS.slice(0, 5).map((platformData) => {
                                const platform = SocialPlatformWithIcon(platformData);
                                return (
                                    <a
                                        key={platform.name}
                                        href={platform.href}
                                        className={`p-2 bg-white dark:bg-cod-gray-700 text-cod-gray-700 dark:text-cod-gray-300 rounded-lg transition-all duration-300 border border-cod-gray-200 dark:border-cod-gray-600 hover:border-transparent ${platform.color}`}
                                        aria-label={platform.name}
                                        title={platform.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {platform.icon}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {FOOTER_SECTIONS.map((section) => (
                            <FooterSection
                                key={section.title}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};