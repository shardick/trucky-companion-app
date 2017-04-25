class SteamAPI
{
    constructor()
    {
        this.config = {
            steamApiKey: '604CDCBE367081EE2B3D63FF7F2A718E'
        }
    }

    async resolveVanityUrl(username)
    {
        var result = {
            steamID: 0,
            found: false
        }
        /*

{
	"response": {
		"steamid": "76561198053883782",
		"success": 1
	}
}
        */
        var response = await fetch('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + this.config.steamApiKey + '&vanityurl=' + username);
        var json = await response.json();

        //console.warn(JSON.stringify(json));

        if (json.response.success == 1) {
            result.steamID = json.response.steamid;
            result.playerInfo = await this.getPlayerSummaries(result.steamID);
            result.found = true;
        }

        return result;
    }

    async getPlayerSummaries(steamid)
    {
        /*
        
{
	"response": {
		"players": [
			{
				"steamid": "76561198053883782",
				"communityvisibilitystate": 3,
				"profilestate": 1,
				"personaname": "dowmeister",
				"lastlogoff": 1492912619,
				"profileurl": "http://steamcommunity.com/id/dowmeister/",
				"avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg",
				"avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
				"avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
				"personastate": 1,
				"realname": "Francesco",
				"primaryclanid": "103582791429521408",
				"timecreated": 1322994575,
				"personastateflags": 0,
				"loccountrycode": "IT",
				"locstatecode": "09",
				"loccityid": 24918
			}
		]
		
	}
}
        */
        var response = await fetch('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + this.config.steamApiKey + '&steamids=' + steamid);
        var json = await response.json();

        return json.response.players[0];
    }
}

module.exports = SteamAPI;