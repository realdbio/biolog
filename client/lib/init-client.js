
//addConditionDialog = null;

Meteor.startup(function(){
    addHealthCondition = function(healthCondition, user) {
        var fact = {
            subj:user.id,
            subjName:user.name,
            pred: "health-condition",
            obj: healthCondition._id,
            objName: healthCondition.name,
            text: healthCondition.name
        }
        Meteor.call("storeFact", fact);
    };

    var addConditionDialogSpec = {
        template: Template.addConditionDialog,
        title: "Add a condition",
        modalDialogClass: "add-condition-dialog", //optional
        modalBodyClass: "add-condition-body", //optional
        modalFooterClass: "add-condition-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            },
            "ok": {
                closeModalOnClick: true, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'OK'
            }

        }
    };

    addConditionDialog = ReactiveModal.initDialog(addConditionDialogSpec);

    addConditionDialog.buttons.ok.on('click', function(button){
        console.log("Selected condition = " + JSON.stringify(Session.get("selectedHealthCondition")));
        var patient = Session.get("patient");
        addHealthCondition(Session.get("selectedHealthCondition"), patient);
//        alert('ok then');
//        Session.set("conditionSearchBoxUserQuery", "");
//        var instance = EasySearch.getComponentInstance(
//            { index : 'conditions' }
//        );
//        instance.clear();
    });

    addConditionDialog.buttons.cancel.on('click', function(button){
        alert('cancel then');
        Session.set("conditionSearchBoxUserQuery", "");
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