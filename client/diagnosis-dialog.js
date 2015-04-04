
getFrowns = function() {
    var dx = Session.get("selectedDiagnosis");
    if (!dx || !dx.num) return 0;
    return dx.num / 2;
};



Template.addDiagnosisDialog.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'conditionChooser', index: 'conditions' }
    );

//    instance.on('searchingDone', function () {
//        Session.set("diagnosisId", null);
//        Session.set("diagnosisName", null);
//    });

    instance.on('currentValue', function (val) {
//        console.log('The user searches for: ' + val);
        conditionSearchBoxUserQuery = val;
    });
};

Template.addDiagnosisDialog.helpers({
    newDiagnosisName: function () {
        return conditionSearchBoxUserQuery;
    }

//    diagnosisButtonClass: function() {
//        if (this._id && Session.get("diagnosisId") == this._id) return "btn-success";
//        if (!this._id && Session.get("diagnosisId") == "newDiagnosis") return "btn-success";
//        return "";
//    },
//    getIconForDiagnosis: function(event) {
//        if (this._id && Session.get("diagnosisId") == this._id) return "ok";
//        if (!this._id && Session.get("diagnosisId") == "newDiagnosis") return "ok";
//        return "unchecked";
//    }

});



Template.addDiagnosisDialog.events({
    'click .smartbio-diagnosisbtn': function(event, template) {
        event.preventDefault();
        this.icon="check";
        var diagnosis = Session.get("selectedDiagnosis");
        diagnosis.obj = this._id;
        diagnosis.objName = this.name;
        diagnosis.text = this.name;
        Session.set("selectedDiagnosis", diagnosis);
//        console.log('click .smartbio-diagnosisbtn: diagnosis=' + JSON.stringify(diagnosis));
//        var newId = this._id;
//        if (!newId) {
//            newId = 'newDiagnosis';
//            //TODO filter by diagnosis?
////            EasySearch.changeProperty('predicates', 'filterByDiagnosiss', null);
//        } else {
////            EasySearch.changeProperty('predicates', 'filterByDiagnosiss', newId);
//        }
//        var newName = this.name;
//        if (!newName) newName = diagnosisSearchBoxUserQuery;
//        Session.set("selectedDiagnosis", this);
//        Session.set("diagnosisId", newId);
//        Session.set("diagnosisName", newName);
    }
});

//Template.addDiagnosisDialog.rendered = function() {
//    //$('.datetimepicker').datetimepicker({
//    //    format: 'YYYY-MM-DD HH:MM:SS'
//    //});
//    $('.datetimepicker').datetimepicker({
//        format: 'YYYY-MM-DD'
//    });
//};


Template.editDiagnosisDialog.helpers({
    diagnosis: function() {
        return Session.get("selectedDiagnosis");
    }
});


//Template.editDiagnosisDialog.rendered = function() {
//    //$('.datetimepicker').datetimepicker({
//    //    format: 'YYYY-MM-DD HH:MM:SS'
//    //});
//    $('.datetimepicker').datetimepicker({
//        format: 'YYYY-MM-DD'
//    });
//};

Template.startedResolved.rendered = function() {
    //$('.datetimepicker').datetimepicker({
    //    format: 'YYYY-MM-DD HH:MM:SS'
    //});
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    $('.rateit').rateit();
    //$('.datetimepicker').datetimepicker({
    //    onSelect: function(d,i) {
    //        if(d !== i.lastVal){
    //            $(this).change();
    //        }
    //    }
    //});

    $('.rateit').bind(getFrowns);
};






