
//addDiagnosisDialog = null;

Meteor.startup(function(){
    insertDiagnosis = function(diagnosis) {
        console.log("insertDiagnosis: " + JSON.stringify(diagnosis));
//        var diagnosis = Session.get("selectedDiagnosis");

        Meteor.call("insertFact", diagnosis);
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

        Meteor.call("updateFact", diagnosis);
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
        console.log("Selected condition = " + JSON.stringify(Session.get("selectedDiagnosis")));
//        var patient = Session.get("patient");
        insertDiagnosis(Session.get("selectedDiagnosis"));
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
    if ((! patient || ! patient.id) && Meteor.user()) {
        patient = {
            id: Meteor.user()._id,
            name: Meteor.user().profile.name
        };
        Session.set("patient", patient);
    }
    return patient;
});