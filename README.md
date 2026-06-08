# SatguruKirana - Movie Discovery App

A modern, JioCinema/Hotstar-style movie discovery and streaming application built with React Native. Browse trending movies, search by title/genre/year, view detailed movie information, and watch trailers seamlessly.

Production-Ready React Native Application | TMDB API Integration | Professional UI/UX

---

## Features

### Home Screen
- JioCinema/Hotstar-style Hero Carousel - Full-width auto-scrolling backdrop with movie details
- Multiple Content Carousels - Trending Now, Top Rated, and Upcoming movies
- Pull-to-Refresh - Reload all content with a single gesture
- Smooth Animations - Fade-in and slide-up effects using React Native Reanimated
- Smart Caching - AsyncStorage for offline support

### Search and Filter Screen
- Real-time Search - Search movies by title
- Genre Filter Dropdown - Dark-themed overlay with TMDB genre categories
- Release Year Filter - Select movies from 1980 to 2026
- Infinite Pagination - Automatic "load more" on scroll
- Grid View - 3-column responsive layout
- Smart Empty States - Helpful prompts and retry buttons

### Movie Detail Screen
- Movie Information - Plot, rating, runtime, release date, popularity
- Cast Members - Actor profiles with images
- Genre Chips - Categorized movie genres
- YouTube Trailer - Embedded video player with fallback support
- Similar Movies - Related content recommendations
- Add to Watchlist - Save movies for later

### Global Features
- Error Retry Mechanism - Graceful error handling with retry buttons
- High Performance - Optimized rendering with React.memo and FlatList
- Professional UI - Dark theme inspired by Netflix, JioCinema, and Hotstar
- Responsive Design - Works on all Android and iOS devices

---

## Tech Stack

### Framework and Core Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.85.3 | Native mobile framework |
| react | 19.2.3 | UI library |
| Node.js | >= 22.11.0 | Runtime environment |

### Navigation Stack
| Package | Version | Purpose |
|---------|---------|---------|
| @react-navigation/native | 7.2.5 | Core navigation |
| @react-navigation/native-stack | 7.16.0 | Stack navigation |
| @react-navigation/bottom-tabs | 7.16.2 | Bottom tab navigation |
| react-native-screens | 4.25.2 | Native screens |
| react-native-safe-area-context | 5.8.0 | Safe area management |

### UI and Animation Libraries
| Package | Version | Purpose |
|---------|---------|---------|
| react-native-reanimated | 4.4.0 | 60fps animations |
| react-native-linear-gradient | 2.8.3 | Gradient overlays |
| react-native-vector-icons | 10.2.0 | Material Design icons |
| react-native-fast-image | 8.6.3 | Optimized image loading |

### Media Players and Web
| Package | Version | Purpose |
|---------|---------|---------|
| react-native-youtube-iframe | 2.3.0 | YouTube trailer playback |
| react-native-webview | 13.13.2 | Web content embedding |

### API and Data Management
| Package | Version | Purpose |
|---------|---------|---------|
| axios | 1.7.9 | HTTP client |
| react-native-config | 1.5.1 | Environment variables |
| @react-native-async-storage/async-storage | 3.1.1 | Local storage/caching |

### Development Tools
| Package | Version | Purpose |
|---------|---------|---------|
| @babel/core | 7.25.2 | JavaScript compiler |
| ESLint | 8.19.0 | Code linting |
| Jest | 29.6.3 | Testing framework |
| Prettier | 2.8.8 | Code formatting |
| Metro | Built-in | React Native bundler |

---

## Project Structure

```
SatguruKirana/
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable components
│   │   ├── HeroCarousel.js           # Auto-scrolling hero banner
│   │   ├── MovieCarousel.js          # Horizontal carousel
│   │   ├── MovieCard.js              # Movie card with image
│   │   ├── SearchBar.js              # Search input
│   │   ├── TrailerPlayer.js          # YouTube player
│   │   ├── SkeletonLoader.js         # Loading placeholders
│   │   ├── LoadingScreen.js          # Full-screen loader
│   │   ├── LoadingSpinner.js         # Spinner component
│   │   ├── EmptyState.js             # Empty/error states
│   │   ├── GenreChip.js              # Genre badge
│   │   └── HeroBanner.js             # Banner component
│   ├── constants/               # App constants
│   │   ├── colors.js                # Color theme
│   │   └── endpoints.js             # API config and endpoints
│   ├── context/                 # State management
│   │   └── MovieContext.js           # Global movie state
│   ├── hooks/                   # Custom hooks
│   │   ├── useMovies.js              # Home screen logic
│   │   └── useSearchMovies.js        # Search screen logic
│   ├── navigation/              # Navigation setup
│   │   ├── RootNavigator.js          # Root navigation
│   │   └── BottomTabs.js             # Bottom tabs
│   ├── screens/                 # App screens
│   │   ├── HomeScreen.js             # Home/trending
│   │   ├── SearchScreen.js           # Search with filters
│   │   └── MovieDetailScreen.js      # Movie details
│   ├── services/                # API services
│   │   ├── api.js                    # Axios instance
│   │   ├── tmdbService.js            # TMDB API calls
│   │   └── cacheService.js           # Caching logic
│   └── utils/                   # Utilities
│       └── helpers.js                # Helper functions
├── android/                     # Android native code
├── ios/                         # iOS native code
├── .env                         # Environment variables (NOT in git)
├── .env.example                 # .env template (in git)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── babel.config.js              # Babel config
├── metro.config.js              # Metro config
├── app.json                     # App config
└── App.js                       # Root component
```

