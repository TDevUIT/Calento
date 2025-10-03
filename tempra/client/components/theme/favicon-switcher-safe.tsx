'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function FaviconSwitcherSafe() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;

    const updateFavicon = () => {
      // Simple approach: just update href of existing favicon
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      
      if (favicon) {
        const newHref = resolvedTheme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico';
        
        if (favicon.href !== newHref) {
          favicon.href = newHref;
          console.log('🎨 Favicon updated to:', newHref);
        }
      } else {
        // If no favicon exists, create one
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = resolvedTheme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico';
        
        if (document.head) {
          document.head.appendChild(link);
          console.log('🎨 Favicon created:', link.href);
        }
      }
    };

    // Add small delay to avoid race conditions
    const timeout = setTimeout(updateFavicon, 100);
    
    return () => clearTimeout(timeout);
  }, [mounted, resolvedTheme]);

  return null;
}
