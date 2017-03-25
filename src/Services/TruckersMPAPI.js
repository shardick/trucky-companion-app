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
        var gametime = await this.game_time();
        var start = new Date(2015, 9, 25);
        return new Date(start.getTime() + ((gametime-3) * 60 * 1000)).customFormat('#DDD# #hhhh#:#mm#');
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

Date.prototype.customFormat = function (formatString) {
    var YYYY,
        YY,
        MMMM,
        MMM,
        MM,
        M,
        DDDD,
        DDD,
        DD,
        D,
        hhhh,
        hhh,
        hh,
        h,
        mm,
        m,
        ss,
        s,
        ampm,
        AMPM,
        dMod,
        th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10
        ? ('0' + M)
        : M;
    MMM = (MMMM = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10
        ? ('0' + D)
        : D;
    DDD = (DDDD = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20)
        ? 'th'
        : ((dMod = D % 10) == 1)
            ? 'st'
            : (dMod == 2)
                ? 'nd'
                : (dMod == 3)
                    ? 'rd'
                    : 'th';
    formatString = formatString
        .replace("#YYYY#", YYYY)
        .replace("#YY#", YY)
        .replace("#MMMM#", MMMM)
        .replace("#MMM#", MMM)
        .replace("#MM#", MM)
        .replace("#M#", M)
        .replace("#DDDD#", DDDD)
        .replace("#DDD#", DDD)
        .replace("#DD#", DD)
        .replace("#D#", D)
        .replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) 
        h = 24;
    if (h > 12) 
        h -= 12;
    hh = h < 10
        ? ('0' + h)
        : h;
    hhhh = hhh < 10
        ? ('0' + hhh)
        : hhh;
    AMPM = (ampm = hhh < 12
        ? 'am'
        : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10
        ? ('0' + m)
        : m;
    ss = (s = this.getSeconds()) < 10
        ? ('0' + s)
        : s;
    return formatString
        .replace("#hhhh#", hhhh)
        .replace("#hhh#", hhh)
        .replace("#hh#", hh)
        .replace("#h#", h)
        .replace("#mm#", mm)
        .replace("#m#", m)
        .replace("#ss#", ss)
        .replace("#s#", s)
        .replace("#ampm#", ampm)
        .replace("#AMPM#", AMPM);
};