---

## Quick Start

### Prerequisites
```
Node.js >= 22.11.0
npm or yarn
Android Studio (for Android) / Xcode (for iOS)
TMDB API Key (free from https://www.themoviedb.org/)
```

### Installation (5 minutes)

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/SatguruKirana.git
cd SatguruKirana
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Setup Environment Variables - IMPORTANT

Create a .env file in the project root:

```env
# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**How to get TMDB API Key:**
1. Visit https://www.themoviedb.org/
2. Create a free account
3. Go to Settings then API in your account
4. Copy the API Key (v3 auth)
5. Paste it as TMDB_API_KEY=your_key_here

**Security Note:**
- The .env file is listed in .gitignore - it will NOT be committed to GitHub
- Each developer/user must create their own .env file
- Never commit real API keys to version control

#### Step 4: Clear Metro Cache (First Run Only)
```bash
npx react-native start --reset-cache
```

#### Step 5: Run the App

**Android:**
```bash
# Terminal 1
npx react-native start

# Terminal 2
npx react-native run-android
```

**iOS:**
```bash
# Terminal 1
npx react-native start

# Terminal 2
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## API Integration

### TMDB API Overview
This app uses The Movie Database (TMDB) API v3 for all movie data.

### Endpoints Used
| Endpoint | Purpose |
|----------|---------|
| /trending/movie/week | Trending movies |
| /movie/top_rated | Top rated movies |
| /movie/upcoming | Upcoming releases |
| /search/movie | Search movies by query |
| /movie/{id} | Movie details |
| /movie/{id}/videos | Movie trailers |
| /movie/{id}/credits | Cast information |
| /movie/{id}/similar | Similar movies |
| /genre/movie/list | Genre list |

### Configuration

The API key is automatically loaded from .env:

```javascript
// src/constants/endpoints.js
import Config from 'react-native-config';

export const TMDB_CONFIG = {
  apiKey: Config.TMDB_API_KEY || '',
  baseUrl: Config.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  imageBaseUrl: Config.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
};
```

### Image URLs
```
Format: https://image.tmdb.org/t/p/{size}{path}

Poster Sizes:  w185, w342, w500, original
Backdrop Sizes: w780, w1280, original

Example: https://image.tmdb.org/t/p/w342/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg
```

---

## Environment Variables

### Required Variables

Create .env file with these variables:

```env
# TMDB API Key (get from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_api_key_here

# TMDB API Base URL
TMDB_BASE_URL=https://api.themoviedb.org/3

# TMDB Image Base URL
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### .env Template for GitHub

Include .env.example in your GitHub repo (without real keys):

```env
# Copy this file to .env and add your API keys
TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### Using Environment Variables

```bash
# After updating .env, you MUST rebuild (hot reload won't pick up .env changes)
npx react-native start --reset-cache
npx react-native run-android  # or run-ios
```

---

## Available Commands

```bash
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run lint          # Run ESLint
npm test              # Run Jest tests
```

---

## Troubleshooting

### Issue: App Not Updating When Files Change
```bash
npx react-native start --reset-cache
```

### Issue: Images Not Loading
- Check internet connection
- Verify TMDB API key in .env
- Confirm API key is not expired
- Check browser: https://image.tmdb.org/t/p/w342/test.jpg

### Issue: Invalid API key Error
```
Solution: 
1. Verify API key in .env (no extra spaces)
2. Clear Metro cache: npx react-native start --reset-cache
3. Rebuild app: npx react-native run-android
```

### Issue: Android Build Error
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue: iOS Pod Dependencies Error
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

---

## Git Setup and GitHub Push

### First-time Git Setup

```bash
# Configure Git (one-time)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize repository (already done)
git init

# Check current status
git status
```

### Add Remote Repository

```bash
# Add your GitHub repository
git remote add origin https://github.com/your-username/SatguruKirana.git

# Verify remote
git remote -v
```

### Commit and Push Code

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: SatguruKirana movie discovery app"

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### Subsequent Updates

```bash
# After making changes
git add .
git commit -m "Fix: Improve image loading error handling"
git push origin main
```

---

## Submission Checklist

Before submitting to company:

- [ ] .env file created with your TMDB API key
- [ ] .env file is in .gitignore (not committed)
- [ ] .env.example exists in repository with template
- [ ] All dependencies installed: npm install
- [ ] App runs on Android: npm run android
- [ ] App runs on iOS: npm run ios
- [ ] README.md is complete and clear
- [ ] Code is linted: npm run lint
- [ ] All images load properly
- [ ] Search with filters works
- [ ] Trailer player works
- [ ] Pull-to-refresh works
- [ ] Caching is functional
- [ ] GitHub repository is public
- [ ] All commits pushed to main branch

---

## App Features Demo

### Home Screen
- Hero carousel with auto-scroll
- Trending, Top Rated, Upcoming carousels
- Pull-to-refresh functionality

### Search Screen
- Real-time movie search
- Genre filter dropdown
- Year filter dropdown
- 3-column grid layout
- Infinite scroll pagination

### Movie Details
- Full movie information
- YouTube trailer player
- Cast members
- Similar movies
- Watchlist button

---

## License

This project is proprietary. All rights reserved.

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review React Native Docs (https://reactnative.dev/)
3. Check TMDB API Docs (https://developer.themoviedb.org/docs)

---

## Ready to Submit

Your app is production-ready. Follow the Git Setup and GitHub Push section to upload to GitHub, then submit the repository link to your company.

Good luck!
