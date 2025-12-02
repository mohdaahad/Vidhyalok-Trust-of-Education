# Vidhyalok Trust of Education - Backend API

Backend API for Vidhyalok Trust of Education website built with Node.js, Express, and MySQL.

## Features

- 🔐 User Authentication & Authorization (JWT)
- 💰 Donation Management with Razorpay Integration
- 🙋‍♂️ Volunteer Registration & Management
- 📊 Project & Event Management
- 📸 Media Upload (Cloudinary)
- 📧 Email Notifications
- 🔒 Security (Helmet, Rate Limiting, CORS)
- 📈 Admin Dashboard & Analytics

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Razorpay
- **File Upload:** Cloudinary
- **Security:** Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   cd impact-forge-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_NAME=impact_forge
DB_USER=root
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/my-donations` - Get my donations
- `POST /api/donations` - Create donation
- `POST /api/donations/verify-payment` - Verify payment
- `GET /api/donations/:id/receipt` - Generate receipt
- `GET /api/donations/:id/tax-certificate` - Generate tax certificate

### Volunteers
- `POST /api/volunteers/register` - Register as volunteer
- `GET /api/volunteers` - Get all volunteers (admin)
- `GET /api/volunteers/my-profile` - Get my volunteer profile
- `PUT /api/volunteers/:id/status` - Update volunteer status (admin)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/:id/register` - Register for event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/donors` - Get all donors
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/reports/export` - Export reports

### Media
- `POST /api/media/upload/image` - Upload image (admin)
- `POST /api/media/upload/video` - Upload video (admin)
- `GET /api/media` - Get all media files
- `DELETE /api/media/:id` - Delete media file (admin)

## Project Structure

```
impact-forge-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── donation.controller.js
│   ├── event.controller.js
│   ├── media.controller.js
│   ├── project.controller.js
│   └── volunteer.controller.js
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── Donation.model.js
│   ├── Event.model.js
│   ├── Project.model.js
│   ├── User.model.js
│   └── Volunteer.model.js
├── routes/
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── donation.routes.js
│   ├── event.routes.js
│   ├── media.routes.js
│   ├── project.routes.js
│   └── volunteer.routes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet for security headers
- Input validation with express-validator

## Development

The server runs on `http://localhost:5000` by default.

Use `npm run dev` for development with auto-reload (nodemon).

## License

ISC

