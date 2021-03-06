svgWidth = Math.round(window.innerWidth*.5);
svgHeight = Math.round(window.innerHeight*.3);

var chartMargin = {
  top: 20,
  right: 60,
  bottom: 300,
  left: 100
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;
    var count =0;
    var relSum =0;
    var nonrelSum =0;
    happinessData.forEach(function(state) {
      state.strongly_religious=+state.strongly_religious
      state.non_religious=+state.non_religious
      if (state.strongly_religious>state.non_religious){
        nonrelSum = nonrelSum+state.non_religious;
        count = count +1;
      }
      else {relSum = relSum+strongly_religious};
    });
    nonrelSum = nonrelSum/count;
    relSum = relSum/(50-count);
    createRegBar(religiousNames,[relSum,nonrelSum]);
  });
  
  function createRegBar(names, values) {
    // Append svg and set dimensions
    var svg = d3.select(".container-fluid")
    .append("div")
    .classed("row2",true)
    .append('div')
    .classed("col-md-6 my-auto",true)
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
    });
  };