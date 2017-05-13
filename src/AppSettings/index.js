var React = require('react');
var ReactNative = require('react-native');
var {AsyncStorage} = ReactNative;

class AppSettings
{
    static get keys()
    {
        return {
            autoRefreshGameTime: 'autoRefreshGameTime',
            autoRefreshServersList: 'autoRefreshServersList',
            serverListRefreshInterval: 'serverListRefreshInterval',
            language: 'language',
            firstStart: 'firstStart',
            lastVersionNumber: 'lastVersionNumber',
            mapSettings: 'mapSettings',
            steamUser: 'steamUser',
            deviceID: 'deviceID'
        }
    }

    static get storageKey()
    {
        return "@TruckyAppSettings";
    }

    static get defaultSettings()
    {
        return {
            autoRefreshGameTime: true,
            autoRefreshServersList: false,
            serverListRefreshInterval: 60000,
            language: 'en',
            firstStart: true,
            lastVersionNumber: '',
            mapSettings: {
                hideHeatMap: true,
                showDirection: true,
                showTrucks: true,
                showName: false,
                showID: true
            },
            steamUser: null,
            deviceID: ''
        };
    }

    static async initialize()
    {
        var alreadyInit = await AppSettings.settingsInitialized();

        if (!alreadyInit) {
            //await AsyncStorage.setItem(storageKey, JSON.stringify(defaultSettings));
            await AppSettings.saveSettings(AppSettings.defaultSettings);
        }
    }

    static async settingsInitialized()
    {
        var settingsString = await AppSettings.getSettingsString();

        return settingsString != null;
    }

    static async getSettingsString()
    {
        return await AsyncStorage.getItem(AppSettings.storageKey);
    }

    static async getSettings()
    {
        await AppSettings.initialize();

        var settingsString = await AppSettings.getSettingsString();

        return JSON.parse(settingsString);
    }

    static async saveSettings(settings)
    {
        await AsyncStorage.setItem(AppSettings.storageKey, JSON.stringify(settings));
    }

    static async setValue(key, value)
    {
        var settings = await AppSettings.getSettings();

        settings[key] = value;

        await AppSettings.saveSettings(settings);
    }
}

module.exports = AppSettings;