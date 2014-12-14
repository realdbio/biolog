//Meteor.startup(function () {
//    Meteor.subscribe('myEntities');
//    Meteor.subscribe('myEtypes');
//});

Meteor.subscribe('myEntities');
Meteor.subscribe('myEtypes');

Handlebars.registerHelper('session',function(input){
    return Session.get(input);
});