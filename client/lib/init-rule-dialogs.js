
//addRuleDialog = null;

Meteor.startup(function(){
    addRule = function(rule) {
        console.log("saving rule: " + JSON.stringify(rule, null, "  "));
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

    var saveClause = function(clause) {
        var rule = Session.get("rule");
        var clauses = rule.clauses;
        clauses[clause.idx] = clause;
        Session.set("rule", rule);
        Session.set("selectedPredicate", null);
        Session.set("selectedObjects", []);
        Session.set("editClauseIndex", null);

        var instance = EasySearch.getComponentInstance(
            { id : 'predicateChooser', index : 'predicates' }
        );
        instance.clear();
        var instance2 = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance2.clear();
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
        var rule = Session.get("rule");
        var ruleName = document.getElementById("ruleName").value;
        var ruleDescription = document.getElementById("ruleDescription").value;
        rule.name = ruleName;
        rule.nameLC = ruleName.toLowerCase();
        rule.description = ruleDescription;
        var ruleTool = new RuleTool(rule);
        addRule(ruleTool.prepareRule());

        //clear
        document.getElementById("ruleName").value = "";
        var ruleDescription = document.getElementById("ruleDescription").value = "";
        Session.set("rule", null);
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
        var idx = Session.get("editClauseIndex");
        var pred = Session.get("selectedPredicate");
        var objs = Session.get("selectedObjects");

        if (!pred || !objs || objs.length===0) {
            alert("You must select a property and at least 1 object/value");
            return false;
        }

        var ruleBefore = Session.get("rule");
        if (idx == null) idx = ruleBefore.clauses.length;
        var negated = false;

        var clause = {
            pred: pred,
            objs: objs,
            negated: negated,
            idx: idx
        };

        saveClause(clause);
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

