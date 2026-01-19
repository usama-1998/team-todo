# Team Todo

A beautiful, modern, and highly modular task management app built with React, TypeScript, and Vite. Features a stunning premium glassmorphic UI with smart list management and persistent storage.

![Team Todo](public/background.png)

## ✨ Features

### Recent Updates
- **Enhanced Task Completion UI**: Completed tasks now feature a refined look with opacity reduction, grayscale effect, and smooth strikethrough animation.
- **Toast Notifications**: Added toast notifications using `sonner` for immediate feedback when completing tasks.
- **Completed Tasks Side Panel**: Access specific task history in a dedicated glassmorphic slide-over panel on the left, with an intuitive "Restore" option.
- **Improved Task Counts**: Tab counters now reflect only active tasks, ignoring completed ones.
- **Drag & Drop**: Move tasks between lists and reorder them with ease.

- **Modular Architecture** - Refactored into specialized components for better maintainability and performance.
- **Premium UI/UX** - Advanced glassmorphism design system using `backdrop-filter` and custom CSS design tokens.

- **Personalized Onboarding** - Welcomes you by name on first launch, stored locally.
- **Smart Lists** - Create, rename, and delete task lists with real-time updates.
- **Drag & Drop** - Reorder tasks effortlessly with intuitive drag-and-drop interactions.
- **Task Priorities** - Custom animated priority dropdowns.
- **Smart Date Picker** - Quick-select shortcuts (Today, Tomorrow, Weekend) and a premium calendar UI.
- **Daily Progress** - Visual progress ring showing your completion rate for the day.
- **Smart Backgrounds** - Choose presets or search online (powered by LoremFlickr) for any background image.
- **Quick Notes** - Add simple notes to your tasks.
- **Dual Timezone Clocks** - Instant view of PKT and SGT times.
- **Fluid Animations** - Telegram-style layout animations using Framer Motion for a premium native app feel.
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
