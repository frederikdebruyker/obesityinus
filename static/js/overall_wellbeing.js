var svgWidth = 960;
var svgHeight = 640;

var margin = {
  top: 20,
  right: 60,
  bottom: 300,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

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

  if (chosenXAxis === "overall_wellbeing") {
    var label = "Overall Wellbeing";
  }
  else if (chosenXAxis === "produce"){
    var label = "Produce:";
  }
  else if (chosenXAxis === "dairy_us_millions"){
    var label = "dairy_us_millions:";
  }
  else if (chosenXAxis === "agriculture_us_millions"){
    var label = "agriculture_us_millions:";
  }
  else if (chosenXAxis === "animals_us_millions"){
    var label = "animals_us_millions:";
  }
  else {
    var label ="excercise";

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

    if (chosenXAxis === "overall_wellbeing") {
      var label = "Overall Wellbeing:";
    }
    else if (chosenXAxis === "produce"){
      var label = "Produce:";
    }
    else if (chosenXAxis === "dairy_us_millions"){
        var label = "dairy_us_millions:";
      }
      else if (chosenXAxis === "agriculture_us_millions"){
        var label = "agriculture_us_millions:";
      }
      else if (chosenXAxis === "animals_us_millions"){
        var label = "animals_us_millions:";
      }
    else {
        var label = "excercise:";
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
    happinessData =happinessData.filter(state => state.abbr != "US")

  // parse data
  happinessData.forEach(function(data) {
    data.overall_wellbeing = +data.overall_wellbeing;
    data.total_obesity = +data.total_obesity;
    data.produce = +data.produce;
    data.excercise = +data.excercise;
    data.dairy_us_millions = +data.dairy_us_millions;
    data.agriculture_us_millions = +data.agriculture_us_millions;
    data.animals_us_millions = +data.animals_us_millions;
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
    .attr("r", 15)
    .attr("fill", "#30FF00")
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
    .attr("fill", "white")
    .attr("font-size", "12px")
    // .attr("font-family",  "Calibri")
    .style("text-anchor", "middle")
    .text(d => d.abbr);


  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var wellbeingLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "overall_wellbeing") // value to grab for event listener
    .classed("active", true)
    .text("Overall Wellbeing (%)");

  var produceLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "produce") // value to grab for event listener
    .classed("inactive", true)
    .text("Percent Produce (%)");
    var excerciseLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 70)
    .attr("value", "excercise") // value to grab for event listener
    .classed("inactive", true)
    .text("Percent Exercise (%)");
    var dairyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 90)
    .attr("value", "dairy_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Dairy, Millions");
    var agriculture_us_millionsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 110)
    .attr("value", "agriculture_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Agriculture, Millions ");
    var animals_us_millionsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 130)
    .attr("value", "animals_us_millions") // value to grab for event listener
    .classed("inactive", true)
    .text("US Animals, Millions");


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 30 - margin.left)
    .attr("x", 0- (height / 2))
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
        if (chosenXAxis === "produce") {
          produceLabel
            .classed("active", true)
            .classed("inactive", false);
          wellbeingLabel
            .classed("active", false)
            .classed("inactive", true);
          excerciseLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        else if(chosenXAxis === "excercise"){
            produceLabel
            .classed("active", false)
            .classed("inactive", true);
          wellbeingLabel
            .classed("active", false)
            .classed("inactive", true);
          excerciseLabel
            .classed("active", true)
            .classed("inactive", false)
        }
        else if(chosenXAxis === "agriculture_us_millions") {
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
        else if(chosenXAxis === "dairy_us_millions"){
            produceLabel
            .classed("active", false)
            .classed("inactive", true);
          wellbeingLabel
            .classed("active", false)
            .classed("inactive", true);
          excerciseLabel
            .classed("active", false)
            .classed("inactive", true)
        dairyLabel
            .classed("active", true)
            .classed("inactive", false)
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
        else {
          produceLabel
            .classed("active", false)
            .classed("inactive", true);
          wellbeingLabel
            .classed("active", true)
            .classed("inactive", false);
         excerciseLabel
            .classed("active", false)
            .classed("inactive", true)
        dairyLabel
            .classed("active", false)
            .classed("inactive", true)
        }
      }
    });
});