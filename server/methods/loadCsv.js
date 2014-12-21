//path = Npm.require( 'path' ) ;
Fiber = Npm.require("fibers");

Meteor.methods({
    loadData: function () {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
//        var __dirname = path.resolve('.');
//        var csvFile = __dirname + "/data/kaiser-cmt-top2500-2014.csv";
        var csvFile = "../../../../../public/data/kaiser-cmt-top2500-2014.csv";
        console.log("csvFile=" + csvFile)
        var csvLoader = new CsvLoader(csvFile);
        csvLoader.convertToJson(function(json) {
//            console.log(JSON.stringify(json, "  "));
            var map = {
                name: "kp_patient_display_name",
                altName: "pref_term",
                synonyms: ["pref_term", "kp_clinician_display_name", "icd9-CM", "icd10-CM"],
                local: "concept_sctid"
            };
            Fiber(function() {
                csvLoader.loadKaiserJson(map, json, "kaiser-cmt-top2500-2014.csv", function() {
                    return "OK";
                });
            }).run();
        });
    }
});