import React from "react";

interface NavbarItemProps {
  children: React.ReactNode;
  className?: string;
}

export default function NavbarItem({ children, className = "" }: NavbarItemProps) {
  return (
    <div className={`flex items-center gap-3 h-9 px-3 rounded-[10px] bg-black/70 backdrop-blur-[5px] ${className}`}>
      {children}
    </div>
  );
}
