

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

Template.addDiagnosisDialog.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:MM:SS'
    });
};


Template.editDiagnosisDialog.helpers({
    diagnosis: function() {
        return Session.get("selectedDiagnosis");
    }
});


Template.editDiagnosisDialog.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:MM:SS'
    });
};

