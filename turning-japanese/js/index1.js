/*
COMPUTE INTEREST OVER TIME AGAINST INTEREST BY REGION  
convert csv to json that includes only the january 1 figure between 2006-2020
multiply each january 1 figure against each year's annual figure in the main results json  
use final to create color 
*/
//examine url to check for new query params 
const urlParams = new URLSearchParams(window.location.search);
let path, svg, projection;
let w1 = urlParams.get('w1') || 'cosplay';
document.title = `${w1} search interest`
// let w2 = urlParams.get('w2') || 'emoji';

const YEARS = {
    min: 2006,
    max: 2020 
}
// function returns array of years 
const AXIS = (() => {
    const arr = [];
    for (let y = YEARS.min; y <= YEARS.max; y++) {
        arr.push(y);
    }
    return arr;
})();
// show data for all years 
const playYears = async function (v) {
    for (let i = YEARS.min; i <= YEARS.max; i++) {
        v.value = i;
        colorByYear(i);
        await sleep(500);

    }
}

let myVue; // Vue instance 


function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const GREYVALUE = -1;
const GREYCOLOR = 'rgb(225,225,225)';

//tooltip shows country and search interest for each word pair
let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span class='details'>" + d.properties.ADMIN + "<br></span>" + "<span>Search Interest: </span><span class='details'>" + (d.interestOne === GREYVALUE ? "0" : d.interestOne) + "</span>";
    })

const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 },
    MAPWIDTH = 1440 - MARGIN.left - MARGIN.right,
    MAPHEIGHT = 750 - MARGIN.top - MARGIN.bottom;

const colorRange = [1, .9, .8, .7, .6, .5, .4, .3, .2, .1].map(
    (x) => {
        val = 225 * x;
        return `rgb(${0},${val},${0})`
    }
)
const cbArray = ['rgb(225,225,225)', 'rgb(229,245,249)', 'rgb(204,236,230)', 'rgb(153,216,201)', 'rgb(102,194,164)', 'rgb(65,174,118)', 'rgb(35,139,69)', 'rgb(0,109,44)', 'rgb(0,68,27)'];

const colorArray = ['rgb(225,225,225)', 'rgb(224,236,244)', 'rgb(191,211,230)', 'rgb(158,188,218)', 'rgb(140,150,198)', 'rgb(140,107,177)', 'rgb(136,65,157)', 'rgb(129,15,124)', 'rgb(77,0,75)'];

function color(interest1, year) { //interest1 is 0-1 scaled relative value of first word in pair
    if (interest1 === undefined || interest1 === GREYVALUE) {
        return GREYCOLOR;
    }
    let yearInterest = scaledInterestByYear[wordOne][year]
    //scale values by years total interest and up .25 to access full color range 
    interest1 = Math.round(interest1 * yearInterest * 0.35);
    if (interest1 >= cbArray.length) interest1 = cbArray.length - 1
    return cbArray[interest1]
}

function main(w1) {
    myVue = new Vue({
        el: '#app',
        data() {
            return {
                value: 0,
                yearInterest: '',
                wordOne: w1,
                // wordTwo: w2,
                options: {
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
                return this.wordOne.replace('-', ' ')//remove dash from hello kitty
            }
        },
        methods: {
            update: () => {//color by year 
                console.log(myVue.value)
                void colorByYear(myVue.value)
            },
            play: () => {
                playYears(myVue)
            },
            wordchoice: () => {//handle dropdown 

                let wordOne = document.getElementsByClassName('wordchoice')[0].value;
                let url = window.location.href.split('?');

                window.location.href =
                    `${url[0]}?w1=${wordOne}`
            }
        },
        mounted() {
        },
        components: {
            'vueSlider': window['vue-slider-component'],
        }
    })
    wordOne = w1;
    // wordTwo = w2;
    myVue.wordOne = w1;
    // myVue.wordTwo = w2;

    svg = d3.select("map")
        .append("svg")
        .attr("width", MAPWIDTH)
        .attr("height", MAPHEIGHT)
        .append('g')
        .attr('class', 'map');

    projection = d3.geoMercator()
        .scale(162)
        .translate([MAPWIDTH / 2, MAPHEIGHT / 1.5]);

    path = d3.geoPath().projection(projection);

    svg.call(tip);

    queue()
        .defer(d3.json, "data/resources1/countries.geojson") // data (geojson)
        .defer(d3.json, `data/resources1/results/${w1}.json`) // interest (pair json file)
        .await(ready);
    if (urlParams.get('w1')) {
        document.getElementsByClassName('wordchoice')[0].value =
            `${w1}`
    }
}
let globalInterest;
let myData;
let toCode;

//add ISO values where needed 
function createToCode(geodata) {
    const to3 = [];

    // console.log(geodata);
    geodata.features.forEach(
        (feature) => {
            to3.push([feature.properties.ADMIN, feature.properties.ISO_A3]);
        }
    );

    const toCode = new Map(to3);
    // updates for Google country names
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

function ready(error, data, interest) {
    myVue.wordOne = wordOne;
    // myVue.wordTwo = wordTwo;
    globalInterest = interest;
    myData = data;
    toCode = createToCode(data);
    // document.querySelector("g.map").remove();
    data.features.forEach(function (d) { d.interestOne = GREYVALUE });
    svg.append("g")
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
        // tooltips
        .style("stroke", "white")
        .style('stroke-width', 0.3)
        .on('mouseover', function (d) {
            console.log(d3.event);
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
    svg.append("path")//check this later 
        .datum(topojson.mesh(data.features,
            function (a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);
}

// assign color based on keys in globalInterest 
function colorByYear(year) {
    myVue.yearInterest = Math.round(scaledInterestByYear[wordOne][year]) + ' out of 100'
    const interestOneByISO = {};
    const yrstr = year + '';
    Object.keys(globalInterest).forEach(
        countryName => {
            if (globalInterest[countryName].words[wordOne][yrstr] === 0)
            // && // check if both values are 0, if so set to GREYVALUE
            // globalInterest[countryName].words[wordTwo][yrstr] === 0) 
            {
                interestOneByISO[toCode.get(countryName)] = GREYVALUE
            } else {
                interestOneByISO[toCode.get(countryName)] =
                    globalInterest[countryName].words[wordOne][yrstr]
            }
        }
    )
    myData.features.forEach(function (d) { d.interestOne = interestOneByISO[d.properties.ISO_A3] });

    d3.selectAll('.countries > path') // already drawn so select paths and set style depending on data values
        .transition()
        .duration(1000)
        .style("fill", function (d) {
            if (d.interestOne === GREYVALUE) { // are both values zero?
                // console.log(year);
                return GREYCOLOR // when both values zero 
            }
            return color(d.interestOne, year); // otherwise
        })
}

let scaledInterestByYear;

fetch('data/resources1/results/wordscales.json', { mode: 'no-cors' })
    .then(result => result.json())
    .then(
        (data) => {
            scaledInterestByYear = data
            main(w1)
        }
    )
    .catch((error) => console.log(error)) 
