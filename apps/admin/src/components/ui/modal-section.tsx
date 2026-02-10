import React from 'react';

interface ModalSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ModalSection: React.FC<ModalSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <h3 className="text-sm font-bold leading-[20px] tracking-[-0.28px] text-gray-600">{title}</h3>
      <div className="text-sm font-normal leading-[20px] tracking-[-0.28px] text-black">{children}</div>
    </div>
  );
};

export default ModalSection;
