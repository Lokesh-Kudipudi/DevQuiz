# Design / UI Brief

## Branding
- Theme: dark-first, terminal-inspired UI with neon accents.
- Tone: focused, competitive, and technical.
- Fonts: Syne for headings, JetBrains Mono for body/UI.
- Colors: background #0a0a0f, surface #111118/#1a1a24, accent #7fff6e, secondary accents #ffcc44 and #9b6dff, danger #ff5555.
- Light mode: optional, softer contrast with green accent.

## Visual Direction
- Terminal-inspired UI with neon accents and a grid overlay.
- Dark theme is the default; light theme provides softer contrast.

## Key Screens
- Login / Register
- Dashboard (group list)
- Group Details (quizzes, assessments, rounds)
- Create Quiz
- Quiz Attempt + Results
- Create Coding Round
- Coding Round Lobby / Live / Results
- Create Online Assessment
- Take Online Assessment + Results

## Component Notes
- Collapsible cards for group details and sidebars.
- Modal-driven create flows and confirmations.
- Real-time leaderboard panels using Socket.io updates.
- Card-based lists with icon headers and action buttons.
- Monospace UI patterns for scores, timers, and invite codes.

## Motion
- `fadeUp` for entry transitions.
- `cursorBlink` for terminal-style accents.

## Layout & Effects
- Grid overlay via `body::before` for depth.
- Minimal scrollbars to keep focus on content.

## Inspiration / References
- Screenshots in `screenshots/`
