Meteor.methods({
    storeFact: function (fact) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        fact.creator = Meteor.userId();
        fact.created = new Date();
        if (!fact._id) fact._id = new Meteor.Collection.ObjectID()._str;
        if (!fact.src) fact.src = "smartbio/server/facts";
        Facts.insert(fact);
    }

//    createFactId: function(fact) {
//        var id = fact.subj + "~" + fact.pred + "~";
//        if (fact.obj) id += fact.obj;
//        else id += fact.text;
//        id +=
//    }
});

