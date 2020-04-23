window.onscroll = function () { myFunction() };

// const backupData = {
//     geisha: {
//         url: 'https://static01.nyt.com/images/2018/04/02/opinion/maureen-dowd/maureen-dowd-articleLarge.png',
//         headline: '',
//         abstract: '',
//         pubDate: ''
//     },
//     judo: {'https://static01.nyt.com/images/2013/02/17/sports/dog-FUKUDA-obit/dog-FUKUDA-obit-thumbWide.jpg',
//     headline: '',
//     abstract: '',
//     pubDate: ''
// },
//     kabuki: {'https://static01.nyt.com/images/2020/04/10/business/00japan-kabuki-promo/00japan-kabuki-promo-articleLarge-v2.jpg',
//     headline: '',
//     abstract: '',
//     pubDate: ''},
//     shogun: {'https://static01.nyt.com/images/2012/04/17/arts/DIVINE/DIVINE-articleLarge.jpg',
//     headline: 'Early Works in Church Setting, With a Japanese Twist',
//     abstract: 'Anthonello, the Japanese early-music ensemble, mixed Japanese and Western styles at St. John the Divine.',
//     pubDate: '2012-04-16T22:13:22+0000'},
//     soba: 'https://static01.nyt.com/images/2014/03/31/dining/hot-sour-soba-salad/hot-sour-soba-salad-watch308-v2.jpg',
//     soy: 'https://static01.nyt.com/images/2012/06/17/magazine/17wmt/17wmt-articleLarge.jpg',
//     kawaii: 'https://static01.nyt.com/images/2016/06/06/world/what-in-the-world/WIT_JAPAN-KAWAII/WIT_JAPAN-KAWAII-watch308.jpg',
//     ramen: 'https://static01.nyt.com/images/2019/03/20/arts/ramen1/merlin_152238174_1a266208-fc5a-4d3b-9cc2-1d0209517c10-articleLarge.jpg',
//     anime: 'https://static01.nyt.com/images/2009/03/13/arts/design/MangaPROMO12.jpg',
//     umami: 'https://static01.nyt.com/images/2019/03/20/dining/15appe5/15appe5-articleLarge.jpg',
//     'hello kitty': 'https://static01.nyt.com/images/2015/06/27/travel/27intransit-kittyphoto/27intransit-kittyphoto-watch308-v2.jpg',
//     emoji: 'https://static01.nyt.com/images/2017/01/20/technology/personaltech/20techtipwebART/20techtipwebART-square320-v2.jpg'
// }

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

// Color array for OED 100 words visualization
// colors = ["rgb(100, 24, 41)", "rgb(187, 24, 41)", "rgb(255, 24, 41)"];
// Color array for category visualization 
// clrs = ["red", "brown", "coral", "goldenrod", "maroon", "olive", "orchid", "tomato", "peru", "plum", "salmon", "teal", "tan", "thistle", "indigo", "black", "lime", "aqua"];

var color = d3.scaleOrdinal()
    .domain(["food & drink", "martial arts", "arts & crafts", "jobs & status", "religion", "entertainment", "culture", "business", "botany", "housing", "other"])
    .range(["goldenrod", "lightsalmon", "olive", "plum", "CornflowerBlue", "teal", "DarkSeaGreen", "indigo", "Chocolate", "DarkTurquoise", "rgb(100,100,100)"]);

