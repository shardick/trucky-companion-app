var React = require('react');
var ReactNative = require('react-native');
var {AsyncStorage} = ReactNative;

class AppSettings
{
    static get keys()
    {
        return {autoRefreshGameTime: 'autoRefreshGameTime', autoRefreshServersList: 'autoRefreshServersList',
            serverListRefreshInterval: 'serverListRefreshInterval', language: 'language'}
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
            language: 'en'
        };        
    }       

    static async initialize()
    {
        var alreadyInit = await AppSettings.settingsInitialized();

        if (!alreadyInit)
        {
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