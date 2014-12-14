/**
 * Created by dd on 11/7/14.
 */

//subscribe to reactive sources
Meteor.subscribe("entityQueue");
Meteor.subscribe("factQueue");

Template.dataLoader.helpers({
    importButtonClass: function() {
        if (Session.get("etypeId")
            && Session.get("rawDataStr")
            && Session.get("datesSpecified") ) {
            return "btn-success";
        }
        return "btn-default disabled";
    }
});

Template.dataLoader.events({
   "click #importButton": function() {
       var importStrategy = {
           delimiter: Session.get("delimiter"),
           headerSignatureLC: Session.get("headerSignatureLC"),
           headerSignature: Session.get("headerSignature"),
           etypeId: Session.get("etypeId"),
           etypeName: Session.get("etypeName"),
//           rawDataStr: Session.get("rawDataStr"),
           headerMappings: Session.get("headerMappings"),
           rowMappings: Session.get("rowMappings"),
           rowData: Session.get("rowData"),
           beginningOfTime: Session.get("beginningOfTime"),
           startDate: Session.get("startDate"),
           eternity: Session.get("eternity"),
           endDate: Session.get("endDate")
       };
       console.log("importStrategy=" + JSON.stringify(importStrategy));

       var payload = {
//           strategy: Session.get("importStrategy"),
//           rawDataStr: Session.get("rawDataStr")
           strategy: importStrategy
       };
       Meteor.call("importStrategyData", payload, function(error, result) {
           // display the error to the user and abort
           if (error)
               return console.log("Error calling bulkLoad: " + error.reason);
           console.log("importStrategyData returns: " + result);
       });
//       var importer = new RealdbioImporter(importStrategy);
//       importer.import(Session.get("rawDataStr"));
   }
});

Template.dataTextArea.events({'keyup': function (event, template) {
    console.log("dataTextArea change keyup");
    event.preventDefault();

//    if (Meteor.user() == null || Meteor.user()._id == null) {
//        console.log("User must be logged in");
//        return;
//    }

    var textarea = template.find("textarea");

//    console.log("textarea=" + textarea.value);

    Session.set("rawDataStr", textarea.value);
    var rows = textarea.value.split('\n');
    var headerRow = rows[0];
    var delim = ",";
    //if a semicolon is in the first row then it is the delim
    if (headerRow.indexOf(";") >= 0) delim = ";";
    //if a tab is in the first row then it is the delim
    if (headerRow.indexOf("\t") >= 0) delim = "\t";
    Session.set("delimiter", delim);
    var headers = headerRow.split(delim);
    console.log("headers=" + headers);
    var cols = [];
//    var existingCols = Session.get("headerMappings");
    var headerStr = "";
    var headerStrLC = "";
    var headersLC = [];
    var ci = 0;
    for (var hi in headers) {
        if (hi==0) continue;
        var headerVal = headers[hi].trim();
        var headerLCVal = headerVal.toLowerCase();
        if (headerStr.length > 0) headerStr += delim;
        headerStr += headerVal;
        if (headerStrLC.length > 0) headerStrLC += "~|~";
        headerStrLC += headerLCVal;
        headersLC.push(headerStrLC);

        var headerMapping = {
            predIndex: ci,
            predColId: "predCol-" + ci,
            text: headerVal
//            textLC: headerLCVal
        };
        cols.push(headerMapping);
        ci++;
    }

    Session.set("headerSignature", headerStr);
    Session.set("headerSignatureLC", headerStrLC);
    //TODO lookup strategies

    Session.set("headerMappings", cols);
    //TODO lookup header mappings

    //next create the row mappings
    var rowMappings = [];
    var rowData = [];
    var di = 0;
    for (var ri in rows) {
        if (ri == 0) continue;
        var rowStr = rows[ri];
        var rowCells = rowStr.split(delim);
        var rowName = rowCells[0];

        if (rowName) rowName = rowName.trim();
        //skip rows without a name
        if (!rowName) {
            di++;
            continue;
        }
        var rowMapping = {
            dataRowIndex: di,
            text: rowName
//            textLC: rowName.toLowerCase()
        };
        rowMappings.push(rowMapping);
        rowCells.shift();
        rowData.push(rowCells);
        di++;
    }
    console.log("rowMappings=" + JSON.stringify(rowMappings));
    Session.set("rowMappings", rowMappings);
    Session.set("rowData", rowData);

    if (! Session.get("etypeId") || Session.get("etypeId")=="newEtype") return;

    //TODO lookup strategies

    //TODO lookup row mappings
    //look up any mappings all at once?
//    var importInfo = {
//        type: Session.get("etypeId"),
//        headerStr: headerStr,
//        headerStrLC: headerStrLC,
//        headers: headers,
//        headersLC: headersLC
//    };
//    Meteor.call("lookupStrategy", importInfo, function(error, result) {
//        if (error) {
//            console.log("error trying to call lookupMappings: " + error);
//            return;
//        }
//
//        if (result.strategies && result.strategies.length > 0) {
//            var strategy = result.strategies[0];
//            Session.set("importStrategy", strategy);
//        }
//
//        for (var ci in cols) {
//            var headerLC = cols[hi].textLC;
//
//            cols[hi].pred = strategy.rowMappings[headerLC];
//        }
//        Session.set("headerMappings", cols);
//
//    });

}});

etypeSearchBoxUserQuery = "";

