// Reads in data, highlights each US state on the map
var maxState = '';
var maxPerc = 0;
var minState = '';
var minPerc = 100;
var federalPerc = 0;

d3.json("/happinessData").then(data => {
    data.forEach(d => {
        if ( d.total_obesity > maxPerc ) {
          maxState = d.abbr;
          maxPerc = d.total_obesity;
          console.log('max',maxState, maxPerc);

        }
        if ( d.total_obesity < minPerc ) {
          minState = d.abbr;
          minPerc = d.total_obesity;
          console.log('min',minState, minPerc);
        }
        if ( d.abbr == 'US' ) {
          federalPerc = d.total_obesity;
          console.log('federal',federalPerc);
        }
        console.log(d.abbr);
    });
});
console.log('max',maxState, maxPerc);
console.log('min',minState, minPerc);

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
