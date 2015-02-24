/**
 * Created by dd on 2/24/15.
 */

Template.console.events({
    'click #biolog-healthInfo-btn': function(event) {
        ask('I am listening', function (err, result) {
            if (result && result.transcript) {
                speak(result.transcript);
                Session.set("recognizedSpeech", result.transcript);
            } else {
                speak('I did not catch that');
            }
        });
    }
});


Template.console.helpers({
    recognizedSpeech: function() {
        return Session.get("recognizedSpeech");
    }
})