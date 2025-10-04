"use client";

interface AuthDividerProps {
    label?: string;
    className?: string;
}

export function AuthDivider({ label = "Or continue with email", className = "" }: AuthDividerProps) {
    return (
        <div className={`relative flex items-center justify-center my-6 ${className}`}>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="absolute px-3 text-xs font-medium theme-text-secondary bg-background/80 backdrop-blur-sm rounded-full border theme-card-border">
                {label}
            </span>
        </div>
    );
}

export default AuthDivider;