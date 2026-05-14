# StudyOS

<div align="center">

![StudyOS Banner](https://capsule-render.vercel.app/api?type=waving\&color=0:0f172a,50:111827,100:1e293b\&height=220\&section=header\&text=StudyOS\&fontSize=52\&fontColor=ffffff\&animation=fadeIn\&fontAlignY=38\&desc=Developer%20Productivity%20Platform%20for%20Students%20and%20Engineers\&descAlignY=60\&descAlign=50)

</div>

---

# Overview

StudyOS is a modern full-stack productivity platform built for developers, competitive programmers, and students.

It combines:

* Learning roadmaps
* DSA tracking
* Notes & revision systems
* Competitive programming analytics
* AI-powered coaching
* Contest tracking
* Dashboard analytics

into a single unified workspace.

The goal of StudyOS is to provide a focused operating system for technical learning and long-term skill development.

---

# Features

## Authentication & Security

* Google OAuth login
* GitHub OAuth login
* Persistent authentication sessions
* Supabase Auth integration
* Protected dashboard routes
* SSR session synchronization

---

## Dashboard Analytics

* Real LeetCode analytics
* Real Codeforces analytics
* GitHub profile statistics
* Cached analytics layer
* Real-time dashboard updates
* Graceful API fallback handling

---

## DSA Tracker

* Track solved problems
* Platform categorization
* Difficulty tracking
* Topic-based organization
* AI-powered weak topic analysis
* Search & filtering support

---

## Learning Roadmaps

Structured learning paths for:

* Data Structures & Algorithms
* Competitive Programming
* Java Backend Development
* Web Development
* System Design

Roadmap progress architecture is designed for:

* topic completion
* progress persistence
* analytics integration
* future adaptive recommendations

---

## Notes & Revision System

* Markdown-based notes
* Revision workflow support
* Knowledge organization
* Spaced repetition architecture
* Search-ready structure

---

## Contest Tracker

Track upcoming contests across:

* Codeforces
* LeetCode
* AtCoder

Includes:

* contest countdowns
* platform filtering
* future reminder support

---

## AI Coach

Gemini-powered AI assistant capable of:

* DSA guidance
* weak topic analysis
* study recommendations
* roadmap suggestions
* learning assistance

Built with graceful fallback handling when API keys are unavailable.

---

# Tech Stack

## Frontend

* Next.js 15 (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* Framer Motion
* Recharts

---

## Backend

* Supabase
* PostgreSQL
* Server Actions
* API Routes
* Row Level Security (RLS)

---

## Integrations

* LeetCode APIs
* Codeforces APIs
* GitHub APIs
* Gemini AI
* Resend Email Service

---

# Architecture

```bash
src/
├── app/
│   ├── dashboard/
│   ├── api/
│   ├── login/
│   └── signup/
│
├── components/
│   ├── layout/
│   ├── shared/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── dsa/
│   ├── notes/
│   ├── profile/
│   ├── roadmap/
│   └── contests/
│
├── services/
│   ├── leetcode.ts
│   ├── codeforces.ts
│   └── ai/
│
├── store/
├── hooks/
├── utils/
└── lib/
```

---

# Database Tables

Current database architecture includes:

* `user_profiles`
* `user_notes`
* `user_problems`
* `user_topic_progress`
* `linked_profiles`
* `cached_analytics`
* `contest_reminders`
* `revisions`
* `bookmarks`

---

# Current Project Status

StudyOS is currently transitioning from a prototype into a production-grade developer platform.

### Stabilized Systems

* Authentication
* Session persistence
* Dashboard rendering
* Analytics APIs
* Error boundaries
* OAuth callbacks
* Loading states
* API fallback handling

### In Progress

* Real roadmap progress tracking
* Deep analytics synchronization
* Notes persistence
* Notification system
* AI personalization

---

# Screenshots

## Dashboard

* Real competitive programming analytics
* Activity tracking architecture
* Learning roadmap system
* AI-powered productivity flow

## DSA Tracker

* Problem tracking
* AI analysis integration
* Topic categorization

## Roadmaps

* Structured learning paths
* Modular roadmap architecture

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd study-os
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
```

---

## 4. Start Development Server

```bash
npm run dev
```

---

# Future Roadmap

## Planned Features

* Real roadmap progress engine
* AI-powered adaptive learning
* Daily streak analytics
* Advanced revision scheduling
* GitHub contribution heatmaps
* Personalized coding recommendations
* Mobile responsiveness improvements
* Notification automation
* Advanced dashboard insights

---

# Engineering Goals

StudyOS focuses heavily on:

* scalable architecture
* feature isolation
* backend consistency
* API resilience
* production-grade auth
* reliable analytics
* maintainable frontend systems

The project emphasizes engineering quality and system stability over feature quantity.

---

# Inspiration

StudyOS is inspired by the idea that:

> developers need an operating system for learning, not just another todo app.

It aims to combine:

* roadmap learning
* coding analytics
* revision systems
* AI guidance
* productivity workflows

into a unified ecosystem.

---

# Contributing

Contributions, ideas, and improvements are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

# License

MIT License

---

# Author

Built with focus, iteration, and e
