/**
 * UI Constants — DevQuiz Design System
 * Central source of truth for component styles and variants.
 * Font: Syne (headings) + JetBrains Mono (body/labels)
 * Palette: #0a0a0f bg · #7fff6e accent · #ffcc44 amber · #9b6dff purple
 */

// ─────────────────────────────────────────────
// BUTTON VARIANTS
// ─────────────────────────────────────────────

export const BUTTON_VARIANTS = {
  primary:
    "bg-[#7fff6e] text-[#0a0a0f] font-medium border-0 " +
    "hover:opacity-90 hover:-translate-y-px active:translate-y-0 " +
    "shadow-none focus:ring-[#7fff6e]/40",

  outline:
    "bg-transparent text-[#f0f0f5] border border-white/[0.14] " +
    "hover:bg-[#1a1a24] focus:ring-white/10",

  ghost:
    "bg-transparent text-[#6b6b80] border border-white/[0.07] " +
    "hover:border-white/[0.14] hover:text-[#f0f0f5] focus:ring-white/10",

  danger:
    "bg-[#ff5555] text-white border-0 " +
    "hover:opacity-90 hover:-translate-y-px active:translate-y-0 " +
    "shadow-none focus:ring-[#ff5555]/40",

  secondary:
    "bg-[#1a1a24] text-[#f0f0f5] border border-white/[0.07] " +
    "hover:border-white/[0.14] focus:ring-white/10",
};

export const BUTTON_SIZES = {
  sm:   "px-3.5 py-1.5 text-[11px]",
  md:   "px-4 py-2 text-xs",
  lg:   "px-5 py-2.5 text-sm",
  icon: "p-2",
};

export const BUTTON_BASE_STYLES =
  "inline-flex items-center justify-center rounded-lg font-mono " +
  "transition-all duration-150 cursor-pointer " +
  "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#0a0a0f] " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";

// ─────────────────────────────────────────────
// CARD STYLES
// ─────────────────────────────────────────────

export const CARD_BASE_STYLES =
  "bg-[#111118] border border-white/[0.07] rounded-[12px] p-6";

export const CARD_HOVER_STYLES =
  "hover:border-white/[0.14] hover:-translate-y-0.5 " +
  "hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] " +
  "transition-all duration-200 cursor-pointer";

// Group card — has the animated top-border reveal
export const GROUP_CARD_STYLES =
  "relative bg-[#111118] border border-white/[0.07] rounded-[12px] p-6 " +
  "cursor-pointer overflow-hidden group " +
  "hover:border-white/[0.14] hover:-translate-y-0.5 " +
  "hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200";

// Use this on a div as the first child inside GROUP_CARD_STYLES
export const GROUP_CARD_ACCENT_BAR =
  "absolute top-0 left-0 right-0 h-[2px] bg-[#7fff6e] " +
  "scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200";

// Sidebar card
export const SIDEBAR_CARD_STYLES =
  "bg-[#111118] border border-white/[0.07] rounded-[12px] p-5 mb-4";

// ─────────────────────────────────────────────
// INPUT STYLES
// ─────────────────────────────────────────────

export const INPUT_BASE_STYLES =
  "w-full bg-[#0a0a0f] border border-white/[0.07] rounded-lg " +
  "px-3.5 py-2.5 font-mono text-[13px] text-[#f0f0f5] " +
  "placeholder-[#6b6b80] outline-none " +
  "focus:border-white/[0.14] transition-colors duration-150 " +
  "disabled:opacity-40 disabled:cursor-not-allowed";

export const INPUT_ERROR_STYLES =
  "border-[#ff5555]/60 focus:border-[#ff5555] focus:ring-[#ff5555]/20";

export const INPUT_LABEL_STYLES =
  "block text-[10px] uppercase tracking-[1px] text-[#6b6b80] font-mono mb-2";

export const INPUT_ERROR_MESSAGE_STYLES =
  "mt-1.5 text-[11px] text-[#ff5555] font-mono";

// ─────────────────────────────────────────────
// BADGE / TAG
// ─────────────────────────────────────────────

