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
	.scale(scaleX)
	.orient('bottom')
	//.tickPadding(10);
	// .innerTickSize(-height)
 //    .outerTickSize(1)
 //    .tickPadding(5)
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
var intervalId;

function plotChart(chartData) {
	data = chartData;
	//add domain
	scaleX.domain(d3.extent(data, d => d.date));
	scaleY.domain([0, 200]);

	innerArea.select('.x-axis').remove();

	//add axis
	XaxisGroup = innerArea.append('g')
		.attr("clip-path", "url(#clip)")//**********
		.attr('class', 'x-axis')
		.attr('transform', 'translate(' + 0 + ',' + height + ')');

		
	XaxisGroup.call(scaleX.axis = axisX
				.ticks(d3.time.day, 1)
				.tickFormat(d3.time.format('%d'))
				//.tickSize(-height/2, 0, 0)				
		);
		
	XaxisGroup.selectAll('.line')
		.style('stroke', 'black')
		.style('opacity', '0.7')


	innerArea.select('.y-axis').remove();

	innerArea.append('g')
		.attr('class', 'y-axis')
		.call(axisY);	

	//add path
	if (!gPath) {		
		gPath = innerArea
			.append('g')
			.attr("clip-path", "url(#clip)")//**********
			.append('path');

		gPath.datum(data)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('d', line)
			.transition()
    		.duration(transitionDuration)
    		.ease(d3.ease('linear'))
    		//.each("start", tick);
	}

	intervalId = setInterval(function() {
		tick();
	}, 5000);

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
	

	XaxisGroup.transition()
	    .duration(3750)
        .ease('linear')
        .call(axisX);//******

	// Redraw the line.
	gPath
		.attr("d", line)
      	.attr("transform", null);

    //******  	
	var transition = gPath
		.transition()
		.duration(3750)
    	.ease(d3.ease('linear'))
		.attr("transform", "translate(" + scaleX(prevDay) + ",0)")

	if (counter < 1000) {
		//here we are using 'end' as otherwise it was happening almost immediately
		//transition.each("end", tick);
	} else {
		clearInterval(intervalId);
	}

	data.shift();
}

function drawCircles(data) {
	 //    var circleData = data.slice(1, data.length);

 //    console.log(data[data.length-1], circleData[circleData.length-1]);    

 //    var circlesAll = innerArea.selectAll('circle')
 //    var circles	= circlesAll.data(circleData, d => d.date + d.close);

 //    circles.enter()
 //    	.append('circle')
 //    	.attr('cx', d => scaleX(d.date))
 //    	.attr('cy', d => scaleY(d.close))
 //    	.attr('r', 3)
 //    	.attr('fill', 'red');

 //    circles
 //    	//.selectAll('circle')
 //    	.attr('cx', d => scaleX(d.date))
 //    	.attr('cy', d => scaleY(d.close));

	// circles.exit().remove();

}