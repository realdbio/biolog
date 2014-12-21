Template.dataloader.events({
    "click #loadCsvButton": function(event, template) {
        event.preventDefault();
        if (Meteor.user() == null || Meteor.user()._id == null) {
            return;
        }
        Meteor.call("loadData");
    }
});