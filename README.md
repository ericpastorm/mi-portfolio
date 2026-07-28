# Eric Pastor — Interactive OS Portfolio

> A personal portfolio presented as a fictional Windows XP-era desktop, combining Y2K software interfaces with Frutiger Aero visuals.

**Live demo:** [ericpastor.dev](https://ericpastor.dev/)

## Overview

Instead of a traditional scrolling portfolio, the site behaves like a small operating system. Visitors boot into a desktop and open the portfolio sections as independent applications.

The interface uses the visual language of early-2000s desktop software: beveled windows, LCD readouts, hardware-style controls, a Start menu, a taskbar, and the optimistic nature-and-technology aesthetic associated with Frutiger Aero.

## Key Features

### Desktop experience

- XP-inspired boot splash with BIOS text and a progress animation.
- Bliss-style wallpaper with chrome bubbles and water textures.
- Desktop shortcuts for **Home**, **About**, **Projects**, and **Contact**.
- Start menu containing every available application.
- Taskbar with open-window buttons, language and theme controls, and a live LED clock.

### Window manager

Every portfolio section runs inside a functional application window:

- Open apps from desktop shortcuts or the Start menu.
- Drag windows by their title bars.
- Click a window to bring it to the foreground.
- Maximize windows to fill the desktop above the taskbar.
- Restore windows to their previous position and dimensions.
- Minimize apps to the taskbar and restore them later.
- Close apps with the title-bar button or the `Escape` key.
- Double-click a title bar to toggle maximize and restore.

Window positions, focus order, minimized state, maximized state, and z-index are managed in client-side state. On screens below `768px`, newly opened windows are maximized automatically for better touch usability.

### Portfolio applications

- **Home:** Introduction, availability status, social links, LCD readout, spectrum analyzer, and Winamp-inspired controls.
- **About:** Professional biography and categorized technology stack.
- **Projects:** Client work and personal projects inside an Embla carousel.
- **Contact:** Contact details and a Web3Forms-powered message form.

### Visual system

- Winamp-inspired title bars, inset displays, transport controls, sliders, and LED indicators.
- Frutiger Aero day theme with vivid sky, grass, glass, water, and chrome surfaces.
- Night Aero dark theme with a dimmed wallpaper, neon edges, and green-on-black LCD displays.
- Theme preference is persisted in `localStorage`.
- English and Spanish interfaces with language-aware routes.
- Responsive layouts and touch-compatible window controls.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with the App Router
- **UI:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Window interactions and animation:** [Framer Motion](https://www.framer.com/motion/)
- **Project carousel:** [Embla Carousel](https://www.embla-carousel.com/)
- **Icons:** [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- **Contact form:** [Web3Forms](https://web3forms.com/)
- **Analytics:** Vercel Analytics and Speed Insights
- **Deployment:** [Vercel](https://vercel.com/)

## Architecture

The desktop and window system are split into focused client components:

```text
components/
├── Desktop.tsx          # Desktop shell and window-manager state
├── Window.tsx           # Drag, focus, minimize, maximize, restore, and close
├── DesktopIcon.tsx      # Selectable and launchable desktop shortcuts
├── Taskbar.tsx          # Start button, app buttons, tray, and live clock
├── StartMenu.tsx        # Application launcher
├── BootSplash.tsx       # Skippable startup sequence
├── WelcomeApp.tsx       # Home application
├── AboutApp.tsx         # About and skills application
├── ProjectsApp.tsx      # Projects carousel application
└── ContactApp.tsx       # Contact form application
```

`HomePageClient.tsx` mounts the desktop shell. Application state is maintained in `Desktop.tsx`, while each window owns motion values for its position and uses Framer Motion drag controls from the title bar.

Translated copy lives in:

```text
dictionaries/en.json
dictionaries/es.json
```

The generated Frutiger Aero artwork is stored in `public/aero/`.

## Getting Started

### Prerequisites

- Node.js `20.9` or newer
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ericpastorm/mi-portfolio.git
   cd mi-portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root and add a Web3Forms access key:

   ```env
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=YOUR_ACCESS_KEY_HERE
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

## Localization

The portfolio supports English and Spanish through language-prefixed routes:

- `/en`
- `/es`

When adding interface copy, update both dictionaries and keep their keys synchronized with the `Dictionary` type in `types.ts`.

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

## Contact

- **Email:** [hello@ericpastor.dev](mailto:hello@ericpastor.dev)
- **LinkedIn:** [linkedin.com/in/eric-pastor-moreno](https://linkedin.com/in/eric-pastor-moreno)
- **Agency:** [basaltworks.com](https://basaltworks.com/)
