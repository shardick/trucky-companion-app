import LocaleManager from '../Locales/LocaleManager';

var lc = new LocaleManager();


/**
 * TruckersMP API wrapper
 * 
 * @class TruckersMPApi
 */
class TruckersMPApi
{
    constructor()
    {
        this.config = {
            api_base_url: 'https://api.truckersmp.com/v2/',
            update_package_json: 'http://update.ets2mp.com/packages.json'
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
        var gametime = await this.game_time();
        var start = new Date(2015, 9, 25);
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


    /**
     * Get update info from live server to show latest banner\message from developers in Home Screen
     * 
     * @returns 
     * 
     * @memberOf TruckersMPApi
     */
    async getUpdateInfo()
    {
        var URL = this.config.update_package_json;

        var response = await fetch(URL);
        var json = await response.json();

        return json;
    }
}

module.exports = TruckersMPApi;