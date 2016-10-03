import * as d3 from 'd3';

const totalHeight = 600;
const totalWidth = 1200;

const margin = {
	top: 20,
	left: 40,
	bottom: 20,
	right: 40
};
const height = totalHeight - margin.top - margin.bottom;
const width = totalWidth - margin.left - margin.right;

const timeFormat = d3.time.format('%d-%b-%y');

//scales
var scaleX = d3.time.scale()
	.range([0, width]);
var scaleY = d3.scale.linear()
	.range([height, 0]);	

//axis
var axisX = d3.svg.axis()
	.scale(scaleX);
var axisY = d3.svg.axis()
	.scale(scaleY)
	.orient('left');		//had missed this

//svg container
var svg = d3.select('body').append('svg')
	.attr('height', totalHeight)
	.attr('width', totalWidth);

//inner area
var innerArea = svg.append('g')
	.attr('transform', 'translate('+ margin.left  + ',' + margin.top +')');

//line function
var line = d3.svg.line()
	.x(d => scaleX(d.date))
	.y(d => scaleY(d.close));

//format function
function format(data) {
	return {
		date: timeFormat.parse(data.date),
		close: +data.close
	};
}

function plotChart(data) {
	//add domain
	scaleX.domain(d3.extent(data, d => d.date));
	scaleY.domain(d3.extent(data, d => d.close));

	//add axis
	innerArea.append('g')
		.attr('transform', 'translate(' + 0 + ',' + height + ')')
		.call(axisX
				.ticks(d3.time.year, 1)
				.tickFormat(d3.time.format('%b%y'))
		);
		
	innerArea.append('g')
		.call(axisY);	

	//add path
	innerArea.append('path')
		.datum(data)
		.attr('stroke', 'steelblue')
		.attr('fill', 'none')
		.attr('d', line);
}
 
d3.tsv('data.tsv', format, plotChart);