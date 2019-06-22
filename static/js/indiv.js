// .text() doesn't return the text. Weird.
// Gets input state
var text = d3.select("#inputin").node().innerHTML

createChart(text,ageKeys,ageNames,true,"Aging");
createChart(text,sexKeys,sexNames,false,"Sexing");
createChart(text,incomeKeys,incomeNames,true,"Incoming");
createChart(text,raceKeys,raceNames,false,"Racing");
createChart(text,educationKeys,educationNames,true,"Educating");
createChart(text,exportKeys,exportNames,false,"Exporting");
createChart(text,politicalKeys,politicalNames,true,"Politicing");