//get search location 
const urlParams = new URLSearchParams(window.location.search);
const hasw1 =urlParams.get('w1');
let path, svg, projection;
let w1 = hasw1 || 'kanji';
let w2 = urlParams.get('w2') || 'emoji';
document.title = `${w1} vs ${w2}`
// set selector's current value

const YEARS = {
    min: 2006,
    max: 2020
}
const AXIS = (() => {
    const arr = [];
    for (let y = YEARS.min; y <= YEARS.max; y++) {
        arr.push(y);
    }
    return arr;
})();
const expt = async function (v) {
    for (let i = YEARS.min; i <= YEARS.max; i++) {
        v.value = i;
        colorByYear(i);
        await sleep(1000);

    }
}
let myVue;
// Vue instance 

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const GREYVALUE = -1;
const GREYCOLOR = 'rgb(225,225,225)';
// var format = d3.format(",");

// Tooltip shows country and search interest for each word pair
let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span class='details'>" + d.properties.ADMIN + "<br></span>" + "<span>Search Interest: </span><span class='details'>" + (d.interestOne === GREYVALUE ? "0, 0" : `${d.interestOne}, ${1 - d.interestOne}`) + "</span>";
    })

const MARGIN = { top: 0, right: 0, bottom: 0, left: 0 },
    MAPWIDTH = 1440 - MARGIN.left - MARGIN.right,
    MAPHEIGHT = 750 - MARGIN.top - MARGIN.bottom;


function color(interest1) { //interest1 is 0-1 scaled relative value of first word in pair
    if (interest1 === undefined || interest1 === GREYVALUE) {
        return GREYCOLOR;
    }
    let red = 255 * interest1;
    let blue = 255 * (1 - interest1);
    return `rgb(${red}, 25, ${blue})` //backtick means string, ${} interpolates rgb values 
}

function main(w1, w2) {
    myVue = new Vue({
        el: '#app',
        data() {
            return {
                value: 0,
                wordOne: w1,
                wordTwo: w2,
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
        methods: {
            update: () => {
                console.log(myVue.value)
                void colorByYear(myVue.value)
            },
            play: () => {
                expt(myVue)
            },
            wordchoice: () => {

                let choice = document.getElementsByClassName('wordchoice')[0].value;
                [wordOne, wordTwo] = choice.split(" vs ") //split words 
                let url = window.location.href.split('?');
                
                window.location.href =
                    `${url[0]}?w1=${wordOne}&w2=${wordTwo}`
            }
        },
        mounted() {
        },
        components: {
            'vueSlider': window['vue-slider-component'],
        }
    })
    wordOne = w1;
    wordTwo = w2;
    myVue.wordOne = w1;
    myVue.wordTwo = w2;

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
        .defer(d3.json, "./data/resources2/countries.geojson") // data (geojson)
        .defer(d3.json, `./data/resources2/results/${w1}-${w2}.json`) // interest (pair json file)
        .await(ready);
    if (urlParams.get('w1')) {
        document.getElementsByClassName('wordchoice')[0].value =
            `${w1} vs ${w2}`
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
    myVue.wordTwo = wordTwo;
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

        d3.select('.loading')//remove loading element 
        .remove()

    svg.append("path")//check this later 
        .datum(topojson.mesh(data.features,
            function (a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);
}

// assign color based on keys in globalInterest 
function colorByYear(year) {
    const interestOneByISO = {};
    const yrstr = year + '';
    Object.keys(globalInterest).forEach(
        countryName => {
            if (globalInterest[countryName].words[wordOne][yrstr] === 0 && // check if both values are 0, if so set to GREYVALUE
                globalInterest[countryName].words[wordTwo][yrstr] === 0) {
                interestOneByISO[toCode.get(countryName)] = GREYVALUE
            } else {
                interestOneByISO[toCode.get(countryName)] =
                    globalInterest[countryName].words[wordOne][yrstr]
            }
        }
    )
    myData.features.forEach(function (d) { d.interestOne = interestOneByISO[d.properties.ISO_A3] });

    d3.selectAll('.countries > path') // already drawn so just select paths and set style depending on data values
        .transition()
        .duration(2000)
        .style("fill", function (d) {
            if (d.interestOne === GREYVALUE) { // are both values zero?
                // console.log(year);
                return GREYCOLOR // when both values zero 
            }
            return color(d.interestOne); // otherwise
        })
}
main(w1, w2);