Meteor.startup(function () {

    try {
        Predicates.insert(diagnosisPredicate);
    } catch (e) {
        //unable
    }


    try {
        Predicates.insert(medicationPredicate);
    } catch (e) {
        //unable
    }

});