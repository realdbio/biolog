getTimelineData = function() {
    var dxs = Session.get("patientDiagnoses");
    var timelineData = [];
    var pt = Session.get("patient");
    if (!pt || !getPatientDob()) return;
    var dobMs = getPatientDob().getTime();
    var twoMosAgoMs = new Date().getTime() - 5.25949e9;
    var earliestTime = dobMs;
    if (dobMs < twoMosAgoMs) earliestTime = twoMosAgoMs;
    var beginning = new Date().getTime();
    var ending = earliestTime;
    var monthFormat = d3.time.format("%-m/%y");
    for (var di in dxs) {
        var dx = dxs[di];
        var start = earliestTime;
        if (dx.startDate && dx.startDate.getTime() > earliestTime) {
            start = dx.startDate.getTime();
        }
        if (start < beginning) beginning = start;
        var end = new Date().getTime();
        if (dx.endDate) {
            end = dx.endDate.getTime();
        }
        if (end > ending) ending = end;
        var label = dx.objName;
        if (dx.startDate) label += " (started " + monthFormat(dx.startDate) + ")";
        var obj = {
            id: dx._id,
            label: label,
            times: [{
                "starting_time": start,
                "ending_time": end
            }]
        };
        //console.log("getTimelineData object: " + JSON.stringify(obj));
        timelineData.push(obj);
    }
    return {
        data: timelineData,
        beginning: beginning,
        ending: ending
    };
};

timelineChart = null;

Tracker.autorun(function () {
    var timelineDataObj = getTimelineData();
    //console.log("timeline Tracker.autorun: timelineChart?" + (! timelineChart) + "; timelineDataObj=" + JSON.stringify(timelineDataObj));
    if (!timelineChart) return;

    timelineChart.beginning(timelineDataObj.beginning);
    timelineChart.ending(timelineDataObj.ending);

    if (!timelineDataObj.data) return;
    var svg = d3.select("#timeline")
        .append("svg")
        .attr("width", "800")
        //.attr("height", "500")
        .datum(timelineDataObj.data)
        .call(timelineChart);
});


Template.timeline.rendered = function() {





    timelineChart = d3.timeline()
        .stack()
        .tickFormat({
            format: d3.time.format("%-m/%y"),
            tickTime: d3.time.months,
            tickInterval: 1,
            tickSize: 5
        })
        //.rotateTicks(90)
        //.showToday()
        //.relativeTime()
        .margin({left:100, right:0, top:0, bottom:100})
        .width(1200);













    //var data = [{
    //    label: "foo",
    //    times: [{
    //        starting_time: 1426478400000,
    //        ending_time: 1440907200000
    //    }, {
    //        starting_time: 1426478400000,
    //        ending_time: 1438401600000
    //    }]
    //},{
    //    label: "bar",
    //    times: [{
    //        starting_time: 1426478400000,
    //        ending_time: 1451883600000
    //    },{
    //        starting_time: 1426478400000,
    //        ending_time: 1451883600000
    //    }]
    //},{
    //    label: "baz",
    //    times: [{
    //        starting_time: 1426478400000,
    //        ending_time: 1451883600000
    //    }]
    //}
    //];





};