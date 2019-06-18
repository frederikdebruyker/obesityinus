// Reads in data, highlights each US state on the map
d3.json("/geoJSONData").then(data => {
    data.features.forEach(d => {

        // console.log(d.properties.NAME);
        // console.log(d.properties.obesity);
        // console.log(d)
    
    });
});

// Wrap every letter in a span
$('.ml7 .letters').each(function(){
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
  });
  
  anime.timeline({loop: true})
    .add({
      targets: '.ml7 .letter',
      translateY: ["1.1em", 0],
      translateX: ["0.55em", 0],
      translateZ: 0,
      rotateZ: [180, 0],
      duration: 750,
      easing: "easeOutExpo",
      delay: function(el, i) {
        return 50 * i;
      }
    }).add({
      targets: '.ml7',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });
