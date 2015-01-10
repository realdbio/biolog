Meteor.startup(function () {
    var p1 = {
        _id: "patient/diagnosis",
        name: "diagnosis",
        nameLC: "diagnosis",
        description: "a health condition that a person (patient) has or had in the past",
        etypes: ["patient"],
        creator: "dave"
    };
    Predicates.insert(p1);
});