
UI.registerHelper('session',function(input){
    return Session.get(input);
});

UI.registerHelper("patient", function() {
    var patient = Session.get("patient");
    if (patient) return patient;
    if (Meteor.user()) {
        var patientId = "patient/" + Meteor.user()._id;
        Meteor.call("getEntity", patientId, function(err, foundPatient) {
            if (foundPatient) {
                patient = foundPatient;
                Session.set("patient", patient);
                return callback(patient);
            }
            patient = {
                _id: patientId,
                name: Meteor.user().profile.name,
                nameLC: Meteor.user().profile.name.toLowerCase(),
                etypes: ["patient"]
            };
            Session.set("patient", patient);
            Meteor.call("addEntity", patient);
            return patient;
        });
    }
});