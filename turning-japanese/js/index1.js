/*
COMPUTE INTEREST OVER TIME AGAINST INTEREST BY REGION  
Convert CSV to JSON that includes only the January 1 figure between 2006-2020.
Multiply each january 1 figure against each year's annual figure in the main results JSON  
use final to create color. 
*/
// Examine url to check for new query params 
const urlParams = new URLSearchParams(window.location.search)
let path, svg, projection;
// w1 is the word that drives this display, default is cosplay 
let w1 = urlParams.get('w1') || 'cosplay';
document.title = `${w1} search interest`
// Range of years for display 
const YEARS = {
    min: 2006,
    max: 2020 
}
// Axis is an array of year values in order  
const AXIS = (() => {
    const arr = [];
    for (let y = YEARS.min; y <= YEARS.max; y++) {
        arr.push(y);
    }
    return arr;
})();
// Asynchronous function that redraws map with values for each year
// Invoked by click on play button   
const playYears = async function (v) {//v is a Vue instance 
    for (let i = YEARS.min; i <= YEARS.max; i++) {
        v.value = i;
        colorByYear(i);
        await sleep(500);// Pause .5 sec 
    }
}

let myVue; // Vue instance for slider 

// Provide for pausing as slider moves to new years 
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const GREYVALUE = -1;
const GREYCOLOR = 'rgb(225,225,225)';

// Tooltip shows country and search interest for each word pair
let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span class='details'>" + d.properties.ADMIN + "<br></span>" + "<span>Search Interest: </span><span class='details'>" + (d.interestOne === GREYVALUE ? "0" : d.interestOne) + "</span>";
    })
// Define page layout 
const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 },
    MAPWIDTH = 1440 - MARGIN.left - MARGIN.right,
    MAPHEIGHT = 750 - MARGIN.top - MARGIN.bottom;

// Perceptually appropriate green values from 
// https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=3 
const cbArray = ['rgb(225,225,225)', 'rgb(229,245,249)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,109,44)', 'rgb(0,68,27)'];

function color(interest1, year) { // Interest1 is 0-1 scaled relative value of word
    if (interest1 === undefined || interest1 === GREYVALUE) {
        return GREYCOLOR;// If value unknown make grey 
    }
    // Year interest is Google search interest relative to the highest point
    // in time for a specific year
    let yearInterest = scaledInterestByYear[wordOne][year]
    // Interest1 is the regional year interest
    // Interest1 is scaled up by year interest then adjusted down by 0.35 
    // to create optimum perceptual color range
    interest1 = Math.round(interest1 * yearInterest * 0.35);
    if (interest1 >= cbArray.length) interest1 = cbArray.length - 1
    return cbArray[interest1]
}
// Draw page 
function main(w1) {
    myVue = new Vue({
        el: '#app',
        data() {
            return {
                value: 0,
                yearInterest: '',
                wordOne: w1,
                options: { // Layout and features for slider 
                    dotSize: 14,
                    width: '50%',
                    height: 6,
                    contained: false,
                    direction: 'ltr',
                    data: AXIS,
                    min: YEARS.min,
                    max: YEARS.max,
                    interval: 1,
                    disabled: false,
                    clickable: true,
                    duration: 0.5,
                    adsorb: true,
                    lazy: false,
                    tooltip: 'active',
                    tooltipPlacement: 'top',
                    tooltipFormatter: void 0,
                    useKeyboard: false,
                    keydownHook: null,
                    dragOnClick: false,
                    enableCross: true,
                    fixed: false,
                    minRange: void 0,
                    maxRange: void 0,
                    order: true,
                    marks: true,
                    dotOptions: void 0,
                    process: true,
                    dotStyle: void 0,
                    railStyle: void 0,
                    processStyle: void 0,
                    tooltipStyle: void 0,
                    stepStyle: void 0,
                    stepActiveStyle: void 0,
                    labelStyle: void 0,
                    labelActiveStyle: void 0,
                }
            }
        },
        computed: {
            titleWord: function () {
                return this.wordOne.replace('-', ' ')// Remove dash from hello kitty
            }
        },
        methods: {
            update: () => { // Color by year when year selected on slider  
                void colorByYear(myVue.value)
            },
            play: () => { // Play button handler 
                playYears(myVue)
            },
            wordchoice: () => { // Handle change of selection in word dropdown 

                let wordOne = document.getElementsByClassName('wordchoice')[0].value;
                let url = window.location.href.split('?');
                // Reload page with new URL 
                window.location.href =
                    `${url[0]}?w1=${wordOne}`
            }
        },
        // Year slider for controlling which year is mapped 
        components: {
            'vueSlider': window['vue-slider-component'],
        }
    })
    wordOne = w1;
    myVue.wordOne = w1;

    // Create svg into which map is drawn  
    svg = d3.select("map")
        .append("svg")
        .attr("width", MAPWIDTH)
        .attr("height", MAPHEIGHT)
        .append('g')
        .attr('class', 'map');
    // Use Mercator projection, scale and position map 
    projection = d3.geoMercator()
        .scale(162)
        .translate([MAPWIDTH / 2, MAPHEIGHT / 1.5]);

    path = d3.geoPath().projection(projection);

    svg.call(tip);
    // Queue up data sources; when available call ready function 
    queue()
        .defer(d3.json, "data/resources1/countries.geojson") // data (geojson)
        .defer(d3.json, `data/resources1/results/${w1}.json`) // interest (pair json file)
        .await(ready);
    // Set select dropdown value to match word from URL 
    if (urlParams.get('w1')) {
        document.getElementsByClassName('wordchoice')[0].value = w1;
    }
}
let globalInterest;
let myData;
let toCode;

