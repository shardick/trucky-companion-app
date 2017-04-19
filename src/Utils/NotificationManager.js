import AppSettings from '../AppSettings';
import TruckersMPApi from '../Services/TruckersMPAPI';
import BackgroundTimer from 'react-native-background-timer';
var PushNotification = require('react-native-push-notification');

class NotificationManager
{
    constructor()
    {
        this.api = new TruckersMPApi();

        this
            .checkNewGameVersion()
            .done();
    }

    async checkNewGameVersion()
    {
        this.checkNewGameVersionIntervalId = BackgroundTimer.setInterval(() => {

            this
                .api
                .get_version()
                .then((_version) => {

                    AppSettings
                        .getSettings()
                        .then((_settings) => {

                            if (_settings.lastVersionNumber != _version.name) {
                                PushNotification.localNotification({
                                    smallIcon: 'drawable/ic_stat_onesignal_default', bigText: 'New TruckersMP version released', message: "New TruckersMP version released", // (required),
                                    playSound: true
                                });

                                AppSettings.setValue(AppSettings.keys.lastVersionNumber, _version.name);
                            }
                        });
                })

        }, 3600000);
    }
}

module.exports = NotificationManager;