export const TAG_STYLES =
  "text-[10px] px-2 py-0.5 bg-[#1a1a24] border border-white/[0.07] " +
  "rounded text-[#6b6b80] tracking-widest font-mono";

export const BADGE_STYLES =
  "inline-flex items-center justify-center w-5 h-5 rounded-full " +
  "bg-[#7fff6e] text-[#0a0a0f] text-[10px] font-semibold font-mono";

// ─────────────────────────────────────────────
// SECTION LABEL (above content blocks)
// ─────────────────────────────────────────────

export const SECTION_LABEL_STYLES =
  "flex items-center gap-2.5 text-[10px] uppercase tracking-[2px] " +
  "text-[#6b6b80] font-mono mb-4 " +
  "after:content-[''] after:flex-1 after:h-px after:bg-white/[0.07]";

// ─────────────────────────────────────────────
// SECTION HEADING (quiz, assessments, coding)
// ─────────────────────────────────────────────

export const SECTION_HEADING_STYLES =
  "font-['Syne',sans-serif] font-bold text-base text-[#f0f0f5] " +
  "flex items-center gap-2 mb-4";

// ─────────────────────────────────────────────
// QUIZ ITEM ROW
// ─────────────────────────────────────────────

export const QUIZ_ITEM_STYLES =
  "bg-[#111118] border border-white/[0.07] rounded-[12px] " +
  "px-6 py-5 mb-3 flex items-center justify-between " +
  "hover:border-white/[0.14] transition-all duration-150 cursor-pointer";

export const QUIZ_ITEM_NAME_STYLES =
  "font-['Syne',sans-serif] font-semibold text-[15px] text-[#f0f0f5] " +
  "mb-2 leading-snug";

export const DIFFICULTY_DOT = {
  easy:   "w-1.5 h-1.5 rounded-full bg-[#7fff6e] inline-block mr-1.5",
  medium: "w-1.5 h-1.5 rounded-full bg-[#ffcc44] inline-block mr-1.5",
  hard:   "w-1.5 h-1.5 rounded-full bg-[#ff5555] inline-block mr-1.5",
};

export const DIFFICULTY_LABEL_STYLES =
  "inline-flex items-center text-[10px] text-[#6b6b80] font-mono";

// ─────────────────────────────────────────────
// LEADERBOARD ROW
// ─────────────────────────────────────────────

export const LB_ROW_STYLES =
  "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0a0a0f] mb-1.5 " +
  "hover:bg-[#1a1a24] transition-colors duration-100";

export const LB_ROW_TOP_STYLES =
  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1.5 " +
  "bg-[#7fff6e]/[0.05] border border-[#7fff6e]/[0.12] " +
  "hover:bg-[#7fff6e]/[0.08] transition-colors duration-100";

export const LB_TABLE_ROW_STYLES =
  "grid grid-cols-[80px_1fr_120px_140px] bg-[#111118] " +
  "border border-white/[0.07] rounded-[10px] mb-2 px-4 py-3.5 items-center " +
  "hover:border-white/[0.14] hover:translate-x-1 transition-all duration-150";

export const LB_TABLE_ROW_ME_STYLES =
  "grid grid-cols-[80px_1fr_120px_140px] " +
  "border border-[#7fff6e]/25 bg-[#7fff6e]/[0.04] " +
  "rounded-[10px] mb-2 px-4 py-3.5 items-center " +
  "hover:border-[#7fff6e]/40 hover:translate-x-1 transition-all duration-150";

export const LB_TABLE_HEADER_STYLES =
  "grid grid-cols-[80px_1fr_120px_140px] px-4 pb-3 mb-3 " +
  "text-[10px] uppercase tracking-[1.5px] text-[#6b6b80] font-mono " +
  "border-b border-white/[0.07]";

