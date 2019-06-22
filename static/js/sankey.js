data =d3.json(`/sankey_files/${text}/Age`).then(data => {
  console.log(data)

  var chart = anychart.sankey(data);

  // set the width of nodes
  chart.nodeWidth("50%");

  // set the container id
  chart.container("SankeyContainer");

  // initiate drawing the chart
  chart.draw();
});