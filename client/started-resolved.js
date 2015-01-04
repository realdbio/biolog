
setStartEndDateControls = function(templateId) {
    var diagnosis = Session.get("selectedDiagnosis");
//    console.log("setStartEndDateControls for diagnosis=" + JSON.stringify(diagnosis));
    $('#startDate-' + templateId).data("DateTimePicker").setDate(diagnosis.startDate);
    $('#endDate-' + templateId).data("DateTimePicker").setDate(diagnosis.endDate);
    $('#sinceBirth-' + templateId).prop("checked", (diagnosis.startFlag==1));
    if (diagnosis.startFlag==1) {
        $('#startDate-' + templateId).data("DateTimePicker").disable();
    } else {
        $('#startDate-' + templateId).data("DateTimePicker").enable();
    }
    $('#ongoing-' + templateId).prop("checked", (diagnosis.endFlag==1));
    if (diagnosis.endFlag==1) {
        $('#endDate-' + templateId).data("DateTimePicker").disable();
    } else {
        $('#endDate-' + templateId).data("DateTimePicker").enable();
    }
};


Template.startedResolved.helpers({
    diagnosis : function() {
//        console.log("selectedDiagnosis=" + JSON.stringify(Session.get("selectedDiagnosis")));
        return Session.get("selectedDiagnosis");
    }

//    getStartDate: function() {
//        var diagnosis = Session.get("selectedDiagnosis");
//        return diagnosis.startDate;
//    },
//
//    getEndDate: function() {
//        var diagnosis = Session.get("selectedDiagnosis");
//        return diagnosis.endDate;
//    },

//    sinceBirthChecked: function() {
//        var diagnosis = Session.get("selectedDiagnosis");
//        if (!diagnosis) return "";
//        if (diagnosis.startFlag==1) return "checked";
//        return "";
//    },
//
//    ongoingChecked: function() {
//        var diagnosis = Session.get("selectedDiagnosis");
//        if (!diagnosis) return "";
//        if (diagnosis.endFlag==1) return "checked";
//        return "";
//    }
});

//Template.startedResolved.rendered = function() {
//    $('.datetimepicker').datetimepicker({
//        format: 'YYYY-MM-DD HH:MM:SS'
//    });
//};

Template.startedResolved.events({
    "change": function(event) {
        var changedElementId = event.currentTarget.id;
        var diagnosis = Session.get("selectedDiagnosis");

        if (changedElementId.indexOf("startDate")==0) {
            var val = $('#' + changedElementId).data("DateTimePicker").getDate();
            if (val) {
                diagnosis.startDate = new Date(val);
                diagnosis.startFlag = 0;
//            Session.set("startDate", new Date(val));
                Session.set("selectedDiagnosis", diagnosis);
            }
        }

        if (changedElementId.indexOf("endDate")==0) {
            var val = $('#' + changedElementId).data("DateTimePicker").getDate();
            if (val) {
                diagnosis.endDate = new Date(val);
                diagnosis.endFlag = 0;
//            Session.set("endDate", new Date(val));
                Session.set("selectedDiagnosis", diagnosis);
            }
        }

        var val = event.currentTarget.checked;
        var templateId = changedElementId.substring(changedElementId.indexOf("-") + 1);
//        console.log("templateId=" + templateId);
        if (changedElementId.indexOf("sinceBirth")==0) {
//            Session.set("beginningOfTime", val);
            if (val) {
                $('#startDate-' + templateId).data("DateTimePicker").disable();
                diagnosis.startFlag = 1;
                diagnosis.startDate = null;
            } else {
                $('#startDate-' + templateId).data("DateTimePicker").enable();
                diagnosis.startFlag = 0;
            }

            Session.set("selectedDiagnosis", diagnosis);
        }

        if (changedElementId.indexOf("ongoing")==0) {
//            Session.set("eternity", val);
            if (val) {
                $('#endDate-' + templateId).data("DateTimePicker").disable();
                diagnosis.endFlag = 1;
                diagnosis.endDate = null;
            } else {
                $('#endDate-' + templateId).data("DateTimePicker").enable();
                diagnosis.endFlag = 0;
            }

            Session.set("selectedDiagnosis", diagnosis);
        }

//        console.log("startResolved " + changedElementId + " has changed to: " + val + "; diagnosis=" + JSON.stringify(diagnosis));
//        var startDateSpecified = Session.get("beginningOfTime") || Session.get("startDate");
//        var endDateSpecified = Session.get("eternity") || Session.get("endDate");
//        Session.set("datesSpecified", startDateSpecified && endDateSpecified);
    }

//    "changeDate": function(event) {
//        var changedElementId = event.currentTarget.id;
//        console.log("Date changed: " + changedElementId);
//        console.log(changedElementId + "=" + event.date);
//    }
});