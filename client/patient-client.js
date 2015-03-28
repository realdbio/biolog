
Template.patientSelector.events({
    'click .patientDialog-patient': function(event) {
        console.log(JSON.stringify(this));
    },

    //'click .patientSelector-newPatient' : function(event) {
    //    var pt = {
    //        _id: "person/" + Meteor.user()._id,
    //        userid: Meteor.user()._id,
    //        creator: Meteor.user()._id,
    //        created: new Date(),
    //        data: {}
    //    };
    //    Session.set("editPatient", pt);
    //}

    'change #inputNickname': function(event) {
        var pt = Session.get("patient");
        var fact = {
            subject: pt._id,
            predicate: "id/nickname",
            text: event.target.value
        };
        pt.data["id/nickname"] = fact;
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed: " + Session.get("patient"));
    },

    'change #inputDob': function(event) {
        var pt = Session.get("patient");
        var fact = {
            subject: pt._id,
            predicate: "id/dob",
            startDate: event.target.value,
            endFlag: 1
        };
        pt.data["id/dob"] = fact;
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed: " + Session.get("patient"));
    },

    'change #inputGender': function(event) {
        var pt = Session.get("patient");
        var fact = {
            subject: pt._id,
            predicate: "id/sex",
            text: event.target.value,
            endFlag: 1
        };
        pt.data["id/sex"] = fact;
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed: " + Session.get("patient"));
    }
});


Template.patientSelector.helpers({
    patients: function() {
        if (! Session.get("patient")) return;
        var pts = getUserPatients(Session.get("patient")._id).fetch();
        Session.set("patients", pts);
        return pts;
    },

    femaleChecked: function() {
        if (this.data.gender=="female") return "checked";
        return "";
    },

    maleChecked: function() {
        if (this.data.gender=="male") return "checked";
        return "";
    }
});