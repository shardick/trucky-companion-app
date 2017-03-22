var DomParser = require('react-native-html-parser').DOMParser
var moment = require('moment');

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

            m.eventDate = this.convertEventDate(m.time);
            
            if (m.eventDate && m.eventDate != undefined)
            {
                m.endDate = moment(m.eventDate).add(2, 'h');
            }

            meetups.push(m);

        }, this);

        return meetups;
    }

    convertEventDate(timeFrame)
    {
        var segments = timeFrame.split(' ');

        var eventDate;
        var timePart = parseInt(segments[1]);

        switch (segments[2]) {
            case 'minutes':
            case 'minute':
                eventDate = moment().add(timePart, 'm');
                break;
            case 'hours':
            case 'hour':
                eventDate = moment().add(timePart, 'h');
                break;
            case 'days':
            case 'day':
                eventDate = moment().add(timePart, 'd');
            case 'week':
            case 'weeks':
                eventDate = moment().add(timePart, 'w');
                break;
            case 'month':
            case 'months':
                eventDate = moment().add(timePart, 'M');
                break;
        }

        return eventDate;
    }

    plusToDate(unit, howMuch) {

        var config = {
            second: 1000, // 1000 miliseconds
            minute: 60000,
            hour: 3600000,
            day: 86400000,
            week: 604800000,
            month: 2592000000, // Assuming 30 days in a month
            year: 31536000000 // Assuming 365 days in year
        };

        return new Date(new Date().getTime() + (config[unit] * howMuch));
    }

    filterEvents(meetups, server, language)
    {
        var ret = new Array();

        meetups.forEach(function (element) {

            if (server != "") {
                if (element.server.indexOf(server.replace(' ', '')) > -1) {
                    ret.push(element);
                }
            }

        }, this);

        return ret;
    }

    distinctLanguages(meetups)
    {
        var ret = new Array();

        meetups.forEach(function (element) {

            if (ret.indexOf(element.language) == -1) {
                ret.push(element.language);
            }
        }, this);

        return ret;
    }
}

module.exports = EventsAPI;