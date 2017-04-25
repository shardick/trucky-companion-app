// import AppSettings from '../AppSettings';
// import TruckersMPApi from '../Services/TruckersMPAPI';
// import BackgroundTimer from 'react-native-background-timer';
// var PushNotification = require('react-native-push-notification');
// import LocaleManager from  '../Locales/LocaleManager';

// class NotificationManager
// {
//     constructor()
//     {
//         this.api = new TruckersMPApi();
//         this.LocaleManager = new LocaleManager();

//         this
//             .checkNewGameVersion()
//             .done();
//     }

//     async checkNewGameVersion()
//     {
//         this.checkNewGameVersionIntervalId = BackgroundTimer.setInterval(() => {

//             this
//                 .api
//                 .get_version()
//                 .then((_version) => {

//                     AppSettings
//                         .getSettings()
//                         .then((_settings) => {

//                             if (_settings.lastVersionNumber = '') {
//                                 AppSettings.setValue(AppSettings.keys.lastVersionNumber, _version.name);
//                             } else {

//                                 if (_settings.lastVersionNumber != _version.name) {
//                                     PushNotification.localNotification({
//                                         smallIcon: 'drawable/ic_stat_onesignal_default', 
//                                         bigText: this.LocaleManager.strings.newTruckersMPGameVersionReleaseNotificationText, 
//                                         message: this.LocaleManager.strings.newTruckersMPGameVersionReleaseNotificationText,
//                                         playSound: true
//                                     });                           

//                                     AppSettings.setValue(AppSettings.keys.lastVersionNumber, _version.name);  
//                                 }                                                               
//                             }
//                         });

//                 })

//         }, 3600000);
//     }
// }

// module.exports = NotificationManager;