

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
        var dob = pt.data["id/dob"];
        var nickname = pt.data["id/nickname"];
        var sex = pt.data["id/sex"];
        addProperty(dob);
        addProperty(nickname);
        addProperty(sex);
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
