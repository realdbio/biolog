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
    isabel: function(dob, sex, pregnant, region, diagnoses) {
        this.unblock();
        console.log("isabel - config=" + JSON.stringify(appConfig()));
        var isabelId = appConfig().isabelId;
        var isabelPassword = appConfig().isabelPassword;
        var url = "http://www.isabelhealthcare.com/private/emr_diagnosis.jsp?" +
            "searchType=0&specialties=28&action=login&id=" + isabelId + "&password=" + isabelPassword +
            "&dob=" + dob + "&sex=" + sex + "&pregnant=" + pregnant + "&region=" + region +
            "&querytext=" + diagnoses + "&suggest=Suggest+Differential+Diagnosis&web_service=json" +
            "&flag=sortbyRW_advanced&callback=isabel";
        console.log("Isabel URL: " + url);

        return HTTP.get(url,{timeout: 20000});
    }
});