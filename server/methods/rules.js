Meteor.methods({
    /* save an rule and associated methods */

    addRule: function (rule) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the rule  does not already exists
        var alreadyExisting = Rules.findOne(rule._id);
        if (alreadyExisting) {
            var message = "Rule already exists";
            console.error(message);
            return { success: false, message: message};
        }

        rule._id = new Meteor.Collection.ObjectID()._str;
        rule.creator = Meteor.userId();
        rule.updater = Meteor.userId();
        var theDate = new Date();
        rule.created = theDate;
        rule.updated = theDate;
        if (!rule.source) rule.source = "smartbio/server/rules";
        console.log("Inserting rule: " + JSON.stringify(rule));
        Entities.insert(rule);

        return {success: true};

    }
});