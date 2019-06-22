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
createChart(text,sexKeys,sexNames,false,"Sexing");
createChart(text,incomeKeys,incomeNames,true,"Incoming");
createChart(text,raceKeys,raceNames,false,"Racing");
createChart(text,educationKeys,educationNames,true,"Educating");
createChart(text,exportKeys,exportNames,false,"Exporting");
createChart(text,politicalKeys,politicalNames,true,"Politicing");
createChart(text,religiousKeys,religiousNames,false,"Religioning");