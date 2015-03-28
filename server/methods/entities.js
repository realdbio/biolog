
Meteor.methods({
    /* save an entity and associated methods */

    addEntity: function (entity) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the entity  does not already exists
        var alreadyExisting = Entities.findOne(entity._id);
        if (alreadyExisting) {
            var message = "Entity already exists";
            console.error(message);
            return { success: false, message: message};
        }

        entity.creator = Meteor.userId();
        entity.updater = Meteor.userId();
        var theDate = new Date();
        entity.created = theDate;
        entity.updated = theDate;
        if (!entity.source) entity.source = "biolog/server/entities";
        console.log("Inserting entity: " + JSON.stringify(entity));
        Entities.insert(entity);

        return {success: true};

    }
});