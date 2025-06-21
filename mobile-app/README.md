# DirectApply Mobile App

A React Native mobile app for DirectApply with Tinder-style job swiping.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd mobile-app
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Test on your device:**
   - Download the **Expo Go** app from your app store
   - Scan the QR code that appears in your terminal
   - The app will load directly on your phone!

## Alternative: Deploy to Expo Cloud

If you want to share the app without requiring Expo Go:

1. **Create an Expo account** at https://expo.dev
2. **Install Expo CLI globally:**
   ```bash
   npm install -g @expo/cli
   ```
3. **Login to Expo:**
   ```bash
   expo login
   ```
4. **Publish your app:**
   ```bash
   expo publish
   ```

This will give you a shareable link that works on any device!

## Features

- 🔥 **Tinder-style job swiping** - Swipe right to apply, left to pass
- 📱 **Native mobile experience** - Smooth animations and haptic feedback
- 🔐 **Secure authentication** - Uses the same Supabase backend as the web app
- 📊 **Application tracking** - View all your job applications
- 👤 **Profile management** - Basic profile with links to full web platform
- 🎯 **AI job matching** - Get personalized match scores for each job

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend (shared with web app)
- **React Navigation** for navigation
- **Expo Linear Gradient** for beautiful gradients
- **React Native Gesture Handler** for smooth swipe interactions
- **Expo Haptics** for tactile feedback

## App Structure

```
src/
├── contexts/          # React contexts for state management
├── navigation/        # Navigation configuration
├── screens/          # All app screens
├── utils/            # Utility functions and Supabase config
└── components/       # Reusable components (if needed)
```

## Key Screens

1. **Onboarding** - Welcome flow and sign-in
2. **Swipe Screen** - Main job discovery interface
3. **Applications** - Track your job applications
4. **Profile** - Basic profile with links to web platform

## Database Integration

The mobile app uses the same Supabase database as the web platform, ensuring perfect synchronization between all your devices.

## Deployment Options

### Option 1: Expo Go (Development)
- Install Expo Go on your phone
- Scan QR code from `npm start`
- Instant testing on your device

### Option 2: Expo Publish (Sharing)
- Run `expo publish` to get a shareable link
- Anyone can access via the link
- No app store required

### Option 3: Build Standalone App
- Use `expo build` to create APK/IPA files
- Distribute directly or submit to app stores

## Environment Variables

The app uses the same Supabase configuration as your web platform. Make sure your Supabase project is properly configured.

## Support

For issues or questions:
- Check the Expo documentation: https://docs.expo.dev
- Visit the DirectApply web platform for full features
- Contact support through the web platform

This mobile app provides a focused, addictive job discovery experience while maintaining full integration with the comprehensive DirectApply web platform.