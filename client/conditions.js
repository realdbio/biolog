Meteor.subscribe("myConditions");

Meteor.subscribe("allFacts");

//Meteor.subscribe("mostUsedConditions");
//Meteor.subscribe("someConditions");

Template.myConditions.events({'submit form': function (event, template) {
    event.preventDefault();
    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }
    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");
    var ent = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id,
        etype: "health-condition"
    };
    var validationError = false;
    if (! Entities.simpleSchema().namedContext().validateOne(ent, "description")) {
        Session.set("error-smartbio-entity-name", "Please enter a name");
        validationError = true;
    }
    if (validationError) return;
    Meteor.call("addEntity", ent, function(error, result) {
        // display the error to the user and abort
        if (error)
            return alert(error.reason);
//        console.log("addEntity returns: " + result);
    });
}});

Template.myConditions.helpers({
    conditions: function() {
//        return Entities.find({etypes: "health-condition"}).fetch();
        return Facts.find({pred: "health-condition", subj: Meteor.userId(), current: 1 }).fetch();
    }
});

Template.allFacts.helpers({
    facts: function() {
//        return Entities.find({etypes: "health-condition"}).fetch();
        return Facts.find().fetch();
    }
});

//Template.mostUsedConditions.helpers({
//    conditions: function(){
//        return Entities.find({etypes: "health-condition" }, {sort: [["used","desc"]]}, {limit: 20}).fetch();
//    }
//});

//Template.someConditions.helpers({
//    conditions: function(){
//        return Entities.find().fetch();
//    }
//});

Template.addConditionButton.events({
    'click #addConditionButton': function(event, template) {
        event.preventDefault();
        addConditionDialog.show();
    }
});