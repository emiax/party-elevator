var Elevator = require('./elevator');

Party = {
    
    attendees: {},

    setIntention: function (attendee, intention) {
        attendee.setIntention(intention);

        var self = this;
        console.log("updated intentions");
        Object.keys(this.attendees).forEach(function (id) {
            var attendee = self.attendees[id];
            console.log(attendee.toString());
        });
    }, 


    addAttendee: function (a) {
        this.attendees[a.id()] = a;
    },


    allToClientFormat: function () {
        var attendeeData = {};
        var self = this;
        Object.keys(this.attendees).forEach(function (attendeeId) {
            var attendee = self.attendees[attendeeId];
            attendeeData[attendeeId] = attendee.toClientFormat();
        });

        var data = {
            attendees: attendeeData
        };

        return data;
    }
    

};

module.exports = Party;
