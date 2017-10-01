import {Platform, Alert, NetInfo} from 'react-native';
/**
 *
 *
 * @class TruckyServices
 */
class TruckyServices
{

    /**
     * Creates an instance of TruckyServices.
     *
     * @memberOf TruckyServices
     */
    constructor()
    {
        this.config = {
            serviceUrl: 'https://api.truckyapp.com'
        }

        if (__DEV__ && Platform.OS == 'android') {
            this.config.serviceUrl = 'http://10.0.0.4:5000';
        }
    }

    /**
     *
     *
     * @param {string} url
     * @returns
     *
     * @memberOf TruckyServices
     */
    async executeRequest(url, method = "GET", payload)
    {
        try
        {
            var myHeaders = new Headers();
            myHeaders.set('user-agent', 'TruckyApp');
            myHeaders.set("x-platform", Platform.OS);

            var myInit = {
                method: method,
                headers: myHeaders,
                mode: 'cors',
                cache: 'no-cache'
            };

            if (myInit.method == "POST") {
                //console.warn(payload);

                myInit
                    .headers
                    .set('Accept', 'application/json, text/plain, */*');
                myInit
                    .headers
                    .set('Content-Type', 'application/json');

                myInit.body = JSON.stringify(payload);
            }

            console.log(url);

            var response = await fetch(this.config.serviceUrl + url, myInit);
            var json = await response.json();

            return json;

        } catch (error) {

            Alert.alert('Network error');

            console.debug('TruckyServices API request: ' + error.message);

            return {
                error: true,
                response: null
            };
        }
    }

    /**
     *
     *
     * @param {string} username
     * @returns
     *
     * @memberOf TruckyServices
     */
    async resolveVanityUrl(username)
    {
        var response = await this.executeRequest('/v2/steam/resolveVanityUrl?username=' + username);
        return response.response;
    }

    /**
     *
     *
     * @param {any} steamid
     * @returns
     *
     * @memberOf TruckyServices
     */
    async getPlayerSummaries(steamid)
    {
        var response = await this.executeRequest('/v2/steam/getPlayerSummaries?steamid=' + steamid);
        return response.response;
    }

    async pois()
    {
        var response = await this.executeRequest('/v2/map/pois');
        return response.response;
    }

    async isOnline(playerID)
    {
        var response = await this.executeRequest('/v2/map/online?playerID=' + playerID);
        return response.response;
    }

    async getFriends(steamID)
    {
        var response = await this.executeRequest('/v2/steam/getFriendsData?steamid=' + steamID);
        return response.response;
    }

    /* news */
    async news()
    {
        var response = await this.executeRequest('/v2/rss/truckersMP');
        return response.response;
    }

    async ets2News()
    {
        var response = await this.executeRequest('/v2/rss/ets2');
        return response.response;
    }

    async atsNews()
    {
        var response = await this.executeRequest('/v2/rss/ats');
        return response.response;
    }

    async update_info()
    {
        var response = await this.executeRequest('/v2/truckersmp/update_info');
        return response.response;
    }

    /* events */
    async events()
    {
        var response = await this.executeRequest('/v2/events');
        return response.response;
    }

    /* tmpapi wrapper */
    async servers()
    {
        var response = await this.executeRequest('/v2/truckersmp/servers');
        return response.response;
    }

    async game_version()
    {
        var response = await this.executeRequest('/v2/truckersmp/version');
        return response.response;
    }

    async game_time()
    {
        var response = await this.executeRequest('/v2/truckersmp/time');
        return response.response;
    }

    async rules()
    {
        var response = await this.executeRequest('/v2/truckersmp/rules');
        return response.response;
    }

    async player(id)
    {
        var response = await this.executeRequest('/v2/truckersmp/player?playerID=' + id);
        return response.response;
    }

    async bans(id)
    {
        var response = await this.executeRequest('/v2/truckersmp/bans?playerID=' + id);
        return response.response;
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

        switch (searchType) {
            case 'steamusername':

                var steamResponse = await this.resolveVanityUrl(searchTerm);

                if (steamResponse.found) {
                    playerInfo.steamProfileInfo = steamResponse.playerInfo;
                    var apiResponse = await this.player(steamResponse.steamID);

                    if (!apiResponse.error) {
                        playerInfo.found = true;
                        playerInfo.truckersMPProfileInfo = apiResponse.response;
                        playerInfo.bans = await this.bans(playerInfo.truckersMPProfileInfo.id);
                        // playerInfo.onlineStatus = await
                        // truckyApi.isOnline(playerInfo.truckersMPProfileInfo.id);
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
                    var steamProfileInfo = await this.getPlayerSummaries(playerInfo.truckersMPProfileInfo.steamID64);
                    playerInfo.steamProfileInfo = steamProfileInfo.playerInfo;
                    playerInfo.bans = await this.bans(playerInfo.truckersMPProfileInfo.id);
                    // playerInfo.onlineStatus = await
                    // truckyApi.isOnline(playerInfo.truckersMPProfileInfo.id);
                    playerInfo.found = true;
                }

                break;
        }

        return playerInfo;
    }

    async registerDevice(deviceInfo)
    {
        var payload = {
            deviceID: deviceInfo.getUniqueID(),
            manifacturer: deviceInfo.getManufacturer(),
            brand: deviceInfo.getBrand(),
            model: deviceInfo.getModel(),
            systemName: deviceInfo.getSystemName(),
            systemVersion: deviceInfo.getSystemVersion(),
            appVersion: deviceInfo.getVersion(),
            readableAppVersion: deviceInfo.getReadableVersion(),
            locale: deviceInfo.getDeviceLocale(),
            country: deviceInfo.getDeviceCountry(),
            isTablet: deviceInfo.isTablet(),
            isEmulator: deviceInfo.isEmulator()
        };

        await this.executeRequest('/device/register', 'POST', payload);
    }

    async traffic(server, game)
    {
        var response = await this.executeRequest('/v2/traffic?server=' + server + '&game=' + game);
        return response.response;
    }

    async traffic_servers()
    {
        var response = await this.executeRequest('/v2/traffic/servers');
        return response.response;
    }

    async wot_gallery_editorsPick(page)
    {
        var response = await this.executeRequest('/v2/wot/gallery/editorsPick?page=' + page);
        return response.response;
    }

    async wot_gallery_newest(page)
    {
        var response = await this.executeRequest('/v2/wot/gallery/newest?page=' + page);
        return response.response;
    }

    async wot_gallery_bestRated(page)
    {
        var response = await this.executeRequest('/v2/wot/gallery/bestRated?page=' + page);
        return response.response;
    }
}

module.exports = TruckyServices;