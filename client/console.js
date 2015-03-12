/**
 * Created by dd on 2/24/15.
 */

Deps.autorun(function () {
    if (Session.get("patient") && Session.get("patient")._id) {
        Meteor.subscribe("patientFlags", Session.get("patient")._id);
    }
});



Template.console.events({
    'click #biolog-healthInfo-btn': function(event) {
        ask('I am listening', function (err, result) {
            if (result && result.transcript) {
                speak(result.transcript);
                Session.set("recognizedSpeech", result.transcript);
            } else {
                speak('I did not catch that');
            }
        });
    },

    'click #refreshChecklistButton': function(event) {
        console.log("search Isabel...");
        Meteor.call("isabel", function(error, result){
            if (error) {
                return console.error("ERROR calling Isabel: " + error);
            }
            var contentString = result.content.substring(7, result.content.length - 2);
            var content = JSON.parse(contentString);
            console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
        });
    }
});


Template.console.helpers({
    recognizedSpeech: function() {
        return Session.get("recognizedSpeech");
    }
});

Template.myChecklist.events({

});

Template.myChecklist.helpers({
    checklist: function() {
        //return Session.get("checklist");
        return getPatientFlags(Session.get("patient")._id).fetch();
    }
});