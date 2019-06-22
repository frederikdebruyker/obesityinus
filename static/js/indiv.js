// .text() doesn't return the text. Weird.
// Gets input state
var text = d3.select("#inputin").node().innerHTML
// Gets base info and adds it.
d3.json(`/happinessData/${text}`).then(base => {
    base = base[0]
    var quad = d3.select("#baseInfo")
    quad.append("h6")
        .classed("text-center", true)
        .text(`Total Obese People: ${base["total_obesity"]}%`);
    quad.append("h6")
        .classed("text-center", true)
        .text(`Total Happy People: ${base["overall_wellbeing"]}%`);
    quad.append("h6")
        .classed("text-center", true)
        .text(`People Consuming Produce Often: ${base["produce"]}%`);
    quad.append("h6")
        .classed("text-center", true)
        .text(`People Exercising Often: ${base["excercise"]}%`);
});
d3.select("#explain").text("Each Sankey Diagram beneath a chart and its explanation show your odds of falling into one of the charted categories given that you're obese.");
// Creates the graphs for the individual pages
createChart(text,ageKeys,ageNames,true,"Aging");
d3.select(".container-fluid").append("div").classed("row", true).append("div").classed("col-12", true).attr("id","SankeyContainerAge");
d3.json(`/sankey_files/${text}/Age`).then(data => {
  

    var chart = anychart.sankey(data);
  
    // set the width of nodes
    chart.nodeWidth("50%");
    
    // set the container id
    chart.container("SankeyContainerAge");
  
    // initiate drawing the chart
    chart.draw();
  });
createChart(text,sexKeys,sexNames,false,"Sexing");
d3.select(".container-fluid").append("div").classed("row", true).append("div").classed("col-12", true).attr("id","SankeyContainerGender");
d3.json(`/sankey_files/${text}/Gender`).then(data => {
  

    var chart = anychart.sankey(data);
  
    // set the width of nodes
    chart.nodeWidth("50%");
    
    // set the container id
    chart.container("SankeyContainerGender");
  
    // initiate drawing the chart
    chart.draw();
  });
createChart(text,incomeKeys,incomeNames,true,"Incoming");

d3.select(".container-fluid").append("div").classed("row", true).append("div").classed("col-12", true).attr("id","SankeyContainerIncome");
d3.json(`/sankey_files/${text}/Income`).then(data => {
  

    var chart = anychart.sankey(data);
  
    // set the width of nodes
    chart.nodeWidth("50%");
    
    // set the container id
    chart.container("SankeyContainerIncome");
  
    // initiate drawing the chart
    chart.draw();
  });
createChart(text,raceKeys,raceNames,false,"Racing");
d3.select(".container-fluid").append("div").classed("row", true).append("div").classed("col-12", true).attr("id","SankeyContainerEthnicity");
d3.json(`/sankey_files/${text}/Ethnicity`).then(data => {
  

    var chart = anychart.sankey(data);
  
    // set the width of nodes
    chart.nodeWidth("50%");
    
    // set the container id
    chart.container("SankeyContainerEthnicity");
  
    // initiate drawing the chart
    chart.draw();
  });
createChart(text,educationKeys,educationNames,true,"Educating");
d3.select(".container-fluid").append("div").classed("row", true).append("div").classed("col-12", true).attr("id","SankeyContainerEducation");
d3.json(`/sankey_files/${text}/Education`).then(data => {
  

    var chart = anychart.sankey(data);
  
    // set the width of nodes
    chart.nodeWidth("50%");
    
    // set the container id
    chart.container("SankeyContainerEducation");
  
    // initiate drawing the chart
    chart.draw();
  });
createChart(text,exportKeys,exportNames,false,"Exporting");
createChart(text,politicalKeys,politicalNames,true,"Politicing");
createChart(text,religiousKeys,religiousNames,false,"Religioning");