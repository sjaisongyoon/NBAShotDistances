import * as d3 from "d3"
import d3Tip from 'd3-tip';
import { compareBy } from './format_data';
import $ from "jquery";
import "jquery-ui/ui/widgets/slider"
import "jquery-ui/themes/base/core.css"
import "jquery-ui/themes/base/slider.css";

const margin = { top: 75, right: 100, bottom: 50, left: 100 };
let width = window.innerWidth - 250
let height = window.innerHeight - 250

const setWidthHeight = () => {
    console.log("this ran", window.innerWidth)
    width = window.innerWidth - 250;
    height = window.innerHeight - 200;
    d3.select(".svg-container")
      .style("width", width + margin.left + margin.right)
      .style("height", height + margin.top + margin.bottom);
}

window.addEventListener("resize", setWidthHeight)

export const attShotDist = "Avg. Shot Dis.(ft.)";
export const team = 'Team';
export const madeShotDist = "Avg. Made Shot Dis.(ft.)"
export const missedShotDist = "Avg. Missed Shot Dis.(ft.)"

let time = 0;
let interval;
// let formattedData;
const svg = d3.select('#chart-area')
    .append('svg')
    .attr("class", "svg-container")
    .attr("viewBox", `0 0 ${width+margin.left+margin.right} ${height+margin.top+margin.bottom}`)
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom);

const g = svg.append("g")
    .attr("class", "chart-container")
    // .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("transform", `translate(${margin.left/2}, ${margin.top})`)

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
const bottomAxisGroup = g.append('g')
    .attr("class", "bottom-axis")
    .attr("transform", `translate(0, ${height})`);    
const topAxisGroup = g.append("g")
    .attr("class", "x-axis")

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
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")

let timeLabel = g.append("text")
    .attr("class", "time-label")
    .attr("y", height/10)
    .attr("x", 30);

// on method
let format = [];
let filtered;

d3.json("dist/data/team_shot_data.json").then(function (data) {

    data.forEach(datum => datum.Season = +datum.Season.split("-")[1])
    data.reverse();
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
    filtered = format.map(seasonData => {
        return seasonData.teams.filter(team => {
            return Object.values(team).every(value => value[attShotDist] !== null)
        })
    }).map(season => season.sort(compareBy("team")))

    x.domain([0, 16]);

    update(filtered[0])

})

function step(){
    time = (time < format.length - 1) ? time + 1 : 0
    update(filtered[time]);
}

$("#play-button")
    .on("click", function(){
        let button = $(this);
        if (button.text() === "Play"){
            button.text("Pause");
            interval = setInterval(step, 800);   
        } else {
            button.text("Play");
            clearInterval(interval);
        }
    })

$("#reset-button")
    .on("click", function(){
        time = 0;
        return update(filtered[0]);
    })

$("#slider").slider({
    max: 2018,
    min: 1996,
    range: false,
    step: 1,
    value: 1996,
    slide: function(event, ui){
        time = ui.value - 1996;
        update(filtered[time]);
    }
})

    
function update(data) {    
    const teamColor = d3.scaleSequential(d3.interpolateCividis);
    const t = d3.transition()
        .duration(200)
        .ease(d3.easeLinear)
        // .delay();
    y.domain(data.map(d => d[team]))

    const t2 = d3.transition()
        .duration(100)
        // .delay(300)
        .ease(d3.easeLinear)

    const yAxisCall = d3.axisLeft(y)
        .tickFormat("").tickSize(3);
    yAxisGroup.call(yAxisCall);

    const yAxisRight = d3.axisRight(y)
    rightAxisGroup.call(yAxisRight)

    const xAxisTopCall = d3.axisTop(x)
        .tickSizeOuter(0);
    const xAxisBottomCall = d3.axisBottom(x)
        .tickSizeOuter(0)
    topAxisGroup.call(xAxisTopCall);
    bottomAxisGroup.call(xAxisBottomCall);

    const joins = g.selectAll("line")
        .data(data, (d,i) => {            
            return d
        })

    joins.enter()
        .append("line")
        .attr("stroke", "#c6c6c6")
        .attr("stroke-width", 1.5)
        .attr("x1", (d) => x(d[attShotDist]))
        .attr("y1", d => {
            return y(d[team]) + y.bandwidth() / 2
        })
        .attr("y2", height/2)
        .attr("x2", 0)
        .merge(joins)
        .transition(t)
        .attr("x1", (d) => x(d[attShotDist]))
        .attr("y1", d => {
            return y(d[team]) + y.bandwidth() / 2
        })
        .attr("y2", height/2)
        .attr("x2", 0)        
        .style("position", "relative")
    joins.exit()
        .remove();
    
    //ENTER
    const teams = g.selectAll("circle").data(data, function (d) {
        return d[team];
    });

    teams.enter()
        .append("circle")
        .attr("id", (d,i)=> d[team])
        .attr("fill", (d, i) => teamColor(i / (data.length)))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(teams)
        .transition(t)
        .attr("cy", d => y(d[team]) + y.bandwidth() / 2)
        .attr("cx", d => x(d[attShotDist]))
        .attr("r", d => {
            // debugger
            return Math.sqrt(area(d[madeShotDist]) / Math.PI)
        })
        .style("position", "relative")
    
    //EXIT    
    teams.exit()
        .transition(t)
        .remove();

    timeLabel.text("Season: " + `${+(time + 1996)}` + " - " +(time + 1997) )
    $("#season")[0].innerHTML = +(time + 1996) + " - " +(time+1997)
    $("#slider").slider("value", +(time + 1996))    
    d3.select(".right-axis")
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("x", "3")
}

