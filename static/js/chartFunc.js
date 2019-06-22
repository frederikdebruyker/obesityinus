// Groups the keys for each graph
// Could've been done programatically with better naming convention
var ageKeys = ["age_18_24_obesity","age_25_34_obesity","age_35_44_obesity","age_45_54_obesity","age_55_64_obesity","age_65_obesity"];
var ageNames = ["18-24","25-34","35-44","45-54","55-64","65+"];

var sexKeys = ["female_obesity","male_obesity"];
var sexNames = ["Female","Male"];

var incomeKeys = ["us_15_k_obesity","us_15_25_k_obesity","us_25_35_k_obesity","us_35_50_k_obesity","us_50_75_k_obesity","us_75_k_obesity"];
var incomeNames = ["Less than 15k","15k-25k","25k-35k","35k-50k","50k-75k","Greater than 75k"];

var raceKeys = ["american_indian_alaska_native_obesity","hawaiian_pacific_islander_obesity","hispanic_obesity","multi_racial_obesity","nonhispanic_black_obesity","nonhispanic_white_obesity","other_race_obesity"];
var raceNames = ["American Indian or Alaskan Native","Hawaiian or Pacific Islander","Hispanic","Multi-Racial","Non-Hispanic Black","Non-Hispanic White","Other"];

var educationKeys = ["college_grad_obesity","technical_partial_college_obesity","high_school_grad_obesity","less_than_high_school_obesity"];
var educationNames = ["College Grad", "Technical School or Partial College","High School","Less than High School"];

var exportKeys = ["agriculture_us_millions","animals_us_millions","dairy_us_millions"];
var exportNames = ["Agriculture $M", "Animal Products $M", "Dairy $M"];

var politicalKeys = ["democrat","republican"];
var politicalNames = ["Democrat","Republican"];

var religiousKeys =["non_religious","strongly_religious"];
var religiousNames= ["Non-Religious","Religious"]

function createChart(state, keys, names) {
    // Creates list to hold values
    var values = [];
    // Append svg and set dimensions
    var svg = d3.select(".container-fluid")
    .append("div")
    .classed("row",true)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
    // Add location actual chart will be on
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    d3.json(`/happinessData/${state}`).then(data => {
        // Pulls it out of the list
        data = data[0]
        // Gets relevant values
        keys.forEach(key=>{
            if (data[key] != "not_significant") {
                values.push(parseFloat(data[key]))
            }
            else {
                values.push(0.0)
            }
        });
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
    });
}