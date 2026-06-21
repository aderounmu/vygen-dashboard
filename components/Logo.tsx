// components/Logo.tsx
import React from 'react';
import LogoLight from "@/Assets/vyken_security.png";
import LogoDark from "@/Assets/vyken_security_dark.png";

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  alt = 'logo',
}) => {
  return (
    <>
      <img
        src={LogoDark}
        className={`block dark:hidden ${className}`}
        alt={alt}
      />
      <img
        src={LogoLight}
        className={`hidden dark:block ${className}`}
        alt={alt}
      />
    </>
  );
};