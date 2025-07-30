
# Research Mate - Frontend

A modern research collaboration platform built with React, TypeScript, and Tailwind CSS.

## Features

### Sprint 1 - Authentication & User Profile
- ✅ User registration and login with JWT authentication
- ✅ Google OAuth integration  
- ✅ Profile management with avatar upload
- ✅ Affiliation management (CRUD operations)
- ✅ Responsive design with "Cool and Collected" theme
- ✅ Form validation with React Hook Form + Zod
- ✅ Toast notifications for user feedback

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query + Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd research-mate-frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:8080`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components (Header, ProtectedLayout)
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication hook
│   ├── useProfile.tsx   # Profile management hook
│   └── useAffiliations.tsx # Affiliations hook
├── pages/               # Page components
│   ├── login.tsx        # Login page
│   ├── signup.tsx       # Registration page
│   ├── profile.tsx      # Profile view
│   ├── profile-edit.tsx # Profile editing
│   ├── affiliations.tsx # Affiliations list
│   └── affiliation-form.tsx # Add/edit affiliation
├── services/            # API client and services
│   └── api.ts           # Axios client + API methods
├── schema/              # Zod validation schemas
│   ├── auth.ts          # Auth form schemas
│   ├── profile.ts       # Profile form schemas
│   └── affiliation.ts   # Affiliation form schemas
├── types/               # TypeScript type definitions
│   └── api.ts           # API response types
└── App.tsx              # Main app with routing
```

## API Integration

The frontend integrates with Research Mate's staging API:
- **Base URL**: `https://api.staging.researchmate.ai/v1`
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic token refresh and user-friendly error messages

### Key API Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login  
- `GET /auth/oauth/google` - Google OAuth
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update profile
- `PUT /users/me/avatar` - Upload avatar
- `GET /users/me/affiliations` - List affiliations
- `POST /users/me/affiliations` - Create affiliation
- `PATCH /users/me/affiliations/{id}` - Update affiliation
- `DELETE /users/me/affiliations/{id}` - Delete affiliation

## Theme & Design

The app uses the **"Cool and Collected"** design theme:

### Color Palette
- **Deep Teal** (#003135) - Primary backgrounds
- **Dark Teal** (#024950) - Secondary panels  
- **Rust Accent** (#964734) - Call-to-action highlights
- **Bright Cyan** (#0FA4AF) - Interactive elements
- **Light Cyan** (#AFDDE5) - Hover states

### Design Features
- Glass morphism effects with backdrop blur
- Metallic button styling with hover animations
- Gradient backgrounds and smooth transitions
- Responsive mobile-first design
- Professional research-focused UI

## Key Features

### Authentication
- Email/password registration with validation
- Secure login with JWT tokens
- Google OAuth integration
- Automatic token refresh and logout on expiry

### Profile Management  
- View and edit profile information
- Avatar upload with preview
- Bio, website, ORCID ID fields
- Social media links management

### Affiliations
- Add/edit/delete institutional affiliations
- Primary affiliation designation
- Position types and date ranges
- Business rule enforcement (single primary)

### User Experience
- Loading states and error handling
- Toast notifications for actions
- Form validation with helpful messages
- Mobile-responsive design
- Smooth animations and transitions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Zod for runtime validation
- React Query for data synchronization

## Deployment

The app can be deployed to any static hosting service:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service

### Recommended Platforms
- Vercel (recommended for React apps)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Environment Variables

Currently, the API base URL is hardcoded for staging. For production deployment, consider adding environment variables:

```env
VITE_API_BASE_URL=https://api.researchmate.ai/v1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for Research Mate.
