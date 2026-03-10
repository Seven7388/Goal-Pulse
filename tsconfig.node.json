# GoalPulse ⚡ — Live Football PWA

A FotMob/AiScore-inspired Progressive Web App with live football scores, global news, betting tips, and Tanzania TV channels.

## ✅ PWA Capabilities
- ✅ Service Worker (offline support, background sync)
- ✅ Web App Manifest (installable)
- ✅ Push Notifications
- ✅ Background Sync
- ✅ Periodic Background Sync
- ✅ Share Target
- ✅ App Shortcuts (Scores, Tips, News)
- ✅ Offline Support (cached assets + data)
- ✅ Dark / Light Mode (auto + manual)
- ✅ Account creation & login

## 🚀 Deploy to Vercel (from phone/PC)

### Step 1 — Upload to GitHub
1. Create new repo at github.com named `goalpulse`
2. Upload all these files keeping the folder structure

### Step 2 — Deploy on Vercel
1. Go to vercel.com → Sign in with GitHub
2. Click "Add New Project" → Select `goalpulse`
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy** ✅

Your app will be live at: `goalpulse.vercel.app`

## 📱 Convert to APK (Android)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init GoalPulse com.goalpulse.app
npm run build
npx cap add android
npx cap copy
npx cap open android
```
Then build APK in Android Studio → upload to Play Store.

## 🔑 Real API Integration
Replace mock data in `src/data/index.ts` with:
- **Scores/Lineups/H2H**: [API-Football](https://rapidapi.com/api-sports/api/api-football) (free tier: 100 req/day)
- **News**: [NewsAPI.org](https://newsapi.org) (free tier: 100 req/day)  
- **Odds/Tips**: [The Odds API](https://the-odds-api.com) (free tier: 500 req/month)
