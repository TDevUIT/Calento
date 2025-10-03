'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-9xl font-bold text-gray-900">404</h1>

        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Page not found
        </h2>

        <p className="mb-8 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Go to homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="mb-4 text-sm text-gray-600">You might be interested in:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/features" className="text-black hover:underline">
              Features
            </Link>
            <Link href="/pricing" className="text-black hover:underline">
              Pricing
            </Link>
            <Link href="/blog" className="text-black hover:underline">
              Blog
            </Link>
            <Link href="/contact" className="text-black hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
