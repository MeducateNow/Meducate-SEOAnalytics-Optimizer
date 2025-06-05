# SEO Optimizer

A web application that analyzes URLs and generates AI-powered SEO suggestions.

## Features

- URL input functionality
- AI-powered keyword, tag, and meta-description generation
- Performance dashboard
- History tracking
- Database integration
- OpenAI API key integration
- SEO scoring system
- Visual dashboard components

## Security Setup

### Environment Variables

This project uses environment variables for sensitive information. Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key (optional)
```

**IMPORTANT: Never commit your `.env` file to version control!**

The `.env` file is already added to `.gitignore` to prevent accidental exposure of sensitive information.

### API Keys

- OpenAI API key can be set in the application settings or as an environment variable
- Supabase credentials must be set as environment variables

## Development

1. Clone the repository
2. Create a `.env` file with your credentials (see above)
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Security Best Practices

- Environment variables are used for all sensitive information
- API keys are never hardcoded in the application
- The `.env` file is excluded from version control
- User authentication is handled securely through Supabase
- Database access is controlled through Row Level Security policies
