



// console.log('BEFORE:',data.slice(0,2))
// data.sort(function(a, b) {
//  return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
// });
// console.log('AFTER:',data.slice(0,2))

// // Slice the first 10 objects for plotting
// data = data.slice(0, 10);

// // Reverse the array due to Plotly's defaults
// data = data.reverse();

// // Trace1 for the Greek Data
// var trace1 = {
//  x: data.map(row => row.greekSearchResults),
//  y: data.map(row => row.greekName),
//  text: data.map(row => row.greekName),
//  name: "Greek",
//  type: "bar",
//  orientation: "h",
//  colorscale:'white'
//  // bgcolor:'gray'
// };

// // data
// var data = [trace1];

// // Apply the group bar mode to the layout
// var layout = {
//  title: "Greek gods search results",
//  margin: {
//    l: 100,
//    r: 100,
//    t: 100,
//    b: 100
//  },
//  plot_bgcolor : '#182844'
// };

// // Render the plot to the div tag with id "plot"
// Plotly.newPlot("plot", data, layout);

  
  // var age =[+data.age_18_24_count, +data.age_25_34_count, +data.age_35_44_count, +data.age_45_54_count , +data.age_55_64_count, +data.age_65_count ];
  // console.log(age);
 


// import data
d3.json("chartFunc.json", function(err, happinessData) {
    if (err) throw err;
    happinessData.forEach(function(data) {
      console.log(data) 
    });
    
  
  

});

