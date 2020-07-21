// import './bubble_chart_nba';
// import './format_data';
import NbaShotDistance from "./nbaShotDistance";
import $ from "jquery";
import "jquery-ui/ui/widgets/slider";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/slider.css";

let chart;
let interval;

const step = () => {
	chart.time = chart.time < chart.format.length - 1 ? chart.time + 1 : 0;
	chart.updateData(chart.filtered[chart.time]);
};

document.addEventListener("DOMContentLoaded", () => {
	chart = new NbaShotDistance("#chart-area", "svg-container2");
	$("#play-button").on("click", function () {
		let button = $(this);
		if (button.text() === "Play") {
			button.text("Pause");
			interval = setInterval(step, 800);
		} else {
			button.text("Play");
			clearInterval(interval);
		}
	});
	$("#reset-button").on("click", () => {
		chart.time = 0;
		return chart.updateData(chart.filtered[0]);
	});
	$("#slider").slider({
		max: 2018,
		min: 1996,
		range: false,
		step: 1,
		value: chart.time + 1996,
		slide: (event, ui) => {
			console.log(ui, ui.value);
			step();
			// chart.time = ui.value - 1996;
			// chart.updateData(chart.filtered[chart.time]);
		},
	});
	// $("#slider").slider("value", +(chart.time + 1996));
});
