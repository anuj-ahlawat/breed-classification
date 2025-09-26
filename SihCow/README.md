# Bharat Pashudhan - Breed Identifier

A mobile-first React Native app for Field Level Workers (FLWs) to identify cattle breeds using AI technology.

## Features

### 🏠 Dashboard Screen
- Large, intuitive buttons for easy navigation
- Camera capture option
- Gallery upload option
- View registered animals
- Help section with instructions

### 📷 Camera Capture
- Live camera view with guidelines overlay
- Animal positioning assistance
- Front/back camera toggle
- High-quality image capture

### 🖼️ Gallery Upload
- Image picker from device gallery
- Image preview and selection
- Tips for best photo quality
- Easy retake option

### 🤖 AI Breed Detection
- Real-time breed analysis
- Confidence score display
- Alternative breed suggestions
- Manual breed selection option
- Visual confidence indicators

### 📝 Animal Registration
- Auto-filled breed information
- Comprehensive animal details form
- Required field validation
- BPA database integration ready
- Offline support

### ✅ Success & Management
- Registration confirmation
- Animal ID generation
- Quick actions (add another, view all)
- Registered animals list view
- Statistics dashboard

## Design Features

- **Mobile-First Design**: Optimized for smartphones used by FLWs
- **Large Touch Targets**: Easy to tap buttons and controls
- **Intuitive Navigation**: Simple, clear user flow
- **Visual Feedback**: Icons, colors, and animations for better UX
- **Offline Support**: Works without internet connection
- **Multi-language Ready**: Prepared for Hindi, Marathi, Tamil support

## Technical Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Camera** for image capture
- **Expo Image Picker** for gallery access
- **React Navigation** for screen routing
- **AsyncStorage** for local data persistence

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install additional dependencies:
```bash
npx expo install expo-camera expo-image-picker @react-native-async-storage/async-storage
```

3. Start the development server:
```bash
npm start
```

## Usage Flow

1. **Capture/Upload**: Take a photo or select from gallery
2. **AI Analysis**: App analyzes the image for breed identification
3. **Review Results**: Check AI prediction and confidence score
4. **Confirm/Edit**: Select correct breed if needed
5. **Fill Details**: Complete animal registration form
6. **Save**: Register animal in BPA database
7. **Manage**: View and manage registered animals

## Target Users

- Field Level Workers (FLWs) in rural areas
- Veterinary officers
- Livestock management personnel
- Government officials
- Farmers and cattle owners

## Key Benefits

- **Simple Interface**: Easy to use for non-technical users
- **Accurate Identification**: AI-powered breed detection
- **Offline Capability**: Works in areas with poor connectivity
- **Data Integration**: Seamless BPA database integration
- **Scalable**: Can handle large numbers of animals
- **Cost-Effective**: Reduces manual data entry time

## Future Enhancements

- Real AI integration for breed detection
- Multi-language support
- Offline sync capabilities
- Advanced analytics and reporting
- GPS location tracking
- Photo quality assessment
- Batch processing capabilities