Party = {
    
    attendees: {},

    elevator: null,


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

};

module.exports = Party;
