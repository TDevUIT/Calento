import { FooterCTA } from './FooterCTA';
import { FooterLinks } from './FooterLinks';
import { FooterBottom } from './FooterBottom';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gradient-to-b from-cod-gray-50 to-white dark:from-cod-gray-900 dark:to-cod-gray-950 transition-colors duration-300">
            <FooterCTA />
            <FooterLinks />
            <FooterBottom />
        </footer>
    );
};