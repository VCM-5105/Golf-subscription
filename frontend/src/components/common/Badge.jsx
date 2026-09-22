import React from "react";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-[#EFECE6] text-[#3D403D] border-[#DDD7CD]",
    active: "bg-[#EBF2ED] text-[#244530] border-[#C3D7C8]",
    pending: "bg-[#FAF1E4] text-[#805315] border-[#E8D3B4]",
    danger: "bg-[#FBEBEB] text-[#7A2424] border-[#ECC4C4]",
    dark: "bg-[#181918] text-[#FAF8F5] border-[#181918]",
    outline: "bg-transparent text-[#575C57] border-[#D8D2C5]"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase font-mono-code ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};
