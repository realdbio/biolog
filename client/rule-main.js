
Template.rule.created = function() {
    predicateChooser = EasySearch.getComponentInstance(
        { index : 'predicates', id: 'predicateChooser' }
    );

    objectChooser = EasySearch.getComponentInstance(
        { index : 'entities', id: 'objectChooser' }
    );

//    predicateSearcher.on('searchingDone', function (searchingIsDone) {
//        searchingIsDone && console.log('I am done!');
//    });
//
//    predicateSearcher.on('currentValue', function (val) {
//        console.log('The user searches for ' + val);
//    });
};


Template.rule.events({
    "submit .biolog-new-rule": function (event) {
        // This function is called when the new task form is submitted

//        var name = event.target.ruleName.value;

//        var subjectEtype = {
//
//        };
//
//
//        // Clear form
//        event.target.ruleName.value = "";
//        event.target.ruleDescription.value = "";

        // Prevent default form submit
        return false;
    },

//    'click #biolog-addClauseBtn': function(event, template) {
//        Session.set("editClauseIndex", null);
//        addClauseDialog.show();
//    },

    'change #AndSelected' : function(event) {
        var rule = Session.get("rule");
        rule.conjunction = "AND";
        Session.set("rule", rule);
    },

    'change #OrSelected' : function(event) {
        var rule = Session.get("rule");
        rule.conjunction = "OR";
        Session.set("rule", rule);
    }


});

Template.rule.helpers({
    rule: function() {
        var rule = Session.get("rule");
//        console.log("rule=" + JSON.stringify(rule));
        if (!rule) {
            rule = {
                etypes: ["patient"],
                block: {
                    conjunction: "AND",
                    clauses: [],
                    blocks: [],
                    path: "block"
                }
            };
            Session.set("rule", rule);
            var ruleTool = new RuleTool(rule);
            rule = ruleTool.getInitializedRule();
            Session.set("rule", rule);
        }
        return rule;
    },

    etypeName: function() {
        var rule = Session.get("rule");
        if (! rule) return "";

        var typesStr = "";
        for (var i in rule.etypes) {
            var etype = rule.etypes[i];
            if (typesStr.length > 0) typesStr += " or ";
            typesStr += etype;
        }
        return typesStr;
    },

    addButtonEnabled: function() {
        if (Session.get("selectedPredicate") && Session.get("selectedObjects")) {
            return "";
        }
        return "disabled";
    },

    blockPanelColor: function() {
        if (this.conjunction == "AND") {
            return "alert alert-info";
        }
        return "alert alert-success";
    }
});


Template.blockEdit.helpers({
    getSelectedBlock: function() {
        return Session.get("selectedBlock");
    }
});


Template.blockEdit.events({
    'click .biolog-blockEdit-removeThisBtn': function(event) {
        var rule = Session.get("rule");
        var blocks = rule.blocks;
        for (var i = this.idx; i<blocks.length; i++) {
            var block = blocks[i];
            block.idx = block.idx -1;
        }
        blocks.splice(this.idx, 1);
        Session.set("rule", rule);
    },
    'click .biolog-blockEdit-addBlockBtn': function(event, template) {
        console.log('click .biolog-blockEdit-addBlockBtn: this=' + JSON.stringify(this));
        var rule = Session.get("rule");
        console.log("rule=" + JSON.stringify(rule));
        var newPath = this.path;
        if (! newPath) newPath = "block";
        newPath += ".blocks";

        if (!this.blocks) this.blocks = [];
        var idx = this.blocks.length;
        newPath += "." + idx;
        var conj = "OR";
        if (this.conjunction == "OR") conj = "AND";
        var newBlock = {
            conjunction: conj,
            clauses: [],
            blocks: [],
            path: newPath,
            idx: idx
        };
        //save the block
        //TODO - are both of lines these necessary?
        this.blocks.push(newBlock);
        setValuePath(rule, newPath, newBlock);
        Session.set("selectedBlock", newBlock);
        Session.set("selectedObject", null);
        Session.set("rule", rule);
        blockDialog.show();
    },
    'change .selectAndOr': function(event, template) {
        var rule = Session.get("rule");
        this.conjunction = event.target.value;
        setValuePath(rule, this.path, this);
        Session.set("rule", rule);
    },
    'click .biolog-blockEdit-removeThisBtn': function(event, template) {
        if (! confirm("Are you sure you want to remove this block and ALL that it contains?")) return;
        console.log("Removing: " + JSON.stringify(this));
        var rule = Session.get("rule");
        setValuePath(rule, this.path, null);
        Session.set("rule", rule);
    }
});


