import React from "react";

interface CategoryIconProps {
  icon: string;
  className?: string;
}

export function CategoryIcon({ icon, className = "" }: CategoryIconProps) {
  if (!icon) return null;

  const trimmedIcon = icon.trim();
  if (trimmedIcon.toLowerCase().startsWith("<svg") || trimmedIcon.toLowerCase().includes("<svg")) {
    
    const svgStartIdx = trimmedIcon.toLowerCase().indexOf("<svg");
    const svgContent = trimmedIcon.substring(svgStartIdx);
    
    return (
      <span
        className={`inline-flex items-center justify-center svg-category-icon ${className}`}
        style={{
          width: "1.25em",
          height: "1.25em",
          verticalAlign: "middle",
          lineHeight: "1",
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  return <span className={className}>{icon}</span>;
}
