

Template.clauseDialog.events({
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


Template.clauseDialog.helpers({
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
        if (Session.get("selectedPredicate") && Session.get("selectedClauses")) {
            return "";
        }
        return "disabled";
    },

    displayPredicate: function() {
        var selectedPredicate = Session.get("selectedPredicate");
        if (selectedPredicate) return selectedPredicate.name;
        return "";
    }
});


//Template.objectButtons.events({
//    'click .smartbio-objectButtons-deleteObjBtn': function(event) {
//        console.log('click .smartbio-objectButtons-deleteObjBtn');
//        var objects = Session.get("selectedClauses");
//        for (var i=this.idx; i<objects.length; i++) {
//            var object = objects[i];
//            object.idx = object.idx -1;
//        }
//        objects.splice(this.idx, 1);
//        Session.set("selectedClauses", objects);
//    }
//})

//Template.objectButtons.helpers({
//
//    clauseClauses: function() {
//        var selectedClauses = Session.get("selectedClauses");
//        return selectedClauses;
//    },
//
//    showOr: function() {
//        if (this.idx ===0) return "";
//        return " or ";
//    }
//});