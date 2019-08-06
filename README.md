# NBAShotDistances

## Background and Overview 
NBAShotDistances is a visualization of how the average distance of shots taken have increased over time. It shows the average shot distance of each team and within that the average shot distance of each player on the team.

Users will be able to look through the 96-97 season up to the 2018-2019 season.

## Demo

**Visualization Over Seasons**
<br>
![ScreenShot](https://i.imgur.com/wGd4Twj.gif)

**Tool Tips Showing Extra Details**
![ToolTips](https://i.imgur.com/8nF29N4.png)

## Implementation
In order to display the data properly, the raw data needed to be formatted into the correct structure. The raw data was made into a json file. A new POJO was then created with the desired structure by parsing the raw data in the original json file. 

```javascript
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

    update(filtered[0])

})
```


## Functionality & MVP
* Visualization of the data per team average
* Visualization of the data per player average
* Visualization of the data over multiple seasons 

## Architecture and Technologies
* D3 for data visualization
* Vanilla Javascript
* Data files formatted in .tsv

## Implementation Timeline
* Day 1 - collect required data and format data to how it will be used. Research on D3
* Day 2 - Implement barebones d3 visualization. Plot data for team averages.  
* Day 3 - Implement SVG and prepare a detailed visualization. Plot data for player averages. Be able to see data by season.
* Day 4 - Ensure workflow is implemented. 
