
dummyDob = function() {
    if (!Session) return;
    var patient = Session.get("patient");
    if (! patient) return;
    if (patient.dob) return;
    patient.dob = new Date(1969,5,1);
    Session.set("patient", patient);
};

dummyDob();

