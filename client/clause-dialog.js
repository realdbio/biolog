

Template.addClauseDialog.events({
    "submit .smartbio-new-rule": function (event) {
        // This function is called when the new task form is submitted

        // Prevent default form submit
        return false;
    },

    'click .smartbio-clausePredBtn': function(event, template) {
        event.preventDefault();
        Session.set("selectedPredicate", this);
        //set easy search to search for entities of the predicate's objectEtypes
        EasySearch.changeProperty('entities', 'etypes', this.objectEtypes);
    },

    //TODO "OR" button to add more
    'click .smartbio-clauseObjBtn': function(event, template) {
        event.preventDefault();
        var selectedObjects = Session.get("selectedObjects");
        if (!selectedObjects) selectedObjects = [];
        selectedObjects.push(this);
        Session.set("selectedObjects", selectedObjects);
    }
});


Template.addClauseDialog.helpers({
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
    }
});