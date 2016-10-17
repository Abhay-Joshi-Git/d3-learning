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
    .interpolate('liner')
	.x(d => scaleX(d.date))
	.y(d => scaleY(d.close));

//format function
function format(data) {
	return {
		date: timeFormat.parse(data.date),
		close: +data.close
	};
}

var path;
var closeRange = 200;

function plotChart(data) {

	//add domain
	scaleX.domain(d3.extent(data, d => d.date));
	scaleY.domain([0, closeRange]);

	innerArea.select('.x-axis').remove();

	//add axis
	innerArea.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(' + 0 + ',' + height + ')')
		.call(axisX
				.ticks(d3.time.year, 1)
				.tickFormat(d3.time.format('%b%y'))
		);
		

	innerArea.select('.y-axis').remove();

	innerArea.append('g')
		.attr('class', 'y-axis')
		.call(axisY);	

	//add path
	if (!path) {		
		path = innerArea.append('g')
			.append('path');
		path.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('d', line);
	}

}
 
d3.tsv('data_1.tsv', format, chart);

var transition = d3.select({}).transition()
    .duration(750)
    .ease("linear");


function nextData(data) {
	var nextDay = new Date(data.date);
	nextDay.setDate(data.date.getDate()+1);

	return {
		date: nextDay,
		close: Math.random() * closeRange
	}
}

function chart(data) {
	plotChart(data);	

	setInterval(function() {
		iterateChart(data)  		 
	}, 2000);	

}

function iterateChart(data) {
		data.push(nextData(data[data.length-1]));

		// pop the old data point off the front
		data.shift();

		plotChart(data);

		// transition the line
		path
			.transition().delay(1000).duration(3000)
			.attr("d", line);

}

