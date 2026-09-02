import React from 'react';
import { featureIconMap, FeatureName, IconName } from './icon-map';
import { Icon } from './Icon';

export interface FeatureIconProps {
  feature: FeatureName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureIcon: React.FC<FeatureIconProps> = ({
  feature,
  size = 18,
  color = 'currentColor',
  className = '',
  style,
}) => {
  const iconName = (featureIconMap[feature] || 'code') as IconName;
  return <Icon name={iconName} size={size} color={color} className={className} style={style} />;
};
