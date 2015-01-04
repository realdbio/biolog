Deps.autorun(function () {
    if (Session.get("patient") && Session.get("patient")._id) {
        Meteor.subscribe("patientDiagnoses", Session.get("patient")._id);
    }
});

Meteor.subscribe("allFacts");

Meteor.subscribe("currentPatient");

//Meteor.subscribe("mostUsedDiagnoses");
//Meteor.subscribe("someDiagnoses");

Template.myDiagnoses.events({'submit form': function (event, template) {
    event.preventDefault();
    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }
    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");
    var ent = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id,
        etype: "diagnosis"
    };
    var validationError = false;
    if (! Entities.simpleSchema().namedContext().validateOne(ent, "description")) {
        Session.set("error-smartbio-entity-name", "Please enter a name");
        validationError = true;
    }
    if (validationError) return;
    Meteor.call("addEntity", ent, function(error, result) {
        // display the error to the user and abort
        if (error)
            return alert(error.reason);
//        console.log("addEntity returns: " + result);
    });
}});

Template.myDiagnoses.helpers({
    diagnoses: function() {
//        console.log("Meteor.user()=" + JSON.stringify(Meteor.user()));

//        return Entities.find({etypes: "diagnosis"}).fetch();
//        return Facts.find({pred: "diagnosis", subj: Meteor.userId(), valid: 1 }).fetch();
        if (! Session.get("patient") || ! Session.get("patient")._id) return;
        return getPatientDiagnoses(Session.get("patient")._id).fetch();
    }
});

Template.allFacts.helpers({
    facts: function() {
//        return Entities.find({etypes: "diagnosis"}).fetch();
        return Facts.find().fetch();
    }
});

//Template.mostUsedDiagnoses.helpers({
//    diagnosiss: function(){
//        return Entities.find({etypes: "diagnosis" }, {sort: [["used","desc"]]}, {limit: 20}).fetch();
//    }
//});

//Template.someDiagnoses.helpers({
//    diagnosiss: function(){
//        return Entities.find().fetch();
//    }
//});

Template.addDiagnosisButton.events({
    'click #addDiagnosisButton': function(event, template) {
        event.preventDefault();
//        var healthCondition = this;
        var patient = Session.get("patient");
        var diagnosis = {
            subj: patient._id,
            subjName: patient.name,
            pred: "diagnosis",
//            obj: healthCondition._id,
//            objName: healthCondition.name,
//            text: healthCondition.name,
            startDate: new Date(),
            startFlag: 0,
            endDate: null,
            endFlag: 1
        };
        Session.set("selectedDiagnosis", diagnosis);
        setStartEndDateControls("addDiagnosisDialog");
        addDiagnosisDialog.show();
    }
});


Template.diagnosisItem.events({
    'click .smartbio-diagnosisbtn': function(event, template) {
        event.preventDefault();
//        console.log("click .smartbio-diagnosisbtn!: setting selectedDiagnosis to: " + JSON.stringify(this));
        var diagnosis = this;
        Session.set("selectedDiagnosis", diagnosis);
        setStartEndDateControls("editDiagnosisDialog");
        editDiagnosisDialog.show();
    }
});