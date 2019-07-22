// import * as d3 from "d3"

// // const data = [25, 20, 10, 12, 15];

// d3.json("../src/data/team_shot_data.json").then(function(data){
//     console.log(data)
//     data.forEach(function(d){
//         d["Avg. Shot Dis.(ft.)"] = (+d["Avg. Shot Dis.(ft.)"] / 11.9) * 12
//     })
//     // console.log(data);
//     // d.Avg. Shot Dis.(ft.)
//     const svg = d3.select("#chart-area").append("svg")
//         .attr("width", 1000)
//         .attr("height", 1000)
    
//     const circles = svg.selectAll("circle")
//         .data(data)
    
//     circles.enter()
//         .append("circle")
//             .attr("cx", (d, i) => (i * 100))
//             // .attr("cx", function(d,i){
//             //     return (i * 50) + 25;
//             // })
//             .attr("cy", 300)
//             .attr("r", (d) => d["Avg. Shot Dis.(ft.)"] * 2 )
//             // .attr("r", function(d){
//             //     return d;
//             // })
//             .attr("fill", function(d){
//                 if (d["Team"] === "Golden State Warriors"){
//                     return "blue";
//                 } else {
//                     return "red";
//                 }
//             })
// }).catch(function(error){
//     console.log(error)
// })


// // const circle = svg.append("circle")
// //     .attr("cx", 100)
// //     .attr("cy", 250)
// //     .attr("r", 70)
// //     .attr("fill", "blue")

// // const rect = svg.append("rect")
// //     .attr("x", 0)
// //     .attr("y", 0)
// //     .attr("width", 50)
// //     .attr("height", 50)
// //     .attr("fill", "red")

// // const line = svg.append("line")
// //     .attr("x1", 400)
// //     .attr("y1", 0)
// //     .attr("x2", 300)
// //     .attr("y2", 300)
// //     .attr("attr-width", 3)
// //     .attr("stroke", "red")
    

// // const path = svg.append("line")
// //     .attr("x1", 400)
// //     .attr("y1", 0)
// //     .attr("x2", 300)
// //     .attr("y2", 300)
// //     .attr("attr-width", 3)
// //     .attr("stroke", "red")
    