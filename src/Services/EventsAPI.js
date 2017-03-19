var DomParser = require('react-native-html-parser').DOMParser

class EventsAPI
{
    constructor()
    {}

    async events()
    {
        var response = await fetch('http://ets2c.com');
        var html = await response.text();

        //console.warn(html);

        let doc = new DomParser().parseFromString(html, 'text/html')

        var rows = doc.querySelect('.row');

        var meetups = new Array();

        rows.forEach(function (element) {

            var rowContent = element.querySelect('<div>');

            var m = {
                server: rowContent[1].textContent,
                time: rowContent[2].textContent,
                location: rowContent[3].textContent,
                author: rowContent[4].textContent,
                language: rowContent[5].textContent,
                participants: rowContent[6].textContent,
                url: rowContent[8].attributes[0].nodeValue
            };

            meetups.push(m);

        }, this);

        return meetups;
    }
}

module.exports = EventsAPI;