# Quick Start Guide 🚀

Get Next Watch Compass running in 3 minutes!

## Prerequisites

- Node.js 18+ installed
- Terminal access

## Installation & Setup

### Option 1: Install dependencies separately

1. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd ../server
   npm install
   ```

### Option 2: Install everything at once (requires concurrently)

1. **Install root dependencies first:**
   ```bash
   npm install
   ```

2. **Install all project dependencies:**
   ```bash
   npm run install:all
   ```

## Running the Application

### Terminal 1 - Start the Backend Server
```bash
cd server
npm run dev
```

Server runs on: **http://localhost:3001**

### Terminal 2 - Start the Frontend
```bash
cd client
npm run dev
```

Frontend runs on: **http://localhost:5173**

### Alternative: Run both with one command (requires concurrently)
```bash
# From root directory
npm run dev
```

## Using the App

1. Open **http://localhost:5173** in your browser
2. Click "Get Started"
3. Select your streaming services
4. Rate 3+ movies to calibrate your taste
5. (Optional) Set mood preferences
6. Click "Find Matches" to get personalized recommendations!

## Troubleshooting

### Port already in use?
- Server: Change `PORT` in `server/.env`
- Client: Vite will prompt you to use a different port

### API errors?
- Check that the server is running on port 3001
- Verify `server/.env` has correct settings
- Check server terminal for error messages

### Blank recommendations?
- The unofficial IMDb API might be rate-limited
- Wait a moment and try again
- Check server logs for API errors

## Environment Variables

Already configured! But if you need to change them:

**client/.env**
```
VITE_API_BASE_URL=http://localhost:3001
```

**server/.env**
```
PORT=3001
IMDB_API_BASE_URL=https://imdb.iamidiotareyoutoo.com
CACHE_TTL=21600
```

## Next Steps

- Read the full [README.md](README.md) for more details
- Check out the recommendation algorithm
- Customize the mood/preference mappings in `client/src/config/preferences.ts`

Enjoy finding your next perfect watch! 🎬
