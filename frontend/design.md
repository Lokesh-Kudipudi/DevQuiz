# Frontend Design Notes

## Visual Direction

- Terminal-inspired UI with neon accents and a grid overlay.
- Dark theme is the default; light theme provides softer contrast.

## Typography

- Headings: `Syne`.
- Body/UI: `JetBrains Mono`.

## Color Tokens (from `src/index.css`)

- Background: `--color-bg`
- Surface: `--color-surface`, `--color-surface2`
- Text: `--color-text-base`, `--color-muted`
- Accents: `--color-accent`, `--color-accent2`, `--color-purple`
- Status: `--color-danger`

## Motion

- `fadeUp` for entry transitions.
- `cursorBlink` for terminal-style accents.

## Layout & Effects

- Grid overlay via `body::before` for depth.
- Minimal scrollbars to keep focus on content.
