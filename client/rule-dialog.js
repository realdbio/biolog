Template.addRuleDialog.events({
    "submit .new-rule": function (event) {
        // This function is called when the new task form is submitted

        var name = event.target.ruleName.value;

        Tasks.insert({
            text: text,
            createdAt: new Date() // current time
        });

        // Clear form
        event.target.ruleName.value = "";

        // Prevent default form submit
        return false;
    }
});

Template.addRuleDialog.helpers({
    etypeName: function() {
        console.log("selectedRule=" + JSON.stringify(Session.get("selectedRule")));
        if (! Session.get("selectedRule") || ! Session.get("selectedRule").etypes || ! Session.get("selectedRule").etypes.length) {
            return "";
        }
        var etype = Session.get("selectedRule").etypes[0] || "";
        return etype;
    }
})