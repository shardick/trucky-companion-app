import LocaleManager from '../Locales/LocaleManager';
import TruckyServices from './TruckyServices';

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
        var response = await fetch(URL, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        //var text = await response.text();

        //console.warn(text);

        //var json = JSON.parse(text); // await response.json();

        //console.warn(JSON.stringify(json));
        
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
        return lc
            .moment(start)
            .add(gametime - 3, 'm')
            .format('dddd HH:mm');
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
        /*

{"error":false,"response":{"id":189591,"name":"dowmeister","avatar":"https:\/\/static.truckersmp.com\/avatars\/defaultavatar.png",
"joinDate":"2014-12-27 14:26:11","steamID64":76561198053883782,
"groupName":"Player","groupID":1,
"permissions":{"isGameAdmin":false,"showDetailedOnWebMaps":false}}}
        */
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

    /**
     * Search player by Steam ID, Steam Username or TruckersMP ID based on searchType parameter
     * 
     * @param {any} searchTerm 
     * @param {any} searchType 
     * @returns 
     * 
     * @memberOf TruckersMPApi
     */
    async searchPlayer(searchTerm, searchType)
    {
        var playerInfo = {
            found: false,
            steamProfileInfo: null,
            truckersMPProfileInfo: null,
            bans: []
        };

        //console.warn(searchType);

        var truckyApi = new TruckyServices();

        switch (searchType) {
            case 'steamusername':

                var steamResponse = await truckyApi.resolveVanityUrl(searchTerm);

                if (steamResponse.found) {
                    playerInfo.steamProfileInfo = steamResponse.playerInfo;
                    var apiResponse = await this.player(steamResponse.steamID);

                    if (!apiResponse.error) {
                        playerInfo.found = true;
                        playerInfo.truckersMPProfileInfo = apiResponse.response;
                        playerInfo.bans = await this.bans(playerInfo.truckersMPProfileInfo.id);
                        //playerInfo.onlineStatus = await truckyApi.isOnline(playerInfo.truckersMPProfileInfo.id);
                    } else {
                        playerInfo.found = false;
                    }

                }

                break;
            case 'steamid':
            case 'truckersmpid':

                var apiResponse = await this.player(searchTerm);

                if (!apiResponse.error) {
                    playerInfo.truckersMPProfileInfo = apiResponse.response;
                    var steamProfileInfo = await truckyApi.getPlayerSummaries(playerInfo.truckersMPProfileInfo.steamID64);
                    playerInfo.steamProfileInfo = steamProfileInfo.playerInfo;
                    playerInfo.bans = await this.bans(playerInfo.truckersMPProfileInfo.id);
                    //playerInfo.onlineStatus = await truckyApi.isOnline(playerInfo.truckersMPProfileInfo.id);
                    playerInfo.found = true;
                }

                break;
        }

        return playerInfo;
    }

    /**
     * Get Player Bans
     * 
     * @param {any} playerID 
     * @returns 
     * 
     * @memberOf TruckersMPApi
     */
    async bans(playerID)
    {
        /*
        {
error: false,
response: [
{
expiration: "2017-02-04 22:39:00",
timeAdded: "2017-01-04 22:39:36",
active: true,
reason: "Ramming: https://youtu.be/3TfMUV-TiUI?t=1m52s //1 month ban due to History",
adminName: "immortal766",
adminID: 502610
},
{
expiration: "2017-01-02 01:57:00",
timeAdded: "2016-12-28 01:57:28",
active: true,
reason: "Dangerous overtaking & Ramming - https://youtu.be/aY9CQ3rHRok",
adminName: "WooQash",
adminID: 652
},
{
expiration: "2016-12-07 22:07:26",
timeAdded: "2016-12-07 19:07:26",
active: true,
reason: "Ramming ",
adminName: "erykmoz",
adminID: 951
},
{
expiration: "2016-11-28 20:34:21",
timeAdded: "2016-11-27 20:34:21",
active: true,
reason: "undertkaing on dc road",
adminName: "RayRay5",
adminID: 62330
}
]
}
*/
        var response = await this.executeRequest('bans/' + playerID);

        return response.response;
    }
}

module.exports = TruckersMPApi;