
//addRuleDialog = null;

Meteor.startup(function(){
    addRule = function(rule) {
        Meteor.call("addRule", rule, function(response) {
            if (response) {
                if (response.success) {
                    console.log("Successfully added fact and property.")
                } else {
                    console.log("Error adding property: " + response.error);
                }
            }
        });
    };

    updateRule = function(rule) {
        Meteor.call("updateRule", rule, function(response) {
            if (response) {
                if (response.success) {
                    console.log("Successfully updated rule.")
                } else {
                    console.log("Error updating rule: " + response.error);
                }
            }
        });
    };

    var addRuleDialogSpec = {
        template: Template.addRuleDialog,
        title: "Add a Rule",
        modalDialogClass: "add-rule-dialog", //optional
        modalBodyClass: "add-rule-body", //optional
        modalFooterClass: "add-rule-footer",//optional
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

    addRuleDialog = ReactiveModal.initDialog(addRuleDialogSpec);

    addRuleDialog.buttons.ok.on('click', function(button){
        addRule(Session.get("selectedRule"));
    });

    addRuleDialog.buttons.cancel.on('click', function(button){
        Session.set("ruleSearchBoxUserQuery", "");
    });

    //Edit Rule Dialog
    var editRuleDialogSpec = {
        template: Template.editRuleDialog,
        title: function() {
//            var patient = Session.get("patient");
            var rule = Session.get("selectedRule")
            if (! rule) return "Edit a Rule";
            return rule.objName;
        },
        modalDialogClass: "edit-rule-dialog", //optional
        modalBodyClass: "edit-rule-body", //optional
        modalFooterClass: "edit-rule-footer",//optional
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

    editRuleDialog = ReactiveModal.initDialog(editRuleDialogSpec);

    editRuleDialog.buttons.ok.on('click', function(button){
        console.log("Save rule = " + JSON.stringify(Session.get("selectedRule")));
        updateRule(Session.get("selectedRule"));
    });
});

