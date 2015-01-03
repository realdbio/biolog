/**
 * Created by dd on 12/15/14.
 */

Meteor.publish("myDiagnoses", function () {
    if (! this.userId) return;
//    return Entities.find({ creator: this.userId, etype: "health-condition" });
    return Facts.find({pred: "diagnosis", subj: this.userId, current: 1, valid: 1 });
});

//Meteor.publish("mostUsedConditions", function (count) {
//    return Entities.find({etypes: "health-condition" }, {sort: [["used","desc"]]}, {limit: 20});
//});

Meteor.publish("allFacts", function () {
//    if (! this.userId) return;
//    return Entities.find({ creator: this.userId, etype: "health-condition" });
    return Facts.find();
});

//Meteor.publish("currentPatient"), function() {
//    return Entities.find({etypes: "patient" }, {sort: [["used","desc"]]}, {limit: 20});
//});
