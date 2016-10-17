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

//***********************
//adding clip path defs 
innerArea.append("defs").append("clipPath")
    .attr("id", "clip")
	.append("rect")
    .attr("width", width-20) //20 for clipping line creation...created line smoothly gets added
    .attr("height", height);

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

var gPath;
var closeRange = 200;
var data;
var counter = 0;
const transitionDuration = 3000;
var XaxisGroup;

function plotChart(chartData) {
	data = chartData;
	//add domain
	scaleX.domain(d3.extent(data, d => d.date));
	scaleY.domain([0, 200]);

	innerArea.select('.x-axis').remove();

	//add axis
	XaxisGroup = innerArea.append('g')
		.attr('class', 'x-axis')
		.attr('transform', 'translate(' + 0 + ',' + height + ')');

	XaxisGroup.call(scaleX.axis =axisX
				.ticks(d3.time.month, 1)
				.tickFormat(d3.time.format('%m%y'))
		);
		

	innerArea.select('.y-axis').remove();

	innerArea.append('g')
		.attr('class', 'y-axis')
		.call(axisY);	

	//add path
	if (!gPath) {		
		gPath = innerArea
			.append('g')
			.attr("clip-path", "url(#clip)")
			.append('path');

		gPath.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('d', line)
			.transition()
    		.duration(transitionDuration)
    		.ease(d3.ease('linear'))
    		.each("start", tick);
	}
}
 
d3.tsv('data_1.tsv', format, plotChart);

function nextData(data) {
	var nextDay = new Date(data.date);
	nextDay.setDate(data.date.getDate()+1);
	return {
		date: nextDay,
		close: (Math.random() * 30) + 120
	}
}


function tick() {
	counter++;

    //cal prevDay	
    var leftMostDate = d3.min(data, d => d.date);
	var prevDay = new Date(leftMostDate);
	prevDay.setDate(leftMostDate.getDate() - 1);

	data.push(nextData(data[data.length - 1])); 

	//update scale
	scaleX.domain(d3.extent(data, d => d.date));
	XaxisGroup.call(scaleX.axis);

	// Redraw the line.
	d3.select(this)
		.attr("d", line)
      	.attr("transform", null);

	var transition = gPath
		.transition()
		.duration(500)
    	.ease(d3.ease('linear'))
		.attr("transform", "translate(" + scaleX(prevDay) + ",0)")

	if (counter < 1000) {
		//here we are using 'end' as otherwise it was happening almost immediately
		transition.each("end", tick);
	}

	data.shift();
}