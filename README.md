# Trucky Companion App

## Why this app?

I'm learning React Native and i'm a trucker (i play Euro Truck Simulator on multiplayer via [TruckersMP mod](https://truckersmp.com/)) so i want to try and learn on a real case using a set of API already built from TruckersMP developers.

I'm not affiliated in any way with SCS, Euro Truck Simulator 2 or TruckersMP.

## Dependencies

react-native

react-native-vector-icons for icons

react-native-simple-markdown for parsing Rules markdown

react-native-progress for progress bar in Servers Screen

react-native-material-ui for interface and theming (BottomNavigation, Drawer, Theme)

react-native-html-parser for parsing html downloaded from http://ets2c.com

react-native-popup-dialog for dialogs

Run npm install to install all depencencies

## Anatomy

index.android.js is entrypoint for Android App, it contains call to src/index.js that includes src/App/App.js . App.js contains main application logic, navigation container and theming.

Services wrapper are in src/App/Services

User preferences are managed via AppSettings in src/AppSettings with AsyncStorage wrapped by async static functions

Routes are served with the static property "routes" contained in RouteManager in src/routes.js

Common components like Drawer and BottomNavigation are wrapped in custom components in src/Components

Images and icons not served by FontAwesome and Material Icons are stored in src/Assets

Navigation are served by RN component Navigation using routes in RouteManager

* index.android
* index.ios
    * src/index
    * src/routes
    * src/App
        * App
        * Home
        * Servers
        * Rules
        * Settings
        * Events
    * Assets
    * src/Components
        * AppDrawerLayout
        * AppBottomNavigation
    * src/Services
        * TruckersMPAPI
        * EventsAPI
    * src/AppSettings

## Compiling and debugging
Open AVD Manager and start an emulator, eg Android_Accelerated_X86. From root folder, in VS Code terminal, run "react-native run android". 

## Build Release
From VS Code terminal run "release-android.bat", release apk in .-\android\app\build\outputs\apk\app-release.apk

## Screenshots

![Servers status](https://shardick.github.io/TruckersMPApp/screenshots/servers2.png)

![Game version info](https://shardick.github.io/TruckersMPApp/screenshots/main.png)

![Search player](https://shardick.github.io/TruckersMPApp/screenshots/search.png)