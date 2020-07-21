import Chart from "./chart";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import { compareBy } from "./format_data";
import { ATTSHOTDIST, TEAM, MADESHOTDIST, MISSEDSHOTDIST } from "./constants";
import $ from "jquery";

class NBAShotDistance extends Chart {
	constructor(selector, containerName, options, toolTipClassName) {
		super(selector, containerName, options);
		this.filtered = [];
		this.format = [];
		this.time = 0;
		this.area = d3
			.scaleLinear()
			.range([50 * Math.PI, 1000 * Math.PI])
			.domain([0, 400]);
		this.setLabels();
		this.loadData();
		this.setToolTip(toolTipClassName);
	}

	setLabels() {
		this.xLabel = this.chart
			.append("text")
			.attr("class", "x-axis-label")
			.attr("y", -40)
			.attr("x", this.width / 2)
			.text("Average Shot Attempt Distance (ft.)")
			.attr("font-size", "18px")
			.attr("font-weight", "bold")
			.attr("text-anchor", "middle");
		this.timeLabel = this.chart
			.append("text")
			.attr("class", "time-label")
			.attr("y", this.height / 10)
			.attr("x", 30);
		this.chart
			.append("ellipse")
			.attr("cx", 0)
			.attr("cy", this.height / 2)
			.attr("rx", 10)
			.attr("ry", 10)
			.attr("stroke-width", 2)
			.attr("stroke", "red")
			.attr("fill", "none");
		d3.select(".right-axis")
			.selectAll("text")
			.attr("font-size", "10px")
			.attr("x", "3");
	}

	setToolTip(toolTipClassName = "d3-tip") {
		this.tip = d3Tip()
			.attr("class", toolTipClassName)
			.html((d) => {
				let text = `<strong>Team:</strong> <span style='color:red'>  ${d[TEAM]}  </span><br>`;
				text += `<strong>Avg. Shot Att. Dist. (ft.):</strong> <span style='color:red'>  ${d[ATTSHOTDIST]} </span><br>`;
				text += `<strong>Avg. Shot Made. Dist. (ft.):</strong> <span style='color:red'>  ${d[MADESHOTDIST]} </span><br>`;
				text += `<strong>Avg. Shot Missed. Dist. (ft.):</strong> <span style='color:red'>  ${d[MISSEDSHOTDIST]} </span><br>`;
				return text;
			});
		this.chart.call(this.tip);
	}

	loadData() {
		d3.json("dist/data/team_shot_data.json").then((data) => {
			data.forEach((datum) => (datum.Season = +datum.Season.split("-")[1]));
			data.reverse();
			for (let i = 0; i < data.length; i++) {
				const datum = data[i];
				if (
					!this.format.length ||
					datum.Season !== this.format[this.format.length - 1].season
				) {
					this.format.push({
						season: datum.Season,
						teams: [datum],
					});
				} else {
					this.format[this.format.length - 1].teams.push(datum);
				}
			}
			this.filtered = this.format
				.map((seasonData) => {
					return seasonData.teams.filter((team) => {
						return Object.values(team).every(
							(value) => value[ATTSHOTDIST] !== null
						);
					});
				})
				.map((season) => season.sort(compareBy("team")));
			this.updateData(this.filtered[0]);
		});
	}

	updateData(data) {
		const teamColor = d3.scaleSequential(d3.interpolateCividis);
		const transition = d3.transition().duration(200).ease(d3.easeLinear);
		this.xAxis();
		this.yAxis(data);
		// this.yAxis();
		// this.xAxis();
		this.renderLines(data, transition);
		this.renderTeams(data, transition, teamColor);
		this.timeLabel.text(
			"Season: " + `${+(this.time + 1996)}` + " - " + (this.time + 1997)
		);
		$("#season")[0].innerHTML =
			+(this.time + 1996) + " - " + (this.time + 1997);
		$("#slider").slider("value", +(this.time + 1996));

		//render lines
	}

	renderLines(data, transition) {
		const joins = this.chart.selectAll("line").data(data, (d, i) => {
			return d;
		});
		joins
			.enter()
			.append("line")
			.attr("stroke", "#c6c6c6")
			.attr("stroke-width", 1.5)
			.attr("x1", (d) => this.xScale(d[ATTSHOTDIST]))
			.attr("y1", (d) => {
				return this.yScale(d[TEAM]) + this.yScale.bandwidth() / 2;
			})
			.attr("y2", this.height / 2)
			.attr("x2", 0)
			.merge(joins)
			.transition(transition)
			.attr("x1", (d) => this.xScale(d[ATTSHOTDIST]))
			.attr("y1", (d) => {
				return this.yScale(d[TEAM]) + this.yScale.bandwidth() / 2;
			})
			.attr("y2", this.height / 2)
			.attr("x2", 0)
			.style("position", "relative");
		joins.exit().remove();
	}

	renderTeams(data, transition, teamColor) {
		const teams = this.chart.selectAll("circle").data(data, function (d) {
			return d[TEAM];
		});
		teams
			.enter()
			.append("circle")
			.attr("id", (d, i) => d[TEAM])
			.attr("fill", (d, i) => teamColor(i / data.length))
			.on("mouseover", this.tip.show)
			.on("mouseout", this.tip.hide)
			.merge(teams)
			.transition(transition)
			.attr("cy", (d) => this.yScale(d[TEAM]) + this.yScale.bandwidth() / 2)
			.attr("cx", (d) => this.xScale(d[ATTSHOTDIST]))
			.attr("r", (d) => {
				// debugger
				return Math.sqrt(this.area(d[MADESHOTDIST]) / Math.PI);
			})
			.style("position", "relative");
		//EXIT
		teams.exit().transition(transition).remove();
	}

	xAxis() {
		this.xScale = d3.scaleLinear().range([0, this.width]).domain([0, 16]);
		let xAxisTopCall = d3.axisTop(this.xScale).tickSizeOuter(0);
		let xAxisBottomCall = d3.axisBottom(this.xScale).tickSizeOuter(0);
		this.topAxisGroup.call(xAxisTopCall);
		this.bottomAxisGroup.call(xAxisBottomCall);
	}

	yAxis(data) {
		this.yScale = d3
			.scaleBand()
			.range([0, this.height])
			.paddingInner(0.2)
			.paddingOuter(0.3)
			.domain(
				data.map((d) => {
					return d[TEAM];
				})
			);
		let leftAxisCall = d3.axisLeft(this.yScale).tickFormat("").tickSize(0);
		let rightAxisCall = d3.axisRight(this.yScale);
		this.rightAxisGroup.call(rightAxisCall);
		this.leftAxisGroup.call(leftAxisCall);
	}
}

export default NBAShotDistance;
