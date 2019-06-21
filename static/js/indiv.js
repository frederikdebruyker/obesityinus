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

// Groups the keys for each graph
// Could've been done programatically with better naming convention
var ageKeys = ["age_18_24_obesity","age_25_34_obesity","age_35_44_obesity","age_45_54_obesity","age_55_64_obesity","age_65_obesity"];
var ageNames = ["18-24","25-34","35-44","45-54","55-64","65+"];

var sexKeys = []

createChartAndText(ageKeys,ageNames)   

function createChartAndText(keys, names) {
    // Creates list to hold values
    var values = [];
    // Append svg and set dimensions
    var svg = d3.select(".container-fluid")
    .append("div")
    .classed("row",true)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    // Add location actual chart will be on
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    d3.json(`/happinessData/${text}`).then(data => {
        // Pulls it out of the list
        data = data[0]
        // Gets relevant values
        keys.forEach(key=>values.push(parseFloat(data[key])));
        // Move all below to a function
        // Creates Scales and axis
        var xScale = d3.scaleBand()
            .domain(names)
            .range([0,chartWidth])
            .padding(.1);

        var yScale = d3.scaleLinear()
            .domain([d3.min(values)-5,d3.max(values)])
            .range([chartHeight,0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        chartGroup.append("g")
        .call(yAxis);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

        // Create one SVG rectangle per piece of tvData
        // Use the linear and band scales to position each rectangle within the chart
        values.forEach((point,index)=>{
            chartGroup.append("rect")
            .attr("class", "bar")
            .attr("x", xScale(names[index]))
            .attr("y", yScale(point))
            .attr("width", xScale.bandwidth())
            .attr("height", (chartHeight - yScale(point)));
        });
    });
}