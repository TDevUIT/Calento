"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

export const LogoTicker = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative py-16 overflow-hidden"
        >
            <Marquee
                gradient={false}
                speed={35}
                pauseOnHover={true}
                className="py-8 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {[
                    { name: "CNN", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/cnn.svg" },
                    { name: "IKEA", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/ikea.svg" },
                    { name: "NVIDIA", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/nvidia.svg" },
                    { name: "Nintendo", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/nintendo.svg" },
                    { name: "Ubisoft", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/ubisoft.svg" },
                    { name: "Harvard", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/harvard.svg" },
                    { name: "NBA", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/nba.svg" },
                    { name: "CoinMarketCap", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/coinmarketcap.svg" },
                    { name: "MailOnline", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/mailonline.svg" },
                    { name: "Roblox", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/roblox.svg" },
                    { name: "Urban Dictionary", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/urban.svg" },
                    { name: "Rotten Tomatoes", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/rotten-tomatoes.svg" },
                    { name: "OLX", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/olx.svg" },
                    { name: "Der Spiegel", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/der-spiegel.svg" },
                    { name: "Upwork", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/upwork.svg" },
                    { name: "GOV.GR", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/govgr.svg" },
                    { name: "Tawk.to", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/tawk.to.png" },
                    { name: "Foot Locker", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/foot-locker.svg" },
                    { name: "EuroVision", logo: "https://www.jsdelivr.com/assets/3d8df350294cfee12bb96c1a6267b505c51a78e9/img/landing/new/external-websites/euro-vision.svg" }
                ].map((company, index) => (
                    <div
                        key={`${company.name}-${index}`}
                        className="mx-8 group cursor-pointer"
                    >
                        <div className="flex h-20 w-32 items-center justify-center transition-all duration-300">
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                width={260}
                                height={260}
                                className="h-32 w-32 object-contain transition-all duration-300"
                            />
                        </div>
                    </div>
                ))}
            </Marquee>
        </motion.div>
    );
};
