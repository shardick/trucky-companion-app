import LocaleManager from '../Locales/LocaleManager';

var lc = new LocaleManager();

class TruckersMPApi
{
    constructor()
    {
        this.config = {
            api_base_url: 'https://api.truckersmp.com/v2/'
        };
    }


    /**
     * 
     * 
     * @param {string} serviceName 
     * @returns 
     * 
     * @memberOf TruckersMPApi
     */
    async executeRequest(serviceName)
    {
        var URL = this.config.api_base_url + serviceName;
        var response = await fetch(URL)
        var json = await response.json();

        return json;
    }


    /**
     * 
     * 
     * @returns Array of servers
     * 
     * @memberOf TruckersMPApi
     */
    async servers()
    {
        var json = await this.executeRequest('servers');
        return json.response;
    }


    /**
     * 
     * 
     * @returns game time object
     * 
     * @memberOf TruckersMPApi
     */
    async game_time()
    {
        var json = await this.executeRequest('game_time');
        return json.game_time;
    }


    /**
     * 
     * 
     * @returns {string}
     * 
     * @memberOf TruckersMPApi
     */
    async game_time_formatted()
    {
        //var lc = new LocaleManager();

        //console.warn(lc.strings);

        //console.warn(lc.interfaceLanguage);

        //var momentLocaleName = 'moment/locale/' + lc.momentLocale;
        //var momentLocale = require(momentLocaleName);

        //console.warn(momentLocale);

        //moment.updateLocale('it', momentLocale);
        
        var gametime = await this.game_time();
        var start = new Date(2015, 9, 25);
        //return new Date(start.getTime() + ((gametime-3) * 60 * 1000)).customFormat('#DDD# #hhhh#:#mm#');
        return lc.moment(start).add(gametime-3, 'm').format('dddd HH:mm');
    }


    /**
     * 
     * 
     * @returns {string}
     * 
     * @memberOf TruckersMPApi
     */
    async get_version()
    {
        var json = await this.executeRequest('version');
        return json;
    }


    /**
     * 
     * 
     * @returns rules markdown
     * 
     * @memberOf TruckersMPApi
     */
    async rules()
    {
        var json = await this.executeRequest('rules');
        return json.rules;
    }


    /**
     * 
     * 
     * @param {string} id 
     * @returns player object
     * 
     * @memberOf TruckersMPApi
     */
    async player(id)
    {
        var json = await this.executeRequest('player/' + id);
        return json;
    }
}

module.exports = TruckersMPApi;