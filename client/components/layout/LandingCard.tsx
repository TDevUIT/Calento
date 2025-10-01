interface LandingCardProps {
    colorClass: string;
    title: string;
    description: string;
}

export function LandingCard({ colorClass, title, description }: LandingCardProps) {
    return (
        <div className={`rounded-2xl ${colorClass} p-4 px-2 flex flex-col items-center shadow-md w-44 min-w-[140px] mx-2`}>
            <div className="mb-2 w-full flex justify-center">
                <div className="rounded-xl overflow-hidden w-16 h-12 bg-white flex items-center justify-center">
                    <span className="w-7 h-7 bg-gray-300 rounded-full"></span>
                </div>
            </div>
            <div className="text-base font-bold mb-1">{title}</div>
            <div className="text-sm">{description}</div>
        </div>
    );
}