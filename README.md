# YouTube Advanced Search

A React + TypeScript + Vite widget for searching YouTube videos with advanced filters (views, subscribers, region, language, date range).

## Tech Stack

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)

## Prerequisites

- **Node.js** 18 or newer ([download](https://nodejs.org/))
- **npm** 9+ (bundled with Node.js) — or use `pnpm` / `yarn`
- A **YouTube Data API v3 key** from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### How to get a YouTube API key

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and create (or select) a project.
2. Enable the **YouTube Data API v3** under **APIs & Services → Library**.
3. Go to **APIs & Services → Credentials** and click **Create credentials → API key**.
4. Copy the generated key — you will paste it into `.env` in the next step.

## 🚀 Setup

1. **Clone the repository** (or download the source):

   ```bash
   git clone <repository-url>
   cd youtube-advanced-search
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the project root:

   ```bash
   cp .env.example .env 2>/dev/null || touch .env
   ```

   Add your API key to `.env`:

   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

## Running Locally

Start the Vite development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (Vite prints the exact URL in the terminal). The page reloads automatically on file changes.

## Available Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot module reload.     |
| `npm run build`   | Type-check with `tsc` and build a production bundle.  |
| `npm run preview` | Serve the production build locally for smoke testing. |
