// Step 1: Loop Through `data` and console.log each weather report object
// // Import Data
d3.json("/happinessData", function(err, happinessData) {
    if (err) throw err;
        // Step 1: Parse Data/Cast as numbers
    // ==============================
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
        
    })
});
  