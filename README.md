# Team Todo

A beautiful, modern, and highly modular task management app built with React, TypeScript, and Vite. Features a stunning premium glassmorphic UI with smart list management and persistent storage.

![Team Todo](public/background.png)

## ✨ Features

- **Modular Architecture** - Refactored into specialized components for better maintainability and performance.
- **Premium UI/UX** - Advanced glassmorphism design system using `backdrop-filter` and custom CSS design tokens.

- **Personalized Onboarding** - Welcomes you by name on first launch, stored locally.
- **Smart Lists** - Create, rename, and delete task lists with real-time updates.
- **Task Priorities & Sorting** - Tasks sorted by Priority (High > Medium > Low) and then by Date.
- **Due Dates** - Set due dates for tasks; defaults to "Today" if unspecified.
- **Daily Progress** - Visual progress ring showing your completion rate for the day.
- **Smart Backgrounds** - Choose presets or search online (powered by LoremFlickr) for any background image.
- **Notes & Documents** - Rich task details with persistent notes and link attachments.
- **Quick Links** - Customizable header bookmarks for frequently accessed sites.
- **Dual Timezone Clocks** - Instant view of PKT and SGT times.
- **Micro-Animations** - Smooth transitions using Framer Motion for a premium native app feel.
- **Persistence** - Automatic data sync via Chrome Storage Sync or LocalStorage fallback.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/usama-1998/team-todo.git
cd team-todo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety & Developer Experience
- **Vite** - Lightning-fast Build Tool
- **Tailwind CSS** - Modern Design System
- **Zustand** - Global State Management with Persistence
- **Framer Motion** - Fluid Animations & Micro-interactions
- **Sonner** - Elegant Toast Notifications
- **Lucide React** - Beautiful, consistent Iconography

## 📱 Component Structure

The app is now organized into specialized components located in `src/components/`:
- `Header.tsx` - Timezones & Daily Progress
- `Sidebar.tsx` - List Navigation & Creation
- `TaskBoard.tsx` - Main Task Interaction Area
- `TaskItem.tsx` - Detailed Task Card logic
- `Settings.tsx` - Customization & Background Search
- `OnboardingModal.tsx` - First-time user welcome screen

## 📄 License

MIT