export const RANK_BADGE = {
  1: "w-8 h-8 rounded-lg grid place-items-center text-[13px] font-semibold bg-[#ffcc44]/15 text-[#ffcc44]",
  2: "w-8 h-8 rounded-lg grid place-items-center text-[13px] font-semibold bg-white/[0.08] text-[#c0c0d0]",
  3: "w-8 h-8 rounded-lg grid place-items-center text-[13px] font-semibold bg-[#cd7f32]/10 text-[#cd7f32]",
  default: "w-8 h-8 rounded-lg grid place-items-center text-[13px] font-semibold bg-[#1a1a24] text-[#6b6b80]",
};

// ─────────────────────────────────────────────
// QUIZ RESULTS — PERFORMANCE CARD
// ─────────────────────────────────────────────

export const PERF_CARD_STYLES =
  "bg-[#111118] border border-white/[0.07] rounded-[12px] p-7 mb-8 " +
  "grid grid-cols-[1fr_auto] gap-6 items-center";

export const PERF_STAT_BOX_STYLES =
  "text-center p-4 bg-[#0a0a0f] border border-white/[0.07] " +
  "rounded-[10px] min-w-[80px]";

export const PERF_STAT_LABEL_STYLES =
  "text-[9px] uppercase tracking-[1.5px] text-[#6b6b80] font-mono mb-2";

export const PERF_STAT_VALUE = {
  score:    "font-['Syne',sans-serif] font-extrabold text-[22px] text-[#7fff6e]",
  rank:     "font-['Syne',sans-serif] font-extrabold text-[22px] text-[#ffcc44]",
  accuracy: "font-['Syne',sans-serif] font-extrabold text-[22px] text-[#9b6dff]",
};

// ─────────────────────────────────────────────
// QUIZ RESULTS — QUESTION REVIEW CARD
// ─────────────────────────────────────────────

export const QUESTION_CARD_STYLES =
  "bg-[#111118] border border-white/[0.07] rounded-[12px] p-6 mb-4 " +
  "border-l-[3px] transition-colors duration-150";

export const QUESTION_CARD_CORRECT = "border-l-[#7fff6e]";
export const QUESTION_CARD_WRONG   = "border-l-[#ff5555]";
export const QUESTION_CARD_PENDING = "border-l-white/[0.07]";

export const QUESTION_NUMBER_BADGE = {
  correct: "w-7 h-7 rounded-[6px] grid place-items-center text-[11px] font-semibold bg-[#7fff6e]/15 text-[#7fff6e] flex-shrink-0",
  wrong:   "w-7 h-7 rounded-[6px] grid place-items-center text-[11px] font-semibold bg-[#ff5555]/15 text-[#ff5555] flex-shrink-0",
  default: "w-7 h-7 rounded-[6px] grid place-items-center text-[11px] font-semibold bg-[#1a1a24] text-[#6b6b80] flex-shrink-0",
};

export const OPTION_STYLES = {
  default:
    "px-3.5 py-2.5 bg-[#0a0a0f] border border-white/[0.07] rounded-lg " +
    "text-xs font-mono flex justify-between items-center",
  correct:
    "px-3.5 py-2.5 bg-[#7fff6e]/[0.07] border border-[#7fff6e]/30 rounded-lg " +
    "text-xs font-mono text-[#7fff6e] flex justify-between items-center",
  wrong:
    "px-3.5 py-2.5 bg-[#ff5555]/[0.07] border border-[#ff5555]/20 rounded-lg " +
    "text-xs font-mono text-[#ff5555] flex justify-between items-center",
};

// ─────────────────────────────────────────────
// TAB SWITCHER
// ─────────────────────────────────────────────

export const TAB_CONTAINER_STYLES =
  "inline-flex bg-[#111118] border border-white/[0.07] rounded-[10px] p-1";

export const TAB_STYLES = {
  active:   "px-6 py-2 text-xs rounded-[7px] cursor-pointer bg-[#7fff6e] text-[#0a0a0f] font-medium font-mono transition-all",
  inactive: "px-6 py-2 text-xs rounded-[7px] cursor-pointer text-[#6b6b80] font-mono hover:text-[#f0f0f5] transition-all",
};

// ─────────────────────────────────────────────
// INVITE CODE BLOCK
// ─────────────────────────────────────────────

