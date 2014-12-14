Template.formEtypeInsert.events({'submit form': function (event, template) {
    event.preventDefault();
    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }
    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");
    var obj = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id
    };
    var validationError = false;
    if (! Etypes.simpleSchema().namedContext().validateOne(obj, "description")) {
        Session.set("error-readlbio-entity-name", "Please enter a name");
        validationError = true;
    }
    if (validationError) return;
    Meteor.call("addEtype", obj, function(error, result) {
        // display the error to the user and abort
        if (error)
            return alert(error.reason);
        console.log("addEtype returns: " + result);
    });
}});


Template.listMyEtypes.helpers({
    etypes: function(){
        return Etypes.find().fetch();
    }
});

//Template.etypeButton.helpers({
//    getIconForEtype: function(event) {
//        console.log("getIconForEtype: selectedEtypeId=" + selectedEtypeId);
//        if (selectedEtypeId == "etypeButton-" + this._id) return "checked";
//        return "unchecked"
//    }
//});

