# Vidhyalok Trust of Education

A modern web application for Vidhyalok Trust of Education, built to manage donations, volunteers, projects, and events.

## Project Overview

Vidhyalok Trust of Education is a platform that enables:

- **Donations**: Accept and manage charitable donations
- **Volunteers**: Register and manage volunteer activities
- **Projects**: Showcase educational and social impact projects
- **Events**: Organize and promote community events
- **Admin Dashboard**: Comprehensive admin panel for managing all aspects of the organization

## Technologies Used

This project is built with:

- **Frontend**:

  - Vite - Fast build tool and dev server
  - TypeScript - Type-safe JavaScript
  - React - UI library
  - React Router - Client-side routing
  - shadcn-ui - Beautiful UI components
  - Tailwind CSS - Utility-first CSS framework
  - Axios - HTTP client for API requests

- **Backend**:
  - Node.js - JavaScript runtime
  - Express.js - Web framework
  - MySQL - Relational database
  - Sequelize - ORM for database operations
  - JWT - Authentication and authorization
  - bcryptjs - Password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn
- MySQL database

### Installation

1. **Clone the repository**

   ```sh
   git clone <YOUR_GIT_URL>
   cd impact-forge-frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_NODE_ENV=development
   ```

4. **Start the development server**

   ```sh
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
impact-forge-frontend/
├── public/          # Static assets (logo, favicon)
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── services/   # API service layer
│   ├── hooks/       # Custom React hooks
│   ├── assets/      # Images and other assets
│   └── App.tsx      # Main application component
├── index.html       # HTML template
└── package.json     # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- 🎨 Modern, responsive UI design
- 🔐 Secure authentication system
- 👥 Admin dashboard for content management
- 💰 Donation management
- 🤝 Volunteer registration and management
- 📅 Event management
- 📊 Project showcase
- 📱 Mobile-friendly interface

## Backend API

The frontend connects to a backend API. Make sure the backend server is running on `http://localhost:5000` (or configure `VITE_API_URL` accordingly).

## Deployment

### Build for Production

```sh
npm run build
```

The `dist` folder will contain the production-ready files.

### Deploy

You can deploy the built files to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any other static hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for Vidhyalok Trust of Education.

## Contact

For questions or support, please contact the development team.
