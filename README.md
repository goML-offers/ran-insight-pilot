# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f1a9f8e5-4a0e-4dbd-a10f-8ea46834eb82

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f1a9f8e5-4a0e-4dbd-a10f-8ea46834eb82) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables (optional)
# Create a .env file and set:
# - VITE_API_URL (default: http://localhost:8080)

# Step 5: Start the backend server (separate repository)
# The backend should be running on http://localhost:8080

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Backend API

This project uses a backend API for all data and AI agent interactions. The backend handles:

- Dashboard KPI data
- Cell status and performance metrics
- Time-series analytics
- AI agent chat via AWS Bedrock

### API Base URL
- **Development**: `http://localhost:8080`
- **Production**: Configure via `VITE_API_URL` environment variable

Make sure the backend server is running before starting the frontend application.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f1a9f8e5-4a0e-4dbd-a10f-8ea46834eb82) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
