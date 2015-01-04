
//addDiagnosisDialog = null;

Meteor.startup(function(){
    addDiagnosis = function(diagnosis) {
        console.log("addDiagnosis: " + JSON.stringify(diagnosis));
//        var diagnosis = Session.get("selectedDiagnosis");

        Meteor.call("addProperty", diagnosis, function(response) {
            if (response) {
                if (response.success) {
                    console.log("Successfully added fact and property.")
                } else {
                    console.log("Error adding property: " + response.error);
                }
            }
        });
    };

    updateDiagnosis = function(diagnosis) {
        console.log("updateDiagnosis: " + JSON.stringify(diagnosis));
//        var fact = {
//            _id: diagnosis._id,
//            subj:user.id,
//            subjName:user.name,
//            pred: "health-condition",
//            obj: diagnosis.obj,
//            objName: diagnosis.name,
//            text: diagnosis.name,
//            startFlag: diagnosis.startFlag,
//            endFlag: diagnosis.endFlag,
//            startDate: diagnosis.startDate,
//            endDate: diagnosis.endDate
//        }
        //update the fact in the ui
//        diagnosis.subj = user.id;
//        diagnosis.subjName = user.name;

        Meteor.call("updateProperty", diagnosis, function(response) {
            if (response) {
                if (response.success) {
                    console.log("Successfully inserted fact and updated property.")
                } else {
                    console.log("Error updating property: " + response.error);
                }
            }
        });
    };

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
//        console.log("Selected condition = " + JSON.stringify(Session.get("selectedDiagnosis")));
//        var patient = Session.get("patient");
        addDiagnosis(Session.get("selectedDiagnosis"));
//        alert('ok then');
//        Session.set("conditionSearchBoxUserQuery", "");
//        var instance = EasySearch.getComponentInstance(
//            { index : 'conditions' }
//        );
//        instance.clear();
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
//        var patient = Session.get("patient");
        updateDiagnosis(Session.get("selectedDiagnosis"));
//        alert('ok then');
//        Session.set("conditionSearchBoxUserQuery", "");
//        var instance = EasySearch.getComponentInstance(
//            { index : 'conditions' }
//        );
//        instance.clear();
    });

});

Handlebars.registerHelper('session',function(input){
    return Session.get(input);
});

Handlebars.registerHelper("patient", function() {
    var patient = Session.get("patient");
    if (patient) return patient;
    if (Meteor.user()) {
        var patientId = "patient/" + Meteor.user()._id;
        Meteor.call("getEntity", patientId, function(err, foundPatient) {
            if (foundPatient) {
                patient = foundPatient;
                Session.set("patient", patient);
                return callback(patient);
            }
            patient = {
                _id: patientId,
                name: Meteor.user().profile.name,
                nameLC: Meteor.user().profile.name.toLowerCase(),
                etypes: ["patient"]
            };
            Session.set("patient", patient);
            Meteor.call("addEntity", patient);
            return patient;
        });
    }
});