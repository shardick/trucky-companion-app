# Trucky Companion App

[![Get it on Google Play](/site/assets/googleplay.png){:width="392px"}](https://play.google.com/store/apps/details?id=com.trucky)

[![Get it on App Store](/site/assets/appstore.png){:width="392px"}](https://itunes.apple.com/ro/app/truckyapp/id1233325424?mt=8)

## Why this app?

I'm learning React Native and i'm a trucker (i play Euro Truck Simulator on multiplayer via [TruckersMP mod](https://truckersmp.com/)) so i want to try and learn on a real case using a set of API already built from TruckersMP developers.

Meetups are downloaded from [ETS2 Convoys](http://ets2c.com)

Live MAP and online status check is integrated via webiew from [ETS2 Map](http://ETS2map.com) and its api.

I'm not affiliated in any way with SCS, Euro Truck Simulator 2 or TruckersMP.

## Dependencies

react-native 0.44.2

react-native-vector-icons for icons

react-native-simple-markdown for parsing Rules markdown

react-native-progress for progress bar in Servers Screen

react-native-material-ui for interface and theming (BottomNavigation, Drawer Layout, Theme)

react-native-popup-dialog for dialogs

react-native-drawer for app drawer

moment for datetime manipulation

react-native-localization for localizations and localized strings management

react-native-restart

react-native-onesignal for push notifications

react-native-tab-view for tabbed views in home screen

react-native-modal-picker for cross platform picker (customized and wrapped in AdaptativePicker)

react-native-device-info for device info and device statistcs (saved on Heroku)

react-navigation for inner navigation (as requested by react-native 0.44)

Run npm install to install all depencencies

## Compiling and debugging
Open AVD Manager and start an emulator, eg Android_Accelerated_X86. From root folder, in VS Code terminal, run "react-native run android".

## Build Release
From VS Code terminal run "release-android.bat", release apk in .-\android\app\build\outputs\apk\app-release.apk

## Credits
TruckersMP, TruckersMP API creators, ETS2map.com and ETS2c.com.

### Translators
Bulgarian: Hristo Spasov<br/>
French: Kevin Monteil and Caernage ([https://forum.truckersmp.com/index.php?/profile/103421-caernage/](https://forum.truckersmp.com/index.php?/profile/103421-caernage/))<br/>
Finnish: Jiri Innanen<br/>
Spanish: Francisco Ramirez<br/>
Dutch: Derk Nomden<br/>
Polish: Piotrek Ślusarz<br/>
German: Tobias Groß<br/>
Czech: ActiV3Drifter ([https://forum.truckersmp.com/index.php?/profile/93979-activ3drifter/](https://forum.truckersmp.com/index.php?/profile/93979-activ3drifter/))<br/>
Russian: CJMAXiK ([https://truckersmp.com/user/3861](https://truckersmp.com/user/3861))<br/>
Portoguese: Ru13z ([https://forum.truckersmp.com/index.php?/profile/119633-ru13z/](https://forum.truckersmp.com/index.php?/profile/119633-ru13z/))<br/>
Chinese: [Biu] - Luo Shen ([https://forum.truckersmp.com/index.php?/profile/101200-biu-luo-shen/](https://forum.truckersmp.com/index.php?/profile/101200-biu-luo-shen/))<br/>

Thanks guys, you are awesome!
