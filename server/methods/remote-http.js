/**
 * Created by dd on 3/11/15.
 */

isabelCallback = function(error, result) {

    if (error) {
        console.log("\n\nIIIIIIIIIII isabelCallback received ERROR from Isabel: " + JSON.stringify(error));
    }
    if (result) {
        console.log("\n\nIIIIIIIIIII isabelCallback received RESULT from Isabel: " + JSON.stringify(result, null, "  "));
    }
};

Meteor.methods({
    isabel: function(clientCallback) {
        this.unblock();
        return HTTP.get(
            "http://www.isabelhealthcare.com/private/emr_diagnosis.jsp?searchType=0&specialties=28&action=login&id=40744&password=isabel15&dob=19870828&sex=m&pregnant=n&region=1&querytext=cold,cough,fever,chills&suggest=Suggest+Differential+Diagnosis&web_service=json&flag=sortbyRW_advanced&callback=isabel",
            {timeout: 20000}
        );
    }
});