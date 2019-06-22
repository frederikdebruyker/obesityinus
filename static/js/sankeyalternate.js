var data = [
    { from: "Obesity", to: "Below 17K", weight: 20000 },
    { from: "Obesity", to: "17-25K", weight: 17000 },
    { from: "Obesity", to: "25K-35K", weight: 8000 },
    { from: "Obesity", to: "35-45K", weight: 11000 },
    { from: "Obesity", to: "45-60K", weight: 7500 },
    { from: "Obesity", to: "60-75K", weight: 5000 },
    { from: "Obesity", to: "Over 75K", weight: 4000 }
];

var sankey_chart = anychart.sankey(data);

sankey_chart.nodeWidth("100%");
sankey_chart.nodePadding(20000);

sankey_chart.container("SankeyContainer");
sankey_chart.draw();