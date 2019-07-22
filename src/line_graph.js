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


const x = d3.scalePoint()
    .range(0,width)
    .padding(0.1);

const y = d3.scaleLinear()
    .range(height, 0);

// const area = d3.scaleLinear()
//     .range([50*Math.PI, 1000*Math.PI])
//     .domain([0,400])

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

// d3.json("../src/data/team_shot_data.json").then(function (data) {

//     data.forEach(datum => datum.Season = +datum.Season.split("-")[1])
//     let format = [];
//     for (let i = 0; i < data.length; i++) {
//         const datum = data[i];
//         if (!format.length || datum.Season !== format[format.length - 1].season) {
//             format.push({
//                 season: datum.Season,
//                 teams: [datum]
//             })
//         } else {
//             format[format.length - 1].teams.push(datum)
//         }
//     }

//     let byTeam = []
//     for (let j = 0; j < data.length; j++) {

//         const datum = data[j];
//         if (!byTeam.length || byTeam.every(obj => obj.team !== datum["Team"])) {
//             byTeam.push({
//                 team: datum["Team"],
//                 seasonStat: [datum]
//             })
//         } else {
//             byTeam.forEach(obj => {
//                 if (obj.team === datum["Team"]) {
//                     obj.seasonStat.push(datum)
//                 }
//             })

//         }

//     }
//     console.log(data)
//     console.log(byTeam)

//     update(byTeam[0])

// })


// function update(data) {
//     const teamColor = d3.scaleSequential(d3.interpolateOrRd);
//     const t = d3.transition()
//         .duration(200)
//         .ease(d3.easeLinear)
//         // .delay();
//     y.domain(data.map(d => d[team]))

//     const t2 = d3.transition()
//         .duration(100)
//         // .delay(300)
//         .ease(d3.easeSinIn)

//     const yAxisCall = d3.axisLeft(y)
//         .tickFormat("").tickSize(0);
//     yAxisGroup.transition(t).call(yAxisCall);


//     const xAxisCall = d3.axisTop(x)
//         .tickSizeOuter(0);
//     xAxisGroup.call(xAxisCall);

//     const joins = g.selectAll("line")
//         .data(data, (d,i) => {
//             // debugger
//             return d
//         })
//         // debugger;
//         // joins.exit()
//         //     // .transition(t)
//         //     .remove()

//         joins.enter()
//             .append("line")
//             .attr("stroke", "grey")
//             .attr("stroke-width", 3)
//             // .attr("y2", height / 2)
//             // .attr("x2", 0)
//             // .attr("x1", 0)
//             .attr("x1", (d) => x(d[attShotDist]))
//             .attr("y1", d => {
//                 return y(d[team]) + y.bandwidth() / 2
//             })
//             .attr("y2", height/2)
//             .attr("x2", 0)
//             .merge(joins)
//             .transition(t2)
//             .attr("x1", (d) => x(d[attShotDist]))
//             .attr("y1", d => {
//                 return y(d[team]) + y.bandwidth() / 2
//             })
//             .attr("y2", height/2)
//             .attr("x2", 0)

//     const teams = g.selectAll("circle")
//         .data(data, function (d) {
//             return d[team]
//         })

//     //EXIT
//     // debugger
//     teams.exit()
//         .attr("class", "exit")
//         .transition(t)
//         .attr("height", 0)
//         .remove();
//     joins.exit()
//         // .transition(t)
//         .transition(t2)
//         .remove()

//     //ENTER
//     // debugger;
//     teams.enter()
//         .append("circle")
//         .attr("class", "enter")
//         .attr("id", (d,i)=> d[team])
//         .attr("fill", (d, i) => teamColor(i / (data.length)))
//         .merge(teams)
//         .transition(t)
//         .attr("cy", d => y(d[team]) + y.bandwidth() / 2)
//         .attr("cx", d => x(d[attShotDist]))
//         .attr("r", d => {
//             // debugger
//             return Math.sqrt(area(d[madeShotDist]) / Math.PI)
//         })
    
//     timeLabel.text("Season: " + `${+(time + 1997 -1)}` + " - " +(time + 1997) )

// }

