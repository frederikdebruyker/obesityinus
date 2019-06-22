// var data = [
    var data = [
        {
          "from": "Obesity",
          "to": "Less than 15k",
          "weight": 460.845
        },
        {
          "from": "Obesity",
          "to": "15k-25k",
          "weight": 658.44
        },
        {
          "from": "Obesity",
          "to": "25k-35k",
          "weight": 385.53
        },
        {
          "from": "Obesity",
          "to": "35k-50k",
          "weight": 371.52
        },
        {
          "from": "Obesity",
          "to": "50k-75k",
          "weight": 488.6
        },
        {
          "from": "Obesity",
          "to": "Greater than 75k",
          "weight": 896.5440000000001
        }
       ];
    
      
    
    var sankey_chart = anychart.sankey(data);
    
    sankey_chart.nodeWidth("20%");
    sankey_chart.nodePadding(20);
    
    sankey_chart.container("SankeyContainer");
    sankey_chart.draw();