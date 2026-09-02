import React from 'react';
import { iconMap, IconName } from './icon-map';

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = 'currentColor',
  className = '',
  style,
}) => {
  const IconComponent = iconMap[name] || iconMap.code;

  return (
    <span
      className={`devdepth-icon inline-flex items-center justify-center ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      <IconComponent size={size} color={color} />
    </span>
  );
};
