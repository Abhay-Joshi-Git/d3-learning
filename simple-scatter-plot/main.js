import * as d3 from 'd3';

//with, height, margins
const totalHeight = 600;
const totalWidth = 900;
const margin = {
	left: 30,
	top: 20,
	right: 30,
	bottom: 20
};
const width = totalWidth - margin.left - margin.right;
const height = totalHeight - margin.top - margin.bottom;

//scale
var scaleX = d3.scale.linear()
	.range([0, width]);
var scaleY = d3.scale.linear()
	.range([height, 0]);	
var scaleColor = d3.scale.ordinal()
	.range(['red', 'green', 'steelblue']);

//axis
var axisX = d3.svg.axis()
	.scale(scaleX);
var axisY = d3.svg.axis()
	.scale(scaleY);	

//svg container
var svg = d3.select('body').append('svg')
	.attr('width', totalWidth)
	.attr('height', totalHeight);

//innerwidth
var innerArea = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//plot chart function
function plotChart(error, data) {

	scaleX.domain(d3.extent(data, d => d.sepalWidth));
	scaleY.domain(d3.extent(data, d => d.sepalLength));
	scaleColor.domain(d3.extent(data, d => d.species));

	innerArea.append('g')
		.attr('transform', 'translate(' + 0 + ',' + height  + ')')
		.call(axisX)
		.append('text')
		.text('sepal width(cm)')
		.attr('x', width)
		.attr('dy', '-.71em')
		.style("text-anchor", "end");
	innerArea.append('g')
		.call(axisY.orient('left'))
		.append('text')
		.attr('transform', 'rotate(-90)')
		.text('sepal length(cm)')
		.attr('y', 6)
		.style("text-anchor", "end")
		.attr('dy', '.71em');					

	innerArea.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => scaleX(d.sepalWidth))
		.attr('cy', d => scaleY(d.sepalLength))
		.attr('r', 5)
		.style('fill', d => scaleColor(d.species));

	//add legend
	const rectWidth = 28;
	const rectHeight = 20;	
	console.log(scaleColor.domain());

	var legend = innerArea.selectAll('.legend')
		.data(scaleColor.domain())
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', (d, i) => 'translate(' + 0 + ',' + i * 25 + ')')		

	legend.append('rect')
		.attr('x', width - rectWidth)
		.attr('width', rectWidth)
		.attr('height', rectHeight)
		.style('fill', d => scaleColor(d));	

	legend.append('text')
		.text(d => d)
		.attr('x', width - rectWidth - 10)
		.style("text-anchor", "end")	//important - text-anchor - to align text horizontally
		.style('alignment-baseline', 'before-edge') // important - text-anchor - to align text vertically

}

d3.tsv('data.tsv', plotChart);