setStartEndDateControls = function(templateId) {
    console.log("setStartEndDateControls: " + templateId);
    var startPicker = $('#startDate-' + templateId).data('DateTimePicker');
    if (!startPicker) return;
    var endPicker = $('#endDate-' + templateId).data('DateTimePicker');
    if (!endPicker) return;
    //startPicker.setDate(null);
    //endPicker.setDate(null);
    var diagnosis = Session.get("selectedDiagnosis");
    if (!diagnosis) return;
    var start = '';
    if (diagnosis.startDate) start = yyyy_mm_dd(diagnosis.startDate);
    if (!start) start = '';
    var end = '';
    if (diagnosis.endDate) end = yyyy_mm_dd(diagnosis.endDate);
    if (!end) end = '';
    $('#_startDate-' + templateId).val(start);
    $('#_startDate-' + templateId).change();
    $('#_endDate-' + templateId).val(end);
    $('#_endDate-' + templateId).change();

    //$('#startDate-' + templateId).data("DateTimePicker").setDate(diagnosis.startDate);
    //$('#endDate-' + templateId).data("DateTimePicker").setDate(diagnosis.endDate);
    //startPicker("setDate", new Date(diagnosis.startDate));
    //endPicker("setDate", new Date(diagnosis.endDate));
    $('#sinceBirth-' + templateId).prop("checked", (diagnosis.startFlag==1));
    if (diagnosis.startFlag==1) {
        startPicker.disable();
        //$('#startDate-' + templateId).data("DateTimePicker").disable();
        //$('#startDate-' + templateId).data("DatePicker").disable();
    } else {
        startPicker.enable();
        //$('#startDate-' + templateId).data("DateTimePicker").enable();
        //$('#startDate-' + templateId).data("DatePicker").enable();
    }
    $('#ongoing-' + templateId).prop("checked", (diagnosis.endFlag==1));
    if (diagnosis.endFlag==1) {
        endPicker.disable();
        //$('#endDate-' + templateId).data("DateTimePicker").disable();
        //$('#endDate-' + templateId).data("DatePicker").disable();
    } else {
        endPicker.enable();
        //$('#endDate-' + templateId).data("DateTimePicker").enable();
        //$('#endDate-' + templateId).data("DatePicker").enable();
    }
    var frowns = 0;
    if (diagnosis.num) frowns = String(diagnosis.num / 2);
    $('#severity-' + templateId).rateit('value', frowns);
};


Template.startedResolved.helpers({
    diagnosis : function() {
//        console.log("selectedDiagnosis=" + JSON.stringify(Session.get("selectedDiagnosis")));
        return Session.get("selectedDiagnosis");
    },

    frowns: function() {
        return getFrowns();
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
//        console.log("startedResolved changed");
        var changedElementId = event.target.id;
        var diagnosis = Session.get("selectedDiagnosis");
        console.log("startedResolved changedElementId=" + changedElementId);

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
    },



    "dp.change": function(event) {
        var changedElementId = event.target.id;
        var diagnosis = Session.get("selectedDiagnosis");
        console.log("startedResolved changedElementId=" + changedElementId);
        if (changedElementId.indexOf("startDate")==0) {
            //var val = $('#' + changedElementId).data("DateTimePicker").getDate();
            var val = $('#_' + changedElementId).val();
            var parts = val.split("-");
            var dateVal = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            //var dateVal = _.parseDate("yyyy-mm-dd", val);
            console.log("startDate changed to: " + parts + "=" + dateVal);
            if (dateVal) {
                diagnosis.startDate = dateVal;
                diagnosis.startFlag = 0;
//            Session.set("startDate", new Date(val));
                Session.set("selectedDiagnosis", diagnosis);
            }
            return;
        }

        if (changedElementId.indexOf("endDate")==0) {
            //var val = $('#' + changedElementId).data("DateTimePicker").getDate();
            var val = $('#_' + changedElementId).val();
            var parts = val.split("-");
            var dateVal = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            //var dateVal = _.parseDate("yyyy-mm-dd", val);
            console.log("endDate changed to: " + dateVal);
            if (dateVal) {
                diagnosis.endDate = dateVal;
                diagnosis.endFlag = 0;
//            Session.set("endDate", new Date(val));
                Session.set("selectedDiagnosis", diagnosis);
            }
            return;
        }
    },

    "click .rateit": function(event, template) {
        var changedElementId = event.currentTarget.id;
        var diagnosis = Session.get("selectedDiagnosis");
        var val = $('#' + changedElementId).rateit('value') * 2;
        diagnosis.num = val;
        diagnosis.normVal = val / 10;
        Session.set("selectedDiagnosis", diagnosis);
    }



//    "changeDate": function(event) {
//        var changedElementId = event.currentTarget.id;
//        console.log("Date changed: " + changedElementId);
//        console.log(changedElementId + "=" + event.date);
//    }
});



