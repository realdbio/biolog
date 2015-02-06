Meteor.startup(function() {

    diagnosisPredicate = {
        _id: "patient/diagnosis",
        name: "diagnosis",
        nameLC: "diagnosis",
        description: "a health condition that a person (patient) has or had in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["health-condition"],
        creator: "dave"
    };

    medicationPredicate = {
        _id: "patient/medication",
        name: "medication",
        nameLC: "medication",
        description: "a medication that a person (patient) takes or has taken in the past",
        subjectEtypes: ["patient"],
        objectEtypes: ["medication"],
        creator: "dave"
    };

});