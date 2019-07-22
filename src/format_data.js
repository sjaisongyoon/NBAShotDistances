import * as d3 from "d3";
import {team, attShotDist, madeShotDist} from './bubble_chart_nba';

export const compareBy = (category) => {
    switch (category) {
        case "team":
            return (a,b) => {
                if (a[team] < b[team]) return -1;
                if (a[team] > b[team]) return 1;
                return 0;
            }
        case "attShotDist":
            return (a, b) => {
                if (a[attShotDist] < b[attShotDist]) return -1;
                if (a[attShotDist] > b[attShotDist]) return 1;
                return 0;
            }

        case "madeShotDist":
            return (a, b) => {
                if (a[madeShotDist] < b[madeShotDist]) return -1;
                if (a[madeShotDist] > b[madeShotDist]) return 1;
                return 0;
            }

        default:
            break;
    }
}

// d3.json("../src/data/team_shot_data.json"). then( data => console.log(data))
d3.json("../src/data/team_shot_data.json").then(function (data) {

    data.forEach( datum => datum.Season = +datum.Season.split("-")[1])
    let format = [];
    for (let i = 0; i < data.length; i++) {
        const datum = data[i];
        if (!format.length || datum.Season !== format[format.length - 1].season){
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
        } else{
            byTeam.forEach(obj => {
                if (obj.team === datum["Team"]){
                    obj.seasonStat.push(datum)
                }
            })

        }

    }

    let filtered = format.map( seasonData => {
        return seasonData.teams.filter( team =>{
            return Object.values(team).every(value => value !== null)
        }).map(team => {
            return team
        })
    })
    // debugger;
    console.log(data)
    console.log(byTeam)
    // console.log(format)
    // console.log(filtered[22])
})



// const sort = (a, b, category) => {
//     switch (category) {
//         case 'alphabetical':
//             compare()
//             break;
    
//         default:
//             break;
//     }
// }