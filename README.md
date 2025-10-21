# NetworkMatic RANflow

<div align="center">

![NetworkMatic RANflow](https://img.shields.io/badge/NetworkMatic-RANflow-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**A modern React-based dashboard for Radio Access Network (RAN) monitoring and optimization with AI-powered co-pilot assistance.**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 🚀 Overview

NetworkMatic RANflow is a comprehensive network operations center (NOC) dashboard designed for telecommunications professionals. It provides real-time monitoring, intelligent analytics, and AI-powered insights for Radio Access Network management.

### Key Highlights

- 📊 **Real-time KPI Monitoring** - Live network performance metrics
- 🗺️ **Interactive Geospatial Views** - Cell tower visualization with heatmaps
- 📈 **Advanced Analytics** - Comprehensive performance charts and trends
- 🤖 **AI Co-pilot** - Intelligent network diagnostics and recommendations
- 📱 **Responsive Design** - Works seamlessly across all devices
- ⚡ **High Performance** - Built with modern React and TypeScript

## ✨ Features

### Core Functionality
- **Real-time KPI Dashboard**: Monitor RRC success rates, active cells, critical alarms, and network load
- **Interactive Map View**: Visualize cell tower locations with signal strength heatmaps
- **Analytics Dashboard**: Time-series charts and performance trend analysis
- **Data Table View**: Detailed tabular data with sorting and filtering capabilities
- **AI-Powered Co-pilot**: Natural language interface for network diagnostics

### Technical Features
- **Modern UI/UX**: Built with shadcn/ui and Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: Live data synchronization every 30 seconds
- **Error Handling**: Graceful fallbacks and user notifications
- **Responsive Design**: Mobile-first approach with desktop optimization

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Framework** | shadcn/ui, Radix UI, Tailwind CSS |
| **State Management** | TanStack Query (React Query) |
| **Routing** | React Router DOM |
| **Maps** | Mapbox GL JS |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Build Tool** | Vite |
| **Linting** | ESLint, TypeScript ESLint |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Recommended Tools
- [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- [VS Code](https://code.visualstudio.com/) with recommended extensions

## 🚀 Installation

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/networkmatic-ranflow.git
cd networkmatic-ranflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Detailed Setup

1. **Clone and Navigate**
   ```bash
   git clone https://github.com/your-username/networkmatic-ranflow.git
   cd networkmatic-ranflow
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8080
   
   # Mapbox Configuration (optional)
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   
   # Development Settings
   VITE_APP_ENV=development
   ```

4. **Backend Setup**
   
   Ensure your backend API server is running and accessible. The backend should provide:
   - Dashboard KPI endpoints
   - Cell tower data APIs
   - AI chat functionality
   - Real-time data streams

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run build:dev` | Create development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 📁 Project Structure

```
networkmatic-ranflow/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── canvas/        # Dashboard view components
│   │   ├── CanvasView.tsx # Main canvas container
│   │   ├── CoPilotPanel.tsx # AI assistant panel
│   │   └── DashboardHeader.tsx # Header with KPIs
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Route components
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── assets/            # Images, icons, etc.
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🔌 API Integration

The application expects a REST API with the following endpoints:

### Required Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/kpis` | Dashboard KPI data |
| `POST` | `/api/chat` | AI co-pilot chat messages |
| `GET` | `/api/cells` | Cell tower information |
| `GET` | `/api/analytics` | Performance analytics data |

### API Response Examples

**Dashboard KPIs**
```json
{
  "rrc_success_rate": 98.2,
  "active_cells": 25,
  "critical_alarms": 3,
  "network_load": 67,
  "status": "Operational"
}
```

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview build locally
npm run preview
```

### Environment Variables for Production

```env
VITE_API_URL=https://your-production-api.com
VITE_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token
VITE_APP_ENV=production
```

### Deployment Platforms

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: Upload build files to S3 bucket
- **Docker**: Use the provided Dockerfile for containerized deployment

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use ESLint configuration for consistency
- Write meaningful commit messages
- Add proper error handling
- Include tests for new features
- Update documentation as needed

## 📖 Documentation

- [User Testing Guide](USER_TESTING_GUIDE.md) - Comprehensive testing instructions
- [API Documentation](docs/API.md) - Backend API specifications
- [Component Library](docs/COMPONENTS.md) - UI component documentation
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Verify `VITE_API_URL` in your `.env` file
- Ensure backend server is running
- Check network connectivity

**Map Not Loading**
- Verify Mapbox access token
- Check browser console for errors
- Ensure proper CORS configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Recharts](https://recharts.org/) for responsive charts
- [Mapbox](https://www.mapbox.com/) for mapping capabilities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/networkmatic-ranflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/networkmatic-ranflow/discussions)
- **Email**: support@goml.com

---

<div align="center">

**Made with ❤️ by the goML Team**

[⭐ Star this repository](https://github.com/your-username/networkmatic-ranflow) if you find it helpful!

</div>
