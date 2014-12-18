/**
 * Created by dd on 12/15/14.
 */

Meteor.publish("myConditions", function () {
    if (! this.userId) return;
    return Entities.find({ creator: this.userId, etype: "health-condition" });
});