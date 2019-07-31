import * as d3 from "d3"
import { compareBy } from './format_data';

const margin = { top: 100, right: 20, bottom: 300, left: 120 };
const width = 1200 - margin.left - margin.right;
const height = 1200 - margin.top - margin.bottom;

export const attShotDist = "Avg. Shot Dis.(ft.)";
export const team = 'Team';
export const madeShotDist = "Avg. Made Shot Dis.(ft.)"

// let time = 0;
const svg = d3.select('#chart-area')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)


const x = d3.scaleLinear()
    .range(0,width)
    .domain([1996, 2020]);
    // .padding(0.1);

const y = d3.scaleLinear()
    .range(height, 0);

const area = d3.scaleLinear()
    .range([50*Math.PI, 1000*Math.PI])
    .domain([0,400])

const yAxisGroup = g.append("g")
    .attr("class", "y-axis")

const xAxisGroup = g.append("g")
    .attr("class", "x-axis")

// // g.append("text")
// //     .attr("class", "x-axis-label")
// //     .attr("y", width / 2)
// //     .attr("x", height + 200)
// //     .attr("font-size", "20px")
// //     .attr("text-anchor", "middle")
// //     .text("Team")

// let xLabel = g.append("text")
//     .attr("class", "x-axis-label")
//     .attr("y", -40)
//     .attr("x", width/2)
//     .text("Average Shot Attempt Distance (ft.)")
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")

// let timeLabel = g.append("text")
//     .attr("class", "time-label")
//     .attr("y", height/10)
//     .attr("x", 30);

d3.json("../src/data/team_shot_data.json").then(function (data) {

    data.forEach(datum => datum.Season = +datum.Season.split("-")[1])
    let format = [];
    for (let i = 0; i < data.length; i++) {
        const datum = data[i];
        if (!format.length || datum.Season !== format[format.length - 1].season) {
            format.push({
                season: datum.Season,
                teams: [datum]
            })
        } else {
            format[format.length - 1].teams.push(datum)
        }
    }

    let byTeam = []
    for (let j = 0; j < data.length; j++) {

        const datum = data[j];
        if (!byTeam.length || byTeam.every(obj => obj.team !== datum["Team"])) {
            byTeam.push({
                team: datum["Team"],
                seasonStat: [datum]
            })
        } else {
            byTeam.forEach(obj => {
                if (obj.team === datum["Team"]) {
                    obj.seasonStat.push(datum)
                }
            })

        }

    }
    console.log(data)
    console.log(byTeam)

    updateTeam(byTeam[0].seasonStat)

})


function updateTeam(data) {
    // debugger;
    console.log(data)
    const teamColor = d3.scaleSequential(d3.interpolateOrRd);
    const t = d3.transition()
        .duration(200)
        .ease(d3.easeLinear)
        // .delay();
    // y.domain([0, d3.max(data, d=> d[attShotDist]x.)])
    y.domain([0, 30])
    // debugger;
    x.domain(data.map(d=> {
        // debugger
        return d["Season"]}).reverse())
    // debugger
    const stats = g.selectAll("circle")
        .data(data, function (d) {
            // debugger
            return d
        })

    //EXIT
    // debugger
    stats.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("height", 0)
        .remove();
    // joins.exit()
    //     // .transition(t)
    //     .transition(t2)
    //     .remove()

    //ENTER
    // debugger;
    stats.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("id", (d,i)=> d[team])
        .attr("fill", (d, i) => teamColor(i / (data.length)))
        .merge(stats)
        .transition(t)
        .attr("cy", d => y(d[attShotDist]))
        .attr("cx", d => {
            // debugger
            return x(d["Season"])})
        .attr("r", d => {
            // debugger
            return Math.sqrt(area(d[madeShotDist]) / Math.PI)
        })
    
    // timeLabel.text("Season: " + `${+(time + 1997 -1)}` + " - " +(time + 1997) )

}

