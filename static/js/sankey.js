var text= "Texas"

d3.json(`/sankey_files/${text}/Age`).then(data => {
  

  var chart = anychart.sankey(data);

  // set the width of nodes
  chart.nodeWidth("50%");
  
  // set the container id
  chart.container("SankeyContainer");

  // initiate drawing the chart
  chart.draw();
});
d3.json(`/sankey_files/${text}/Education`).then(data => {
  

  var chart = anychart.sankey(data);

  // set the width of nodes
  chart.nodeWidth("50%");
  
  // set the container id
  chart.container("SankeyContainer2");

  // initiate drawing the chart
  chart.draw();
});