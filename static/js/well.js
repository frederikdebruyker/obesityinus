var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// var svg = d3.select("#scatter")
//   .select(".chart")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "overall_wellbeing";

// function used for updating x-scale var upon click on axis label
function xScale(happinessData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(happinessData, d => d[chosenXAxis]) ,
      d3.max(happinessData, d => d[chosenXAxis]) 
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
    
  return circlesGroup;
}
// function used for updating state abbr  textGroup with a transition to
// // new circles
function renderText(textGroup, newXScale) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      ;
  
    return textGroup;
  }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "overall_wellbeing") {
//     var label = "Overall Wellbeing:";
//   }
//   else {
//     var label = "Produce:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// // function used for updating text group with new tooltip
// function updateToolTip(chosenXAxis, textGroup) {

//     if (chosenXAxis === "overall_wellbeing") {
//       var label = "Overall Wellbeing:";
//     }
//     else {
//       var label = "Produce:";
//     }
  
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
//       });
  
//     textGroup.call(toolTip);
  
//     textGroup.on("mouseover", function(data) {
//       toolTip.show(data);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });
  
//     return textGroup;
//   }
  
// Retrieve data from the CSV file and execute everything below
d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;

  // parse data
  happinessData.forEach(function(data) {
    data.overall_wellbeing = +data.overall_wellbeing;
    data.total_obesity = +data.total_obesity;
    data.produce = +data.produce;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(happinessData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(happinessData, d => d.total_obesity)-2, d3.max(happinessData, d => d.total_obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
    
    

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  
    .data(happinessData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.total_obesity))
    .attr("r", 7)
    .attr("fill", "orange")
    .attr("opacity", ".5");

// append State abbreviation to the circlesGroup
    // circlesGroup
    // .append("text")
    // // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // // .attr("y", d => yLinearScale(d.total_obesity))
    // .attr("fill", "black")
    // .attr("font-size", "7.5px")
    // .text(d => d.abbr)
    //  var textGroup=chartGroup.selectAll("text")
    // .data(happinessData)
    // .enter()
    // .append("text")
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d.total_obesity))
    // .attr("fill", "black")
    // .attr("font-size", "7.5px")
    // .style("text-anchor", "middle")
    // .text(d => d.abbr);


  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "overall_wellbeing") // value to grab for event listener
    .classed("active", true)
    .text("Overall Wellbeing (%)");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "produce") // value to grab for event listener
    .classed("inactive", true)
    .text("Percent Produce (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Percent Obesity (%)");

  // updateToolTip function above csv import
  var circlesGroup= updateToolTip(chosenXAxis, circlesGroup);
  var textGroup= updateToolTip(chosenXAxis, textGroup);
//   textGroup.call(toolTip);
  
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(happinessData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        textGroup = updateToolTip(chosenXAxis, textGroup);


        // changes classes to change bold text
        if (chosenXAxis === "produce") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});
