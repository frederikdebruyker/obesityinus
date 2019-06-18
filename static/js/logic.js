// Center of the US, what the map zooms to and resets to
centerLatLon = [39.8283,-98.5795];
startZoom = 4.5;

// Base map creation goes here
var map = L.map("map", {
    center: centerLatLon,
    zoom: startZoom
});

// Initial background layer goes here
var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.satellite",
    accessToken: API_KEY
}).addTo(map);

// This is an object that holds the largest polygon for each state
// It will be for use in placing marker layers with rankings later on
var largestStatePolygon = {};

// Reads in data, highlights each US state on the map
d3.json("/geoJSONData").then(data => {
    data.features.forEach(d => {
        // Gets the largest polygon to position the tooltips in.
        if (d.geometry.type === "MultiPolygon") {
            let lengths = d.geometry.coordinates.map(d => d[0].length);
            var index = lengths.indexOf(d3.max(lengths));
            largestStatePolygon[d.properties.NAME] = d.geometry.coordinates[index][0];
        }
        else {
            largestStatePolygon[d.properties.NAME] = d.geometry.coordinates[0];
        }
    });
    
    // Removes Puerto Rico, which is unused
    delete largestStatePolygon["Puerto Rico"];
    data.features = data.features.filter(feature => feature.properties.NAME != "Puerto Rico");
    // Deletes the referece to DC in largest as no marker will be placed there
    // However, the polygon in the data is still used
    delete largestStatePolygon["District of Columbia"];

    // Plots the geoJSON
    L.geoJson(data, {
        // Styles background appearance of the outline
        style: () => {
            return {
                color: "white",
                fillColor: "white",
                fillOpacity: .5,
                weight: 1.5
            };
        },

        onEachFeature: (feature, layer) => {
            layer.on({
                // Zooms to state when clicked
                click: event => {
                    map.flyToBounds(event.target.getBounds());
                },
                // Resets to base when right clicked and closes popup
                contextmenu: ()=>{
                    layer.closePopup();
                    map.flyTo(centerLatLon, startZoom);
                }
            });
            // Creates link to page containing more data
            // Except for DC, which we have no data on
            if (feature.properties.NAME != "District of Columbia") {
                layer.bindPopup(`<a href="/stateInfo/${feature.properties.NAME}">Click Me For More Info!</a>`);
            } else  {
                layer.bindPopup("Your princess is in another castle!<br>Try a state!");
            }
        }
    }).addTo(map);


    // Adds the rankings/info of each layer as a separate layer
    // Lets people explore data themselves
    d3.json("/happinessData").then(allStates => {
        // Removes the dictionary for whole US as it won't be used
        allStates = allStates.filter(a => a.id != "National")

        // Creates an object of lat lng objects that have been converted
        // to an array and reversed, cause it's own lat longs are
        // used backwards by the marker function
        var markerSpots = {};
        Object.keys(largestStatePolygon).forEach(key => {
            // Gets the initial latlng object
            // Then converts it to an array and reverses it
            markerSpots[key] = Object.values(
                L.polygon(largestStatePolygon[key])
                    .getBounds().getCenter()
            ).reverse()
            
        });

        // Creates the layers to be added as a layer control
        var rankingLayer = {
            "Healthiness":sorter("total_obesity",allStates,markerSpots,false),
            "Republican Leaning":sorter("republican",allStates,markerSpots),
            "Democratic Leaning":sorter("democrat",allStates,markerSpots),
            "Religiosity":sorter("strongly_religious",allStates,markerSpots),
            "Produce Consumption":sorter("produce",allStates,markerSpots),
            "Excercise":sorter("excercise",allStates,markerSpots),
            "Happiness":sorter("overall_wellbeing",allStates,markerSpots),
            "Animal Exports":sorter("animals_us_millions",allStates,markerSpots),
            "Dairy Exports":sorter("dairy_us_millions",allStates,markerSpots),
            "Agricultural Exports":sorter("agriculture_us_millions",allStates,markerSpots)
        };
        // Adding the Healthiness layer to map.
        rankingLayer["Healthiness"].addTo(map);

        // Creates the variable that will be used to make everything binary colors
        // Also creates outline path variables
        var zerone;
        var individual;
        // Creates a geojson level for Democratic vs Republican
        var demreb = L.geoJson(data, {
            // Styles background appearance of the outline
            style: (feature) => {
                // Makes DC blend in with Maryland, which we have data on
                // Prevents weird white dot on map
                if (feature.properties.NAME != "District of Columbia") {
                    individual = allStates.find(b => b.id === feature.properties.NAME);
                } else {
                    individual = allStates.find(b => b.id === "Maryland");
                }

                // Sets the color based off relevant property
                if (individual.republican > individual.democrat) {
                    zerone = "red";
                }
                else if (individual.republican < individual.democrat) {
                    zerone = "blue";
                }
                else {
                    zerone = "purple";
                }
                return {
                    color: "teal",
                    fillColor: zerone,
                    fillOpacity: .4,
                    weight: 1.5
                };
            },
    
            onEachFeature: (feature, layer) => {
                layer.on({
                    // Zooms to state when clicked
                    click: event => {
                        map.flyToBounds(event.target.getBounds());
                    },
                    // Resets to base when right clicked and closes popup
                    contextmenu: ()=>{
                        layer.closePopup();
                        map.flyTo(centerLatLon, startZoom);
                    }
                });
                // Creates link to page containing more data
                layer.bindPopup(`<a href="/stateInfo/${feature.properties.NAME}">Click Me For More Info!</a>`);
            }
        });
        // Creates a geojson level for Very Religious vs Not Religious
        var relath = L.geoJson(data, {
            // Styles background appearance of the outline
            style: (feature) => {
                // Makes DC blend in with Maryland, which we have data on
                // Prevents weird white dot on map
                if (feature.properties.NAME != "District of Columbia") {
                    individual = allStates.find(b => b.id === feature.properties.NAME);
                } else {
                    individual = allStates.find(b => b.id === "Maryland");
                }

                // Sets the color based off relevant property
                if (individual.strongly_religious > individual.non_religious) {
                    zerone = "yellow";
                }
                else if (individual.strongly_religious < individual.non_religious) {
                    zerone = "green";
                }
                else {
                    zerone = "black";
                }
                return {
                    color: "teal",
                    fillColor: zerone,
                    fillOpacity: .4,
                    weight: 1.5
                };
            },
    
            onEachFeature: (feature, layer) => {
                layer.on({
                    // Zooms to state when clicked
                    click: event => {
                        map.flyToBounds(event.target.getBounds());
                    },
                    // Resets to base when right clicked and closes popup
                    contextmenu: ()=>{
                        layer.closePopup();
                        map.flyTo(centerLatLon, startZoom);
                    }
                });
                // Creates link to page containing more data
                layer.bindPopup(`<a href="/stateInfo/${feature.properties.NAME}">Click Me For More Info!</a>`);
            }
        });

        // The control overlay for the demreb and relath layers
        var binaryLayers = {
            "Democrat vs. Republican": demreb,
            "Very Religious vs. Not Religious": relath
        };
        // Control for all layers
        // Ensures that only one of each category can be displayer at the same time
        L.control
        .layers(rankingLayer, binaryLayers)
        .addTo(map);

    });
});

