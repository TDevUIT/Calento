interface FooterSectionProps {
    title: string;
    links: string[];
    isWide?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ title, links, isWide = false }) => {
    return (
        <div className={isWide ? "col-span-2" : ""}>
            <h4 className="font-bold text-cod-gray-900 dark:text-cod-gray-100 text-base mb-4 tracking-wide transition-colors duration-300">{title}</h4>
            <div className={`space-y-2 ${isWide ? "grid grid-cols-2 gap-x-6 gap-y-2" : ""}`}>
                {links.map((link) => (
                    <a
                        key={link}
                        href="#"
                        className="text-cod-gray-700 dark:text-cod-gray-300 hover:text-[#0c7057] dark:hover:text-emerald-400 text-sm block transition-all duration-200 hover:translate-x-1 py-1 font-medium hover:font-semibold"
                    >
                        {link}
                    </a>
                ))}
            </div>
        </div>
    );
};