// Set up the chart
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
  top: 70,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

/* Create an SVG wrapper, append an SVG group that will hold our chart,
and shift the latter by left and top margins. */
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the csv data
d3.csv("assets/data/data.csv").then(function(reportData, err) {
    if (err) throw err;

    // Convert strings to numbers     
    reportData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(reportData, d => d.poverty)-1, 
            d3.max(reportData, d => d.poverty)+2])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(reportData, d => d.healthcare)-2, 
            d3.max(reportData, d => d.healthcare)+2])
        .range([height, 0]);
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(reportData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "#1d8cd1")
        .attr("opacity", "0.5");

    // Create text inside circles
    chartGroup.append("g").selectAll('text')
        .data(reportData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare)+5)
        .classed('stateText', true);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 1.75))
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.25}, 
        ${height + margin.top})`)
      .text("In Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });