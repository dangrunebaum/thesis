// Color array for OED 100 words visualization
colors = ["rgb(100, 24, 41)", "rgb(187, 24, 41)", "rgb(255, 24, 41)"];
// Color array for category visualization 
clrs = ["red", "brown", "coral", "goldenrod", "maroon", "olive", "orchid", "tomato", "peru", "plum", "salmon", "teal", "tan", "thistle", "indigo", "black", "lime", "aqua"];

// Create timeline svg 
var timelineSvg = d3.select("timeline-div").append("svg")
    .attr("class", "timeline")
    .attr("width", "95%")
    .attr("height", "6000px")
// Load timeline data and show year 
d3.csv("data/timeline.csv", function (data) {
    // console.log(data);
    timelineSvg.selectAll("timelineText")
        .data(data)
        .enter()
        .append("text")
        // .attr("transform", "translate(0,20)")
        .attr("x", "15px")
        .style("font-weight", 600)// bold year 
        .attr("y", function (d, i) { return data[i].year * 9.2 - 14460; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-size", "18px")
        .attr("fill", "rgb(125, 24, 41)")
        .text(function (d, i) { return data[i].year; })
    // Load timeline data and show event 
    timelineSvg.selectAll("timelineText")
        .data(data)
        .enter()
        .append("text")
        // .attr("transform", "translate(0,20)")
        .attr("x", "70px")
        .attr("y", function (d, i) { return data[i].year * 9.2 - 14460; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "rgb(125, 24, 41)")
        .style("font-weight", 400)//normal font weight
        .text(function (d, i) { return data[i].event; })
})

// let timeline = document.getElementById("center-text")
// data.forEach(element => {
//     let tspan = document.createElement("span")
//     span.setAttribute("transform", "translateY: " + element.year * 10 - 15840)
//     // span.setAttribute("transformX", 10)
//     span.innerText = (element.event)
//     timeline.appendChild(span)
// });

// function wrap(text, width) {
//     text.each(function() {
//       var text = d3.select(this),
//           words = text.text().split(/\s+/).reverse(),
//           word,
//           line = [],
//           lineNumber = 0,
//           lineHeight = 1.1, // ems
//           y = text.attr("y"),
//           dy = parseFloat(text.attr("dy")),
//           tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
//       while (word = words.pop()) {
//         line.push(word);
//         tspan.text(line.join(" "));
//         if (tspan.node().getComputedTextLength() > width) {
//           line.pop();
//           tspan.text(line.join(" "));
//           line = [word];
//           tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//         }
//       }
//     });
//   }

// Create OED words SVG
var svg = d3.select("word-div").append("svg")
    .attr("class", "word")
    .attr("width", "95%")
    .attr("height", "6000px")

// Append background lines
svg.append("line")
    .attr("class", "line")
    .attr("x1", 50)
    .attr("x2", 50)
    .attr("y1", 40)
    .attr("y2", 6000)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

svg.append("line")
    .attr("class", "line")
    .attr("x1", 160)
    .attr("x2", 160)
    .attr("y1", 40)
    .attr("y2", 6000)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

svg.append("line")
    .attr("class", "line")
    .attr("x1", 270)
    .attr("x2", 270)
    .attr("y1", 40)
    .attr("y2", 6000)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

// Append chart text 
svg.append('text')
    .attr("x", 150)
    .attr("y", 20)
    .attr("font-size", "14")
    .style("fill", "rgb(20, 24, 41)")
    .attr("font-family", "'Montserrat', sans-serif")
    .text("Frequency Band")
svg.append('text')
    .attr("x", 47)
    .attr("y", 40)
    .attr("font-size", "14")
    .attr("font-family", "'Montserrat', sans-serif")
    .style("fill", "rgb(20, 24, 41)")
    .text("3")
svg.append('text')
    .attr("x", 157)
    .attr("y", 40)
    .attr("font-size", "14")
    .attr("font-family", "'Montserrat', sans-serif")
    .style("fill", "rgb(20, 24, 41)")
    .text("4")
svg.append('text')
    .attr("x", 267)
    .attr("y", 40)
    .attr("font-size", "14")
    .style("fill", "rgb(20, 24, 41)")
    .text("5")

// Append Div for tooltip to SVG
var tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// Load words csv
d3.csv("data/100-frequent-words.csv", function (data) {
    // console.log(data);
    // to get frequency: data[i].Frequency;
    svg.selectAll(".oedtext")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "oedtext")
        .attr("transform", "translate(0,20)")
        .attr("x", function (d, i) { return data[i].Frequency * 110 - 280; })// xpos based on frequency
        .attr("y", function (d, i) { return i * 41 + 40; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-weight", function (d, i) { return data[i].Frequency * 100 + 200; })//font weight based on frequency
        .attr("font-size", function (d, i) { return data[i].Frequency * 5; })// font size based on frequency
        .style("cursor", "pointer")
        .attr("fill", "#7D1829")
        // .attr("fill", function (d, i) { return 
        // .attr("fill", function (d, i) {
        //     if (data[i].Frequency === '3') { return colors[0]; }
        //     else if (data[i].Frequency === '4') { return colors[1]; }
        //     else { return colors[2]; }
        // }) //font color based on frequency
        .text(function (d, i) { return data[i].Loanword; })
        // Show word meaning on mouseover 
        .on("mouseover", function (d) {
            // var citation = d.Citation; // year of first citation 
            var meaning = d.Meaning;
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .9);
            // div.text
            tooltipDiv.html(meaning)
                .style("left", (d3.event.pageX + 60) + "px")
                .style("top", (d3.event.pageY - 55) + "px")
            d3.select(this).classed("active", true);
        })

        // fade tooltip on mouseout               
        .on("mouseout", function (d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0)
            d3.select(this).classed("active", false);
        })
        // Event listener for audio 
        .on("click", mouseClick);

    /* Audio function -- for each Loanword click loop through audio folder, find src locator matching word and play the corresponding audio file */
    function mouseClick(item) {
        // console.log(item.Loanword);
        var pronunciation = document.getElementById('audioElement');
        pronunciation.setAttribute('src', `/data/audio/${item.Loanword}--_us_1.mp3`);
        pronunciation.play()
        // console.log("mouseClick");
        //  pronunciation source 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/tatami--_us_1.mp3

    }
})



// Visualizations: language frequency bar chart 
var app = new Vue({
    // ID of referenced div-element
    el: '#bars',
    data: {
        chartTitle: "TOP ASIAN LANGUAGES IN THE OED BY LOANWORD",
        svgHeight: 400,
        svgWidth: 750,
        margin: { top: 25, left: 25, bottom: 25, right: 25 },
        data: [
            { name: "Hindi", val: 537 },
            { name: "Japanese", val: 530 },
            { name: "Sanskrit", val: 400 },
            { name: "Malay", val: 400 },
            { name: "Chinese", val: 257 },
            { name: "Urdu", val: 248 },
            { name: "Tamil", val: 71 },
            { name: "Tagalog", val: 69 },
            { name: "Bengali", val: 47 },
            { name: "Burmese", val: 39 }
        ]
    },
    computed: {
        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        // scale = {
        //   x: () => {
        //     do something
        //     return x
        // }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
        scale() {
            const x = d3
                .scaleBand()
                .domain(this.data.map(x => x.name))
                // https://github.com/d3/d3-scale/blob/master/README.md#band_rangeRound
                .rangeRound([0, this.width])
                .padding(0.15); // There is also paddingInner and paddingOuter if preferred
            const y = d3
                .scaleLinear()
                // The spread operator ... can be used to convert an array
                // in places where a list of parameters is expected.
                // Because we are using a method here, Math.max(1, 2, 3) is expected.
                // The new mapped array is transformed with ...
                // so it can be interpreted by Math.max()
                .domain([0, Math.max(...this.data.map(x => x.val))])
                .rangeRound([this.height, 0]); // Already flipped
            const z = this.data.val + "";
            return { x, y, z };
        }
    },
    methods: {
        myFill(index) {
            // if (index === 0) {
            //     return "brown"
            // } else if (index === 1) {
            //     return "red"
            // } else if (index === 2) {
            //     return "coral"
            // } else if (index === 3) {
            //     return "goldenrod"
            // } else if (index === 4) {
            //     return "maroon"
            // } else if (index === 5) {
            //     return "olive"
            // } else if (index === 6) {
            //     return "orchid"
            // } else if (index === 7) {
            //     return "tomato"
            // } else if (index === 8) {
            //     return "peru"
            // } else if (index === 9) {
            //     return "plum"
            // }
            if (index === 1) {
                return "#7D1829"
            } else return "#638786" // "#96B83D"
        }
    },
    directives: {
        axis(el, binding) {
            console.log(el); // this is the g
            console.log(binding); // the scale object
            const axis = binding.arg; // x or y
            // Line below defines an object and immediately calls
            // only the property for x or y
            // it’s basically like a ternary expression
            const axisMethod = { x: "axisBottom", y: "axisLeft" }[axis];
            // The line below assigns the x or y function of the scale object
            const methodArg = binding.value[axis];
            // The variable assignments above are a very concise way to
            // guarantee that d3 can select *this* element and call
            // the axis method on it
            // with the right argument
            // so it ends up equivalent to the expression
            // d3.axisBottom(scale.x)
            d3.select(el).call(d3[axisMethod](methodArg));
        }
    }
})

// Data for category bubble chart 
dataset = {
    "children": [
        {
            "Tag": "housing",
            "Count": 14
        },
        {
            "Tag": "botany",
            "Count": 18
        },
        {
            "Tag": "business",
            "Count": 20
        },
        {
            "Tag": "culture",
            "Count": 22
        },
        {
            "Tag": "entertainment",
            "Count": 22
        },
        {
            "Tag": "religion",
            "Count": 29
        },
        {
            "Tag": "jobs & status",
            "Count": 33
        },
        {
            "Tag": "arts & crafts",
            "Count": 45
        },
        {
            "Tag": "martial arts",
            "Count": 63
        },
        {
            "Tag": "food & drink",
            "Count": 78
        }
    ]
};

var diameter = 700;

var color = d3.scaleOrdinal(d3.schemeCategory20);

var color = d3.scaleOrdinal()
    .domain(["food & drink", "martial arts", "arts & crafts", "jobs & status", "religion", "entertainment", "culture", "business", "botany", "housing"])
    .range(["goldenrod", "lightsalmon", "olive", "plum", "salmon", "teal", "tan", "indigo", "LightSlateGray", "DarkTurquoise"]);

var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(1.5);

var CategoriesSvg = d3.select("section#bubbleChart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var nodes = d3.hierarchy(dataset)
    .sum(function (d) { return d.Count; });

var node = CategoriesSvg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
        return !d.children;
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

node.append("title")
    .text(function (d) {
        return d.Tag + ": " + d.Count;
    });

node.append("circle")
    .attr("r", function (d) {
        return d.r;
    })
    .style("fill", function (d, i) {
        // console.log(d)
        return color(d.data.Tag);
    })
// .on("mouseover", function (d) {
//     d3.select(this).classed("active", true) 
//     console.log('mouseover')
// })
// .on("mouseout", function (d) {
//  d3.select(this).classed("active", false)   
// })

node.append("text")
    .attr("dy", ".05em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d.data.Tag.substring(0, d.r / 2);
    })
    .attr("font-family", "'Montserrat', sans-serif")
    .attr("font-size", function (d) {
        return d.r / 4;
    })
    .attr("fill", "white");

node.append("text")
    .attr("dy", "1.0em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d.data.Count;
    })
    .attr("font-family", "'Montserrat', sans-serif")
    .attr("font-size", function (d) {
        return d.r / 2;
    })
    .attr("fill", "white")

d3.select("center").style("background-color", "whitesmoke");

var app2 = new Vue({
    // ID of referenced div-element
    el: '#histogram',
    data: {
        chartTitle: "JAPANESE LOANWORD ADDITIONS TO THE OED OVER TIME",
        svgHeight: 400,
        svgWidth: 800,
        margin: { top: 25, left: 25, bottom: 25, right: 25 },
        data: [
            {
                decade: "1570",
                val: 1
            },
            {
                decade: "1580",
                val: 2
            },
            {
                decade: "1590",
                val: 0
            },
            {
                decade: "1600",
                val: 0
            },
            {
                decade: "1610",
                val: 14
            },
            {
                decade: "1620",
                val: 2
            },
            {
                decade: "1630",
                val: 0
            },
            {
                decade: "1640",
                val: 0
            },
            {
                decade: "1650",
                val: 0
            },
            {
                decade: "1660",
                val: 2
            },
            {
                decade: "1670",
                val: 2
            },
            {
                decade: "1680",
                val: 1
            },
            {
                decade: "1690",
                val: 0
            },
            {
                decade: "1700",
                val: 0
            },
            {
                decade: "1710",
                val: 0
            },
            {
                decade: "1720",
                val: 43
            },
            {
                decade: "1730",
                val: 0
            },
            {
                decade: "1740",
                val: 0
            },
            {
                decade: "1750",
                val: 0
            },
            {
                decade: "1760",
                val: 0
            },
            {
                decade: "1770",
                val: 0
            },
            {
                decade: "1780",
                val: 0
            },
            {
                decade: "1790",
                val: 1
            },
            {
                decade: "1800",
                val: 0
            },
            {
                decade: "1810",
                val: 2
            },
            {
                decade: "1820",
                val: 8
            },
            {
                decade: "1830",
                val: 3
            },
            {
                decade: "1840",
                val: 4
            },
            {
                decade: "1850",
                val: 8
            },
            {
                decade: "1860",
                val: 7
            },
            {
                decade: "1870",
                val: 57
            },
            {
                decade: "1880",
                val: 57
            },
            {
                decade: "1890",
                val: 47
            },
            {
                decade: "1900",
                val: 30
            },
            {
                decade: "1910",
                val: 16
            },
            {
                decade: "1920",
                val: 21
            },
            {
                decade: "1930",
                val: 25
            },
            {
                decade: "1940",
                val: 29
            },
            {
                decade: "1950",
                val: 54
            },
            {
                decade: "1960",
                val: 35
            },
            {
                decade: "1970",
                val: 37
            },
            {
                decade: "1980",
                val: 12
            },
            {
                decade: "1990",
                val: 8
            },
            {
                decade: "2000",
                val: 1
            }
        ]
    },
    computed: {
        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        // scale = {
        //   x: () => {
        //     do something
        //     return x
        // }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
        scale() {
            const x = d3
                .scaleBand()
                .domain(this.data.map(x => x.decade))
                // https://github.com/d3/d3-scale/blob/master/README.md#band_rangeRound
                .rangeRound([0, this.width])
                .padding(0.15); // There is also paddingInner and paddingOuter if preferred
            const y = d3
                .scaleLinear()
                // The spread operator ... can be used to convert an array
                // in places where a list of parameters is expected.
                // Because we are using a method here, Math.max(1, 2, 3) is expected.
                // The new mapped array is transformed with ...
                // so it can be interpreted by Math.max()
                .domain([0, Math.max(...this.data.map(x => x.val))])
                .rangeRound([this.height, 0]); // Already flipped
            return { x, y };
        }
    },
    methods: {
        myFill(index) { return "#638786" }
    },
    directives: {
        axis(el, binding) {
            console.log(el); // this is the g
            console.log(binding); // the scale object
            const axis = binding.arg; // x or y
            // Line below defines an object and immediately calls
            // only the property for x or y
            // it’s basically like a ternary expression
            const axisMethod = {
                x: "axisBottom",
                y: "axisLeft"
            }
            [axis];
            // The line below assigns the x or y function of the scale object
            const methodArg = binding.value[axis];
            // The variable assignments above are a very concise way to
            // guarantee that d3 can select *this* element and call
            // the axis method on it
            // with the right argument
            // so it ends up equivalent to the expression
            // d3.axisBottom(scale.x)
            if (axis === "y")
                d3.select(el)
                    .call(d3[axisMethod](methodArg));
            else {
                d3.select(el)
                    // .append("svg")
                    // .append("g")
                    // .append("text")
                    // .attr("class", "axis")
                    // .attr("transform", "translate(0," + height + ")")
                    // // .call(d3.axisBottom(x).ticks(10))
                    // .selectAll("text")
                    // .style("text-anchor", "end")
                    // .attr("dx", "-.8em")
                    // .attr("dy", ".15em")
                    // .attr("transform", "rotate(-65)");
                    .call(d3[axisMethod](methodArg));
                console.log(el);
                d3.select(el)
                    .selectAll("text")
                    .style("text-anchor", "middle")
                    .style("font-size", "8px")
                    .attr("dx", "-2em")
                    .attr("dy", "-5px")
                    .attr("transform", "rotate(-75)")
                    d3.select(el)
                    .selectAll("line")
                    .attr("x1", "-3px")
                    .attr("x2", "-3px");
            }
        }
    }
})

// var g = svg.append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// NYT small multiples 

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 20, left: 30 },
    width = 250 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  //Read the data
  d3.csv("data/nyt-multiples.csv",

    // When reading the csv, I must format variables:
    function (d) {
      return { date: d3.timeParse("%Y")(d.date), interest: d.interest, topic: d.topic }
    },

    function (data) {
      // console.log(data);
      // group the data: I want to draw one line per group
      var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.topic; })
        .entries(data);

      // What is the list of groups?
      allKeys = sumstat.map(function (d) { return d.key })

      // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
      var nytSvg  = d3.select("#my_dataviz")
        .selectAll("uniqueChart")
        .data(sumstat)
        .enter()
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      nytSvg 
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));
      console.log(data.length, d3.max(data, function (d) { return +d.interest; }))
      //Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.interest; })])
        .range([height, 0]);
      nytSvg .append("g")
        .call(d3.axisLeft(y).ticks(5));

      // color palette
      var color = d3.scaleOrdinal()
        .domain(allKeys)
        .range(['#e41a1c', '#377eb8', '#6B8E23', '#984ea3', '#ff7f00', '#32CD32', '#a65628', '#f781bf', '#00b3b3', '#B8860B'])

      // Draw the line
      nytSvg .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke-width", 4.0)
        .attr("d", function (d) {
          return d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(+d.interest); })
            (d.values)
        })

      // Add titles
      nytSvg 
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(function (d) { return (d.key) })
        .style("font-size", "20px")
        .style("fill", function (d) { return color(d.key) })

