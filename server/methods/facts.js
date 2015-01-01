Meteor.methods({
    /* save a fact and associated properties */

    /**
     * Add a fact.  No special permissions needed.  Return true if successful.
     * Increment use count for the S & O entities referenced.
     * @param fact
     * @param mode
     */
    addFact: function (fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the subject exists
        var subjId = fact.subj;
        var subj = Entities.findOne(subjId);
        if (! subj || subj.valid < 0) {
            var message = "Subject does not exist or is no longer valid";
            console.error(message);
            return { success: false, message: message};
        }

        fact.creator = Meteor.userId();
        fact.updater = Meteor.userId();
        var theDate = new Date();
        fact.created = theDate;
        fact.updated = theDate;
        if (!fact._id) fact._id = new Meteor.Collection.ObjectID()._str;
        if (!fact.source) fact.source = "smartbio/server/facts";
        console.log("Inserting fact: " + JSON.stringify(fact));
        Facts.insert(fact);

        //next update the current data for the subject entity
        var newEntityVals = {};
        var key = 'data.' + fact.pred;
        if (fact.obj) key += "." + fact.obj;
        newEntityVals[key] = fact;
        Entities.update(subjId,
            {
                $set: newEntityVals,
                $inc: { used: 1 }
            }
        );

        //next increment the use count for the object, if any
        if (fact.obj) {
            Entities.update(fact.obj,
                {
                    $inc: { used:1 }
                }
            );
        }

        return {success: true};
    },

    /**
     * Store a fact and also update a property of the subject.
     * When can properties be added?  These things must be true:
     * 1. The entity is not private, or the user is a trustee.
     * 2. The fact is current
     * 3. There is not already a property with the same signature (SPO or SP).
     *
     * First call addFact.  If this returns true, then update the property if the above conditions are met.  Return true if the property was added.
     * @param fact
     */
    addProperty: function(fact, skipFact) {
        if (! skipFact) {
            var result = this.addFact(fact);
            if (! result.success) {
                return result;
            }
        }

        if (fact.current <= 0) {
            var message = "Fact is not current: " + JSON.stringify(fact);
            console.error(message);
            return { success: false, message: message};
        }

        var subj = Entities.findOne(fact.subj);
        if (subj.editors && ! _.contains(subj.editors, Meteor.userId())) {
            var message = "User: " + Meteor.userId() + " not authorized to add property to entity: " + fact.subj;
            console.error(message);
            return { success: false, message: message};
        }

        var signature = "data." + fact.pred;
        if (fact.obj) signature += "." + fact.obj;
        if (subj[signature]) {
            var message = "Entity: " + fact.subj + " already has property: " + signature;
            console.error(message);
            return { success: false, message: message};
        }

        var newProperty = {};
        newProperty[signature] = fact;
        Entities.update(fact.subj,
            { $set: newProperty }
        );
        return {success: true};
    },

    /**
     * Update an existing fact of the same id.  First check permissions and use count.
     * If use count > 0, then fail.  Return true if successful
     */
    updateFact: function (fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        var existingFact = Facts.findOne(fact._id);

        //if previous fact not found, abort
        if (existingFact) {
            var message = "No such fact to update";
            console.error(message);
            return { success: false, message: message};
        }

        //if not permitted, abort
        if (existingFact.editors && ! _.contains(existingFact.editors, Meteor.userId())) {
            var message = "User: " + Meteor.userId() + " not authorized to update fact: " + JSON.stringify(fact);
            console.error(message);
            return { success: false, message: message};
        }

        //if new fact has different subject or predicate than previous, abort
        if (existingFact.subj != fact.subj) {
            var message = "Subjects do not match";
            console.error(message);
            return { success: false, message: message};
        }
        if (existingFact.pred != fact.pred) {
            var message = "Predicates do not match";
            console.error(message);
            return { success: false, message: message};
        }

        //if the fact is already used, then mark it as not current and create a new fact
        if (existingFact.used > 0) {
            fact._id = new Meteor.Collection.ObjectID()._str;
            var endDate = new Date();
            Facts.upsert( existingFact._id,
                {$set: {
                    outdated: endDate,
                    outdater: Meteor.userId(),
                    endDate: endDate,
                    endFlag: 0,
                    current: -1,
                    supersededBy: fact._id
                }});
        }
        console.log("Updating fact: " + JSON.stringify(fact));
        Facts.upsert( fact._id,
            {$set: {
                updated: new Date(),
                updater: Meteor.userId(),
                valid: fact.valid,
                obj: fact.obj,
                num: fact.num,
                text: fact.text,
                startDate: fact.startDate,
                startFlag: fact.startFlag,
                endDate: fact.endDate,
                endFlag: fact.endFlag
            }});

        //next update the current data for the subject
        var newFact = {};
        newFact['data.' + fact.pred] = fact;
        Entities.update(subjId,
            { $set: newFact }
        );

        //next update the used count for the object, if warranted
        if (fact.obj && fact.obj != existingFact.obj) {
            Entities.update(fact.obj, { $inc: { used: 1 } } );
        }

        if (existingFact.obj && fact.obj != existingFact.obj) {
            Entities.update(existingFact.obj, { $inc: { used: -1 } });
        }
    },


    /**
     * First call updateFact.  If this returns true, then update the property if these conditions are met.
     * 1. The entity is not private, or the user is a trustee.
     * 2. The fact is current
     * 3. There is not already a property with the same signature (SPO or SP).
     *
     * Return true if the property was updated.
     * @param fact
     * @param skipFact if true, do not update the fact, only update the property
     */
    updateProperty: function(fact, skipFact) {
        if (! skipFact) {
            var result = this.updateFact(fact);
            if (! result.success) {
                return result;
            }
        }

        return this.addProperty(fact, true);
    },


    /**
     * If fact with same SP does not exist, then return addFact().
     * If the the user is permitted (owner of the subject entity) then invalidate past facts with that SP and then call addFact.
     * Return true if the fact was added.
     */
    setFact: function(fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            var message = "User not authenticated";
            console.error(message);
            return { success: false, message: message};
        }

        //make sure the subject exists
        var subjId = fact.subj;
        var subj = Entities.findOne(subjId);
        if (! subj || subj.valid < 0) {
            var message = "Subject does not exist or is no longer valid";
            console.error(message);
            return { success: false, message: message};
        }

        //find other existing valid facts with the same SP and invalidate them
        //TODO

        fact.creator = Meteor.userId();
        fact.updater = Meteor.userId();
        var theDate = new Date();
        fact.created = theDate;
        fact.updated = theDate;
        if (!fact._id) fact._id = new Meteor.Collection.ObjectID()._str;
        if (!fact.source) fact.source = "smartbio/server/facts";
        console.log("Inserting fact: " + JSON.stringify(fact));
        Facts.insert(fact);

        //next update the current data for the subject entity
        var newEntityVals = {};
        var key = 'data.' + fact.pred;
        if (fact.obj) key += "." + fact.obj;
        newEntityVals[key] = fact;
        Entities.update(subjId,
            {
                $set: newEntityVals,
                $inc: { used: 1 }
            }
        );

        //next increment the use count for the object, if any
        if (fact.obj) {
            Entities.update(fact.obj,
                {
                    $inc: { used:1 }
                }
            );
        }

        return {success: true};
    }
});

