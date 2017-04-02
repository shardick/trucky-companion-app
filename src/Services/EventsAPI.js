var DomParser = require('react-native-html-parser').DOMParser
import LocaleManager from '../Locales/LocaleManager';
var lc = new LocaleManager();

/*const Realm = require('realm');*/

/*const realmName = "Meetup_2";*/

/*const realm = new Realm({
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
});*/


/**
 * ETS2c.com wrappers. Parses html from ets2.com and build an array with scheduled events
 * 
 * @class EventsAPI
 */
class EventsAPI
{
    constructor()
    {}

    /**
     *
     *
     * @returns Array of meetups
     *
     * @memberOf EventsAPI
     */
    async events()
    {
        // realm.write(() => {    var allMeetups = realm.objects(realmName);
        // realm.delete(allMeetups); });

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

                m.endDate = lc.moment(m.eventDate)
                    .add(2, 'h')
                    .toDate();

                //console.log(JSON.stringify(m));

                /*realm.write(() => {
                    var results = realm.objects(realmName);
                    var storedM = results.filtered('eventID = $0', m.eventID);

                    if (storedM) 
                        realm.create(realmName, m, true);
                    else 
                        realm.create(realmName, m);
                    }
                );*/

                meetups.push(m);
            }

        }, this);

        return meetups;
    }

    /**
     *
     *
     * @param {string} timeFrame
     * @returns Date or undefined
     *
     * @memberOf EventsAPI
     */
    convertEventDate(timeFrame)
    {
        var segments = timeFrame.split(' ');

        var eventDate;
        var timePart = parseInt(segments[1]);

        switch (segments[2]) {
            case 'minutes':
            case 'minute':
                eventDate = lc.moment().add(timePart, 'm');
                break;
            case 'hours':
            case 'hour':
                eventDate = lc.moment().add(timePart, 'h');
                break;
            case 'days':
            case 'day':
                eventDate = lc.moment().add(timePart, 'd');
            case 'week':
            case 'weeks':
                eventDate = lc.moment().add(timePart, 'w');
                break;
            case 'month':
            case 'months':
                eventDate = lc.moment().add(timePart, 'M');
                break;
        }

        if (eventDate != undefined) 
            return eventDate.toDate();
        else 
            return eventDate;
        }
    
    /**
     *
     *
     * @param {Array} meetups
     * @param {string} server
     * @param {string} language
     * @returns
     *
     * @memberOf EventsAPI
     */
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
}

module.exports = EventsAPI;