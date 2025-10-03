'use client';

import React from 'react';
import Image from 'next/image';

interface EmployeeCardProps {
  name: string;
  total: string;
  billable: string;
  amount: string;
  avatar?: string;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  name, 
  total, 
  billable, 
  amount,
  avatar 
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-lg text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90 mb-1">
            EMPLOYEE
          </p>
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-white/20">
          {avatar ? (
            <Image src={avatar} alt={name} width={48} height={48} className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-wide opacity-90">TOTAL</span>
          <span className="text-sm font-semibold">{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Billable</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{billable}</span>
            <span className="text-lg font-bold">{amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