Template.etypeChooserCreator.created = function () {
    var instance = EasySearch.getComponentInstance(
        { id: 'etypeChooser', index: 'etypes' }
    );

    instance.on('searchingDone', function (searchingIsDone) {
//        console.log('I am done! ' + searchingIsDone);
        Session.set("etypeId", null);
        Session.set("etypeName", null);
    });

    instance.on('currentValue', function (val) {
//        console.log('The user searches for ' + val);
        etypeSearchBoxUserQuery = val;
    });
};

Template.etypeChooserCreator.helpers({
    newEtypeName: function() {
        return etypeSearchBoxUserQuery;
    },

    etypeButtonClass: function() {
//        console.log("etypeButtonClass(): etypeId=" + Session.get("etypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("etypeId") == this._id) return "btn-success";
        if (!this._id && Session.get("etypeId") == "newEtype") return "btn-success";
        return "";
    },

    getIconForEtype: function(event) {
//        console.log("getIconForEtype: etypeId=" + Session.get("etypeId") + "; this._id=" + this._id);
        if (this._id && Session.get("etypeId") == this._id) return "ok";
        if (!this._id && Session.get("etypeId") == "newEtype") return "ok";
        return "unchecked"
    },

    etypeChooserFinishedIcon: function(event) {
//        console.log("etypeChooserFinishedIcon() called");
        if (Session.get("etypeId")) {
            return "btn btn-large btn-success";
        } else {
            return "hidden";
        }
    }
});

Template.etypeChooserCreator.events({
    'click .realdb-etype-btn': function(event, template) {
        event.preventDefault();
        this.icon="check";
//        console.log('click .realdb-etype-btn: etypeId=' + Session.get("etypeId"));
        var newId = this._id;
        if (!newId) {
            newId = 'newEtype';
            //TODO filter by etype?
//            EasySearch.changeProperty('predicates', 'filterByEtypes', null);
        } else {
//            EasySearch.changeProperty('predicates', 'filterByEtypes', newId);
        }
        var newName = this.name;
        if (!newName) newName = etypeSearchBoxUserQuery;
        Session.set("etypeId", newId);
        Session.set("etypeName", newName);

        //set EasySearch to filter by this etype


//        console.log('click .realdb-etype-btn: Session.etypeId=' + Session.get("etypeId"));
    }
});


Template.dataloaderTable.helpers({
   getData: function(rowIndex) {
       var rowData = Session.get("rowData");
       var thisRowData = rowData[rowIndex];
       return thisRowData;
   }
});


Template.datePickers.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD HH:MM:SS'
    })
};

Template.datePickers.events({
    "change": function(event) {
        var changedElementId = event.currentTarget.id;

        if ("startDate" == changedElementId) {
            var val = $('#startDate').data("DateTimePicker").getDate();
            Session.set("startDate", new Date(val));
        }

        if ("endDate" == changedElementId) {
            var val = $('#endDate').data("DateTimePicker").getDate();
            Session.set("endDate", new Date(val));
        }

        var val = event.currentTarget.checked;

        if ("beginningOfTime" == changedElementId) {
            Session.set("beginningOfTime", val);
            if (val) {
                $('#startDate').data("DateTimePicker").disable();
            } else {
                $('#startDate').data("DateTimePicker").enable();
            }
        }

        if ("eternity" == changedElementId) {
            Session.set("eternity", val);
            if (val) {
                $('#endDate').data("DateTimePicker").disable();
            } else {
                $('#endDate').data("DateTimePicker").enable();
            }
        }

        var startDateSpecified = Session.get("beginningOfTime") || Session.get("startDate");
        var endDateSpecified = Session.get("eternity") || Session.get("endDate");
        Session.set("datesSpecified", startDateSpecified && endDateSpecified);
    }

//    "changeDate": function(event) {
//        var changedElementId = event.currentTarget.id;
//        console.log("Date changed: " + changedElementId);
//        console.log(changedElementId + "=" + event.date);
//    }
});


//Template.dataQueue.helpers({
//    dataQueueItems: function() {
//        return [{title: "Item #1"}, {title: "Another item"}];
//    }
//});
//var predSearchInstances = [];
//var predSearchIndex = 0;
//Template.columnMapper.created = function () {
//    var instance = EasySearch.getComponentInstance(
//        { index : 'predicates' }
//    );
//    instance.on('searchingDone', function (searchingIsDone) {
//        searchingIsDone && console.log('I am done searching!');
//    });
//};
//Template.columnMapper.helpers({
//    isVisible: function() {
//        if (this.predIndex == predSearchIndex) {
//            return "";
//        } else {
//            return "hidden";
//        }
//    },
//    getNewPredName: function() {
//        return "new pred name nere";
//    }
//});
//Template.columnMapper.events({
//    'keyup': function(event, template) {
//        var elementId = event.currentTarget.id;
//        var predIndex = -1;
//        if (elementId.indexOf("predCol-")==0) {
//            predIndex = elementId.substring(8);
//        }
//        var dataCols = Session.get("headerMappings");
//        var inputVal = event.currentTarget.value;
//        console.log('change predIndex #' + predIndex + "=" + inputVal);
//        dataCols[predIndex].newPredName = inputVal;
//        dataCols[predIndex].predName = inputVal;
//        console.log("dataCols=" + JSON.stringify(dataCols));
//        Session.set("headerMappings", dataCols);
//    }
//});