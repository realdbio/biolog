Template.timeline.rendered = function() {
    //var testData = [
    //    {id: "pA", label: "person a", times: [
    //        {"starting_time": 1355752800000, "ending_time": 1355759900000},
    //        {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
    //    {id: "pB", label: "person b", times: [
    //        {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
    //    {id: "pC", label: "person c", times: [
    //        {"starting_time": 1355761910000, "ending_time": 1355763910000}]},
    //];
    //
    //var chart = d3.timeline();
    //
    //var svg = d3.select("#timeline").append("svg").attr("width", 500)
    //    .datum(testData).call(chart);









    var data = [{
        label: "foo",
        times: [{
            starting_time: 1426478400000,
            ending_time: 1440907200000
        }, {
            starting_time: 1426478400000,
            ending_time: 1438401600000
        }]
    },{
        label: "bar",
        times: [{
            starting_time: 1426478400000,
            ending_time: 1451883600000
        },{
            starting_time: 1426478400000,
            ending_time: 1451883600000
        }]
    },{
        label: "baz",
        times: [{
            starting_time: 1426478400000,
            ending_time: 1451883600000
        }]
    }
];

var chart = d3.timeline()
    .stack()
    .tickFormat({
        format: d3.time.format("%I %p"),
        tickTime: d3.time.months,
        tickInterval: 60000,
        tickSize: 6
    })
    .rotateTicks(90)
    .showToday()
    .margin({left:100, right:0, top:0, bottom:0})
    .height(200);

var svg = d3.select("#timeline")
    .append("svg")
    .attr("width", "1000")
    .datum(data)
    .call(chart);













};