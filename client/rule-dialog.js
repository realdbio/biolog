
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
        rule.booleanMode = "AND";
        Session.set("rule", rule);
    },

    'change #OrSelected' : function(event) {
        var rule = Session.get("rule");
        rule.booleanMode = "OR";
        Session.set("rule", rule);
    }


});

Template.addRuleDialog.helpers({
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

    andChecked: function() {
        var rule = Session.get("rule");
        if (! rule) return "";
        if (!rule.booleanMode) rule.booleanMode = "OR";
        Session.set("rule", rule);
        if (rule.booleanMode == "OR") return "";
        return "checked";
    },

    orChecked: function() {
        var rule = Session.get("rule");
        if (! rule) return "";
        if (!rule.booleanMode) rule.booleanMode = "OR";
        Session.set("rule", rule);
        if (rule.booleanMode == "OR") return "checked";
        return "";
    }


});

Template.clauseLister.events({
    'click .smartbio-clauseLister-deleteBtn': function(event) {
        var rule = Session.get("rule");
        var clauses = rule.clauses;
        for (var i=this.idx; i<clauses.length; i++) {
            var clause = clauses[i];
            clause.idx = clause.idx -1;
        }
        clauses.splice(this.idx, 1);
        Session.set("rule", rule);
    },

    'click .smartbio-clauseLister-editBtn': function(event, template) {
        Session.set("editClauseIndex", this.idx);
        Session.set("selectedPredicate", this.pred);
        Session.set("selectedObjects", this.objs);
        addClauseDialog.show();
    }
})

Template.clauseLister.helpers({
    clauses: function() {
        var rule = Session.get("rule");
        if (!rule) return;
        return rule.clauses;
    },

    showAnd: function() {
        if (this.idx === 0) return "";
        var rule = Session.get("rule");
        return rule.booleanMode;
    },

    showOr: function() {
        if (this.idx ===0) return "";
        return " or ";
    }
});