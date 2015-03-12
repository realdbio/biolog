
dummyPatient = function() {
    if (!Session) return;
    var patient = Session.get("patient");
    if (! patient) return;
    if (!patient.dob) patient.dob = new Date(1969,5,1);
    if (!patient.sex) patient.sex = "f";
    if (!patient.region) patient.region = "12";
    if (!patient.pregnant) patient.pregnant = "";
    Session.set("patient", patient);
};

dummyPatient();

