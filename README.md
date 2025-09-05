# Jego App - Enterprise Job & Appointment Management Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Deployment with Coolify & Nixpack](#deployment-with-coolify--nixpack)
- [API Documentation](#api-documentation)

## 🚀 Overview

Jego App is a comprehensive Next.js application designed for managing job postings, company appointments, and business operations. The platform supports multiple user roles including administrators, company admins, company agents, and regular users, each with specific permissions and dashboards.

## 🛠 Tech Stack

### Core Technologies
- **Framework**: [Next.js 15.4.5](https://nextjs.org) with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: Zustand 5.0.7
- **Data Fetching**: TanStack Query (React Query) 5.84.1

### UI Components & Libraries
- **Component Library**: Custom components built with Radix UI primitives
- **Forms**: React Hook Form 7.62.0 with Zod 4.0.14 validation
- **Tables**: TanStack Table 8.21.3
- **Charts**: Recharts 2.15.4
- **Icons**: Tabler Icons & Lucide React
- **Date Handling**: date-fns 4.1.0 & Luxon 3.7.1
- **Maps**: Mapbox GL 3.14.0
- **File Upload**: FilePond
- **Markdown**: React Showdown
- **Notifications**: Sonner

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **Type Safety**: TypeScript with strict mode
- **Environment Validation**: @t3-oss/env-nextjs
- **Safe Actions**: next-safe-action 8.0.8

## ✨ Features

### For Administrators
- **Dashboard Analytics**: User, company, job, and post statistics with interactive charts
- **User Management**: Full CRUD operations for user accounts
- **Company Management**: Manage company profiles and verifications
- **Category Management**: Create and manage post/job categories
- **Content Moderation**: Review and manage all posts and job listings

### For Company Admins & Agents
- **Company Dashboard**: View appointment counts, job applications, and recent activities
- **Appointment Management**: Handle customer appointment requests
- **Job Posting**: Create, edit, and manage job listings
- **Post Management**: Publish company news and events
- **Team Management**: Manage company team members
- **Company Settings**: 
  - Update company information
  - Set location and map coordinates
  - Configure business hours
  - Upload company logo and images

### For Regular Users
- **Profile Management**: Update personal information and avatar
- **Job Applications**: Apply to job postings
- **Appointment Booking**: Request appointments with companies

### Common Features
- **Authentication**: Secure login, registration, and password recovery
- **Email Verification**: Account verification via email
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Theme toggle with system preference detection
- **Internationalization**: French language support (can be extended)
- **Real-time Search**: Debounced search across all data tables
- **Pagination**: Efficient data loading with customizable page sizes
- **File Management**: Image uploads with preview and optimization

## 📁 Project Structure

```
jego-app/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   ├── applications/    # Job applications management
│   │   │   ├── appointments/    # Appointment management
│   │   │   ├── companies/       # Company management (admin)
│   │   │   ├── jobs/           # Job listings
│   │   │   ├── posts/          # News/Events posts
│   │   │   ├── profile/        # User profile
│   │   │   ├── settings/       # Settings pages
│   │   │   └── users/          # User management (admin)
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   └── verify/             # Email verification
│   │
│   ├── components/             # Reusable components
│   │   ├── base/              # Base components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── modals/           # Modal components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # UI primitives (Radix-based)
│   │
│   ├── features/              # Feature-based modules
│   │   ├── admin-stats/      # Admin statistics
│   │   ├── applications/     # Job application features
│   │   ├── auth/            # Authentication features
│   │   ├── categories/      # Category management
│   │   ├── companies/       # Company features
│   │   ├── company-appointments/
│   │   ├── company-stats/
│   │   ├── edit-company-*/  # Company edit forms
│   │   ├── jobs/           # Job posting features
│   │   ├── posts/          # Post features
│   │   ├── profile/        # Profile features
│   │   └── users/          # User management features
│   │
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and constants
│   │   ├── env/             # Environment configuration
│   │   ├── helpers/         # Helper functions
│   │   └── stores/          # Zustand stores
│   │
│   ├── services/            # API service layer
│   └── types/               # TypeScript type definitions
│
├── public/                   # Static assets
├── .enxample.env            # Environment variables example
├── components.json          # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔐 Authentication & Authorization

### User Roles

The application implements a role-based access control (RBAC) system with four distinct user roles:

1. **ADMIN** (`admin`)
   - Full system access
   - User and company management
   - System-wide statistics and analytics
   - Content moderation

2. **COMPANY_ADMIN** (`company:admin`)
   - Full access to company features
   - Team member management
   - Company settings configuration
   - Post and job creation

3. **COMPANY_AGENT** (`company:agent`)
   - Limited company access
   - View appointments and applications
   - Cannot modify company settings

4. **USER** (`user`)
   - Basic user features
   - Profile management
   - Job applications

### Authentication Flow

1. **Registration**: Users register with email and password
2. **Email Verification**: Verification link sent to email
3. **Login**: JWT-based authentication with 14-day cookie expiration
4. **Password Recovery**: Reset password via email link
5. **Session Management**: Automatic token refresh and validation

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file based on `.enxample.env`:

```env
# Application Environment
NODE_ENV=development

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://dev.api.jego.cm

# Mapbox Configuration (for location maps)
# Get your access token from: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

### Environment Validation

The application uses `@t3-oss/env-nextjs` for runtime environment validation:

- **Client variables** are validated in `src/lib/env/client.ts`
- **Server variables** are validated in `src/lib/env/server.ts`

## 💻 Local Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Mapbox account for map features

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/jego-app.git
cd jego-app

# Install dependencies
pnpm install

# Copy environment variables
cp .enxample.env .env.local

# Update .env.local with your configuration
```

### Running the Development Server

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

Access the application at [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment with Coolify & Nixpack

### Overview

This application is designed to be deployed using [Coolify](https://coolify.io/) with [Nixpack](https://nixpacks.com/) as the build system. Nixpack automatically detects and builds Node.js applications without requiring a Dockerfile.

### Deployment Configuration

#### 1. Coolify Setup

1. **Add New Resource** in Coolify
2. Select **"GitHub Repository"** or **"GitLab Repository"**
3. Connect your repository
4. Choose branch (e.g., `main` or `develop`)

#### 2. Build Configuration

Coolify will automatically detect the Next.js application. Configure the following:

**Build Settings:**
```yaml
Build Pack: Nixpack (auto-detected)
Base Directory: /
Build Command: pnpm build (auto-detected)
Install Command: pnpm install (auto-detected)
```

#### 3. Environment Variables

In Coolify's environment variables section, add:

```env
# Production Environment
NODE_ENV=production

# Application URLs
NEXT_PUBLIC_APP_URL=https://app.jego.cm
NEXT_PUBLIC_API_URL=https://api.jego.cm

# Mapbox Token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token

# Next.js Specific
NEXT_TELEMETRY_DISABLED=1
```

#### 4. Runtime Configuration

**Port Configuration:**
```yaml
Port: 3000
```

**Health Check:**
```yaml
Path: /
Interval: 30s
Timeout: 10s
Retries: 3
```

#### 5. Nixpack Configuration (Optional)

If you need custom Nixpack configuration, create a `nixpacks.toml` file in your project root:

```toml
# nixpacks.toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]

[phases.install]
cmds = ["pnpm install --frozen-lockfile"]

[phases.build]
cmds = ["pnpm build"]

[start]
cmd = "pnpm start"

[variables]
NODE_ENV = "production"
```

#### 6. Advanced Coolify Settings

**Resource Limits:**
```yaml
CPU: 1000m (1 vCPU)
Memory: 1Gi
```

**Scaling:**
```yaml
Min Replicas: 1
Max Replicas: 3
Target CPU: 80%
```

**Persistent Storage (if needed):**
```yaml
Mount Path: /app/uploads
Size: 10Gi
```

### Deployment Process

1. **Push to Repository**: Push your code to the configured branch
2. **Automatic Deployment**: Coolify detects changes and triggers deployment
3. **Build Process**: Nixpack builds the application
4. **Health Checks**: Coolify verifies the application is running
5. **Traffic Routing**: Once healthy, traffic is routed to new deployment

### Post-Deployment Checklist

- [ ] Verify all environment variables are set correctly
- [ ] Test authentication flow (login, register, password reset)
- [ ] Check Mapbox integration for location features
- [ ] Verify file uploads are working
- [ ] Test email notifications
- [ ] Monitor application logs in Coolify
- [ ] Set up database backups
- [ ] Configure SSL certificates (usually automatic with Coolify)

## 📡 API Documentation

The application connects to a backend API at the URL specified in `NEXT_PUBLIC_API_URL`. 

### API Endpoints Structure

```
/auth
  /login            - POST - User authentication
  /register         - POST - User registration
  /verify-email     - POST - Email verification
  /logout           - POST - User logout
  /forgot-password  - POST - Password recovery
  /reset-password   - POST - Password reset

/users
  /              - GET    - List users (paginated)
  /:id           - GET    - Get user details
  /:id           - PUT    - Update user
  /:id           - DELETE - Delete user
  /count         - GET    - Get user count

/companies
  /              - GET    - List companies (paginated)
  /:id           - GET    - Get company details
  /:id           - PUT    - Update company
  /:id           - DELETE - Delete company
  /count         - GET    - Get company count

/jobs
  /              - GET    - List jobs (paginated)
  /:id           - GET    - Get job details
  /              - POST   - Create job
  /:id           - PUT    - Update job
  /:id           - DELETE - Delete job
  /count         - GET    - Get job count

/posts
  /              - GET    - List posts (paginated)
  /:id           - GET    - Get post details
  /              - POST   - Create post
  /:id           - PUT    - Update post
  /:id           - DELETE - Delete post
  /count         - GET    - Get post count

/appointments
  /              - GET    - List appointments
  /:id           - GET    - Get appointment details
  /              - POST   - Create appointment request
  /:id/status    - PUT    - Update appointment status

/applications
  /              - GET    - List job applications
  /:id           - GET    - Get application details
  /              - POST   - Submit job application
  /:id/status    - PUT    - Update application status
```

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## 🔧 Troubleshooting

### Common Issues

1. **Mapbox Map Not Loading**
   - Verify `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set correctly
   - Check if the token has the required permissions

2. **Authentication Issues**
   - Ensure `NEXT_PUBLIC_API_URL` points to the correct backend
   - Verify cookies are enabled in the browser
   - Check CORS settings on the backend

3. **Build Failures in Coolify**
   - Check Nixpack logs for detailed error messages
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

4. **File Upload Issues**
   - Check `serverActions.bodySizeLimit` in `next.config.ts`
   - Verify storage permissions in production

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

---

For more information or support, please contact the development team.