Meteor.startup(function(){


    var addDiagnosisDialogSpec = {
        template: Template.addDiagnosisDialog,
        title: "Add a condition",
        modalDialogClass: "add-condition-dialog", //optional
        modalBodyClass: "add-condition-body", //optional
        modalFooterClass: "add-condition-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            },
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            }
        }
    };

    addDiagnosisDialog = ReactiveModal.initDialog(addDiagnosisDialogSpec);

    addDiagnosisDialog.buttons.ok.on('click', function(button){
        addProperty(Session.get("selectedDiagnosis"));
        searchIsabel();
    });

    addDiagnosisDialog.buttons.cancel.on('click', function(button){
        Session.set("conditionSearchBoxUserQuery", "");
    });

    //Edit Diagnosis Dialog
    var editDiagnosisDialogSpec = {
        template: Template.editDiagnosisDialog,
        title: function() {
//            var patient = Session.get("patient");
            var diagnosis = Session.get("selectedDiagnosis")
            if (! diagnosis) return "Edit a Condition";
            return diagnosis.objName;
        },
        modalDialogClass: "edit-condition-dialog", //optional
        modalBodyClass: "edit-condition-body", //optional
        modalFooterClass: "edit-condition-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            },
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            }
        }
    };

    editDiagnosisDialog = ReactiveModal.initDialog(editDiagnosisDialogSpec);

    editDiagnosisDialog.buttons.ok.on('click', function(button){
        console.log("Save condition = " + JSON.stringify(Session.get("selectedDiagnosis")));
        updateProperty(Session.get("selectedDiagnosis"));
        searchIsabel();
    });
});






Deps.autorun(function () {
    if (Session.get("patient") && Session.get("patient")._id) {
        Meteor.subscribe("patientDiagnoses", Session.get("patient")._id);

        Meteor.subscribe("currentPatient");
    }
});

//Meteor.subscribe("allFacts");



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
        if (! Session.get("patient") || ! Session.get("patient")._id) return;
//        var patientDiagnoses = Session.get("patientDiagnoses");
//        if (patientDiagnoses) return patientDiagnoses;
////        console.log("Meteor.user()=" + JSON.stringify(Meteor.user()));
//
////        return Entities.find({etypes: "diagnosis"}).fetch();
////        return Facts.find({pred: "diagnosis", subj: Meteor.userId(), valid: 1 }).fetch();

        var patientDiagnoses = getPatientDiagnoses(Session.get("patient")._id).fetch();
        //console.log("Found patientDiagnoses=" + JSON.stringify(patientDiagnoses));
        Session.set("patientDiagnoses", patientDiagnoses);
        return patientDiagnoses;
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
        var patient = Session.get("patient");
        var diagnosis = {
            subj: patient._id,
            subjName: patient.name,
            pred: "diagnosis",
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


Template.diagnosisItem.rendered = function() {
    timenow = new Date();
    //console.log("timenow=" + timenow + "; time=" + timenow.getTime());
    //console.log("dob=" + Session.get("patient").data.dob + "; time=" + Session.get("patient").data.dob.getTime());
    //endOfToday = new Date();
    //endOfToday.setHours(23,59,59,999);
    //noonYesterday = new Date(endOfToday).setHours(endOfToday.getHours() - 36);
    //console.log("diagnosisItem.rendered: this=" + this);





    $('.rateit').rateit();


    //'90%': [noonYesterday, 1000],
    //'95%' : [timenow.getTime(), 1000],
    //format: {
    //    to: function (value) {
    //        return value + ',-';
    //    },
    //    from: function (value) {
    //        return value.replace(',-', '');
    //    }
    //}
    //format: wNumb({
    //    decimals: 0
    //})

    //this.$('.time-slider').noUiSlider({
    //    start: [Session.get("patient").data.dob.getTime(), timenow.getTime()],
    //    connect: true,
    //    step: 1,
    //    range: {
    //        'min': [Session.get("patient").data.dob.getTime()],
    //        'max': [timenow.getTime()]
    //    },
    //    format: wNumb({
    //        decimals: 0
    //    })
    //
    //})
    //.on('change', function (ev, val) {
    //        var id = ev.target.id.substring(ev.target.id.indexOf("-") + 1);
    //        //Session.set('slider', val);
    //
    //            var theDiagnosis = null;
    //        var diagnoses = Session.get("patientDiagnoses");
    //
    //        for (var di in diagnoses) {
    //            var diag = diagnoses[di];
    //            if (diag._id == id) {
    //                theDiagnosis = diag;
    //                break;
    //            }
    //        }
    //        if (! theDiagnosis) {
    //            console.error("time-slider: unable to find diagnosis: " + id);
    //        }
    //
    //        //set item dates
    //        var startVal = val[0];
    //        theDiagnosis.startFlag = 0;
    //        theDiagnosis.startDate = new Date(parseInt(startVal, 10));
    //
    //        var endVal = val[1];
    //
    //        theDiagnosis.endDate = new Date(parseInt(endVal, 10));
    //        //if (endVal == endOfToday) {
    //        //    theDiagnosis.endDate = null;
    //        //    theDiagnosis.endFlag = 1;
    //        //} else {
    //        //    theDiagnosis.endFlag = 0;
    //        //    theDiagnosis.endDate = new Date(endVal);
    //        //}
    //        updateProperty(theDiagnosis);
    //        //diagnoses[di] = theDiagnosis;
    //        //console.log("Slider ev=" + val + "; saving diagnosis=" + JSON.stringify(theDiagnosis));
    //        //Session.set("patientDiagnoses", diagnoses);
    //});


    //this.$(".time-slider").noUiSlider_pips({
    //    mode: 'steps',
    //    density: 10000
    //});

};

Template.diagnosisItem.events({
    'click .smartbio-diagnosisbtn': function(event, template) {
        event.preventDefault();
        console.log("click .smartbio-diagnosisbtn!: setting selectedDiagnosis to: " + JSON.stringify(this));
        var diagnosis = this;
        Session.set("selectedDiagnosis", diagnosis);
        setStartEndDateControls("editDiagnosisDialog");
        editDiagnosisDialog.show();
    }
});

Template.diagnosisItem.helpers({
    color: function() {
        return "color-blue";
    },

    getStartDate: function() {
        return this.startDate;
    },

    getEndDate: function() {
        return this.endDate;
    },

    frowns: function() {
        return this.num / 2;
    }
});
