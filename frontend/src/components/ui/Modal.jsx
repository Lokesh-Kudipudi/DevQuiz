import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { MODAL_OVERLAY_STYLES, MODAL_PANEL_STYLES, MODAL_TITLE_STYLES, MODAL_SUBTITLE_STYLES } from '../../constants/ui';

const Modal = ({ isOpen, onClose, title, subtitle, children, footer, className = '' }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={MODAL_OVERLAY_STYLES}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0" 
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className={`relative ${MODAL_PANEL_STYLES} ${className}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className={MODAL_TITLE_STYLES}>{title}</h3>
                        {subtitle && (
                            <p className={MODAL_SUBTITLE_STYLES}>{subtitle}</p>
                        )}
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#6b6b80] hover:text-[#f0f0f5] transition-colors ml-4 mt-0.5 cursor-pointer bg-transparent border-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Body */}
                <div>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2.5 mt-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
