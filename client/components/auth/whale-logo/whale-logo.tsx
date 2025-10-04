"use client";

// Placeholder Whale Logo (stylized minimal whale inside a circle)
// Replace with real asset once provided.
export function WhaleLogo({ size = 56 }: { size?: number }) {
    const dimension = size;
    return (
        <div
            className="rounded-full bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-purple-400/10 p-[2px] shadow-inner border border-blue-500/20"
            style={{ width: dimension, height: dimension }}
        >
            <div className="w-full h-full rounded-full flex items-center justify-center bg-white/70 dark:bg-white/5 backdrop-blur-sm">
                <svg
                    width={dimension * 0.6}
                    height={dimension * 0.6}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500 dark:text-sky-300"
                >
                    <path
                        d="M12 32c0-8.837 7.61-16 17-16 7.414 0 13.682 4.29 16 10.297C51.5 26.5 56 31 56 36.5 56 43.18 50.18 49 43.5 49H30c-9.39 0-18-7.163-18-16Z"
                        fill="currentColor"
                        fillOpacity={0.35}
                    />
                    <path
                        d="M20 30c0-4.418 4.03-8 9-8 3.928 0 7.22 2.016 8.5 4.833C41.8 26.4 45 29.5 45 33.5 45 38.194 40.97 42 36 42h-7c-4.97 0-9-3.806-9-8Z"
                        className="fill-current"
                    />
                    <circle cx="30" cy="31" r="2" fill="white" />
                    <path
                        d="M18 36c3 5 9 8 15 8h8"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeOpacity={0.8}
                    />
                    <path
                        d="M46 24c1.2-1.2 2-3 2-5 0-1.2-.2-2.1-.5-3 .9.3 1.8.5 3 .5 2 0 3.8-.8 5-2-.5 2.6-1.4 5.2-3.5 7.3C50.8 23.8 48.6 24.6 46 24Z"
                        fill="currentColor"
                        fillOpacity={0.55}
                    />
                </svg>
            </div>
        </div>
    );
}

export default WhaleLogo;