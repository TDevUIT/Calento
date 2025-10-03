import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS_DATA } from '@/config/landing-data.config';

export const SecondTestimonialSection: React.FC = () => {
  if (!TESTIMONIALS_DATA.grafana) {
    return null;
  }

  const testimonial = TESTIMONIALS_DATA.grafana;

  return (
    <section className="w-full py-20 px-4 bg-white dark:bg-cod-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 flex justify-center">
            <Image
              src={testimonial.illustration}
              alt={`${testimonial.company} Testimonial Illustration`}
              width={600}
              height={400}
              className="rounded-2xl shadow-lg dark:shadow-cod-gray-950/50 max-w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <blockquote className="text-2xl lg:text-3xl font-bold text-cod-gray-900 dark:text-cod-gray-100 mb-6 leading-tight transition-colors duration-300">
              {testimonial.quote}
            </blockquote>
            <div className="text-cod-gray-600 dark:text-cod-gray-400 transition-colors duration-300">
              <div className="font-semibold">{testimonial.author}</div>
              <div className="text-lg">{testimonial.title}, {testimonial.company}</div>
            </div>
            <Image
              src={testimonial.companyLogo}
              alt={`${testimonial.company} Logo`}
              width={128}
              height={40}
              className="mt-6 w-32"
            />
          </div>
        </div>
      </div>
    </section>
  );
};