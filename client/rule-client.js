
Template.rule.created = function() {
    //predicateChooser = EasySearch.getComponentInstance(
    //    { index : 'predicates', id: 'predicateChooser' }
    //);



    EasySearch.createSearchIndex('entities', {
        'field' : ['name', 'description'],
        'collection' : Entities,
        'props' : {
            'filteredCategories' : []
        },
        'query' : function (searchString) {
            // Default query that will be used for searching
            var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

            // filter for categories if set
            if (this.props.filteredCategories.length > 0) {
                query.etypes = { $in : this.props.filteredCategories };
            }

            return query;
        }
    });

    objectChooser = EasySearch.getComponentInstance(
        { index : 'entities' }
    );

    //thenObjectChooser = EasySearch.getComponentInstance(
    //    { index : 'entities', id: 'thenObjectChooser' }
    //);
};


Template.rule.events({
    'click #biolog-saveRule': function(event) {
        event.stopPropagation();
        event.preventDefault();
        var rule = Session.get("rule");
        var isValid = Rules.simpleSchema().namedContext().validate(rule);
        var keys = Rules.simpleSchema().namedContext().invalidKeys();
        console.log("keys=" + JSON.stringify(keys));
        if (!isValid) {
            var errMsg = "The following are required: "
            for (var ki in keys) {
                var key = keys[ki];
                if (ki > 0) errMsg += ", ";
                errMsg += key.name;
            }
            Session.set("errorMessage", errMsg);
            console.log("Rule form has errors: " + errMsg);
            return;
        } else {
            Session.set("errorMessages", null);
        }
        console.error("isValid=" + JSON.stringify(isValid));
        var ruleTool = new RuleTool(rule);
        ruleTool.buildIfQuery();
        ruleTool.saveRule();
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

    errorMessage: function() {
        return Session.get("errorMessage");
    },

    errorPresent: function() {
        if(Session.get("errorMessage")) {
            return "";
        }
        return "hidden";
    }

});


Template.blockDisplay.events({
    'change .selectAndOr' : function(event) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        var val = event.currentTarget.value;
        //console.log("path=" + path + "; this.path=" + this.path + "; this=" + JSON.stringify(this));
        if (this.path != path) return;
        var rule = Session.get("rule");
        this.conjunction = val;
        setValuePath(rule, path, this);
        Session.set("rule", rule);
    },

    'click .biolog-addDiagnosis': function(event, template) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        if (this.path != path) return;
        Session.set("selectedBlock", this);
        Session.set("selectedPredicate", diagnosisPredicate);
        Session.set("selectedObject", null);
        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        EasySearch.changeProperty('entities', 'filteredCategories', ["health-condition"]);
        objDialog.show();
    },

    'click .biolog-addMedication': function(event, template) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        if (this.path != path) return;
        Session.set("selectedBlock", this);
        Session.set("selectedPredicate", medicationPredicate);
        Session.set("selectedObject", null);
        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        EasySearch.changeProperty('entities', 'filteredCategories', ["medication"]);
        objDialog.show();
    },

    'click .biolog-addBlock': function(event, template) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        if (this.path != path) return;
        //console.log('click .biolog-addBlock: this=' + JSON.stringify(this));
        var rule = Session.get("rule");
//        console.log("rule=" + JSON.stringify(rule));
//        var newPath = data.path;
//        if (! newPath) newPath = "block";
        var newPath = path + ".blocks";

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
        //this.blocks.push(newBlock);
        setValuePath(rule, newPath, newBlock);
        Session.set("rule", rule);
    },

    'click .biolog-removeThisBlock': function(event, template) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        if (this.path != path) return;
        var parentPath = path;
        var deleteIndex = 0;
        if (parentPath.indexOf(".") >= 0) {
            parentPath = path.substring(0, path.lastIndexOf("."));
            deleteIndex = path.substring(path.lastIndexOf(".") + 1);
        }
        var okRemove = confirm("Are you sure you want to remove this block and ALL that it contains?");
        if (! okRemove) return false;
        var rule = Session.get("rule");
        //console.log("BEFORE: rule=" + JSON.stringify(rule));
        //var block = getValuePath(rule, path);
        //console.log("Removing: " + JSON.stringify(block));
        var blocks = getValuePath(rule, parentPath);
        console.log("deleteIndex=" + JSON.stringify(deleteIndex));
        var newBlocks = [];
        var newIndex = 0;
        for (var bi in blocks) {
            var block = blocks[bi];
            if (bi != deleteIndex) {
                block.idx = newIndex;
                block.path = parentPath + "." + newIndex;
                newBlocks.push(block);
                newIndex++;
            }
        }
        setValuePath(rule, parentPath, newBlocks);
        console.log("AFTER: rule=" + JSON.stringify(rule));
        Session.set("rule", rule);
    }
});