<<<<<<< HEAD

function sorter(key, stateObjects, markerSpots,desc=true) {
    // Creates the array to be passed back to the layer group
    var markers = [];
    // Sorts asc or desc as specified
    if (desc) {
        stateObjects.sort((a,b) => b[key] - a[key]);
    }
    else {
        stateObjects.sort((a,b) => a[key] - b[key]);
    }
    stateObjects.forEach((sorted,index) => {
        markers.push(L.circle(markerSpots[sorted.id],{
            opacity:0,
            fillOpacity:0,
            interactive:0,
            }).bindTooltip((index+1).toString(), {
                permanent: true,
                direction: "center",
                className: "ranking"}));
    });
    return L.layerGroup(markers)
}
=======
// Old stuff, it will be segmented and folded into the new stuff and then deleted
// d3.json(geoURL).then( data => {
//     // Orders the percent obesity in a separate array
//     let fatOrder = data.features.map(d => d.properties.Obesity);
//     fatOrder.sort((a,b)=>a-b);
//     var percentObese = L.geoJson(data, {
//         // Feature can be removed if we don't end up using it
//         style: feature => {
//             return {
//                 color: "grey",
//                 fillColor: "white",
//                 fillOpacity: .8,
//                 weight: 1.5
//             };
//         },

//         onEachFeature: (feature, layer) => {
//             layer.bindTooltip(feature.properties.Obesity.toString(), {
//                 permanent: true,
//                 direction: "center",
//                 className: "ranking"});

//             layer.on({
//                 // Zooms to state when clicked
//                 click: event => {
//                     map.flyToBounds(event.target.getBounds());
//                 },
//                 // Resets to base when right clicked
//                 contextmenu: ()=>{
//                     map.flyTo(centerLatLon, startZoom);
//                 }
//             });
//         }
//     });

//     var healthyRanking = L.geoJson(data, {
//         // Feature can be removed if we don't end up using it
//         style: feature => {
//             return {
//                 color: "grey",
//                 fillColor: "white",
//                 fillOpacity: .8,
//                 weight: 1.5
//             };
//         },

//         onEachFeature: (feature, layer) => {
//             layer.bindTooltip((fatOrder.indexOf(feature.properties.Obesity)+1).toString(), {
//                 permanent: true,
//                 direction: "center",
//                 className: "ranking"});

//             layer.on({
//                 // Zooms to state when clicked
//                 click: event => {
//                     map.flyToBounds(event.target.getBounds());
//                 },
//                 // Resets to base when right clicked
//                 contextmenu: ()=>{
//                     map.flyTo(centerLatLon, startZoom);
//                 }
//             });
//         }
//     }).addTo(map); 

//     // Second Layer Group for the control
//     var obesityInfo = {
//         "Percent Obesity": percentObese,
//         "Who's the Healthiest?": healthyRanking
//     }
    
//     // Control for more baseLayers, has to be a second command so they
//     // aren't treated as overlays
//     L.control
//     .layers(obesityInfo)
//     .addTo(map);
// });

>>>>>>> 50d20052d857626c920dd67463becf463de722f6
