
//ruleDialog = null;

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


    saveBlock = function(block) {
        var rule = Session.get("rule");
        if (!block.idx) block.idx = 0;
        setValuePath(rule, block.path, block);
        Session.set("rule", rule);
    };


    clearClauseSelector = function() {
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


//    var ruleDialogSpec = {
//        template: Template.ruleDialog,
//        title: "Add a Rule",
//        modalDialogClass: "add-rule-dialog", //optional
//        modalBodyClass: "add-rule-body", //optional
//        modalFooterClass: "add-rule-footer",//optional
//        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
//        buttons: {
//            "ok": {
//                closeModalOnClick: true, // if this is false, dialog doesn't close automatically on click
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
//    ruleDialog = ReactiveModal.initDialog(ruleDialogSpec);
//
//    ruleDialog.buttons.ok.on('click', function(button){
//        var rule = Session.get("rule");
//        var ruleName = document.getElementById("ruleName").value;
//        var ruleDescription = document.getElementById("ruleDescription").value;
//        rule.name = ruleName;
//        rule.nameLC = ruleName.toLowerCase();
//        rule.description = ruleDescription;
//        var ruleTool = new RuleTool(rule);
//        addRule(ruleTool.prepareRule());
//
//        //clear
//        document.getElementById("ruleName").value = "";
//        var ruleDescription = document.getElementById("ruleDescription").value = "";
//        Session.set("rule", null);
//    });
//
//    ruleDialog.buttons.cancel.on('click', function(button){
//        Session.set("ruleSearchBoxUserQuery", "");
//    });

    var blockDialogSpec = {
        template: Template.blockEdit,
        title: "Add a Block",
        modalDialogClass: "block-dialog", //optional
        modalBodyClass: "block-body", //optional
        modalFooterClass: "block-footer",//optional
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

    blockDialog = ReactiveModal.initDialog(blockDialogSpec);


    blockDialog.buttons.ok.on('click', function(button){

//        if (!objs || objs.length===0) {
//            alert("You must add at least 1 object/value");
//            return false;
//        }
//
//        var ruleBefore = Session.get("rule");
//        if (idx == null) idx = ruleBefore.blocks.length;
//        var negated = false;
//
//        var block = {
//            objs: objs,
//            negated: negated,
//            idx: idx
//        };
//
//        saveBlock(block);



        var clauses = Session.get("selectedClauses");

        if (!clauses || clauses.length===0) {
            alert("You must add at least 1 object/value");
            return false;
        }

        var block = Session.get("selectedBlock");
        var rule = Session.get("rule");

        saveBlock(block);
        clearClauseSelector();


        blockDialog.hide();
    });

    blockDialog.buttons.cancel.on('click', function(button){
//        Session.set("blockSearchBoxUserQuery", "");
    });

});

//    var clauseDialogSpec = {
//        template: Template.clauseDialog,
//        title: "Add a Clause",
//        modalDialogClass: "clause-dialog", //optional
//        modalBodyClass: "clause-dialog-body", //optional
//        modalFooterClass: "clause-dialog-footer",//optional
//        removeOnHide: false, //optional. If this is true, modal will be removed from DOM upon hiding
//        buttons: {
//            "ok": {
//                closeModalOnClick: false, // if this is false, dialog doesnt close automatically on click
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
//    clauseDialog = ReactiveModal.initDialog(clauseDialogSpec);
//
//
//    clauseDialog.buttons.ok.on('click', function(button){
//        var clauses = Session.get("selectedClauses");
//
//        if (!clauses || clauses.length===0) {
//            alert("You must add at least 1 object/value");
//            return false;
//        }
////
////        var ruleBefore = Session.get("rule");
////        if (idx == null) idx = ruleBefore.blocks.length;
////        var negated = false;
////
////        var block = {
////            objs: objs,
////            negated: negated,
////            idx: idx
////        };
//
//        var block = Session.get("selectedBlock");
//        var path = Session.get("selectedPath");
//        var rule = Session.get("rule");
//
//        saveBlock(block, path);
//        clearClauseSelector();
//        blockDialog.hide();
//    });
//
//    clauseDialog.buttons.cancel.on('click', function(button){
////        Session.set("blockSearchBoxUserQuery", "");
//    });



//    //Edit Rule Dialog
//    var editRuleDialogSpec = {
//        template: Template.editRuleDialog,
//        title: function() {
////            var patient = Session.get("patient");
//            var rule = Session.get("selectedRule")
//            if (! rule) return "Edit a Rule";
//            return rule.objName;
//        },
//        modalDialogClass: "edit-rule-dialog", //optional
//        modalBodyClass: "edit-rule-body", //optional
//        modalFooterClass: "edit-rule-footer",//optional
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
//    editRuleDialog = ReactiveModal.initDialog(editRuleDialogSpec);
//
//    editRuleDialog.buttons.ok.on('click', function(button){
//        console.log("Save rule = " + JSON.stringify(Session.get("selectedRule")));
//        updateRule(Session.get("selectedRule"));
//    });


