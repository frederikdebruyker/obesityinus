var svgWidth = 960;
var svgHeight =500;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3.select("#scatteragric")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "dairy_us_millions";

// function used for updating x-scale var upon click on axis label
function xScale(happinessData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(happinessData, d => d[chosenXAxis]),
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
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXaxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "dairy_us_millions") {
    var label = "dairy_us_millions";
  }
  else if (chosenXAxis === "agriculture_us_millions"){
    var label = "agriculture_us_millions:";
  }
  else {
    var label ="animals_us_millions";

  };
  

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, textGroup) {

    if (chosenXAxis === "dairy_us_millions") {
      var label = "dairy_us_millions:";
    }
    else if (chosenXAxis === "agriculture_us_millions"){
      var label = "agriculture_us_millions:";
    }
    else {
        var label = "animals_us_millions:";
      }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
      });
  
    textGroup.call(toolTip);
  
    textGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return textGroup;
  }
// Retrieve data from the CSV file and execute everything below
d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;

  // parse data
  happinessData.forEach(function(data) {
    
    data.total_obesity = +data.total_obesity;
    data.agriculture_us_millions = +data.agriculture_us_millions;
    data.animals_us_millions = +data.animals_us_millions;
    data.dairy_us_millions = +data.dairy_us_millions;
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
    .attr("r", 10)
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
var textGroup = chartGroup.selectAll("tolani")
    .data(happinessData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.total_obesity))
    .attr("fill", "black")
    .attr("font-size", "7.5px")
    .style("text-anchor", "middle")
    .text(d => d.abbr);


  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var agriculture_us_millionsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "agriculture_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Agriculture, Millions ");
    var animals_us_millionsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "animals_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Animals, Millions");
    var dairyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "dairy_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Dairy, Millions");

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

        // updates Text with new x values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        textGroup = updateToolTip(chosenXAxis, textGroup);
        // changes classes to change bold text
        if (chosenXAxis === "agriculture_us_millions") {
          agriculture_us_millionsLabel
            .classed("active", true)
            .classed("inactive", false);
          dairyLabel
            .classed("active", false)
            .classed("inactive", true);
          animals_us_millionsLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        else if(chosenXAxis === "animals_us_millions"){
          agriculture_us_millionsLabel
            .classed("active", false)
            .classed("inactive", true);
          dairyLabel
            .classed("active", false)
            .classed("inactive", true);
          animals_us_millionsLabel
            .classed("active", true)
            .classed("inactive", false)
        }
        else if(chosenXAxis === "dairy_us_millions"){
          agriculture_us_millionsLabel
            .classed("active", false)
            .classed("inactive", true);
          animals_us_millionsLabel
            .classed("active", false)
            .classed("inactive", true)
         dairyLabel
            .classed("active", true)
            .classed("inactive", false)
        }
        
        
      }
    });
});