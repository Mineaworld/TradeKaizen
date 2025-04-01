# Environment Setup

This document explains how to set up the required environment variables for TradeKaizen.

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_APP_VERSION=1.0.0

# Authentication Settings (optional)
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/api/auth/callback
```

## Supabase Settings

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from the API settings
3. Set up the database tables according to the schema in `/schema` folder
4. Configure storage buckets and policies as described in `/docs/supabase-storage-policies.md`

## Development Environment

To run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Production Environment

For production, you'll need to set these environment variables in your hosting platform (Vercel, Netlify, etc.).

Additionally, make sure to configure the production redirect URL for authentication:

```env
NEXT_PUBLIC_AUTH_REDIRECT_URL=https://your-production-domain.com/api/auth/callback
```
