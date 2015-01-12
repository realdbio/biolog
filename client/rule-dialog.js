
Template.addRuleDialog.created = function() {
    var predicateChooser = EasySearch.getComponentInstance(
        { index : 'predicates', id: 'predicateChooser' }
    );

    var objectChooser = EasySearch.getComponentInstance(
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
    "submit .new-rule": function (event) {
        // This function is called when the new task form is submitted

        var name = event.target.ruleName.value;

        var subjectEtype = {

        };


        // Clear form
        event.target.ruleName.value = "";

        // Prevent default form submit
        return false;
    },

    'click .smartbio-rulePredBtn': function(event, template) {
        event.preventDefault();
        this.icon="check";
        var rule = Session.get("selectedRule");
        rule.pred = this._id;
        rule.predicate = this;
        Session.set("selectedRule", rule);

        //set easy search to search for entities of the predicate's objectEtypes
        EasySearch.changeProperty('entities', 'etypes', rule.predicate.objectEtypes);
    },

    'click .smartbio-ruleObjBtn': function(event, template) {
        event.preventDefault();
        this.icon="check";
        var rule = Session.get("selectedRule");
        rule.obj = this._id;
        rule.object = this;
        Session.set("selectedRule", rule);
    }
});

Template.addRuleDialog.helpers({
    etypeName: function() {
        console.log("selectedRule=" + JSON.stringify(Session.get("selectedRule")));
        if (! Session.get("selectedRule") || ! Session.get("selectedRule").etypes || ! Session.get("selectedRule").etypes.length) {
            return "";
        }
        var etype = Session.get("selectedRule").etypes[0] || "";
        return etype;
    }
})