import React, { forwardRef } from 'react';
import { INPUT_BASE_STYLES, INPUT_ERROR_STYLES, INPUT_LABEL_STYLES, INPUT_ERROR_MESSAGE_STYLES } from '../../constants/ui';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={INPUT_LABEL_STYLES}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          ${INPUT_BASE_STYLES}
          ${error ? INPUT_ERROR_STYLES : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className={INPUT_ERROR_MESSAGE_STYLES}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
