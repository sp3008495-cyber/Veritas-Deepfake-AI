# Veritas AI — Multi-Modal Deepfake & Media Forensics Platform

Veritas AI is a modern, dark-mode-first cyber-security web application built with **React**, **Vite**, **Tailwind CSS**, and **Lucide React**. It provides an interactive forensic workspace to inspect **Images**, **Audio**, and **Video** files for synthetic manipulation, face-morphing, voice cloning, and temporal lighting inconsistencies.

## Key Features

1. **Multi-Modal Upload Center (Drag & Drop)**
   - Unified drag-and-drop ingestion supporting **Images** (`.jpg`, `.png`, `.webp`), **Audio** (`.mp3`, `.wav`, `.m4a`), and **Video** (`.mp4`, `.mov`, `.webm`).
   - Automatic file metadata extraction (file size, native image/video resolution, media duration) with instant preview and **Run Analysis** workflow.

2. **Interactive AI Analysis Simulation Engine**
   - Multi-step forensic progress pipeline simulating frame extraction, frequency-domain (DCT/FFT) residual analysis, metadata consistency verification, and neural artifact evaluation.

3. **Detailed Multi-Modal Forensic Breakdowns**
   - **Overall Verdict Banner:** Displays a clear status badge (`Authentic`, `Suspicious`, or `High Probability of Manipulation / Morphing`) alongside the overall confidence score percentage.
   - **Image Forensics:** Interactive Error Level Analysis (ELA) filter toggle, facial morphing bounding-box overlays, and EXIF/C2PA metadata integrity checks.
   - **Audio Forensics:** Interactive STFT spectrogram and phase-inversion correlation views, real-time audio probe playback, and synthetic vocoder artifact scoring.
   - **Video Forensics:** Frame-by-frame timeline scrubber with flagged suspicious keyframes, temporal consistency metrics, and 3D lighting/shadow inconsistency warnings.
   - **Forensic Report Export:** One-click JSON forensic report download and printable PDF report summary modal.

4. **Recent Scans History**
   - Persistent sidebar history stored in `localStorage` with status badges and timestamps for instant recall of previous scans.

## Project Structure

```text
veritas-ai/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── utils/
    │   └── forensicEngine.js
    └── components/
        ├── Header.jsx
        ├── Sidebar.jsx
        ├── UploadCenter.jsx
        ├── VerdictBanner.jsx
        ├── ImageForensics.jsx
        ├── AudioForensics.jsx
        ├── VideoForensics.jsx
        └── ReportModal.jsx
```

## Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0` (or `pnpm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/veritas-ai.git
   cd veritas-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Icons | Lucide React |
| State & Storage | React Hooks + Browser `localStorage` |
| Media Inspection | HTML5 File API, Web Audio API, Canvas/SVG Overlays |

## License

Released under the MIT License.