export const INVITE_CODE_BLOCK_STYLES =
  "bg-[#0a0a0f] border border-white/[0.07] rounded-lg px-4 py-3 " +
  "flex justify-between items-center";

export const INVITE_CODE_VALUE_STYLES =
  "text-xl font-mono font-medium tracking-[4px] text-[#ffcc44]";

export const INVITE_CODE_COPY_BTN_STYLES =
  "bg-transparent border-0 text-[#6b6b80] text-sm cursor-pointer " +
  "px-1.5 py-0.5 rounded hover:text-[#7fff6e] transition-colors";

// ─────────────────────────────────────────────
// MEMBER LIST ITEM
// ─────────────────────────────────────────────

export const MEMBER_ITEM_STYLES =
  "flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1a1a24] transition-colors cursor-default";

export const MEMBER_NAME_STYLES = "text-xs font-mono text-[#f0f0f5]";

export const AVATAR_COLORS = [
  "#7b2ff7", "#2f7bf7", "#2fb87b",
  "#f72f4f", "#f79a2f", "#7fff6e",
  "#9b6dff", "#ff5555", "#ffcc44",
];

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────

export const EMPTY_STATE_STYLES =
  "py-12 px-6 text-center bg-[#111118] border border-dashed " +
  "border-white/[0.07] rounded-[12px] mb-3";

export const EMPTY_STATE_ICON_STYLES = "text-[32px] mb-3 opacity-40";
export const EMPTY_STATE_TEXT_STYLES = "text-xs text-[#6b6b80] font-mono mb-4";

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────

export const MODAL_OVERLAY_STYLES =
  "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center";

export const MODAL_PANEL_STYLES =
  "bg-[#111118] border border-white/[0.14] rounded-2xl p-8 w-[400px] " +
  "animate-[fadeUp_0.2s_ease]";

export const MODAL_TITLE_STYLES =
  "font-['Syne',sans-serif] font-bold text-xl text-[#f0f0f5] mb-1.5";

export const MODAL_SUBTITLE_STYLES =
  "text-[11px] text-[#6b6b80] font-mono mb-6";

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────

export const NAVBAR_STYLES =
  "sticky top-0 z-50 h-[60px] px-8 flex items-center justify-between " +
  "bg-[#0a0a0f]/85 backdrop-blur-xl border-b border-white/[0.07]";

export const NAVBAR_LOGO_MARK_STYLES =
  "w-8 h-8 rounded-lg bg-[#7fff6e] grid place-items-center " +
  "text-sm font-extrabold text-[#0a0a0f] font-['Syne',sans-serif] flex-shrink-0";

export const NAVBAR_LOGO_TEXT_STYLES =
  "font-['Syne',sans-serif] font-extrabold text-lg tracking-tight text-[#f0f0f5]";

export const NAVBAR_USER_CHIP_STYLES =
  "flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24] " +
  "border border-white/[0.07] rounded-full text-xs font-mono text-[#f0f0f5] cursor-pointer";

// ─────────────────────────────────────────────
// PAGE LAYOUT HELPERS
// ─────────────────────────────────────────────

export const PAGE_WRAPPER_STYLES  = "max-w-[1200px] mx-auto px-8 py-12";
export const RESULTS_WRAPPER_STYLES = "max-w-[900px] mx-auto px-8 py-12";

export const PAGE_TITLE_STYLES =
  "font-['Syne',sans-serif] font-extrabold text-5xl tracking-[-2px] leading-none text-[#f0f0f5]";

export const PAGE_SUBTITLE_STYLES =
  "text-[#6b6b80] text-xs mt-2 tracking-wide font-mono";

export const BACK_LINK_STYLES =
  "inline-flex items-center gap-1.5 text-xs text-[#6b6b80] font-mono " +
  "hover:text-[#f0f0f5] transition-colors cursor-pointer mb-8";

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

export const FOOTER_STYLES =
  "text-center py-6 text-[10px] text-[#6b6b80] tracking-widest font-mono " +
  "border-t border-white/[0.07]";
