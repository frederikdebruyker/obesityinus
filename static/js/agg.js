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
  
// Import Data
 d3.json("/db/happiness_and_politics.json", function(err, happinessData) {
     if (err) throw err;
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    happinessData.forEach(function(data) {
    data.Nonreligious = +data.Nonreligious;
    // data.povertyMoe = parsefloat(data.povertyMoe);
    data.topic = +data.topic;
   
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(happinessData, d => d.Nonreligious)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(happinessData, d => d.topic)])
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

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(happinessData).enter()
    var circ = circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.Nonreligious))
    .attr("cy", d => yLinearScale(d.topic))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5")

    // Step 6: Create State names in the Circles
    // ==============================
    circlesGroup
    .append("text")
    .attr("x", d => xLinearScale(d.Nonreligious))
    .attr("y", d => yLinearScale(d.topic))
    .attr("fill", "black")
    .attr("font-size", "7.5px")
    .text(d => d.locationabbr)
    
    

    // // Step 6: Initialize tool tip
    // // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.locationabbr}<br> % Obsesity: ${d.Nonreligious}<br> topic by State: ${d.topic}`);
      });

//     // // Step 7: Create tooltip in the chart
//     // // ==============================
     circ.call(toolTip);

//     // // Step 8: Create event listeners to display and hide the tooltip
//     // // ==============================
     circ.on("click", function(data) {
       toolTip.show(data, this);
     })
       // onmouseout event
      .on("mouseout", function(data, index) {
         toolTip.hide(data);
       });

//     // Create axes labels
    chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("topic");

     chartGroup.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
       .attr("class", "axisText")
       .text("Percent Obsesity");
  });
