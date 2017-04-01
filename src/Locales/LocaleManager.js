import LocalizedStrings from 'react-native-localization';
var moment = require('moment');
var strings = require('./resources');
import AppSettings from '../AppSettings';

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

                //strings.setLanguage(this._settings.language);
                this.setLanguage(this._settings.language);
            });
    }

    get interfaceLanguage()
    {
        return this
            .strings
            .getInterfaceLanguage();
    }

    get momentLocale()
    {
        return this._momentLocale;
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
        /*var deviceLocale = this
            .strings
            .getInterfaceLanguage();
        var localeFragments = deviceLocale.split('-'); */
        this._momentLocale = this._settings.language;
        
    }

    setLanguage(language)
    {
        strings.setLanguage(language);        
    }
}

module.exports = LocaleManager;