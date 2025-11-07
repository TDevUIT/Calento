import { cn } from '@/lib/utils';
import { FooterLinkData } from '@/constants/footer.constants';

interface FooterSectionProps {
    title: string;
    links: FooterLinkData[];
    isWide?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ title, links, isWide = false }) => {
    return (
        <div className={isWide ? "col-span-2" : ""}>
            <h3 className="font-bold text-cod-gray-900 dark:text-cod-gray-100 text-base mb-4 tracking-wide transition-colors duration-300">{title}</h3>
            <div className={cn('space-y-2', isWide && 'grid grid-cols-2 gap-x-6 gap-y-2')}>
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="text-cod-gray-700 dark:text-cod-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm block transition-all duration-200 hover:translate-x-1 py-1 font-medium hover:font-semibold"
                        {...(link.external && {
                            target: "_blank",
                            rel: "noopener noreferrer"
                        })}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    );
};
