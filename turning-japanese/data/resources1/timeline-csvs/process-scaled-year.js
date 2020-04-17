let myArgs = process.argv.slice(2);
const wordOne = myArgs[0].toLowerCase();
// const wordTwo = myArgs[1];
const neatCsv = require('neat-csv');
const fs = require('fs')
const scaledInterest = new Map()
const path = `./${wordOne}-timeline.csv`
const thisYear = new Date().getFullYear();
process1file(path).then(
  () =>  console.log(scaledInterest)
);

// fs.writeFileSync(`./resources/results/${wordOne}.json`,
//     JSON.stringify(trends, null, 4)) //name of output file
// console.log('complete');

async function process1file(path) {

    let data = fs.readFileSync(path);
    const pairs = await neatCsv(data)
    // console.log(pairs);
    pairs.shift()
    pairs.shift()
    let denom = 0;
    pairs.forEach(
        datum => {
            const year_mo = datum[0]
            const year = +(year_mo.split('-')[0])
            const val1 = +datum[1]
            if (year === thisYear) denom++;
            if (scaledInterest.has(year)) {
           
                scaledInterest.set(year, scaledInterest.get(year) + val1 / 12)
            }
            else {
                scaledInterest.set(year, val1 / 12)
            }
            // console.log(scaledInterest);
        }
    )
    if (denom !== 0)
    scaledInterest.set(thisYear, scaledInterest.get(thisYear) * 12 / denom)
}
