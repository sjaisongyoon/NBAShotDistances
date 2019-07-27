import * as d3 from "d3"
import d3Tip from 'd3-tip';
import { compareBy } from './format_data';
// (d3 as any).tip = d3Tip;
// import {hide, show} from 'd3-tip';
// 
const margin = { top: 100, right: 200, bottom: 300, left: 50 };
const width = 1200 - margin.left - margin.right;
const height = 1200 - margin.top - margin.bottom;

export const attShotDist = "Avg. Shot Dis.(ft.)";
export const team = 'Team';
export const madeShotDist = "Avg. Made Shot Dis.(ft.)"
export const missedShotDist = "Avg. Missed Shot Dis.(ft.)"

let time = 0;
const svg = d3.select('#chart-area')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// const tip = d3Tip().attr('class', 'd3-tip')
//     .html(d => {
//         let text = "<strong>Team:<strong> <span style='colored:red'>" + d.team + "</span><br>"
//         text += "<strong>Shot Att. Avg. Dist. (ft.):<strong> <span style='colored:red'>" + d.team + "</span><br>"
//     });
// g.call(tip);

const tip = d3Tip().attr('class', 'd3-tip')
    .html(d => {
        // debugger
        let text = `<strong>Team:</strong> <span style='color:red'>  ${d[team]}  </span><br>`
        text += `<strong>Avg. Shot Att. Dist. (ft.):</strong> <span style='color:red'>  ${d[attShotDist]} </span><br>`
        text += `<strong>Avg. Shot Made. Dist. (ft.):</strong> <span style='color:red'>  ${d[madeShotDist]} </span><br>`
        text += `<strong>Avg. Shot Missed. Dist. (ft.):</strong> <span style='color:red'>  ${d[missedShotDist]} </span><br>`
        // debugger
        return text
    });
g.call(tip);

const y = d3.scaleBand()
    .range([0, height])
    .paddingInner(0.2)
    .paddingOuter(0.3);


const x = d3.scaleLinear()
    .range([0, width])

const area = d3.scaleLinear()
    .range([50*Math.PI, 1000*Math.PI])
    .domain([0,400])

const yAxisGroup = g.append("g")
    .attr("class", "y-axis")

const rightAxisGroup = g.append("g")
    .attr("class", "right-axis")
    .attr("transform", `translate(${width}, 0)`);

const xAxisGroup = g.append("g")
    .attr("class", "x-axis")

// g.append("text")
//     .attr("class", "x-axis-label")
//     .attr("y", width / 2)
//     .attr("x", height + 200)
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")
//     .text("Team")

g.append("ellipse")
    .attr("cx", 0)
    .attr("cy", height / 2)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr("fill", "none")


let xLabel = g.append("text")
    .attr("class", "x-axis-label")
    .attr("y", -40)
    .attr("x", width/2)
    .text("Average Shot Attempt Distance (ft.)")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")

let timeLabel = g.append("text")
    .attr("class", "time-label")
    .attr("y", height/10)
    .attr("x", 30);

// d3tip tip = d3.tip().attr('class', 'd3tip').html(function(d) {return d;}), with 2 event listeners
// on method

d3.json("./data/team_shot_data.json").then(function (data) {

    data.forEach(datum => datum.Season = +datum.Season.split("-")[1])
    data.reverse();
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
    let filtered = format.map(seasonData => {
        return seasonData.teams.filter(team => {
            return Object.values(team).every(value => value[attShotDist] !== null)
        })
    }).map(season => season.sort(compareBy("team")))

    x.domain([0, 16]);

    d3.interval(() => {
        time = (time < format.length - 1) ? time + 1 : 0
        update(filtered[time]);

    }, 1000);
    update(filtered[0])

})

function update(data) {

    const teamColor = d3.scaleSequential(d3.interpolateOrRd);
    // const t = d3.transition()
    //     .duration(200)
    //     .ease(d3.easeLinear)
    //     // .delay();
    y.domain(data.map(d => d[team]))

    const t2 = d3.transition()
        .duration(100)
        // .delay(300)
        .ease(d3.easeSinIn)

    const yAxisCall = d3.axisLeft(y)
        .tickFormat("").tickSize(0);
    yAxisGroup.call(yAxisCall);

    const yAxisRight = d3.axisRight(y)
        .tickSizeOuter(0);
    rightAxisGroup.call(yAxisRight)

    const xAxisCall = d3.axisTop(x)
        .tickSizeOuter(0);
    xAxisGroup.call(xAxisCall);

    const joins = g.selectAll("line")
        .data(data, (d,i) => {
            // debugger
            return d
        })
        // debugger;
        // joins.exit()
        //     // .transition(t)
        //     .remove()

        joins.enter()
            .append("line")
            .attr("stroke", "grey")
            .attr("stroke-width", 3)
            // .attr("y2", height / 2)
            // .attr("x2", 0)
            // .attr("x1", 0)
            .attr("x1", (d) => x(d[attShotDist]))
            .attr("y1", d => {
                return y(d[team]) + y.bandwidth() / 2
            })
            .attr("y2", height/2)
            .attr("x2", 0)
            .merge(joins)
            // .transition(t2)
            .attr("x1", (d) => x(d[attShotDist]))
            .attr("y1", d => {
                return y(d[team]) + y.bandwidth() / 2
            })
            .attr("y2", height/2)
            .attr("x2", 0)

    const teams = g.selectAll("circle")
        .data(data, function (d) {
            return d[team]
        })

    //EXIT
    // debugger
    teams.exit()
        .attr("class", "exit")
        // .transition(t)
        .attr("height", 0)
        .remove();
    joins.exit()
        // .transition(t)
        // .transition(t2)
        .remove()

    //ENTER
    // debugger;
    teams.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("id", (d,i)=> d[team])
        .attr("fill", (d, i) => teamColor(i / (data.length)))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(teams)
        // .transition(t)
        .attr("cy", d => y(d[team]) + y.bandwidth() / 2)
        .attr("cx", d => x(d[attShotDist]))
        .attr("r", d => {
            // debugger
            return Math.sqrt(area(d[madeShotDist]) / Math.PI)
        })
    
    timeLabel.text("Season: " + `${+(time + 1997 -1)}` + " - " +(time + 1997) )

        d3.select(".right-axis").selectAll("text")
        .attr("font-size", "10px")
        .attr("x", "3")
        // .attr("y", d => y(d[team]) + y.bandwidth())



}

