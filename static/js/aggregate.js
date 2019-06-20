// d3.json("/obesityData")
// d3.json("/db/obesity_and_stratifications.json", function(data) {
//     console.log(data);
//     var happinessData = data.filter(function(d) { return d.locationdesc === "Iowa"; });
//     console.log(JSON.stringify(happinessData));
// // /db/happiness_and_politics.json
// });
// var happinessData = data.filter(function(d) { return d.LocationDesc === Alabama; });
// console.log(JSON.stringify(happinessData));
// /db/happiness_and_politics.json

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// // Import Data
d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;
    // var happinessData = data.filter(function(d) { return d.produce >0 ,d.total_obesity > 0; });
    // console.log(JSON.stringify(happinessData));
// /db/happiness_and_politics.json

//  d3.json("/db/happiness_and_politics.json", function(err, happinessData) {
//      if (err) throw err;
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    happinessData.forEach(function(data) {
    data.total_obesity = +data.total_obesity;
    // data.povertyMoe = parsefloat(data.povertyMoe);
    data.produce = +data.produce;
    data.overall_wellbeing = +data.overall_wellbeing;
    console.log(data)
   
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(happinessData, d => d.total_obesity)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
       .domain([48, d3.max(happinessData, d => d.produce)])
      .range([height, 48]);

    // Step 2: Create scale functions for overall wellbeing
    // ==============================
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(happinessData, d => d.total_obesity)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(happinessData, d => d.overall_wellbeing)])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles for produce
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(happinessData).enter()
    var circ = circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.total_obesity))
    .attr("cy", d => yLinearScale(d.produce))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5")

    // Step 5: Create Circles for overall wellbeing
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(happinessData).enter()
    var circ = circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.total_obesity))
    .attr("cy", d => yLinearScale(d.overall_wellbeing))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5")

    // Step 6: Create State names in the Circles for produce
    // ==============================
    circlesGroup
    .append("text")
    .attr("x", d => xLinearScale(d.total_obesity))
    .attr("y", d => yLinearScale(d.produce))
    .attr("fill", "black")
    .attr("font-size", "7.5px")
    .text(d => d.abbr)
    
    // Step 6: Create State names in the Circles for overall wellbeing
    // ==============================
    circlesGroup
    .append("text")
    .attr("x", d => xLinearScale(d.total_obesity))
    .attr("y", d => yLinearScale(d.overall_wellbeing))
    .attr("fill", "black")
    .attr("font-size", "7.5px")
    .text(d => d.abbr)
    

    // // Step 6: Initialize tool tip for produce
    // // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br> % Obsesity: ${d.total_obesity}<br> produce by State: ${d.produce}`);
      });

      // // Step 6: Initialize tool tip for overall wellbeing
    // // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br> % Obsesity: ${d.total_obesity}<br> produce by State: ${d.overall_wellbeing}`);
    });
//     // // Step 7: Create tooltip in the chart
//     // // ==============================
     circ.call(toolTip);

// //     // // Step 8: Create event listeners to display and hide the tooltip
// //     // // ==============================
     circ.on("click", function(data) {
       toolTip.show(data, this);
     })
       // onmouseout event
      .on("mouseout", function(data, index) {
         toolTip.hide(data);
       });

//     // Create axes labels for produce
    chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Percent Produce, %");

     chartGroup.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
       .attr("class", "axisText")
       .text("Percent Obsesity, %");

          // Create axes labels overall wellbeing
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Overall Wellbeing, %");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Percent Obsesity, %");
       
  });
