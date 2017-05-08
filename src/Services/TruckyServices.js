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
    }

    /**
     *
     *
     * @param {any} url
     * @returns
     *
     * @memberOf TruckyServices
     */
    async executeRequest(url)
    {
        var response = await fetch(this.config.serviceUrl + url);
        var json = await response.json();

        return json;
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
    
}

module.exports = TruckyServices;