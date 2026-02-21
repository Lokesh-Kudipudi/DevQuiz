import React from 'react';
import { CARD_BASE_STYLES, CARD_HOVER_STYLES } from '../../constants/ui';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`${CARD_BASE_STYLES} ${hover ? CARD_HOVER_STYLES : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
