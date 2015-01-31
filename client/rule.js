
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
    "submit .smartbio-new-rule": function (event) {
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

    'click #smartbio-addClauseBtn': function(event, template) {
        Session.set("editClauseIndex", null);
        addClauseDialog.show();
    },

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

Template.blockEdit.events({
    'click .smartbio-blockEdit-removeThisBtn': function(event) {
        var rule = Session.get("rule");
        var blocks = rule.blocks;
        for (var i = this.idx; i<blocks.length; i++) {
            var block = blocks[i];
            block.idx = block.idx -1;
        }
        blocks.splice(this.idx, 1);
        Session.set("rule", rule);
    },

//    'click .smartbio-blockEdit-addClauseBtn': function(event, template) {
//        Session.set("selectedBlock", this);
//        clauseDialog.show();
//    },

    'click .smartbio-blockEdit-addBlockBtn': function(event, template) {
        console.log('click .smartbio-blockEdit-addBlockBtn: this=' + JSON.stringify(this));
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
        Session.set("rule", rule);
        blockDialog.show();
    },

    'change .selectAndOr': function(event, template) {
//        console.log('change .selectAndOr: ' + JSON.stringify(event.target.value))
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
        return this.blocks;
    },

    clauses: function() {
        return this.clauses;
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
    }
});


Template.blockDisplay.events({
    'click .biolog-blockDisplay-editBlockBtn': function(event, template) {
        console.log('click .smartbio-blockDisplay-editBlockBtn: this=' + JSON.stringify(this));

        Session.set("selectedBlock", this);
        blockDialog.show();
    },

    'click .biolog-blockDisplay-removeThisBtn': function(event, template) {
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

    clauses: function() {
        return this.clauses;
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
    }
});






Template.clauseEdit.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'conditionChooser', index: 'conditions' }
    );

    instance.on('currentValue', function (val) {
        conditionSearchBoxUserQuery = val;
    });
};

Template.clauseDisplay.helpers({
    conjunctionStr: function() {
        var block = Session.get("selectedBlock");
        var rule = Session.get("rule");
        if (! block) block = rule.block;
        if (this.idx === 0) return "";
        return block.conjunction;
    },

    notHidden: function() {
        if (this.negated) return "";
        return "hidden";
    }
});

Template.clauseEdit.events({
    'click .biolog-clauseEdit-addBtn': function(event, template) {

    },

    'click .biolog-clausePredBtn': function(event, template) {
        event.preventDefault();
        Session.set("selectedPredicate", this);
        //set easy search to search for entities of the predicate's objectEtypes
        EasySearch.changeProperty('entities', 'etypes', this.objectEtypes);
    },

    //TODO "OR" button to add more
    'click .biolog-clauseObjBtn': function(event, template) {
        event.preventDefault();
        var selectedClauses = Session.get("selectedClauses");
        var pred = Session.get("selectedPredicate");
        if (!pred) return alert("Please select a property");
        if (!selectedClauses || selectedClauses.length == 0) {
            selectedClauses = [];
            this.conjunction = null;
        } else {
            this.conjunction = "OR";
        }
        this.pred = pred;

        var idx = selectedClauses.length;
        this.idx = idx;
        selectedClauses.push(this);
        Session.set("selectedClauses", selectedClauses);
    }
});

Template.clauseEdit.helpers({
    newDiagnosisName: function () {
        return conditionSearchBoxUserQuery;
    }

});


Template.valueSelector.events({
    'click .biolog-clauseObjBtn': function(event, template) {
        console.log("Save: " + JSON.stringify(this));
        var pred = Session.get("selectedPredicate");
        if (! pred) return alert("Please select a property");

        var rule = Session.get("rule");
        var block = Session.get("selectedBlock");
        if (!block) block = rule.block;
        if (! block.clauses) block.clauses = [];
        var idx = block.clauses.length;
        var clause = {
            idx: idx,
            negated: false,
            pred: pred,
            object: this
        };

        block.clauses.push(clause);
        setValuePath(rule, block.path, block);
        Session.set("rule", rule);

        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        //TODO clear the search box and focus on it
    }
});




//Template.clauseDialog.events({
//    "submit .smartbio-new-rule": function (event) {
//        // This function is called when the new task form is submitted
//
//        // Prevent default form submit
//        return false;
//    },
//
//    'click .smartbio-clausePredBtn': function(event, template) {
//        event.preventDefault();
//        Session.set("selectedPredicate", this);
//        //set easy search to search for entities of the predicate's objectEtypes
//        EasySearch.changeProperty('entities', 'etypes', this.objectEtypes);
//    },
//
//    //TODO "OR" button to add more
//    'click .smartbio-clauseObjBtn': function(event, template) {
//        event.preventDefault();
//        var selectedClauses = Session.get("selectedClauses");
//        var pred = Session.get("selectedPredicate");
//        if (!pred) return alert("Please select a property");
//        if (!selectedClauses || selectedClauses.length == 0) {
//            selectedClauses = [];
//            this.conjunction = null;
//        } else {
//            this.conjunction = "OR";
//        }
//        this.pred = pred;
//
//        var idx = selectedClauses.length;
//        this.idx = idx;
//        selectedClauses.push(this);
//        Session.set("selectedClauses", selectedClauses);
//    }
//});
//
//
//Template.clauseDialog.helpers({
//    etypeName: function() {
//        var rule = Session.get("rule");
//        if (! rule) return "";
//
//        var typesStr = "";
//        for (var i in rule.etypes) {
//            var etype = rule.etypes[i];
//            if (typesStr.length > 0) typesStr += " or ";
//            typesStr += etype;
//        }
//        return typesStr;
//    },
//
//    addButtonEnabled: function() {
//        if (Session.get("selectedPredicate") && Session.get("selectedClauses")) {
//            return "";
//        }
//        return "disabled";
//    },
//
//    displayPredicate: function() {
//        var selectedPredicate = Session.get("selectedPredicate");
//        if (selectedPredicate) return selectedPredicate.name;
//        return "";
//    }
//});

