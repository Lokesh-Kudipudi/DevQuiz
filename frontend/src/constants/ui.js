/**
 * UI Constants
 * Central source of truth for component styles and variants.
 */

// Button Component Constants
export const BUTTON_VARIANTS = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-lg shadow-primary-500/30",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 focus:ring-gray-500",
    outline: "bg-transparent border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/30",
};

export const BUTTON_SIZES = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg",
    icon: "p-2",
};

export const BUTTON_BASE_STYLES = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

// Card Component Constants
export const CARD_BASE_STYLES = "bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6";
export const CARD_HOVER_STYLES = "hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";

// Input Component Constants
export const INPUT_BASE_STYLES = "w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";
export const INPUT_ERROR_STYLES = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
export const INPUT_LABEL_STYLES = "block text-sm font-medium text-gray-300 mb-1.5";
export const INPUT_ERROR_MESSAGE_STYLES = "mt-1 text-sm text-red-400";