Template.blockEdit.helpers({
    andSelected: function() {
//        console.log("andSelected?" + this.conjunction);
        if (this.conjunction == "OR") return "";
        return "checked";
    },

    orSelected: function() {
//        console.log("orSelected?" + this.conjunction);
        if (this.conjunction == "OR") return "checked";
        return "";
    },

    blocks: function() {
//        console.log("blockEdit: blocks: blockDialog=" + JSON.stringify(blockDialog));
        return this.blocks;
    },

    blockPanelColor: function() {
        var rule = Session.get("rule");
        if (!rule || !this.path) return "alert alert-info";
        var conjunction = getValuePath(rule, this.path).conjunction;
//        console.log("conjunction=" + conjunction);
        if (conjunction == "AND") {
            return "alert alert-info";
        }
        return "alert alert-success";
    },

    displayRemoveButton: function() {
        if (this.path == "block") return "hidden";
        return "";
    },

    clauses: function() {
        console.log("blockEdit: clauses: this=" + JSON.stringify(this, null, "  "));
        for (var i in this.clauses) {
            this.clauses[i].conjunction = this.conjunction;
        }
        return this.clauses;
    },

    displayConjunction: function() {
//        console.log("displayConjunction=" + JSON.stringify(this.conjunction));
        if (this.idx === 0) return "";
        return this.conjunction;
    }
});
//
//Template.blockListDisplay.helpers({
//    blocks: function() {
//        return this.blocks;
//    }
//});


Template.blockDisplay.events({
    'click .biolog-addDiagnosis': function(event, template) {
        Session.set("selectedBlock", this);
        Session.set("selectedPredicate", diagnosisPredicate);
        objDialog.show();
    },

    'click .biolog-addMedication': function(event, template) {
        Session.set("selectedBlock", this);
        Session.set("selectedPredicate", medicationPredicate);
        objDialog.show();
    },

    'click .biolog-addBlock': function(event, template) {
        console.log('click .biolog-addBlock: this=' + JSON.stringify(this));
        var rule = Session.get("rule");
//        console.log("rule=" + JSON.stringify(rule));
        var newPath = this.path;
        if (! newPath) newPath = "block";
        newPath += ".blocks";

        if (!this.blocks) this.blocks = [];
        var idx = this.blocks.length;
        newPath += "." + idx;
        var conj = "OR";
        if (this.conjunction == "OR") conj = "AND";
        var newBlock = {
            conjunction: conj,
            clauses: [],
            blocks: [],
            path: newPath,
            idx: idx
        };
        this.blocks.push(newBlock);
        setValuePath(rule, newPath, newBlock);
        Session.set("rule", rule);
    },
    'click .biolog-removeThisBlock': function(event, template) {
        if (! confirm("Are you sure you want to remove this block and ALL that it contains?")) return;

        console.log("Removing: " + JSON.stringify(this));
        var rule = Session.get("rule");
        setValuePath(rule, this.path, null);
        Session.set("rule", rule);
    }
});


Template.blockDisplay.helpers({
    blocks: function() {
        return this.blocks;
    },

    blockPanelColor: function() {
        if (this.conjunction == "AND") {
            return "alert alert-info";
        }
        return "alert alert-success";
    },

    displayRemoveButton: function() {
        if (this.path == "block") return "hidden";
        return "";
    },

    clauses: function() {
        for (var i in this.clauses) {
            this.clauses[i].conjunction = this.conjunction;
        }
        return this.clauses;
    },

    displayConjunction: function() {
//        console.log("displayConjunction=" + JSON.stringify(this.conjunction));
        if (this.idx === 0) return "";
        return this.conjunction;
    },

    conjunctionBeforeBlocks: function() {
        if (this.blocks && this.blocks.length > 0) return this.conjunction;
        return "";
    }
});



