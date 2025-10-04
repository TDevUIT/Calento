"use client";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LegalNoticeProps {
    variant?: 'login' | 'register';
    className?: string;
    brandName?: string; // default Calento
}

// Thông báo pháp lý tái sử dụng cho trang đăng nhập / đăng ký
export function LegalNotice({ variant = 'login', className, brandName = 'Calento' }: LegalNoticeProps) {
    const linkClass = 'text-emerald-600 dark:text-emerald-400 underline decoration-emerald-400/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors';

    if (variant === 'register') {
        return (
            <div className={cn('text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 space-y-1', className)}>
                <p>
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <Link href="/terms" className={linkClass}>Điều khoản Dịch vụ {brandName}</Link>.
                </p>
                <p>
                    Tìm hiểu cách chúng tôi sử dụng & bảo vệ dữ liệu trong{' '}
                    <Link href="/privacy" className={linkClass}>Chính sách Quyền riêng tư</Link>.
                </p>
            </div>
        );
    }

    return (
        <p className={cn('text-[11px] leading-relaxed text-slate-500 dark:text-slate-400', className)}>
            Bằng việc sử dụng {brandName}, bạn đồng ý với{' '}
            <Link href="/terms" className={linkClass}>Điều khoản Dịch vụ</Link>{' '}và{' '}
            <Link href="/privacy" className={linkClass}>Chính sách Quyền riêng tư</Link>.
        </p>
    );
}

// Keep named export only (no default) to align with barrel export pattern.
