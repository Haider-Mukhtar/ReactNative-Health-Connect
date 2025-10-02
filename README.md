# React Native Google Health Connect Integration with Expo 🚀

<img width="1500" height="750" alt="Medium Banners (3)" src="https://github.com/user-attachments/assets/a55980c1-6605-42e6-b61c-429f4026f1db" />

**A robust, TypeScript-based React Native Expo app demonstrating seamless integration with Google Health Connect using `react-native-health-connect`.**

This repository provides a complete guide and codebase for integrating Google Health Connect into a React Native Expo app. Fetch health data like steps, calories burned, heart rate, and sleep with ease, while handling permissions, errors, and best practices. Built with TypeScript for type safety, this project is perfect for developers building fitness or wellness apps in 2025! 🎉

For a detailed step-by-step tutorial, check out our Medium post.
**[Integrating Google Health Connect in React Native Expo Apps](https://medium.com/@haidermukhtar/integrating-google-health-connect-in-react-native-expo-apps-56e2477b7e17)**

> **Note**: Health Connect is Android-only. For iOS, consider `react-native-health` for Apple HealthKit integration. Always test on a physical Android device or emulator and comply with GDPR/HIPAA for user privacy..

## 🎯 Features
- Fetch **steps**, **calories burned**, **heart rate**, and **sleep data** from Google Health Connect.
- Custom React hook for streamlined data fetching and permission handling.
- Comprehensive error handling for permission denials and edge cases.
- Expo dev client for native module support.
- TypeScript for robust type safety.
- Modern, gradient-based UI with reusable components.

## 📸 Permission Request Flow
<img width="1500" height="750" alt="Medium Banners (1)" src="https://github.com/user-attachments/assets/74db4f48-b4a9-4763-b282-b22580524ca1" />

## 📱 Main Dashboard
<img width="364" height="750" alt="Medium Banners (2)" src="https://github.com/user-attachments/assets/fdf12ede-d875-49f6-9e94-ebc7b97d3699" />


## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Haider-Mukhtar/ReactNative-Health-Connect.git
cd ReactNative-Health-Connect
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Android Permissions
Update `app.json` with the following configuration:
```bash
{
  "expo": {
    "plugins": [
      "expo-health-connect",
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "minSdkVersion": 26,
            "buildToolsVersion": "35.0.0"
          }
        }
      ]
    ],
    "android": {
      "package": "com.yourcompany.healthconnectdemo",
      "permissions": [
        "android.permission.health.READ_STEPS",
        "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
        "android.permission.health.READ_HEART_RATE",
        "android.permission.health.READ_SLEEP"
      ]
    }
  }
}
```
### 4. Prebuild the Project
Since this project uses native modules, run:
```bash
npx expo prebuild --platform android
```
### 5. Run the App
```bash
npx expo run:android
```

## 📂 Project Structure
```
├── app/
│   ├── _layout.tsx           # Main app layout
│   ├── index.tsx             # Main app screen
│── assets/
│── hooks/
│   │── useHealthConnect.ts   # Custom hook for Health Connect
├── app.json                  # Expo configuration
├── README.md                 # You're here!
```

## 📚 Use Cases
- **Fitness Tracker:** Auto-log steps and calories for gamified goals.
- **Sleep Analyzer:** Track sleep duration for wellness insights.
- **Health Monitor:** Alert on irregular heart rates.

```mermaid
sequenceDiagram
    actor User
    participant App
    participant useHealthConnectHook
    participant HealthConnectAPI
    participant UI

    User->>App: Open App
    App->>useHealthConnectHook: Initialize Hook
    useHealthConnectHook->>HealthConnectAPI: Request Permissions
    HealthConnectAPI->>useHealthConnectHook: Permission Status
    useHealthConnectHook->>App: Permission Check Result
    App->>User: Display Permission Prompt
    User->>App: Grant/Deny Access
    App->>useHealthConnectHook: Permission Response
    useHealthConnectHook->>HealthConnectAPI: Fetch Health Data (Steps, Calories, Heart Rate, Sleep)
    HealthConnectAPI->>useHealthConnectHook: Return Data
    useHealthConnectHook->>UI: Update with Fetched Data
    UI->>User: Display Health Metrics
    User->>App: Trigger Refresh
    App->>useHealthConnectHook: Call Refetch
    useHealthConnectHook->>HealthConnectAPI: Fetch Updated Data
    HealthConnectAPI->>useHealthConnectHook: Return Updated Data
    useHealthConnectHook->>UI: Update with New Data
    UI->>User: Display Updated Metrics
```

## 🤝 Contributing
Contributions are welcome! 🙌 Fork the repo, create a branch, and submit a pull request. Check issues for tasks or report bugs.

## 📜 License
MIT License. See [LICENSE](https://github.com/Haider-Mukhtar/ReactNative-Health-Connect/blob/main/LICENSE) for details.

## 📬 Stay Connected
Want more React Native tutorials and tips?
- 🌐 Website: [haidermukhtar.vercel.app](https://haidermukhtar.vercel.app/)
- 💼 LinkedIn: [Haider Mukhtar](https://www.linkedin.com/in/haider-mukhtar/)

Happy coding! Build something amazing with Google Health Connect in 2025! 💻
