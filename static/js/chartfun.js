// Gets data to make graphs
// Creates chart size
// Width is also constrained by Bootstrap
svgWidth = Math.round(window.innerWidth*.5);
svgHeight = Math.round(window.innerHeight*.3);
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 40
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
// Groups the keys for each graph
// Could've been done programatically with better naming convention
var ageKeys = ["age_18_24_obesity","age_25_34_obesity","age_35_44_obesity","age_45_54_obesity","age_55_64_obesity","age_65_obesity"];
var ageNames = ["18-24","25-34","35-44","45-54","55-64","65+"];
var title=["Age Group","Gender","Income","Race","Educatio"]
var sexKeys = ["female_obesity","male_obesity"];
var sexNames = ["Female","Male"];

var incomeKeys = ["us_15_k_obesity","us_15_25_k_obesity","us_25_35_k_obesity","us_35_50_k_obesity","us_50_75_k_obesity","us_75_k_obesity"];
var incomeNames = ["Less than 15k","15k-25k","25k-35k","35k-50k","50k-75k","Greater than 75k"];

var raceKeys = ["american_indian_alaska_native_obesity","hawaiian_pacific_islander_obesity","hispanic_obesity","multi_racial_obesity","nonhispanic_black_obesity","nonhispanic_white_obesity","other_race_obesity"];
var raceNames = ["American Indian or Alaskan Native","Hawaiian or Pacific Islander","Hispanic","Multi-Racial","Non-Hispanic Black","Non-Hispanic White","Other"];

var educationKeys = ["college_grad_obesity","technical_partial_college_obesity","high_school_grad_obesity","less_than_high_school_obesity"];
var educationNames = ["College Grad", "Technical School or Partial College","High School","Less than High School"];

// var exportKeys = ["agriculture_us_millions","animals_us_millions","dairy_us_millions"];
// var exportNames = ["Agriculture $M", "Animal Products $M", "Dairy $M"];

// var politicalKeys = ["democrat","republican"];
// var politicalNames = ["Democrat","Republican"];

// var religiousKeys =["non_religious","strongly_religious"];
// var religiousNames= ["Non-Religious","Religious"];

// function createChart(state, keys, names, left=true,extraClass,title) {
//     // Creates list to hold values
//     var values = [];
//     // Append svg and set dimensions
//     var rowDic = d3.select(".container-fluid")
//     .append("div")
//     .classed(`row ${extraClass}`,true)
//     if (left) {
//         var svg = rowDic.append("div")
//         .classed("col-md-6",true)
//         .append("svg")
//         .attr("height", svgHeight)
//         .attr("width", svgWidth);
//         var text = rowDic.append("div")
//         .classed("col-md-6 my-auto",true)
//         .append("p")
//         .classed("text-center",true)
//         .text("THIS IS A TEST< I DON'T KNOW WHY I AM YELLING! WORDS WORDS FSDNJ FSNAJ  SAFNJASD FSNO AFSANJO  SDANJOD DSNJIDSAN  DSODSNOJ SDNJIOADS DSANOJ ASOSOADS DSNAOS DSANO DSADSNOA");
//     } else {
//         var text = rowDic.append("div")
//         .classed("col-md-6 my-auto",true)
//         .append("p")
//         .classed("text-center",true)
//         .text("THIS IS A TEST< I DON'T KNOW WHY I AM YELLING! WORDS WORDS FSDNJ FSNAJ  SAFNJASD FSNO AFSANJO  SDANJOD DSNJIDSAN  DSODSNOJ SDNJIOADS DSANOJ ASOSOADS DSNAOS DSANO DSADSNOA");
//         var svg = rowDic.append("div")
//         .classed("col-md-6",true)
//         .append("svg")
//         .attr("height", svgHeight)
//         .attr("width", svgWidth);
//     }

function createChart(state, keys, names, left=true,extraClass) {
    var switchDic = {
        "age_18_24_obesity":["Age (Years)","% Obesity",
            "Obesity typically rises with age until your late 50s and decreases significantly once you reach half a decade past 60."],
        "female_obesity":["Gender","% Obesity",
            "Obesity is usually almost equal between the genders queried here, with men being slightly higher."],
        "us_15_k_obesity":["Income","% Obesity",
            "The percentage of people who are overweight by bracket typically decreases the more those people make."],
        "hispanic_obesity":["Ethnicity/Race","% Obesity",
            "American Indians or Alaskan Natives and Non-Hispanic Blacks have the highest odds of being obese, and Other is often the lowest. Hispanic, Hawaiian or Pacific Islanders, and Multi-Racial people are between the two and are usually somewhat equal. Non-Hispanic White is also usually slightly less than those three but slightly more than Other."],
        "college_grad_obesity":["Education Level","% Obesity",
            "The percentage of people who are overweight by bracket usually increases the lower your level of education."],
        "agriculture_us_millions":["Exports","Amount in US Millions",
            "This chart displays how much of various food products that the state produces and exports."],
        "democrat":["Political Alignment","% Pop in Alignment",
            "This chart displays the exact percentages of the population of the state that align with the Democrats or the Republicans."],
        "non_religious":["Religiosity","% Pop in Alignment",
            "This chart displays the exact percentages of the population that are religious or non-religious in alignment."]
    };
    // Creates list to hold values
    var values = [];
    // Append svg and set dimensions
    var rowDic = d3.select(".container-fluid")
    .append("div")
    .classed(`row ${extraClass}`,true)
    if (left) {
        var svg = rowDic.append("div")
        .classed("col-md-6",true)
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
        var descriptor = rowDic.append("div")
        .classed("col-md-6 my-auto",true)
        .append("p")
        .classed("text-center",true)
    } else {
        var descriptor = rowDic.append("div")
        .classed("col-md-6 my-auto",true)
        .append("p")
        .classed("text-center",true)
        var svg = rowDic.append("div")
        .classed("col-md-6",true)
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
    }
    descriptor.text(switchDic[keys[0]][2]);
    // Adds text descriptors of charts and trends.
// Add location actual chart will be on
        // Add location actual chart will be on
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    d3.json(`/happinessData/${state}`,function(error, data) {
        if (error) throw error;
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

        // Add labels
        // xAxis.append("text").text("HEYEYEYEYEYE")
        // Append two SVG group elements to the chartGroup area,
        // and create the bottom and left axes inside of them
        chartGroup.append("g")
        .call(yAxis);

        chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor","end")
        .attr("transform","rotate(-15)");

        // Create one SVG rectangle per piece of Data
        // Use the linear and band scales to position each rectangle within the chart
        values.forEach((point,index)=>{
            chartGroup.append("rect")
            .attr("class", "bar")
            .attr("x", xScale(names[index]))
            .attr("y", yScale(point))
            .attr("width", xScale.bandwidth())
            .attr("height", (chartHeight - yScale(point)));

            chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30 - chartMargin.left)
            .attr("x", 0- (height / 2))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Percent Obesity (%)");

            var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
                labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            //  .attr("value", "overall_wellbeing") // value to grab for event listener
            //  .classed("active", true)
            .text(`${names}`);
                });
    });
}