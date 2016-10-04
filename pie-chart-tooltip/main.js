import 'd3';

//display area
const totalWidth = 800;
const totalHeight = 700;
const margin = {
	left: 30, right: 30,
	top: 20, bottom: 20
};
const width = totalWidth - margin.left - margin.right;
const height = totalHeight - margin.top - margin.bottom;

//radius
const arcRadius = d3.min([width, height]) / 2 ;

//color scale
const scaleColor = d3.scale.ordinal()
	.range(['red', 'orange', 'yellow', 'green', 'purple', 'blue', 'steelblue']);

//arc path data generator function
var arc = d3.svg.arc()
	.outerRadius(arcRadius - 10)
	.innerRadius(0);

//pie data helper function
const pie = d3.layout.pie()
	.sort(null)
	.value(d => d.population);

//svg container
var svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('transform', 'translate(' + (width /2)  + ',' + (height /2) + ')')

//attach div
var element = d3.select('body').append('div')
	.attr('class', 'tooltip-container');

//mouse over event handler
function onMouseOver(d, i) {
	d3.select('.tooltip-container')
		.html('age : ' + d.data.age + '<br>' + 'population : ' + d.data.population)
		.style('left', d3.event.pageX + 10 + 'px')
		.style('top', d3.event.pageY + 10 + 'px')
		.style('opacity', 1);
} 

//mouse out event handler
function onMouseOut(d, i) {
	d3.select('.tooltip-container')
		.style('opacity', 0);
}
 
function plotChart(error, data) {
	//add domain
	scaleColor.domain(data.map(d => d.age));

	//add group place-holder elements and attach data
	var g = svg.selectAll('.pie-group')
		.data(pie(data))
		.enter()
		.append('g')
		.attr('class', 'pie-group');

	//add arcs
	g.append('path')
		.attr('d', arc)
		.attr('fill', d => scaleColor(d.data.age));

	//add texts
	g.append('text')
		.attr('transform', d => 'translate('+ arc.centroid(d) + ')')
		.text(d => d.data.age);

	//add events
	g.on('mouseover', onMouseOver);
	g.on('mouseout', onMouseOut); 

};

d3.csv('data.csv', function(d) {
  d.population = +d.population;
  return d;
}, plotChart);