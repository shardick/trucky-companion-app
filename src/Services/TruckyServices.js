
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
}

module.exports = TruckyServices;