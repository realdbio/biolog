Meteor.subscribe("myConditions");

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
    conditions: function(){
        return Entities.find({ etype: "health-condition" }).fetch();
    }
});

Template.addConditionButton.events({
    'click #addConditionButton': function(event, template) {
        event.preventDefault();
        addConditionDialog.show();
    }
});