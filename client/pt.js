Meteor.startup(function() {

    //var selectPatientDialogSpec = {
    //    id: "patientDialog",
    //    template: Template.patientSelector,
    //    title: "Who is the patient?",
    //    modalDialogClass: "patient-dialog", //optional
    //    modalBodyClass: "patient-dialog-body", //optional
    //    modalFooterClass: "patient-dialog-footer",//optional
    //    removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
    //    buttons: {
    //        "ok": {
    //            closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
    //            class: 'btn-info',
    //            label: 'Save'
    //        },
    //        "cancel": {
    //            class: 'btn-default btn-sm',
    //            label: 'Close'
    //        }
    //    }
    //};
    //
    //selectPatientDialog = ReactiveModal.initDialog(selectPatientDialogSpec);
    //
    //selectPatientDialog.buttons.ok.on('click', function(button){
    //    console.log("Save patient = " + JSON.stringify(Session.get("editPatient")));
    //    Meteor.call("addEntity", Session.get("editPatient"));
    //});
    //
    //var selectPatient = function() {
    //    if (!Session) return;
    //    var patient = Session.get("patient");
    //    if (patient) return;
    //
    //    //load pt from DB
    //    var patients = getUserPatients(Meteor.userId());
    //    //if no patients defined, create one
    //    if (!patients) {
    //        var pt = {
    //            etypes: ["patient"],
    //            _id: "person/" + Meteor.userId(),
    //            owners: [Meteor.userId()],
    //            valid: 1,
    //            data: {}
    //
    //        };
    //    }
    //
    //    if (patients.length == 1) {
    //        Session.set("patient", patients[0]);
    //        return;
    //    }
    //    //multiple patients. need to select one
    //    selectPatientDialog.show();
    //};



    var patientDemographicsDialogSpec = {
        id: "patientDemogrpahicsDialog",
        template: Template.patientDemographics,
        title: "Demographics",
        modalDialogClass: "patient-demographics-dialog", //optional
        modalBodyClass: "patient-demographics-dialog-body", //optional
        modalFooterClass: "patient-demographics dialog-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            },
            "cancel": {
                class: 'btn-default btn-sm',
                label: 'Close'
            }
        }
    };

    patientDemographicsDialog = ReactiveModal.initDialog(patientDemographicsDialogSpec);

    //selectPatient();

    patientDemographicsDialog.buttons.ok.on('click', function(button) {
        var pt = Session.get("patient");
        //console.log("Saving pt:" + JSON.stringify(pt));
        var dob = getValuePath(pt, "data['id/dob']");
        var nickname = getValuePath(pt, "data['id/nickname']");
        var sex = getValuePath(pt, "data['id/sex']");
        setProperty(dob);
        setProperty(nickname);
        setProperty(sex);
    });

});


ensureDemographics = function() {
    var pt = Session.get("patient");
    console.log("ensureDemographics: pt=" + JSON.stringify(pt));
    if (!pt) return;
    if (!pt.data || !pt.data["id/dob"] || !pt.data["id/gender"]) {
        patientDemographicsDialog.show();
    }
};




Template.patientDemographics.events({
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
            subj: pt._id,
            pred: "id/nickname",
            text: event.target.value
        };
        setValuePath(pt, "data['id/nickname']", fact);
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed: " + JSON.stringify(Session.get("patient")));
    },

    'change #inputDob': function(event) {
        var pt = Session.get("patient");
        var fact = {
            subj: pt._id,
            pred: "id/dob",
            startDate: event.target.value,
            endFlag: 1
        };
        setValuePath(pt, "data['id/dob']", fact);
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed patient: " + JSON.stringify(Session.get("patient")));
    },

    'change input[name=inputGender]': function(event) {
        var pt = Session.get("patient");
        var fact = {
            subj: pt._id,
            pred: "id/sex",
            text: event.target.value,
            endFlag: 1
        };
        setValuePath(pt, "data['id/sex']", fact);
        Session.set("patient", pt);
        //addProperty(fact);
        console.log("Changed: " + JSON.stringify(Session.get("patient")));
    }
});


Template.patientDemographics.helpers({
    patients: function() {
        if (! Session.get("patient")) return;
        var pts = getUserPatients(Session.get("patient")._id).fetch();
        Session.set("patients", pts);
        return pts;
    },

    femaleChecked: function() {
        var sex = getValuePath(this, "data['id/sex']");
        if (!sex) return;
        if (sex.text=="female") return "checked";
        return "";
    },

    maleChecked: function() {
        var sex = getValuePath(this, "data['id/sex']");
        if (!sex) return;
        if (sex.text=="male") return "checked";
        return "";
    },

    nickname: function() {
        var nickname = getValuePath(this, "data['id/nickname']");
        if (!nickname) return;
        return nickname.text;
    },

    dob: function() {
        var dob = getValuePath(this, "data['id/dob']");
        if (!dob) return;
        var dobDate = new Date(String(dob.startDate));
        //console.log("dob: this=" + JSON.stringify(this));
        //console.log("dob: dobDate=" + (typeof dobDate) + "; dobDate=" + dobDate);
        return dobDate.toISOString().substring(0, 10);
    }
});