// Create timeline svg 
var timelineSvg = d3.select("timeline-div").append("svg")
    .attr("class", "timeline")
    .attr("width", "98%")
    .attr("height", "5000px")
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
        .attr("y", function (d, i) { return data[i].year * 10 - 15760; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-size", "18px")
        .attr("fill", "rgb(75, 75, 75)")
        .text(function (d, i) { return data[i].year; })
    // Load timeline data and show event 
    timelineSvg.selectAll("timelineText")
        .data(data)
        .enter()
        .append("text")
        // .attr("transform", "translate(0,20)")
        .attr("x", "70px")
        .attr("y", function (d, i) { return data[i].year * 10 - 15760; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "rgb(75, 75, 75)")
        .style("font-weight", 400)//normal font weight
        .text(function (d, i) { return data[i].event; })
})

// Create OED words SVG
var svg = d3.select("word-div").append("svg")
    .attr("class", "word")
    .attr("width", "95%")
    .attr("height", "4300px")

// Append background lines
svg.append("line")
    .attr("class", "line")
    .attr("x1", 50)
    .attr("x2", 50)
    .attr("y1", 40)
    .attr("y2", 4300)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

svg.append("line")
    .attr("class", "line")
    .attr("x1", 160)
    .attr("x2", 160)
    .attr("y1", 40)
    .attr("y2", 4300)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

svg.append("line")
    .attr("class", "line")
    .attr("x1", 270)
    .attr("x2", 270)
    .attr("y1", 40)
    .attr("y2", 4300)
    .style("stroke-dasharray", "5,5")
    .style("stroke", "lightgrey");

// Append chart text 
svg.append('text')
    .attr("x", 150)
    .attr("y", 10)
    .attr("font-size", "14")
    .style("fill", "rgb(75, 75, 75)")
    .attr("font-family", "'Montserrat', sans-serif")
    .text("Frequency Band")

svg.append('text')
    .attr("x", 310)
    .attr("y", 20)
    .attr("font-size", "10")
    .style("fill", "rgb(75, 75, 75)")
    .attr("font-family", "'Montserrat', sans-serif")
    .text("Click for audio")

svg.append('text')
    .attr("x", 100)
    .attr("y", 40)
    .attr("font-size", "14")
    .attr("font-family", "'Montserrat', sans-serif")
    .style("fill", "rgb(75, 75, 75)")
    .text("3")

svg.append('text')
    .attr("x", 205)
    .attr("y", 40)
    .attr("font-size", "14")
    .attr("font-family", "'Montserrat', sans-serif")
    .style("fill", "rgb(75, 75, 75)")
    .text("4")

svg.append('text')
    .attr("x", 310)
    .attr("y", 40)
    .attr("font-size", "14")
    .style("fill", "rgb(75, 75, 75)")
    .text("5")

// Append Div for tooltip to SVG
var tooltipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Append div for NYT hover
var card = d3.select("body")
    .append("div")
    .attr("class", "card")
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
        .attr("y", function (d, i) { return i * 42 + 80; })
        .attr("font-family", "'Montserrat', sans-serif")
        .attr("font-weight", function (d, i) { return data[i].Frequency * 200 - 100; })//font weight based on frequency
        .attr("font-size", function (d, i) { return data[i].Frequency * 5; })// font size based on frequency
        .style("cursor", "pointer")
        // .attr("fill", "#7D1829")
        .style("fill", function (d, i) {
            // console.log(d.Category) 
            { return color(d.Category); }
        })


        // .style("fill", function (d, i) {
        //     // console.log(d.Category) 
        //     if (data[i].Category = color.domain(5))
        //     { return color(d.Category); }
        // })

        // .attr("fill", function (d, i) {
        //     if (data[i].Frequency === '3') { return colors[0]; }
        //     else if (data[i].Frequency === '4') { return colors[1]; }
        //     else { return colors[2]; }
        // }) //font color based on frequency
        .text(function (d, i) { return data[i].Loanword; })
        // Show word meaning on mouseover 
        .on("mouseover", function (d) {
            // var citation = d.Citation; // year of first citation 
            var meaning = `${d.Meaning} Category: ${d.Category}`;
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", .95);
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
        var url = `https://dangrunebaum.github.io/thesis/turning-japanese/data/audio/${item.Loanword.toLowerCase()}--_us_1.mp3`
        console.log(url);
        pronunciation.setAttribute('src', url);
        //         `https://dangrunebaum.github.io/data/audio/typhoon--_us_1.mp3`
        //                                    `https://dangrunebaum.github.io/thesis/turning-japanese/data/audio/typhoon--_us_1.mp3`
        // `/data/audio/${item.Loanword}--_us_1.mp3`
        //         );
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
        margin: { top: 25, left: 35, bottom: 25, right: 25 },
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
            if (index === 1) {
                return "#7D1829"
            } else return "#3C8A9E" // "#96B83D"
        }
    },
    directives: {
        axis(el, binding) {
            // console.log(el); // this is the g
            // console.log(binding); // the scale object
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

var diameter = 600;


var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(1.5);

var CategoriesSvg = d3.select("div#bubbleChart")
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
    .style("fill", function (d) {
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

d3.select("center").style("background-color", "white");

var app2 = new Vue({
    // ID of referenced div-element
    el: '#histogram',
    data: {
        chartTitle: "JAPANESE LOANWORD ADDITIONS TO THE OED OVER TIME",
        svgHeight: 400,
        svgWidth: 800,
        margin: { top: 25, left: 25, bottom: 50, right: 25 },
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
        myFill(index) { return "#3C8A9E" }
    },
    directives: {
        axis(el, binding) {
            // console.log(el); // this is the g
            // console.log(binding); // the scale object
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
                // console.log(el);
                d3.select(el)
                    .selectAll("text")
                    .style("font-size", "10px")
                    .style("font-family", "'Montserrat', sans-serif")
                    .style("text-anchor", "middle")
                    .attr("dx", "-2em")
                    .attr("dy", "-5px")
                    .attr("transform", "rotate(-75)")

                d3.select(el)
                    .selectAll("line")
                    .attr("x1", "-3px")
                    .attr("x2", "-3px")
                    .attr("y2", "2");
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

    // Format variables:
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
        var nytSvg = d3.select("#small_multiples")
            .selectAll("uniqueChart")
            .data(sumstat)
            .enter()
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, width]);
        nytSvg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));
        // console.log(data.length, d3.max(data, function (d) { return +d.interest; }))
        //Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.interest; })])
            .range([height, 0]);
        nytSvg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // color palette
        var color = d3.scaleOrdinal()
            .domain(allKeys)
            .range(["plum", "lightsalmon", "teal", "plum", "goldenrod", "goldenrod", "DarkSeaGreen", "goldenrod", "teal", "goldenrod", "teal", "DarkSeaGreen"]);
        //     .domain(["food & drink", "martial arts", "arts & crafts", "jobs & status", "religion", "entertainment", "culture", "business", "botany", "housing", "other"])

        // Draw the line
        nytSvg.append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("stroke-width", 4.0)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return y(+d.interest); })
                    (d.values)
            })


        //Append rollover materials 
        // Find the closest X index of the mouse:
        var bisect = d3.bisector(function (d) { return d.date; }).left;

        // Create circle that travels along the curve of chart
        var focus = nytSvg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 5)
            .style("opacity", 0)

        // Create text that travels along the curve of chart
        var focusText = nytSvg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // Create a rect on top of the svg area that rectangle recovers mouse position
        nytSvg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            // .on('mouseover', mouseover)
            // .on('mousemove', mousemove)
            // .on('mouseout', mouseout)
            .append('text')
        // .attr('word', function (d) { return d.key });//add word attr for topic

        // What happens when the mouse move -> show the annotations at the right positions.
        // function mouseover() {
        //     focus.style("opacity", 1)
        //     focusText.style("opacity", 1)
        // }

        // Add titles
        nytSvg.append("text")
            .attr("text-anchor", "start")
            .attr("y", -5)
            .attr("x", 0)
            .text(function (d) { return (d.key) })
            .style("font-size", "20px")
            .style("fill", function (d) { return color(d.key) })
            .attr('word', function (d) { return d.key })
            .attr("class", "nyt-word")
            .style("cursor", "pointer")
            .on('mouseover', wordOver)
            .on('mouseout', mouseout);



        function wordOver(e) {
            const { pageX, pageY } = d3.event;
            let thisWord = d3.select(this).attr('word')
            d3.select(this).classed("active", true)
            console.log(thisWord);

            // const urlParams = new URLSearchParams(window.location.search);
            // let w1 = urlParams.get(thisWord);
            const nytTerm = thisWord || 'geisha'//word variable 

            //API call 
            var request = new XMLHttpRequest()


            request.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${nytTerm}&api-key=8A8qBswiq0XnSX221vWlreyWRcAvhMbf`, true)
            request.onload = function () {



                // console.log(data.response.docs[0].abstract)

                if (request.status >= 200 && request.status < 400) {
                //access JSON data 
                var data = JSON.parse(this.response)

                    const doc = data.response.docs.find(
                        (doc) => doc.multimedia.length !== 0);
                    const nytImageUrl = doc.multimedia[0].url

                    console.log(nytTerm, nytImageUrl)
                    // [0].multimedia[0].url;//image url 
                    // nytImage.src = `https://static01.nyt.com/${nytImageUrl}`//image url string 

                    const headline = doc.headline.main;//article headline  
                    const abstract = doc.abstract;//article abstract
                    const pubDate = doc.pub_date.substring(0, 7);
                    console.log(pubDate);

                    card.transition()
                        .duration(200)
                        .style("opacity", .95);
                    // div.text
                    // card.html(`<img class="card" src="${backupUrls[nytImageUrl]}">`)
                    card.html(
                        `<img class="card-img" src="https://static01.nyt.com/${nytImageUrl}">
                        <div class="card-headline">${headline}</div><br>
                        <div class="card-abstract">${abstract}</div>
                        <div class="card-pubDate">NYT ${pubDate}</div>`
                    )
                        .style("left", (pageX - 360) + "px")
                        .style("top", (pageY - 255) + "px")

                } else {
                    const {url, headline, abstract, pubDate} = backupData[nytTerm];
                    const nytImageUrl = url;
                    card.transition()
                    .duration(200)
                    .style("opacity", .95);
                // div.text
                // card.html(`<img class="card" src="${backupUrls[nytImageUrl]}">`)
                card.html(
                    `<img class="card" src="${nytImageUrl}">
                    <div>${headline}</div>
                    <div>${abstract}</div>
                    <div>${pubDate}</div>`
                )
                    .style("left", (pageX - 360) + "px")
                    .style("top", (pageY - 255) + "px")
                }
            }

            request.send()
        }

        function mouseout() {
            d3.select(this).classed("active", false)
            card.transition()
                .duration(500)
                .style("opacity", 0);
        }

        // function mousemove() {
        //     // console.log(d3.select(this).attr('word'))
        //     const thisWord = d3.select(this).attr('word')
        //     d3.select(this).classed("active", true);
        //     // get coordinate we need
        //     // var x0 = x.invert(d3.mouse(this)[0]);
        //     // var i = bisect(data.filter(
        //     //     d => d.key === "thisWord"
        //     // ), x0, 1);
        //     // selectedData = data[i]
        //     console.log(thisWord);
        //     // console.log(selectedData);
        //     // var topic = selectedData.topic;
        //     // console.log(topic);
        //     // if (topic === "geisha")
        //     // focus
        //     //     .attr("cx", x(selectedData.date))
        //     //     .attr("cy", y(selectedData.interest))
        //     d3.select(`text[word=${selectedData.topic}]`)//search for text object with attribute being word that has selected topic
        //         .html(selectedData.interest)
        //         .attr("x", x(selectedData.date))
        //         .attr("y", y(selectedData.interest))
        // }


    })

function openSingle() {
    window.open("index1.html", "_blank");
}

function openPairs() {
    window.open("index2.html", "_blank");
}