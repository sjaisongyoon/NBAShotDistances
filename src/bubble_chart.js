// import * as d3 from "d3"
// import {compareBy} from './format_data';

// const margin = { top: 50, right: 20, bottom: 300, left: 80 };
// const width = 1000 - margin.left - margin.right;
// const height = 800 - margin.top - margin.bottom;

// export const avgShotDistance = "Avg. Shot Dis.(ft.)";
// export const team = 'Team'

// let time = 0;
// const svg = d3.select('#chart-area')
//     .append('svg')
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

// const g = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`)
    

// const x = d3.scaleBand()
//     .range([0, width])
//     .paddingInner(0.2)
//     .paddingOuter(0.3)


// const y = d3.scaleLinear()
//     .range([height, 0])


// const xAxisGroup = g.append("g")
//     .attr("class", "x-axis")
//     .attr("transform", `translate(0, ${height})`)

// const yAxisGroup = g.append("g")
//     .attr("class", "y-axis")
// // .attr("transform", `translate(0, ${height})`)

// g.append("text")
//     .attr("class", "x-axis-label")
//     .attr("x", width / 2)
//     .attr("y", height + 200)
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")
//     .text("Team")

// let yLabel = g.append("text")
//     .attr("class", "y-axis-label")
//     .attr("x", -(height / 2))
//     .attr("y", -60)
//     .text("Shot Distance (ft.)")
//     .attr("transform", "rotate(-90)")
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")

// let timeLabel = g.append("text")
//     .attr("class", "time-label")
//     .attr("x", width-60)
//     .attr("y", height + 120)



// d3.json("../src/data/team_shot_data.json").then(function (data) {

//     data.forEach(datum => datum.Season = +datum.Season.split("-")[1])
//     data.reverse();
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
//     let filtered = format.map(seasonData => {
//         return seasonData.teams.filter(team => {
//             return Object.values(team).every(value => value[avgShotDistance] !== null)
//         })
//     }).map(season => season.sort(compareBy("averageDistance")))
//     // debugger;

//     y.domain([0, d3.max(data, d => d[avgShotDistance])]);


//     // console.log(format)
//     console.log(filtered)
//     d3.interval(() => {
//         time = (time < format.length-1) ? time + 1 : 0
//             update(filtered[time]);
        
//     }, 400);
//     update(filtered[0])

// })

// function update(data) {
//     const teamColor = d3.scaleSequential(d3.interpolateOrRd);
//     const t = d3.transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         // .attr("height", 0)
//         .delay();
//     x.domain(data.map(d => d[team]))

//     const xAxisCall = d3.axisBottom(x)
//         .tickSizeOuter(0);
//     xAxisGroup.transition(t).call(xAxisCall);

//     const yAxisCall = d3.axisLeft(y)
//         .tickSizeOuter(0);
//     yAxisGroup.call(yAxisCall);

//     //JOIN
//     const teams = g.selectAll("rect")
//         .data(data, function (d) {
//             return d[team]
//         })

//     //EXIT
//         // debugger
//     teams.exit()
//         .attr("class","exit")
//         .transition(t)
//         .attr("height", 0)
//         .remove();

//     //ENTER
//     // debugger;
//     teams.enter()
//         .append("rect")
//         .attr("class", "enter")
//         // .attr("x", d => x(d[team]) )
//         .attr("height", 0)
//         .attr("width", x.bandwidth())
//         .attr("fill", (d,i) => teamColor(i/(data.length)))
//         .attr("y", y(0))
//         // .attr("r", 5)
//         .merge(teams)
//         .transition(t)
//             .attr("x", d => x(d[team]) )
//             .attr("width", x.bandwidth())
//             .attr("y", d => y(d[avgShotDistance]))
//             .attr("height", d => height - y(d[avgShotDistance]));

//     d3.select(".x-axis").selectAll("text")
//         .attr("font-size", "10px")
//         .attr("y", "0")
//         .attr("x", "-10")
//         .transition(t)
//         .attr("y", "0")
//         .attr("x", "-10")
//         .attr("text-anchor", "end")
//         .attr("transform", "rotate(-60)")
//         // .attr("dy", 0)

//     timeLabel.text(+(time + 1997))

// }

