
d3.json("/happinessData", function(err, happinessData) {
  if (err) throw err;
  var count =0;
  var demSum =0;
  var repSum =0;
  happinessData.forEach(function(state) {
    if (state.republican>state.democrat){
      repSum = repSum+state.republican
      count = count +1
      repAvg= d3.mean(repSum)

    }
    else demSum = demSum+state.democrat
    demAvg = d3.mean(demSum)
  })
  });

createChart("National",politicalKeys,politicalNames)







