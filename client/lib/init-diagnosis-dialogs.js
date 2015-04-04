
//addDiagnosisDialog = null;

//Meteor.startup(function(){
//
//
//    var addDiagnosisDialogSpec = {
//        template: Template.addDiagnosisDialog,
//        title: "Add a condition",
//        modalDialogClass: "add-condition-dialog", //optional
//        modalBodyClass: "add-condition-body", //optional
//        modalFooterClass: "add-condition-footer",//optional
//        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
//        buttons: {
//            "ok": {
//                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
//                class: 'btn-info',
//                label: 'Save'
//            },
//            "cancel": {
//                class: 'btn-danger',
//                label: 'Cancel'
//            }
//        }
//    };
//
//    addDiagnosisDialog = ReactiveModal.initDialog(addDiagnosisDialogSpec);
//
//    addDiagnosisDialog.buttons.ok.on('click', function(button){
//        addProperty(Session.get("selectedDiagnosis"));
//        searchIsabel
//    });
//
//    addDiagnosisDialog.buttons.cancel.on('click', function(button){
//        Session.set("conditionSearchBoxUserQuery", "");
//    });
//
//    //Edit Diagnosis Dialog
//    var editDiagnosisDialogSpec = {
//        template: Template.editDiagnosisDialog,
//        title: function() {
////            var patient = Session.get("patient");
//            var diagnosis = Session.get("selectedDiagnosis")
//            if (! diagnosis) return "Edit a Condition";
//            return diagnosis.objName;
//        },
//        modalDialogClass: "edit-condition-dialog", //optional
//        modalBodyClass: "edit-condition-body", //optional
//        modalFooterClass: "edit-condition-footer",//optional
//        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
//        buttons: {
//            "ok": {
//                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
//                class: 'btn-info',
//                label: 'Save'
//            },
//            "cancel": {
//                class: 'btn-danger',
//                label: 'Cancel'
//            }
//        }
//    };
//
//    editDiagnosisDialog = ReactiveModal.initDialog(editDiagnosisDialogSpec);
//
//    editDiagnosisDialog.buttons.ok.on('click', function(button){
//        console.log("Save condition = " + JSON.stringify(Session.get("selectedDiagnosis")));
//        updateProperty(Session.get("selectedDiagnosis"));
//        searchIsabel();
//    });
//});

