import {
    WIDTH,
    HEIGHT,
    MARGIN
} from './constants'
import * as d3 from "d3";

class Chart {
    constructor(selector, options){
        console.log(MARGIN)
        this.setChart(selector, options)
        this.setLabels()
        this.xAxis()
        this.yAxis()
    }

    setChart(selector, containerName, options = { topOffset: 0, leftOffset: 0}){
        const svg = d3
          .select(selector)
          .append("svg")
          .attr("class", containerName)
          .attr(
            "viewBox",
            `0 0 ${WIDTH + MARGIN.left + MARGIN.right} ${
            HEIGHT + MARGIN.top + MARGIN.bottom}`
          )
          .style("width", WIDTH + MARGIN.left + MARGIN.right)
          .style("height", HEIGHT + MARGIN.top + MARGIN.bottom);
        this.chart = svg
          .append("g").attr(
            "transform",`translate(${MARGIN.left / 2 + options.leftOffset}, ${MARGIN.top + options.topOffset})`
          );
    }

    xAxis(){
        this.xScale = d3.scaleLinear().range([0, WIDTH])
        let xAxisTopCall = d3.axisTop(this.xScale).tickSizeOuter(0)
        let xAxisBottomCall = d3.axisBottom(this.xScale).tickSizeOuter(0)
        this.chart
          .append("g")
          .attr("class", "top-axis")
          .call(xAxisTopCall);
        this.chart
          .append("g")
          .attr("class", "bottom-axis")
          .attr("transform", `translate(0, ${HEIGHT})`)
          .call(xAxisBottomCall);
    }

    yAxis(){
        this.yScale = d3
          .scaleBand()
          .range([0, HEIGHT])
          .paddingInner(0.2)
          .paddingOuter(0.3);
        let leftAxisCall = d3.axisLeft(this.yScale)
          .tickFormat("")
          .tickSize(0);
        let rightAxisCall = d3.axisRight(this.yScale)
        this.chart
          .append("g")
          .attr("class", "right-axis")
          .attr("transform", `translate(${WIDTH}, 0)`)
          .call(rightAxisCall);
        this.chart
          .append("g")
          .attr("class", "left-axis")
          .call(leftAxisCall)            
    }

    setLabels(){
        this.xLabel = this.chart
          .append("text")
          .attr("class", "x-axis-label")
          .attr("y", -40)
          .attr("x", WIDTH / 2)
          .text("Average Shot Attempt Distance (ft.)")
          .attr("font-size", "18px")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle");
    }    

    setData(data){
        this.data = data;
    }
}


export default Chart