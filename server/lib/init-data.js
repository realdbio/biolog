Meteor.startup(function () {

    try {
        Predicates.insert(diagnosisPredicate);
    } catch (e) {
        console.error(e);
    }


    try {
        Predicates.insert(medicationPredicate);
    } catch (e) {
        console.error(e);
    }

    try {
        Predicates.insert(flagPredicate);
    } catch (e) {
        console.error(e);
    }

    try {
        Predicates.insert(measurementPredicate);
    } catch (e) {
        console.error(e);
    }

});