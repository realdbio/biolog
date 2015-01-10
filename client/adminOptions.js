/**
 * Created by dd on 1/4/15.
 */

Template.adminOptions.events({


    'click #addRuleOption': function(event, template) {
        event.preventDefault();
//        var patient = Session.get("patient");
        var rule = {
            etypes: ["patient"]
        };
        Session.set("selectedRule", rule);
//        console.log("addRuleOption: rule=" + JSON.stringify(rule));
//        setStartEndDateControls("addDiagnosisDialog");
        addRuleDialog.show();
    }
});