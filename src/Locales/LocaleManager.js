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

    get availableLanguages()
    {
        return [
            {
                displayName: 'Bulgarian',
                code: 'bg'
            }, {
                displayName: 'Czech',
                code: 'cs'
            }, {
                displayName: 'Dutch',
                code: 'nl'
            }, {
                displayName: 'German',
                code: 'de'
            }, {
                displayName: 'English',
                code: 'en'
            }, {
                displayName: 'Finnish',
                code: 'fi'
            }, {
                displayName: 'French',
                code: 'fr'
            }, {
                displayName: 'Italian',
                code: 'it'
            }, {
                displayName: 'Polish',
                code: 'pl'
            }, {
                displayName: 'Portuguese',
                code: 'pt'
            }, {
                displayName: 'Spanish',
                code: 'es'
            }, {
                displayName: 'Russian',
                code: 'ru'
            }
        ];
    }
    // http://www.lingoes.net/en/translator/langcode.htm
    get supportedLanguages()
    {
        return [
            'en',
            'it',
            'en-US',
            'en-GB',
            'it-IT',
            'it-CH',
            'fr-FR',
            'bg-BG',
            'fr-BE',
            'fr-CA',
            'fr-CH',
            'fr-LU',
            'fr-MC',
            'fr',
            'bg',
            'en-AU',
            'en-CA',
            'en-IE',
            'en-JM',
            'en-NZ',
            'en-ZA',
            'en-PH',
            'fi',
            'fi-FI',
            'es',
            'es-ES',
            'es-AR',
            'es-BO',
            'es-CL',
            'es-CO',
            'es-CR',
            'es-DO',
            'es-EC',
            'es-GT',
            'es-HN',
            'es-MX',
            'es-NI',
            'es-PA',
            'es-PE',
            'es-PR',
            'es-PY',
            'es-SV',
            'es-UY',
            'es-VE',
            'nl',
            'nl-NL',
            'nl-BE',
            'pl',
            'pl-PL',
            'de',
            'de-AT',
            'de-CH',
            'de-DE',
            'de-LI',
            'de-LU',
            'cs-CZ',
            'cs',
            'ru',
            'ru-RU',
            'pt-PT',
            'pt-BR',
        ];
    }

    interfaceLanguageIsSupported()
    {
        return this
            .supportedLanguages
            .includes(this.interfaceLanguage);
    }

    normalizeLanguage(language)
    {
        return language
            .split('-')[0]
            .toLowerCase();
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
            case 'fr':
                momentLocaleConfiguration = require('moment/locale/fr');
                break;
            case 'bg':
                momentLocaleConfiguration = require('moment/locale/bg');
                break;
            case 'fi':
                momentLocaleConfiguration = require('moment/locale/fi');
                break;
            case 'es':
                momentLocaleConfiguration = require('moment/locale/es');
                break;
            case 'nl':
                momentLocaleConfiguration = require('moment/locale/nl');
                break;
            case 'pl':
                momentLocaleConfiguration = require('moment/locale/pl');
                break;
            case 'de':
                momentLocaleConfiguration = require('moment/locale/de');
                break;
            case 'cs':
                momentLocaleConfiguration = require('moment/locale/cs');
                break;
            case 'ru':
                momentLocaleConfiguration = require('moment/locale/ru');
                break;
            case 'pt':
                momentLocaleConfiguration = require('moment/locale/pt');
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