//try to append bisect line 
    //     g.append("path")
    //     .datum(data)
    //     .attr("class", "line")
    //     .attr("d", line);
    //     var focus = g.append("g")
    //     .attr("class", "focus")
    //     .style("display", "none");

    // focus.append("line")
    //     .attr("class", "x-hover-line hover-line")
    //     .attr("y1", 0)
    //     .attr("y2", height);

    // focus.append("line")
    //     .attr("class", "y-hover-line hover-line")
    //     .attr("x1", width)
    //     .attr("x2", width);

    // focus.append("circle")
    //     .attr("r", 7.5);

    // focus.append("text")
    //     .attr("x", 15)
    //   	.attr("dy", ".31em");

    // svg.append("rect")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mouseover", function() { focus.style("display", null); })
    //     .on("mouseout", function() { focus.style("display", "none"); })
    //     .on("mousemove", mousemove);

    //     function mousemove() {
    //         var x0 = x.invert(d3.mouse(this)[0]),
    //             i = bisectDate(data, x0, 1),
    //             d0 = data[i - 1],
    //             d1 = data[i],
    //             d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //         focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    //         focus.select("text").text(function() { return d.interest; });
    //         focus.select(".x-hover-line").attr("y2", height - y(d.interest));
    //         focus.select(".y-hover-line").attr("x2", width + width);
    //       }

    })