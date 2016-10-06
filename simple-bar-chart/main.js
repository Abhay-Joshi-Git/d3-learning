import * as d3 from 'd3';

const totalWidth = 800;
const totalHeight = 500;
const margin = {
	left: 40,
	top: 20,
	right: 20,
	bottom: 20
};
const width = totalWidth - margin.left - margin.right;
const height = totalHeight - margin.top - margin.bottom;

var scaleX = d3.scale.ordinal();

var scaleY = d3.scale.linear()
	.range([height, 0]);


var svg = d3.select('body').append('svg')
	.attr('height', totalHeight)
	.attr('width', 900);

var innerArea = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

function plotChart(error, data) {	
	var barXMargin = 4;
	var barWidth = (width - (barXMargin * data.length) - barXMargin) / data.length;

	
	scaleY.domain(d3.extent(data, d => d.frequency));
	scaleX
		.domain(data.map(d => d.letter))
		.range(data.map((d, i) => (barXMargin + i * (barWidth+barXMargin))));

	var axisXScale = d3.scale.ordinal()	
		.domain(data.map(d => d.letter))
		.range(data.map((d, i) => (barXMargin + i * (barWidth + barXMargin) + barWidth/2)));

	var axisX = d3.svg.axis()
		.scale(axisXScale);
	var axisY = d3.svg.axis()
		.scale(scaleY)
		.ticks(10, '%')
		.orient('left');

	innerArea.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', d => scaleX(d.letter))
		.attr('y', d => scaleY(d.frequency))
		.attr('width', barWidth) //*** width depending on scale bands
		.attr('height', d => height - scaleY(d.frequency))
		.style('fill', 'steelblue');

	innerArea.append('g')
		.attr('transform', 'translate(' + 0 + ',' + height + ')')
		.call(axisX);
	innerArea.append('g')		
		.call(axisY);
}

d3.tsv("data.tsv", plotChart);