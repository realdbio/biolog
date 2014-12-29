Meteor.methods({
    insertFact: function (fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
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
    },

    //Update certain fields for any fact: text, num, date fields
    updateFact: function (fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        console.log("Updating fact: " + JSON.stringify(fact));
        Facts.update( fact._id,
            {$set: {
                updated: new Date(),
                updater: Meteor.userId(),
                valid: fact.valid,
                num: fact.num,
                text: fact.text,
                startDate: fact.startDate,
                startFlag: fact.startFlag,
                endDate: fact.endDate,
                endFlag: fact.endFlag
            }});
    }

//    createFactId: function(fact) {
//        var id = fact.subj + "~" + fact.pred + "~";
//        if (fact.obj) id += fact.obj;
//        else id += fact.text;
//        id +=
//    }
});

