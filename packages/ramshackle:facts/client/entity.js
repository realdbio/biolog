
Meteor.subscribe("myEntities");

Template.formEntityInsert.events({'submit form': function (event, template) {
    event.preventDefault();
    if (Meteor.user() == null || Meteor.user()._id == null) {
        return;
    }
    _name = template.find("input[name=name]");
    _description = template.find("input[name=description]");
    var ent = {
        name: _name.value,
        description: _description.value,
        creator: Meteor.user()._id
    };
    var validationError = false;
    if (! Entities.simpleSchema().namedContext().validateOne(ent, "description")) {
        Session.set("error-readlbio-entity-name", "Please enter a name");
        validationError = true;
    }
    if (validationError) return;
    Meteor.call("addEntity", ent, function(error, result) {
        // display the error to the user and abort
        if (error)
            return alert(error.reason);
//        console.log("addEntity returns: " + result);
    });
}});

Template.listMyEntities.helpers({
    entities: function(){
        return Entities.find().fetch();
    }
});


Template.entityItem.rendered = function() {
    var infoItemSelector = "#realdb-btn-entity-info-" + this.data._id;
//    console.log(infoItemSelector);
    $(infoItemSelector).popover();
};




//Template.listEntities.rendered = function(){
//    //initialize popup
////    $('.realdb-btn-entity-info').popup();
////    console.log("initialized");
//
////    var queue = $('.realdb-btn-entity-info');
////        console.log("Initializing " + queue.length + " entities");
////        for (var i in queue) {
////            var item = queue[i];
////            console.log('init item ' + i + ': ' + item);
////            $(item).popup();
////        }
//};

//Template.listEntities.events({
//    'click .realdb-btn-entity-info': function(event, template){
//        var infoItemSelector = "#realdb-btn-entity-info-" + this._id;
//        console.log('this=' + this);
//        console.log('popping up: title=' + this.name + '; content=' + this.description);
////        template.$(event.currentTarget).popup({
//
//        $(infoItemSelector).popup(
//            {
////            title: this.name,
////            content: this.description,
//            on: 'click'
//        }
//        );
//
////        template.$(event.currentTarget).popup({
////            title: this.name,
////            content: this.description,
////            on: 'click'
////        });
//
////        $(event.currentTarget).popup({
////            title: this.name,
////            content: this.description,
////            on: 'click'
////        });
//
////        $(event.currentTarget).popup({
////            title: "test",
////            content: "descr",
////            on: 'click'
////        });
//    }
//});
//




//Template.listEntities.helpers({
//    entities: function(){
//        var es = Entities.find().fetch();
//        console.log("Found " + es.length + " entities");
//        if (es && es.length > 0) es[es.length-1].isLast = true;
//        return es;
//    }
//});