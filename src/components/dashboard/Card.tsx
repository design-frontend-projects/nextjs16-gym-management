import React from "react";

interface CardProps {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};
