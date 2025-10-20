# RAN Co-pilot Dashboard

A modern React-based dashboard for Radio Access Network (RAN) monitoring and optimization with AI-powered co-pilot assistance.

## Features

- **Real-time KPI Monitoring**: Track network performance metrics with live updates
- **Interactive Map View**: Visualize cell tower locations and signal strength with heatmaps
- **Analytics Dashboard**: Comprehensive charts and graphs for network performance analysis
- **Data Table View**: Detailed tabular data for in-depth analysis
- **AI Co-pilot**: Intelligent assistant for network diagnostics and optimization recommendations
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ (recommended to use [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn package manager
- Backend API server (separate repository)

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Start the Backend Server

Make sure your backend API server is running on the configured URL (default: `http://localhost:8080`).

The backend should provide endpoints for:
- Dashboard KPIs
- Cell status and performance metrics
- Time-series analytics data
- AI chat functionality

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── canvas/         # Dashboard view components
│   ├── CanvasView.tsx  # Main canvas container
│   ├── CoPilotPanel.tsx # AI assistant panel
│   └── DashboardHeader.tsx # Header with KPIs
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Route components
├── services/           # API service functions
└── assets/             # Static assets
```

## API Integration

The application expects a REST API with the following endpoints:

- `GET /api/dashboard/kpis` - Dashboard KPI data
- `POST /api/chat` - AI co-pilot chat messages
- Additional endpoints for cell data and analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use ESLint configuration for code consistency
- Implement responsive design principles
- Write meaningful commit messages
- Add proper error handling for API calls

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables for Production

Set the following environment variables for production deployment:

- `VITE_API_URL` - Production API server URL

## License

This project is open source. Please check the LICENSE file for details.

## Support

For questions and support, please open an issue in the GitHub repository.
