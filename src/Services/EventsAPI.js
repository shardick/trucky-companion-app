var DomParser = require('react-native-html-parser').DOMParser
var moment = require('moment');
const Realm = require('realm');

const realmName = "Meetup_2";

const realm = new Realm({
    schema: [
        {
            name: realmName,
            primaryKey: 'eventID',
            properties: {
                eventID: 'int',
                server: 'string',
                time: 'string',
                location: 'string',
                author: 'string',
                language: 'string',
                participants: 'string',
                url: 'string',
                calendarEventID: 'string',
                eventDate: 'date',
                endDate: 'date'
            }
        }
    ]
});

class EventsAPI
{
    constructor()
    {}

    async events()
    {
        //realm.write(() => {
        //    var allMeetups = realm.objects(realmName);
        //    realm.delete(allMeetups);
        //});

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
                url: rowContent[8].attributes[0].nodeValue,
                calendarEventID: ''
            };

            m.eventID = parseInt(m.url.split('/')[1]);

            m.eventDate = this.convertEventDate(m.time);

            if (m.eventDate != undefined) {

                m.endDate = moment(m.eventDate)
                    .add(2, 'h')
                    .toDate();

                //console.log(JSON.stringify(m));

                realm.write(() => {
                    var results = realm.objects(realmName);
                    var storedM = results.filtered('eventID = $0', m.eventID);

                    if (storedM)
                        realm.create(realmName, m, true);
                    else
                        realm.create(realmName, m);
                });

                meetups.push(m);
            }

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

        if (eventDate != undefined) 
            return eventDate.toDate();
        else 
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