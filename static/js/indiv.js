// .text() doesn't return the text. Weird.
// Gets input state
var text = d3.select("#inputin").node().innerHTML

createChart(text,ageKeys,ageNames);
createChart(text,sexKeys,sexNames,false);
createChart(text,incomeKeys,incomeNames);
createChart(text,raceKeys,raceNames,false);
createChart(text,educationKeys,educationNames);
createChart(text,exportKeys,exportNames,false);
createChart(text,politicalKeys,politicalNames);