Template.blockDisplay.helpers({
    andSelected: function() {
        //console.log("andSelected?" + JSON.stringify(this));
        if (this.conjunction=="AND") return "selected";
        return "";
    },

    orSelected: function() {
        //console.log("orSelected?" + JSON.stringify(this));
        if (this.conjunction=="OR") return "selected";
        return "";
    },

    blocks: function() {
        return this.blocks;
    },

    blockPanelColor: function() {
        var rule = Session.get("rule");
        var conjPath = this.path + ".conjunction";
        var conjunction = getValuePath(rule, conjPath);
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
        for (var i in this.clauses) {
            this.clauses[i].conjunction = this.conjunction;
        }
        return this.clauses;
    },

    displayConjunction: function() {
        var path = this.path;
        if (this.idx === 0) return "";
        return this.conjunction;
    },

    displayParentConjunction: function() {
        if (this.idx==0) return "";
        var path = this.path;
        var parentPath = path;
        if (parentPath.indexOf(".")) parentPath = parentPath.substring(0, parentPath.lastIndexOf("."));
        if (parentPath.indexOf(".")) parentPath = parentPath.substring(0, parentPath.lastIndexOf("."));
        var conjPath = parentPath + ".conjunction";
        //var idxPath = parentPath + ".idx";
        var rule = Session.get("rule");
        //var idx = getValuePath(rule, idxPath);
        var conjunction = getValuePath(rule, conjPath);
        //if (this.idx === 0) return "";
        return conjunction;
    },

    conjunctionBeforeBlocks: function() {
        if (this.blocks && this.blocks.length > 0) return this.conjunction;
        return "";
    }
});

Template.clauseDisplay.events({
    'click .biolog-deleteObjBtn': function(event) {
        event.stopPropagation();
        event.preventDefault();
        var path=event.currentTarget.id;
        //console.log('click .biolog-deleteObjBtn: path=' + path + '; this=' + JSON.stringify(this));
        var parentPath = path;
        var deleteIndex = 0;
        if (parentPath.indexOf(".") >= 0) {
            parentPath = path.substring(0, path.lastIndexOf("."));
            deleteIndex = path.substring(path.lastIndexOf(".") + 1);
        }
        //var okRemove = confirm("Are you sure you want to remove this block and ALL that it contains?");
        //if (! okRemove) return false;
        var rule = Session.get("rule");
        var clauses = getValuePath(rule, parentPath);
        //console.log("parentPath=" + parentPath + "; deleteIndex=" + JSON.stringify(deleteIndex));
        var newClauses = [];
        var newIndex = 0;
        for (var ci in clauses) {
            var clause = clauses[ci];
            if (ci != deleteIndex) {
                clause.idx = newIndex;
                clause.path = parentPath + "." + newIndex;
                newClauses.push(clause);
                newIndex++;
            }
        }
        setValuePath(rule, parentPath, newClauses);
        //console.log("AFTER: rule=" + JSON.stringify(rule, null, "  "));
        Session.set("rule", rule);
    }
});

Template.clauseDisplay.helpers({
//    showConjunction: function() {
////        var block = Session.get("selectedBlock");
//        if (this.idx === 0) return "";
//        return this.conjunction;
//    },

    notHidden: function() {
        if (this.negated) return "";
        return "hidden";
    },

    parentPath: function() {
        return this.path;
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
        if (! pred) return alert("Please select a property");

        var rule = Session.get("rule");
//        var block = Session.get("selectedBlock");
//        var block = theBlock;
//        console.log("valueSelector:
        var block = Session.get("selectedBlock");

        if (! block.clauses) block.clauses = [];
        var idx = block.clauses.length;
        var clausePath = block.path + ".clauses." + idx;
        var clause = {
            idx: idx,
            negated: false,
            pred: pred,
            object: this,
            path: clausePath
        };
        block.clauses[idx] = clause;

        Session.set("selectedObject", this);
        //block.clauses.push(clause);
        //console.log("valueSelector: block=" + JSON.stringify(block, null, "  "));
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


Template.thenValueSelector.created = function() {
    var instance = EasySearch.getComponentInstance(
        { id : 'objectChooser', index : 'entities' }
    );
    instance.on('searchingDone', function (searchingIsDone) {
        if (searchingIsDone) Session.set("selectedThenObject", null);
    });
};

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



Template.consequent.events({
    'click .biolog-addFlag': function(event) {
        event.stopPropagation();
        event.preventDefault();
        Session.set("selectedThenPredicate", flagPredicate);
        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        EasySearch.changeProperty('entities', 'filteredCategories', ["flag"]);
        thenObjDialog.show();
    },

    'click .biolog-addDiagnosis': function(event) {
        event.stopPropagation();
        event.preventDefault();
        Session.set("selectedThenPredicate", diagnosisPredicate);
        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        EasySearch.changeProperty('entities', 'filteredCategories', ["health-condition"]);
        thenObjDialog.show();
    },

    'click .biolog-addMeasurement': function(event) {
        event.stopPropagation();
        event.preventDefault();
        Session.set("selectedThenPredicate", diagnosisPredicate);
        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        EasySearch.changeProperty('entities', 'filteredCategories', ["measurement"]);
        thenObjDialog.show();
    }
});


Template.thenValueSelector.events({
    'click .biolog-clauseObjBtn': function(event, template) {
        var pred = Session.get("selectedThenPredicate");
        if (! pred) return alert("Please select a property");

        var rule = Session.get("rule");
        if (! rule.then) rule.then = [];
        var idx = block.then.length;
        var thenItem = {
            idx: idx,
            pred: pred,
            object: this
        };
        rule.then[idx] = thenItem;

        Session.set("selectedThenObject", this);
        Session.set("rule", rule);

        var instance = EasySearch.getComponentInstance(
            { id : 'objectChooser', index : 'entities' }
        );
        instance.clear();
        //TODO clear the search box and focus on it
    }
});

Template.thenValueSelector.helpers({
    selectedObjName: function() {
        var selectedObject = Session.get("selectedThenObject");
        if (!selectedObject) return "";
        return selectedObject.name;
    },

    hideObjectIfNoneSelected: function() {
        var selectedObject = Session.get("selectedThenObject");
        if (selectedObject) return "";
        return "hidden";
    }
});