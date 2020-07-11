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