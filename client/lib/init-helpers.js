
UI.registerHelper('session',function(input){
    return Session.get(input);
});

UI.registerHelper("patient", function() {
    var patient = Session.get("patient");
    if (patient) return patient;
    if (Meteor.user()) {
        var patientId = "patient/" + Meteor.user()._id;
        Meteor.call("getEntity", patientId, function(err, foundPatient) {
            console.log("Patient helper: found: " + JSON.stringify(foundPatient));
            if (err) {
                console.error(err);
            }
            if (foundPatient) {
                patient = foundPatient;
                Session.set("patient", patient);
                ensureDemographics();
                return;
            }
            patient = {
                _id: patientId,
                name: Meteor.user().profile.name,
                nameLC: Meteor.user().profile.name.toLowerCase(),
                etypes: ["patient"],
                owners: [Meteor.userId()],
                valid: 1,
                data: {}
            };
            Session.set("patient", patient);
            Meteor.call("addEntity", patient);

            ensureDemographics();

            return patient;
        });
    }
});



//UI.registerHelper('each_with_index', function(cursor) {
////    var fn = options.fn, inverse = options.inverse;
//    if(!cursor) return;
//    var ret = "";
//    var idx = 0;
//    cursor.forEach(function(item){
//        idx++;
//        item.index = idx;
//        ret+=fn(item);
//    });
//    return ret;
//});