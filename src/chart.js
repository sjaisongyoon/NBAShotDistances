import { WIDTH, HEIGHT, MARGIN } from "./constants";
import * as d3 from "d3";

class Chart {
	constructor(selector, containerName, options) {
		this.width = window.innerWidth - 250;
		this.height = window.innerHeight - 250;
		this.xScale;
		this.yScale;
		this.setChart(selector, containerName, options);
		this.setAxes();
	}

	setWidthHeight(containerName) {
		this.width = window.innerWidth - 250;
		this.height = window.innerHeight - 200;
		d3.select(containerName)
			.style("width", this.width + margin.left + margin.right)
			.style("height", this.height + margin.top + margin.bottom);
	}

	setChart(selector, containerName, options = { topOffset: 0, leftOffset: 0 }) {
		const svg = d3
			.select(selector)
			.append("svg")
			.attr("class", containerName)
			.attr(
				"viewBox",
				`0 0 ${this.width + MARGIN.left + MARGIN.right} ${
					this.height + MARGIN.top + MARGIN.bottom
				}`
			)
			.style("width", this.width + MARGIN.left + MARGIN.right)
			.style("height", this.height + MARGIN.top + MARGIN.bottom);
		this.chart = svg
			.append("g")
			.attr(
				"transform",
				`translate(${MARGIN.left / 2 + options.leftOffset}, ${
					MARGIN.top + options.topOffset
				})`
			);
	}

	setAxes() {
		this.leftAxisGroup = this.chart.append("g").attr("class", "left-axis");
		this.rightAxisGroup = this.chart
			.append("g")
			.attr("class", "right-axis")
			.attr("transform", `translate(${this.width}, 0)`);
		this.bottomAxisGroup = this.chart
			.append("g")
			.attr("class", "bottom-axis")
			.attr("transform", `translate(0, ${this.height})`);
		this.topAxisGroup = this.chart.append("g").attr("class", "top-axis");
	}
}

export default Chart;
