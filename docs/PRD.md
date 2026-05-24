# Product Requirements Document (PRD)

## Product Overview
DevQuiz is a developer-focused assessment platform that unifies:
- Group-based competitive practice
- Private solo interview preparation

It helps users generate and attempt quizzes, coding rounds, and online assessments from a single workflow.

## Target Users
- Students preparing for placements/interviews
- Peer study groups and bootcamp cohorts
- Mentors running technical practice rounds
- Solo engineers wanting daily prep with streak motivation

## Core Product Goals
- Reduce friction to start technical practice (AI-generated content in minutes)
- Support both collaboration and individual repetition
- Make progress visible (results, rankings, streaks)

## Functional Requirements

### 1. Authentication & Access
- Google OAuth login
- Local email/password login
- Demo account login
- Protected routes for authenticated actions

### 2. Group Mode
- Create group and join via invite code
- Group dashboard with quizzes/OAs/coding rounds
- Group content deletion permissions (creator/admin constraints)

### 3. Solo Mode
- Dedicated Personal Dashboard
- Solo creation flows:
  - Quiz
  - Online Assessment
  - Coding Round
- Per-item actions:
  - Start/Results
  - Delete

### 4. Quizzes
- AI generation from topics
- Timed/step-by-step attempt flow
- Score calculation and results view
- Leaderboard view for group context

### 5. Online Assessments
- Multi-section assessment creation
- Section-wise timed submissions
- Guardrails for navigation/end conditions
- Results + leaderboard with section-level detail

### 6. Coding Rounds
- Round creation and participation flow
- Lobby -> live -> results lifecycle
- External question timer/status tracking
- Topic/difficulty assisted question selection

### 7. Progress & Motivation
- UTC-day streak aggregation from solo activity
- Heatmap visualization in personal dashboard

## Non-Functional Requirements
- Real-time UX for round state changes
- Secure auth via HTTP-only cookies
- Role-based access checks for group vs solo scope
- Environment-based API key handling for Gemini calls

## Out of Scope
- Enterprise multi-tenancy and organization RBAC
- Billing/subscriptions
- Proctoring/anti-cheat
- Native mobile app
