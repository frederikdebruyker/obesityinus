// import{select,scaleLinear,max} from d3;

var svgWidth = 960;
var svgHeight = 560;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#barchart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//   function xScale(happinessData, chosenXAxis) {
//     // create scales
//     var xLinearScale = d3.scaleLinear()
//       .domain([d3.min(happinessData, d => d[chosenXAxis]),
//         d3.max(happinessData, d => d[chosenXAxis]) 
//       ])
//       .range([0, width]);

//     return xLinearScale;

//   }
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);
//  age();
// obesity();
// function age(){
//      age =  [data.age_18_24_count,data.age_25_34_count,data.age_35_44_count,data.age_45_54_count ,data.age_55_64_count,data.age_65_count];


// }
// console.log(age)

// function obesity(){
//      obesity =new Array([data.age_18_24_obesit,data.age_25_34_obesity ,data.age_35_44_obesity,data.age_45_54_obesity,data.age_55_64_obesity,data.age_65_obesity]);

// }
console.log(typeof data)

var render = data => {


    let age = [data.age_18_24_count, data.age_25_34_count, data.age_35_44_count, data.age_45_54_count, data.age_55_64_count, data.age_65_count];
    let obesity = [data.age_18_24_obesity, data.age_25_34_obesity, data.age_35_44_obesity, data.age_45_54_obesity, data.age_55_64_obesity, data.age_65_obesity];

    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.age)])
        .range([0, innerWidth]);
    //   console.log(xScale.domain());
    var yScale = d3.scaleBand()
        .domain(data.map(d => d.age))
        .range([0, innerHeight])
        .padding(0.1)
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    var g = svg.append('g')
    g.append('g').call(bottomAxis)
        .attr('transform', `translate(${margin.left},${margin.top})`);


    g.append('g').call(leftAxis)
        .attr('transform', `translate(0,${innerHeight})`)

    g.selectAll('rect').data(data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(d.obesity))
        .attr('width', d => xScale(d.age))
        .attr('height', yScale.bandwidth())

    console.log();


}
// render(data);
console.log(typeof data)
data = [];
// // Import Data
d3.json("/happinessData", function (err, happinessData) {
    if (err) throw err;

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // Object.entries(happinessData).forEach(function ([key, value]) {

        
    //     console.log( value.age_18_24_count);
    //     data.age_18_24_count = +value.age_18_24_count;
    //     data.age_25_34_count = +value.age_25_34_count;
    //     data.age_35_44_count = +value.age_35_44_count;
    //     data.age_45_54_count = +value.age_45_54_count;
    //     data.age_55_64_count = +value.age_55_64_count;
    //     data.age_65_count = +value.age_65_count;
    //     data.age_18_24_obesity = +value.age_18_24_obesity;
    //     data.age_25_34_obesity = +value.age_25_34_obesity;
    //     data.age_35_44_obesity = +value.age_35_44_obesity;
    //     data.age_45_54_obesity = +value.age_45_54_obesity;
    //     data.age_55_64_obesity = +value.age_55_64_obesityt;
    //     data.age_65_obesity = +value.age_65_obesity;

    // });
    console.log(data);
    happinessData.forEach(function (data) {
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
        // console.log(data.age_18_24_count)

    // })
    // console.log(happinessData);
    render(happinessData);
});

// // Step 1: Loop Through `data` and console.log each weather report object
// happinessData.forEach(function(data) {
//     console.log(data);
// });

// // happinessData.forEach((data) => {

//     var row = tbody.append("tr");

//     Object.values(data).forEach((value) => {

//       row.append("td").text(value);

//     });
//     console.log(row)
//   });






