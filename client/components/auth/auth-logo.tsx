"use client";
import { Logo } from '@/components/ui/logo';

// Responsive logo: larger on >=sm screens, smaller on very narrow devices
export function AuthLogo({ showBeta = false }: { showBeta?: boolean }) {
    return (
        <div className="flex justify-center">
            <div className="sm:hidden"><Logo size="md" showBeta={showBeta} /></div>
            <div className="hidden sm:block"><Logo size="lg" showBeta={showBeta} /></div>
        </div>
    );
}

export default AuthLogo;