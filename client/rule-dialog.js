
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

    'click #smartbio-addClauseBtn': function(event, template) {

        addClauseDialog.show();

//        console.log('click #smartbio-addBtn');
//        event.preventDefault();
//
//        //TODO support negation by checking a box
//        var pred = Session.get("selectedPredicate");
//        var objs = Session.get("selectedObjects");
//        var negated = false;
//        var clause = {
//            pred: pred,
//            objs: objs,
//            negated: negated
//        };
////        console.log("adding clause to ruleTool=" + JSON.stringify(ruleTool));
//        ruleTool.addClause(clause);
//        var rule = ruleTool.prepareRule();
//        Session.set("rule", rule);
//        console.log("Rule now = " + JSON.stringify(rule, null, "  "));
//        Session.set("selectedPredicate", null);
//        Session.set("selectedObjects", []);

    }
});

Template.addRuleDialog.helpers({
    etypeName: function() {
        var rule = Session.get("rule");
        if (! rule) return "";
//        console.log("etypeName: rule=" + JSON.stringify(rule));

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
    }
});


Template.clauseLister.helpers({
    clauses: function() {
        var rule = Session.get("rule");
        if (!rule) return;
        return rule.clauses;
    }
});