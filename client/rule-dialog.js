
Template.addRuleDialog.created = function() {
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


Template.addRuleDialog.events({
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
//        event.target.ruleName.value = "";

        // Prevent default form submit
        return false;
    },

    'click .smartbio-rulePredBtn': function(event, template) {
        event.preventDefault();
//        this.icon="check";
//        predicateChooser.clear();
//        var ruleTool = Session.get("ruleTool");
//        if (!rule.if) rule.if = getBaseRuleIf();
//        rule.pred = this._id;
//        rule.predicate = this;
//        Session.set("ruleTool", rule);
        Session.set("selectedPredicate", this);

        //set easy search to search for entities of the predicate's objectEtypes
        EasySearch.changeProperty('entities', 'etypes', this.objectEtypes);
    },

    'click .smartbio-ruleObjBtn': function(event, template) {
        event.preventDefault();
//        this.icon="check";
//        objectChooser.clear();
//        var ruleTool = Session.get("ruleTool");
//        rule.obj = this._id;
//        rule.object = this;
        var selectedObjects = Session.get("selectedObjects");
        if (!selectedObjects) selectedObjects = [];
        selectedObjects.push(this);
        Session.set("selectedObjects", selectedObjects);
    },

    'click #smartbio-addBtn': function(event, template) {
        console.log('click #smartbio-addBtn');
        event.preventDefault();

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
        console.log("Rule now = " + JSON.stringify(ruleTool.prepareRule(), null, "  "));
        Session.set("selectedPredicate", null);
        Session.set("selectedObjects", []);

    }
});

Template.addRuleDialog.helpers({
    etypeName: function() {
        if (!ruleTool || !ruleTool.rule) return "";
        console.log("ruleTool=" + JSON.stringify(ruleTool.rule));

        var typesStr = "";
        for (var i in ruleTool.rule.etypes) {
            var etype = ruleTool.rule.etypes[i];
            if (typesStr.length > 0) typeStr += " or ";
            typesStr += etype;
        }
        return typesStr;
    },

    addButtonEnabled: function() {
        if (Session.get("selectedPredicate") && Session.get("selectedObjects")) {
            return "";
        }
        return "disabled";
    }
});