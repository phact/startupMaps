$(document).ready(function() {

$("#slider").slider({
	value:21,
	min: 1,
	max: 21,
	step: 1,
	slide: function( event, ui ) {
		$("#month").val(ui.value);
		redraw(ui.value.toString());
	}
});
$("#month").val($("#slider").slider("value") );

var w = 1200;
var h = 500;

var xy = d3.geo.equirectangular()
          .scale(1000);

var path = d3.geo.path()
    .projection(xy);

var svg = d3.select("#graph").insert("svg:svg")
	.attr("width", w)
        .attr("height", h);

var states = svg.append("svg:g")
    .attr("id", "states");

var circles = svg.append("svg:g")
    .attr("id", "circles");

var labels = svg.append("svg:g")
    .attr("id", "labels");

d3.json("world-countries.json", function(collection) {
  states.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
      .attr("d", path)
            .on("mouseover", function(d) {
                d3.select(this).style("fill","#d1b7a3")
                    .append("svg:title")
                    .text(d.properties.name);})
            .on("mouseout", function(d) {
                d3.select(this).style("fill","#ccc");})
});


//http://stackoverflow.com/questions/11386150/lat-lon-positon-on-a-d3-js-map
// +convert to string to number

var scalefactor=17. ;

var bubbleScale = d3.scale.log(100);

d3.csv("startups.csv", function(csv) {
  circles.selectAll("circle")
      .data(csv)
    .enter()
    .append("svg:circle")
      .attr("cx", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
      .attr("cy", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]; })
      .attr("r",  function(d) { 
		  return +bubbleScale(d["21"])*scalefactor; 
	  })
      .attr("title",  function(d) { return d["country"]+": "+Math.round(d["21"]); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill","#0d7e9e");})
            .on("mouseout", function(d) {
                d3.select(this).style("fill","#cb5f17");});

  labels.selectAll("labels")
      .data(csv)
    .enter()
    .append("svg:text")
        .attr("x", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[0]; })
        .attr("y", function(d, i) { return xy([+d["longitude"],+d["latitude"]])[1]; })
        .attr("dy", "0.3em")
        .attr("text-anchor", "middle")
		.attr("pointer-events","none")
        .text(function(d) { return Math.round(d["21"]); });

});

function redraw(month) {
      circles.selectAll("circle")
	  .transition()
          .duration(100).ease("linear")
          .attr("r",  function(d) { return +bubbleScale(d[month])*scalefactor;  })
          .attr("title",  function(d) { return d["country"]+": "+Math.round(d[month]); });

      labels.selectAll("text")
          .text(function(d) { return Math.round(d[month]); });
}

});