//Template.clauseListDisplay.helpers({
//    showClauseConjunction: function() {
//        console.log("showClauseConjunction=" + JSON.stringify(this));
//        return this.conjunction;
//    }
//});



Template.clauseEdit.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'conditionChooser', index: 'conditions' }
    );

    instance.on('currentValue', function (val) {
        conditionSearchBoxUserQuery = val;
    });
};

Template.clauseDisplay.helpers({
    showConjunction: function() {
//        var block = Session.get("selectedBlock");
        if (this.idx === 0) return "";
        return this.conjunction;
    },

    notHidden: function() {
        if (this.negated) return "";
        return "hidden";
    }
});



Template.clauseEdit.helpers({
    newDiagnosisName: function () {
        return conditionSearchBoxUserQuery;
    }

});

Template.predicateSelector.created = function() {
    var instance = EasySearch.getComponentInstance(
        { id : 'predicateChooser', index : 'predicates' }
    );
    instance.on('searchingDone', function (searchingIsDone) {
        if (searchingIsDone) Session.set("selectedPredicate", null);
    });
};

Template.predicateSelector.events({
    'click .biolog-clausePredBtn': function(event, template) {
        event.preventDefault();
        Session.set("selectedPredicate", this);
        //set easy search to search for entities of the predicate's objectEtypes
        EasySearch.changeProperty('entities', 'etypes', this.objectEtypes);

        var instance = EasySearch.getComponentInstance(
            { id : 'predicateChooser', index : 'predicates' }
        );
        instance.clear();
    }
});

Template.predicateSelector.helpers({
    selectedPredName: function() {
        var selectedPredicate = Session.get("selectedPredicate");
        if (!selectedPredicate) return "";
        return selectedPredicate.name;
    },

    hidePredIfNoneSelected: function() {
        var selectedPredicate = Session.get("selectedPredicate");
        if (selectedPredicate) return "";
        return "hidden";
    }
});

Template.valueSelector.created = function() {
    var instance = EasySearch.getComponentInstance(
        { id : 'objectChooser', index : 'entities' }
    );
    instance.on('searchingDone', function (searchingIsDone) {
        if (searchingIsDone) Session.set("selectedObject", null);
    });
};

Template.valueSelector.events({
    'click .biolog-clauseObjBtn': function(event, template) {
//        console.log('click .biolog-clauseObjBtn: this=' + JSON.stringify(this));
        var pred = Session.get("selectedPredicate");
        if (! pred) return alert("Please select a property, to the left");

        var rule = Session.get("rule");
//        var block = Session.get("selectedBlock");
//        var block = theBlock;
//        console.log("valueSelector:
        var block = null;
        console.log("valueSelector: template.data=" + JSON.stringify(template.data, null, "  "));
        if (template.data && template.data.path) {
            block = getValuePath(rule, template.data.path);
        } else {
            block = Session.get("selectedBlock");
        }


//        if (!block) block = rule.block;
        if (! block.clauses) block.clauses = [];
        var idx = block.clauses.length;
        var clause = {
            idx: idx,
            negated: false,
            pred: pred,
            object: this
        };
        block.clauses[idx] = clause;

        Session.set("selectedObject", this);
        block.clauses.push(clause);
        console.log("valueSelector: block=" + JSON.stringify(block, null, "  "));
        Session.set("selectedBlock", block);
        setValuePath(rule, block.path, block);
//        console.log("Added to the clauses.  Rule=" + JSON.stringify(rule));
        Session.set("rule", rule);

        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        //TODO clear the search box and focus on it
    }
});


Template.valueSelector.helpers({
    selectedObjName: function() {
        var selectedObject = Session.get("selectedObject");
        if (!selectedObject) return "";
        return selectedObject.name;
    },

    hideObjectIfNoneSelected: function() {
        var selectedObject = Session.get("selectedObject");
        if (selectedObject) return "";
        return "hidden";
    }
});