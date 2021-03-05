//Treemap created based on FCC assignment
// set the dimensions and margins of the graph
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
width = 900 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.
select("#visualGraph").
append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom);

// Define the div for the tooltip
var tooltip = d3.
select("body").
append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);

var legend = d3.
select("#legend-container").
append("svg").
attr("id", "legend").
attr("width", width).
attr("height", 50);

var color = d3.scaleOrdinal(d3.schemeDark2);
var categories = [];

d3.json(
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
function (error, data) {
  if (error) throw error;
  // Pass data to the following cluster layout:
  var root = d3.
  hierarchy(data).
  each(function (d) {
    if (d.depth === 1) {
      categories.push(d.data.name);
    }
  }).
  sum(function (d) {
    return d.value;
  }) // Size of each leave is assigned according to the 'value' field in input data
  .sort(function (a, b) {
    return b.height - a.height || b.value - a.value;
  }); //

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap().size([width, height]).padding(2)(root); // :Lays out the specified root hierarchy

  // Draw a rectangle for each element of the hierarchy:
  var cell = svg.
  selectAll("g").
  data(root.leaves()).
  enter().
  append("g").
  attr("class", "group").
  attr("transform", function (d) {
    return "translate(" + d.x0 + "," + d.y0 + ")";
  });

  cell.
  append("rect").
  attr("id", function (d) {return d.data.id;}).
  attr("class", "tile").
  attr("id", function (d, i) {
    return i;
  }).
  attr("width", function (d) {
    return d.x1 - d.x0;
  }).
  attr("height", function (d) {
    return d.y1 - d.y0;
  }).
  attr("data-name", function (d) {
    return d.data.name;
  }).
  attr("data-category", function (d) {
    return d.data.category;
  }).
  attr("data-value", function (d) {
    return d.data.value;
  }).
  style("stroke", "black").
  style("fill", function (d) {
    while (d.depth > 1) {
      d = d.parent;
      return color(d.data.name);
    }
  }).
  on("mousemove", function (d) {
    tooltip.transition().duration(500).style("opacity", 0.9);
    tooltip.
    html(
    "Name: " +
    d.data.name +
    "<br>Category: " +
    d.data.category +
    "<br>Value: " +
    d.data.value).

    attr("data-value", d.data.value).
    style("left", d3.event.pageX - 5 + "px").
    style("top", d3.event.pageY + 10 + "px");
  }).
  on("mouseout", function (d) {
    tooltip.style("opacity", 0);
  });

  // Define a clip path to hide overflowing text, use limits of each rect element appended before
  var path = cell.
  append("clipPath").
  attr("id", function (d, i) {
    return `clipPath-${i}`;
  }).
  append("use").
  attr("xlink:href", function (d, i) {
    return `#${i}`;
  });

  // ...and add the text labels on each leaf (overflow is hidden by defining a clip path that corresponds to the limits of each leaf and that trims the text outside aforementioned limits)
  cell.
  append("text").
  attr("clip-path", function (d, i) {
    return `url( "#clipPath-${i}" )`;
  }).
  attr("class", "tile-text").
  selectAll("tspan").
  data(function (d) {
    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
  }).
  enter().
  append("tspan").
  attr("x", 5).
  attr("y", function (d, i) {
    return 15 + i * 12;
  }).
  attr("fill", "white").
  attr("font-size", "12px").
  attr("pointer-events", "none").
  text(function (d) {
    return d;
  });

  // Append visual elements to the legend to read data in the treemap
  legend.
  selectAll("rect").
  data(categories).
  enter().
  append("rect").
  attr("class", "legend-item").
  attr("x", function (d, i) {
    return i * width / categories.length + 5;
  }).
  attr("y", 20).
  attr("width", 20).
  attr("height", 20).
  attr("rx", 5).
  attr("ry", 5).
  attr("fill", function (d, i) {
    return color(d);
  });
  legend.
  selectAll("text").
  data(categories).
  enter().
  append("text").
  attr("x", function (d, i) {
    return i * width / categories.length + 36;
  }).
  attr("y", 36).
  attr("font-size", "15px").
  text(function (d) {
    return d;
  });
});