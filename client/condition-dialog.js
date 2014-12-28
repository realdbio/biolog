Template.addConditionDialog.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'conditionChooser', index: 'conditions' }
    );

    instance.on('searchingDone', function () {
        Session.set("conditionId", null);
        Session.set("conditionName", null);
    });

    instance.on('currentValue', function (val) {
//        console.log('The user searches for: ' + val);
        conditionSearchBoxUserQuery = val;
    });
};

Template.addConditionDialog.helpers({
    newConditionName: function () {
        return conditionSearchBoxUserQuery;
    },

    conditionButtonClass: function() {
//        console.log("etypeButtonClass(): etypeId=" + Session.get("etypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("conditionId") == this._id) return "btn-success";
        if (!this._id && Session.get("conditionId") == "newCondition") return "btn-success";
        return "";
    },

    getIconForCondition: function(event) {
//        console.log("getIconForEtype: etypeId=" + Session.get("etypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("conditionId") == this._id) return "ok";
        if (!this._id && Session.get("conditionId") == "newCondition") return "ok";
        return "unchecked";
    }

});



Template.addConditionDialog.events({
    'click .smartbio-condition-btn': function(event, template) {
        event.preventDefault();
        this.icon="check";
//        console.log('click .smartbio-condition-btn: conditionId=' + Session.get("conditionId"));
//        var newId = this._id;
//        if (!newId) {
//            newId = 'newCondition';
//            //TODO filter by condition?
////            EasySearch.changeProperty('predicates', 'filterByConditions', null);
//        } else {
////            EasySearch.changeProperty('predicates', 'filterByConditions', newId);
//        }
//        var newName = this.name;
//        if (!newName) newName = conditionSearchBoxUserQuery;
        Session.set("selectedHealthCondition", this);
//        Session.set("conditionId", newId);
//        Session.set("conditionName", newName);
    }
});


Template.editConditionDialog.helpers({
    "condition" : function() {
        console.log("selectedHealthCondition=" + JSON.stringify(Session.get("selectedHealthCondition")));
        return Session.get("selectedHealthCondition");
    }
});

Template.editConditionDialog.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:MM:SS'
    })
};

Template.editConditionDialog.events({
    "change": function(event) {
        var changedElementId = event.currentTarget.id;
        var condition = Session.get("selectedHealthCondition");

        if ("startDate" == changedElementId) {
            var val = $('#startDate').data("DateTimePicker").getDate();
            condition.startDate = new Date(val);
            condition.startFlag = 0;
//            Session.set("startDate", new Date(val));
            Session.set("selectedHealthCondition", condition);
        }

        if ("endDate" == changedElementId) {
            var val = $('#endDate').data("DateTimePicker").getDate();
            condition.endDate = new Date(val);
            condition.endFlag = 0;
//            Session.set("endDate", new Date(val));
            Session.set("selectedHealthCondition", condition);
        }

        var val = event.currentTarget.checked;

        if ("sinceBirth" == changedElementId) {
//            Session.set("beginningOfTime", val);
            if (val) {
                $('#startDate').data("DateTimePicker").disable();
            } else {
                $('#startDate').data("DateTimePicker").enable();
            }
            condition.startFlag = 1;
            condition.startDate = null;
            Session.set("selectedHealthCondition", condition);
        }

        if ("ongoing" == changedElementId) {
//            Session.set("eternity", val);
            if (val) {
                $('#endDate').data("DateTimePicker").disable();
            } else {
                $('#endDate').data("DateTimePicker").enable();
            }
            condition.endFlag = 1;
            condition.endDate = null;
            Session.set("selectedHealthCondition", condition);
        }

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