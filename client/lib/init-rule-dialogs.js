
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

    var saveBlock = function(block) {
        var rule = Session.get("rule");
        var blocks = rule.blocks;
        blocks[block.idx] = block;
        Session.set("rule", rule);
        Session.set("selectedPredicate", null);
        Session.set("selectedObjects", []);
        Session.set("editBlockIndex", null);

        var instance = EasySearch.getComponentInstance(
            { id : 'predicateChooser', index : 'predicates' }
        );
        instance.clear();
        document.getElementById("predicateChooser").value = "";
        var instance2 = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance2.clear();
        document.getElementById("objectChooser").value = "";
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
                closeModalOnClick: true, // if this is false, dialog doesn't close automatically on click
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

    var addBlockDialogSpec = {
        template: Template.addBlockDialog,
        title: "Add a Block",
        modalDialogClass: "add-block-dialog", //optional
        modalBodyClass: "add-block-body", //optional
        modalFooterClass: "add-block-footer",//optional
        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
        buttons: {
            "ok": {
                closeModalOnClick: false, // if this is false, dialog doesnt close automatically on click
                class: 'btn-info',
                label: 'Save'
            },
            "cancel": {
                class: 'btn-danger',
                label: 'Cancel'
            }
        }
    };

    addBlockDialog = ReactiveModal.initDialog(addBlockDialogSpec);


    addBlockDialog.buttons.ok.on('click', function(button){
        var idx = Session.get("editBlockIndex");
//        var pred = Session.get("selectedPredicate");
        var objs = Session.get("selectedObjects");

        if (!objs || objs.length===0) {
            alert("You must add at least 1 object/value");
            return false;
        }

        var ruleBefore = Session.get("rule");
        if (idx == null) idx = ruleBefore.blocks.length;
        var negated = false;

        var block = {
            objs: objs,
            negated: negated,
            idx: idx
        };

        saveBlock(block);
        addBlockDialog.hide();
    });

    addBlockDialog.buttons.cancel.on('click', function(button){
//        Session.set("blockSearchBoxUserQuery", "");
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

