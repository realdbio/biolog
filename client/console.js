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
        dummyPatient();
        var patientDiagnoses = Session.get("patientDiagnoses");
        var diagnosisList = "";
        for (var di in patientDiagnoses) {
            var dx = patientDiagnoses[di];
            if (diagnosisList.length > 0) diagnosisList += "|";
            diagnosisList += dx.objName;
        }
        var pt = Session.get("patient");
        var dob = yyyymmdd(pt.dob);
        Meteor.call("isabel", dob, pt.sex, pt.pregnant, pt.region, diagnosisList, function(error, result){
            if (error) {
                return console.error("ERROR calling Isabel: " + error);
            }
            var contentString = result.content.substring(7, result.content.length - 2);
            var content = JSON.parse(contentString);
            console.log("Received RESULT from Isabel: " + JSON.stringify(content, null, "  "));
            Session.set("isabel", content.Diagnosis_checklist)
        });
    }
});


Template.console.helpers({
    recognizedSpeech: function() {
        return Session.get("recognizedSpeech");
    }
});

//Template.myChecklist.events({
//
//});
//
//Template.myChecklist.helpers({
//    checklist: function() {
//        return getPatientFlags(Session.get("patient")._id).fetch();
//    }
//});

Template.isabelChecklist.helpers({
    diagnoses: function() {
        if (! Session.get("isabel")) return null;
        return Session.get("isabel").diagnosis;
    },

    isabelIcon: function() {
        if (this.red_flag && this.red_flag == "true") return "fa fa-warning";
        return "fa fa-question-circle";
    },

    severityColor: function() {
        if (this.red_flag && this.red_flag == "true") return "list-group-item-danger";
        return "list-group-item-warning";
    }
});