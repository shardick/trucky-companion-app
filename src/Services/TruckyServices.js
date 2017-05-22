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
            serviceUrl: 'https://truckyservices.herokuapp.com'
        }

        if (__DEV__ && Platform.OS == 'android') {
            this.config.serviceUrl = 'http://10.0.0.4:5000';
        }
    }

    /**
     *
     *
     * @param {any} url
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

            return null;
        }
    }

    /**
     *
     *
     * @param {any} username
     * @returns
     *
     * @memberOf TruckyServices
     */
    async resolveVanityUrl(username)
    {
        var response = await this.executeRequest('/steam/resolveVanityUrl?username=' + username);
        return response;
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
        var response = await this.executeRequest('/steam/getPlayerSummaries?steamid=' + steamid);
        return response;
    }

    async pois()
    {
        var response = await this.executeRequest('/map/pois');
        return response;
    }

    async isOnline(playerID)
    {
        var response = await this.executeRequest('/map/online?playerID=' + playerID);
        return response;
    }

    async getFriends(steamID)
    {
        var response = await this.executeRequest('/steam/getFriendsData?steamid=' + steamID);
        return response;
    }

    /* news */
    async news()
    {
        var response = await this.executeRequest('/tmpapi/news');
        return response;
    }

    async update_info()
    {
        var response = await this.executeRequest('/tmpapi/update_info');
        return response;
    }

    /* events */
    async events()
    {
        var response = await this.executeRequest('/events/list');
        return response;
    }

    /* tmpapi wrapper */
    async servers()
    {
        var response = await this.executeRequest('/tmpapi/servers');
        return response;
    }

    async game_version()
    {
        var response = await this.executeRequest('/tmpapi/version');
        return response;
    }

    async game_time()
    {
        var response = await this.executeRequest('/tmpapi/time');
        return response;
    }

    async rules()
    {
        var response = await this.executeRequest('/tmpapi/rules');
        return response.rules;
    }

    async player(id)
    {
        var response = await this.executeRequest('/tmpapi/player?playerID=' + id);
        return response;
    }

    async bans(id)
    {
        var response = await this.executeRequest('/tmpapi/bans?playerID=' + id);
        return response;
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

}

module.exports = TruckyServices;