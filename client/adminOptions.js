/**
 * Created by dd on 1/4/15.
 */

//ruleTool = {};

Template.adminOptions.events({


    'click #addRuleOption': function(event, template) {
        event.preventDefault();
//        var patient = Session.get("patient");
        var rule = {
            etypes: ["patient"]
        };
        var ruleTool = new RuleTool(rule);
        rule = ruleTool.getInitializedRule();
        Session.set("rule", rule);
//        Session.set("ruleTool", ruleTool);
//        console.log("addRuleOption: rule=" + JSON.stringify(rule));
//        setStartEndDateControls("addDiagnosisDialog");
        console.log("adminOptions: ruleTool=" + JSON.stringify(ruleTool));
        addRuleDialog.show();
    }
});