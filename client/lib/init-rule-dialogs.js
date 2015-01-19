
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

    addClause = function() {
        //TODO support negation by checking a box
        var pred = Session.get("selectedPredicate");
        var objs = Session.get("selectedObjects");
        var negated = false;
        var clause = {
            pred: pred,
            objs: objs,
            negated: negated
        };
//        console.log("adding clause to ruleTool=" + JSON.stringify(ruleTool));
        ruleTool.addClause(clause);
        var rule = ruleTool.prepareRule();
        Session.set("rule", rule);
        console.log("Rule now = " + JSON.stringify(rule, null, "  "));
        Session.set("selectedPredicate", null);
        Session.set("selectedObjects", []);
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

    var addClauseDialogSpec = {
        template: Template.addClauseDialog,
        title: "Add a Clause",
        modalDialogClass: "add-clause-dialog", //optional
        modalBodyClass: "add-clause-body", //optional
        modalFooterClass: "add-clause-footer",//optional
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

    addClauseDialog = ReactiveModal.initDialog(addClauseDialogSpec);

    addClauseDialog.buttons.ok.on('click', function(button){
        //TODO check to see if rule is complete
        addClause();
    });

    addClauseDialog.buttons.cancel.on('click', function(button){
//        Session.set("clauseSearchBoxUserQuery", "");
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