//add ISO values where needed 
function createToCode(geodata) {
    const to3 = [];

    geodata.features.forEach(
        (feature) => {
            to3.push([feature.properties.ADMIN, feature.properties.ISO_A3]);
        }
    );
    // Create a single js map between country names and country codes
    // This is needed because Google data uses country names and JSON data uses country codes
    // Some need to be edited for match to succeed
    const toCode = new Map(to3);
    toCode.set('United States', 'USA')
    toCode.set('Myanmar (Burma)', 'MMR')
    toCode.set('Tanzania', 'TZA')
    toCode.set('Hong Kong', 'HKG')
    toCode.set('Bosnia & Herzegovina', 'BIH')
    toCode.set('Czechia', 'CZE')
    toCode.set('Serbia', 'SRB')
    toCode.set('Côte d’Ivoire', 'CIV')
    toCode.set('Congo - Brazzaville', 'COG')
    toCode.set('Congo - Kinshasa', 'COD')
    toCode.set('Micronesia', 'FSM')
    toCode.set('Guinea-Bissau', 'GNB')
    toCode.set('Timor-Leste', 'TLS')
    toCode.set('North Macedonia', 'MKD')
    toCode.set('eSwatini', 'SWZ')
    return toCode
}
// Draw map after data is loaded 
function ready(error, data, interest) {
    myVue.wordOne = wordOne;
    globalInterest = interest;
    myData = data;
    toCode = createToCode(data);
    // Initialize interest values for every region to GREYVALUE, 
    // so missing values are treated as zero when coloring regions 
    data.features.forEach(function (d) { d.interestOne = GREYVALUE });
    svg.append("g") // Create and draw map 
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function (d) {
            return color(GREYVALUE);
        })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity", 0.8)
        // tooltip
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
            tip.show(d);
            d3.select(".d3-tip")
                .style("left", (d3.event.clientX + 20) + "px")
                .style("top", (d3.event.clientY - 20) + "px")
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
        })
        .on('mouseout', function (d) {
            tip.hide(d);

            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke", "white")
                .style("stroke-width", 0.3);
        });
        d3.select('.loading')
        .remove()
    svg.append("path") 
        .datum(topojson.mesh(data.features,
            function (a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);
}

// Assign color based on keys in globalInterest 
function colorByYear(year) {
    // Show interest out of 100
    myVue.yearInterest = Math.round(scaledInterestByYear[wordOne][year]) + ' out of 100'
    const interestOneByISO = {};
    const yrstr = year + '';
    Object.keys(globalInterest).forEach(
        countryName => {
            if (globalInterest[countryName].words[wordOne][yrstr] === 0)
            // Check if both values are 0, if so set to GREYVALUE
            {
                interestOneByISO[toCode.get(countryName)] = GREYVALUE
            } else {
                interestOneByISO[toCode.get(countryName)] =
                    globalInterest[countryName].words[wordOne][yrstr]
            }
        }
    )
    // Set interestOne property according to relative interest by year 
    myData.features.forEach(function (d) { d.interestOne = interestOneByISO[d.properties.ISO_A3] });

    d3.selectAll('.countries > path') // already drawn so select paths and set style depending on data values
    // 
        .transition()
        .duration(1000)
        .style("fill", function (d) {
            if (d.interestOne === GREYVALUE) { // are both values zero?
                return GREYCOLOR // when both values zero 
            }
            return color(d.interestOne, year); // otherwise
        })
}
// Global interest by year 
let scaledInterestByYear;
// Use local file with global interest data to initialize scaledInterestByYear
fetch('data/resources1/results/wordscales.json', { mode: 'no-cors' })
    .then(result => result.json())
    .then(
        (data) => {
            scaledInterestByYear = data
            main(w1) // Display page 
        }
    )
    .catch((error) => console.log(error)) 
