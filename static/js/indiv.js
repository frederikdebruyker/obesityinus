// .text() doesn't return the text. Weird.
// Gets input state
var text = d3.select("#inputin").node().innerHTML
// Gets data to make graphs
// Creates chart size
svgWidth = 600;
svgHeight = 400;
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;




createChart(text,ageKeys,ageNames);
createChart(text,sexKeys,sexNames);
createChart(text,incomeKeys,incomeNames);
createChart(text,raceKeys,raceNames);
createChart(text,educationKeys,educationNames);
createChart(text,exportKeys,exportNames);
createChart(text,politicalKeys,politicalNames);