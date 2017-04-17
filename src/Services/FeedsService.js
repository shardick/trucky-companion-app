var DomParser = require('react-native-html-parser').DOMParser
import LocaleManager from '../Locales/LocaleManager';
var moment = require('moment');
var lc = new LocaleManager();

class FeedsService
{
    constructor()
    {
        this.config = {
            truckersMPGroupRSS: 'http://steamcommunity.com/groups/truckersmpofficial/rss/'
        };
    }

    async getTruckersMPGroupFeed()
    {
        var response = await fetch(this.config.truckersMPGroupRSS);
        var html = await response.text();

        //console.warn(html);

        let doc = new DomParser().parseFromString(html, 'text/html')

        let items = doc.querySelect('item');

        let news = new Array();

        items.forEach(function(element) {

            var n = {
                title: element.querySelect('title')[0].textContent,
                description: element.querySelect('description')[0].textContent,
                link: element.querySelect('link')[0].textContent,
                pubDate: element.querySelect('pubDate')[0].textContent,
                guid:  element.querySelect('guid')[0].textContent,
            };

            n.newsDate = lc.moment(n.pubDate.split(',')[1]);

            news.push(n);
        });

        return news;
    }
}

module.exports = FeedsService;