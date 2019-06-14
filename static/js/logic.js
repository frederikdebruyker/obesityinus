// Center of the US, what the map zooms to and resets to
centerLatLon = [39.8283,-98.5795];
startZoom = 4.5;

// Initial layers go here
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// Layer group 1 of backgrounds for control panel
var brightness = {
    "Terrain": terrain,
    "Dark Mode": dark,
    "Light Mode": light
}

// Base map creation goes here
var map = L.map("map", {
    center: centerLatLon,
    zoom: startZoom,
    layers: [terrain]
});

// Control for first base layers
L.control
.layers(brightness)
.addTo(map);

// This is an object that holds the largest polygon for each state
// It will be for use in placing marker layers with rankings later on
var largestStatePolygon = {};

// Reads in data, highlights each US state on the map
d3.json("/geoJSONData").then(data => {
    data.features.forEach(d => {
        if (d.geometry.type === "MultiPolygon") {
            let lengths = d.geometry.coordinates.map(d => d[0].length);
            var index = lengths.indexOf(d3.max(lengths));
            // var obj = {};
            largestStatePolygon[d.properties.NAME] = d.geometry.coordinates[index][0];
        }
        else {
            largestStatePolygon[d.properties.NAME] = d.geometry.coordinates[0];
        }

    });
    console.log(data.features);
    console.log(largestStatePolygon);
});

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