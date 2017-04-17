import LocalizedStrings from 'react-native-localization';
var moment = require('moment');
var strings = require('./resources');
import AppSettings from '../AppSettings';


/**
 * Language and locale management. It contains an instance of LocalizedStrings and a localized instance of moment to datetime parsing and formatting
 * 
 * @class LocaleManager
 */
class LocaleManager
{
    constructor()
    {       
        AppSettings
            .getSettings()
            .then((settings) => {
                this._settings = settings;
                this.setMomentLocale();
                this.loadMomentLocale();
                this.setLanguage(this._settings.language);
            });
    }

    get supportedLanguages()
    {
        return [
            'en', 'it',
            'en-US', 'en-GB', 'it-IT', 'it-CH'
        ];
    }

    interfaceLanguageIsSupported()
    {
        return this.supportedLanguages.includes(this.interfaceLanguage); 
    }

    normalizeLanguage(language)
    {
        return language.split('-')[0].toLowerCase();
    }

    get interfaceLanguage()
    {
        return this
            .strings
            .getInterfaceLanguage();
    }

    get strings()
    {
        return strings;
    }

    moment(param)
    {
        return moment(param);        
    }

    loadMomentLocale()
    {
        var momentLocaleConfiguration;

        switch (this._momentLocale) {
            case 'it':
                momentLocaleConfiguration = require('moment/locale/it');
                break;
            default:

                break;
        }

        if (momentLocaleConfiguration && typeof(momentLocaleConfiguration) != undefined) {
            moment.updateLocale(this._momentLocale, momentLocaleConfiguration);
        }
    }

    setMomentLocale()
    {
        this._momentLocale = this._settings.language;        
    }

    setLanguage(language)
    {
        strings.setLanguage(language);        
    }
}

module.exports = LocaleManager;