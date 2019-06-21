var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d)},
    color = d3.scale.category20();
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr('transform', `translate(${margin.left} + "," ${margin.top})`);
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);
var path = sankey.link();
// var freqCounter = 1;
d3.json("/sankey_files/Florida/Income", energy => {
    console.log (energy)
  sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(32);
  var link = svg.append("g").selectAll(".link")
      .data(energy.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", d => Math.max(21, d.dy))
      .sort((a, b) => b.dy - a.dy)
      link
      .on('mouseover', function () {
        d3.select(this)
          .style('stroke-opacity', 0.25);
      })
      .on('mouseout', function () {
        d3.select(this)
          .style('stroke-opacity', 0.15);
  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });
  var node = svg.append("g").selectAll(".node")
      .data(energy.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      // .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .style('fill', (d, i) => {d.color = color(i);return d.color;
      })
      .style("stroke", "none")
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x",  sankey.nodeWidth())
      .attr("text-anchor", "start");
  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
  var linkExtent = d3.extent(energy.links, function (d) {return d.value});
  var frequencyScale = d3.scale.linear().domain(linkExtent).range([0.05, 1]);
  // var particleSize = 
  d3.scale.linear().domain(linkExtent).range([1,5]);
  energy.links.forEach(currentLink => {
    currentLink.freq = frequencyScale(currentLink.value);
    currentLink.particleSize = 1.5;
    currentLink.particleColor = d3.scale.linear().domain([1, 3])
    .range([currentLink.source.color, currentLink.target.color]);
  });
  // energy.links.forEach(function (link) {
  //   link.freq = frequencyScale(link.value);
  //   link.particleSize = particleSize(link.value);
  //   link.particleColor = d3.scale.linear().domain([1,1000]).range([link.source.color, link.target.color]);
  })
  // var t = 
  d3.timer(tick, 1000);
  let particles = [];
    function tick(elapsed /* , time */) {
      particles = particles.filter(d => d.current < d.path.getTotalLength());
  // var particles = [];
  // function tick(elapsed, time) {
  //   particles = particles.filter(function (d) {return d.time > (elapsed - 1000)});
  //   if (freqCounter > 100) {
  //     freqCounter = 1;
  //   }
    d3.selectAll("path.link")
    .each(
      function (d) {
        //        if (d.freq < 1) {
                for (let x = 0; x < 2; x++) {
                  const offset = (Math.random() - 0.5) * (d.dy - 4);
                  if (Math.random() < d.freq) {
                    const length = this.getTotalLength();
                    particles.push({
                      link: d,
                      time: elapsed,
                      offset,
                      path: this,
                      length,
                      animateTime: length,
                      speed: 0.5 + (Math.random())
                    });
                  }
                }
              });
    particleEdgeCanvasPath(elapsed);
    // freqCounter++;
  }
  function particleEdgeCanvasPath(elapsed) {
    var context = d3.select("canvas").node().getContext("2d")
    context.clearRect(0,0,1000,1000);
      context.fillStyle = "gray";
      context.lineWidth = "1px";
//     for (var x in particles) {
//         var currentTime = elapsed - particles[x].time;
//         var currentPercent = currentTime / 1000 * particles[x].path.getTotalLength();
//         var currentPos = particles[x].path.getPointAtLength(currentPercent)
//         context.beginPath();
//       context.fillStyle = particles[x].link.particleColor(currentTime);
//         context.arc(currentPos.x,currentPos.y + particles[x].offset,particles[x].link.particleSize,0,2*Math.PI);
//         context.fill();
//     }
//   }
// });
for (const x in particles) {
  if ({}.hasOwnProperty.call(particles, x)) {
    const currentTime = elapsed - particles[x].time;
//        let currentPercent = currentTime / 1000 * particles[x].path.getTotalLength();
    particles[x].current = currentTime * 0.15 * particles[x].speed;
    const currentPos = particles[x].path.getPointAtLength(particles[x].current);
    context.beginPath();
    context.fillStyle = particles[x].link.particleColor(0);
    context.arc(
      currentPos.x,
      currentPos.y + particles[x].offset,
      particles[x].link.particleSize,
      0,
      2 * Math.PI
    );
    context.fill();
  }
}
}
});