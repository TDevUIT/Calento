import Image, { ImageProps } from 'next/image';
import { FC } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const OptimizedImage: FC<OptimizedImageProps> = ({
  alt,
  loading = 'lazy',
  priority = false,
  ...props
}) => {
  return (
    <Image
      alt={alt}
      loading={loading}
      priority={priority}
      quality={85} 
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4="
      {...props}
    />
  );
};

interface AvatarImageProps extends Omit<ImageProps, 'alt' | 'className'> {
  alt: string;
  size?: number;
  className?: string;
}

export const AvatarImage: FC<AvatarImageProps> = ({
  alt,
  size = 40,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
      <Image
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size}px`}
        quality={90}
        {...props}
      />
    </div>
  );
};

export const HeroImage: FC<OptimizedImageProps> = ({ alt, ...props }) => {
  return (
    <OptimizedImage
      alt={alt}
      priority={true}
      loading="eager"
      quality={90}
      {...props}
    />
  );
};
