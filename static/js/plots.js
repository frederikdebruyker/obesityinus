



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
function age(){
  
  var age =[+data.age_18_24_count, +data.age_25_34_count, +data.age_35_44_count, +data.age_45_54_count , +data.age_55_64_count, +data.age_65_count ];
  return age;
 
}
console.log(age);   


// import data
d3.json("/happinessData/National", function(err, happinessData) {
    if (err) throw err;
// console.log(happinessData)
  // parse data
  

    happinessData.forEach(function(data) {
    
      data.age_18_24_count = + data.age_18_24_count;
      data.age_25_34_count = +data.age_25_34_count;
      data.age_35_44_count = +data.age_35_44_count;
      data.age_45_54_count = +data.age_45_54_count;
      data.age_55_64_count = +data.age_55_64_count;
      data.age_65_count = +data.age_65_count;
      data.age_18_24_obesity = +data.age_18_24_obesity;
      data.age_25_34_obesity = +data.age_25_34_obesity;
      data.age_35_44_obesity = +data.age_35_44_obesity;
      data.age_45_54_obesity = +data.age_45_54_obesity;
      data.age_55_64_obesity = +data.age_55_64_obesityt;
      data.age_65_obesity = +data.age_65_obesity;
      
      // var age_18_24_count = data.age_18_24_count;
      // var age_25_34_count = data.age_25_34_count;
      // var age_35_44_count = data.age_35_44_count;
      // var age_45_54_count = data.age_45_54_count;
      // var age_55_64_count = data.age_55_64_count;
      // var age_65_count = data.age_65_count;
     
      var trace =[
        {
          x: [ '18-24','25-34','35-44','45-54','55-64','65'],
          y: [age],
          type: 'bar'

        }
        
      ];
      


    });
    
  
    console.log(data)
});

// plotly.newPlot("barPlot",trace);