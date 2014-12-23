Template.addConditionDialog.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'conditionChooser', index: 'conditions' }
    );

    instance.on('searchingDone', function () {
        console.log('searchingDone');
        Session.set("conditionId", null);
        Session.set("conditionName", null);
    });

    instance.on('currentValue', function (val) {
        console.log('The user searches for: ' + val);
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
        return "unchecked"
    }

});



//Template.addConditionDialog.events({
//    'click .smartbio-condition-btn': function(event, template) {
//        event.preventDefault();
//        this.icon="check";
////        console.log('click .smartbio-condition-btn: conditionId=' + Session.get("conditionId"));
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
//        Session.set("conditionId", newId);
//        Session.set("conditionName", newName);
//    }
//});