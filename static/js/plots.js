svgWidth = 960;
svgHeight = 640;

var chartMargin = {
  top: 70,
  right: 60,
  bottom: 300,
  left: 100,
};
var politicalKeys = ["democrat","republican"];
var politicalNames = ["Democrat","Republican"];
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

d3.json("/happinessData", function(err, happinessData) {
  if (err) throw err;
  var count =0;
  var demSum =0;
  var repSum =0;
  happinessData.forEach(function(state) {
    state.republican=+state.republican
    state.democrat=+state.democrat
    if (state.republican>state.democrat){
      repSum = repSum+state.republican;
      count = count +1;
    }
    else {demSum = demSum+state.democrat};
  });
  repSum = repSum/count;
  demSum = demSum/(50-count);
  createAggBar(politicalNames,[demSum,repSum]);
});



function createAggBar(names, values) {
  // Append svg and set dimensions
  var svg = d3.select(".container-fluid")
  .append("div")
  .classed("row",true)
  .append('div')
  .classed("col-md",true)
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);
  // Add location actual chart will be on
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  // Move all below to a function
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

  // Create one SVG rectangle per piece of Data
  // Use the linear and band scales to position each rectangle within the chart
  values.forEach((point,index)=>{
      chartGroup.append("rect")
      .attr("class", "bar")
      .attr("x", xScale(names[index]))
      .attr("y", yScale(point))
      .attr("width", xScale.bandwidth())
      .attr("height", (chartHeight - yScale(point)));

       // Create group for  2 x- axis labels
       var labelsGroup = chartGroup.append("g")
       .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
        labelsGroup.append("text")
       .attr("x", 0)
       .attr("y", 30)
      //  .attr("value", "overall_wellbeing") // value to grab for event listener
      //  .classed("active", true)
       .text("Politics");
 
           // append y axis
       chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 30 - margin.left)
       .attr("x", 0- (height / 2))
       .attr("dy", "1em")
       .classed("axis-text", true)
       .text("Percent Obesity (%)");

       svg.append("text")
      .attr("transform", "translate(200,40)")
      .attr("x", 10)
      .attr("y", 10)
      .attr("fill", "white")
      .attr("font-size", "1px")
      .attr("class", "title")
      .text("Obesity vs Politics")
      

       
  });
};

var religiousKeys =["non_religious","strongly_religious"];
var religiousNames= ["Non-Religious","Religious"]

d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;
    var count =0;
    var relSum =0;
    var nonrelSum =0;
    happinessData.forEach(function(state) {
      state.strongly_religious=+state.strongly_religious;
      state.non_religious=+state.non_religious;
      if (state.strongly_religious>state.non_religious){
        relSum = relSum+state.strongly_religious;
        count = count +1;
        console.log(state.strongly_religious);
      }
      else {nonrelSum = nonrelSum+state.non_religious};
      console.log(state.non_religious);
    });
    nonrelSum = nonrelSum/count;
    relSum = relSum/(50-count);
    createRegBar(religiousNames,[relSum,nonrelSum]);
  });
  
  function createRegBar(names, values) {
    // Append svg and set dimensions
    var svg = d3.select(".row")
    .append("div")
    .classed("row",true)
    .append('div')
    .classed("col-md",true)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    // Add location actual chart will be on
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    // Move all below to a function
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
  
    // Create one SVG rectangle per piece of Data
    // Use the linear and band scales to position each rectangle within the chart
    values.forEach((point,index)=>{
        chartGroup.append("rect")
        .attr("class", "bar")
        .attr("x", xScale(names[index]))
        .attr("y", yScale(point))
        .attr("width", xScale.bandwidth())
        .attr("height", (chartHeight - yScale(point)));
        
    
        // Create group for  2 x- axis labels
      var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

      var religiousLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 30)
      // .attr("value", "overall_wellbeing") // value to grab for event listener
      .classed("active", true)
      .text("Religion");

          // append y axis
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 30 - margin.left)
      .attr("x",  0-(height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("Percent Obesity (%)");

      svg.append("text")
      .attr("transform", "translate(200,40)")
      .attr("x", 10)
      .attr("y", 10)
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("class", "title")
      .text("Obesity vs Religion")
      
    });
   
  };
              
// var stateCharts ="National";
// createChart(stateCharts,ageKeys,ageNames,true,"age");
// createChart(stateCharts,sexKeys,sexNames,false,"sex");
// createChart(stateCharts,incomeKeys,incomeNames,true,"income");
// createChart(stateCharts,raceKeys,raceNames,false,"race");
// createChart(stateCharts,educationKeys,educationNames,true,"education");
