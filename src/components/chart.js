// Component used to render time-series visualisation
import * as d3 from 'd3';
import {useEffect} from "react";
import axios from "axios";
import {useState} from "react";
import {usePromiseTracker, trackPromise} from "react-promise-tracker";
import styles from '../chart.module.css'

const Chart = ({dateSelection}) => {

    const [data, setData] = useState({});

    // Create a promise tracker to track API request.
    const { promiseInProgress } = usePromiseTracker({area: "api-request"});

    // Set up useEffect hook in the body of the Chart component
    // #1 First useEffect hook redraws the chart when the promise has been resolved and the data is populated.
    useEffect(() => {

        if ((promiseInProgress === false) && (data?.records?.length)) {

            // Select and Clear the Chart
            const svg = d3.select('#chart-svg')
            svg.selectAll("*").remove();

            // Draw the chart again
            drawChart();
        }

    }, [data?.records?.length, promiseInProgress])

    const API_URL = "http://localhost:8000/api/historic_records/?"

    // Declare API Params
    const API_PARAMS = {
        "aggregation": "day",
        "date_after": d3.timeFormat("%d-%m-%Y")(dateSelection),
        "date_before": d3.timeFormat("%d-%m-%Y")(new Date())
    }

    // #2 Second useEffect hook used to make the request on every new date selection.
    useEffect(() => {

        // Make the request inside a promise tracker called 'api-request'
        trackPromise(
            axios.get(API_URL, {params: API_PARAMS} )
                .then(function(res) {
                    setData(res.data)
                    console.log(res.data)
                })
            , "api-request")

    }, [dateSelection])

    const drawChart = () => {

        // Get viewport dimensions
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

        // Set Margins
        const chartMargin = {
            left: vw > 900 ? `85` : vw > 600 ? `60` : `50`,
            right: vw > 600 ? `85` : `20`,
            top: vw > 900 ? `75` : vw > 600 ? `60` : `35`,
            bottom: vw > 900 ? `75` : vw > 600 ? `60` : `35`,
        };

        // Set dynamic height & width according to container
        const height = document.querySelector('#chart-svg').getBoundingClientRect().height - chartMargin.bottom;
        const width = document.querySelector('#chart-svg').getBoundingClientRect().width - chartMargin.right;

        // Declare SVG
        const svg = d3.select('#chart-svg')

        // Add Background Color to Chart
        svg.append("rect")
            .attr("width", width - chartMargin.left)
            .attr("height", height - chartMargin.bottom)
            .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")")
            .attr("fill", "rgba(229, 229, 229, 0.2)");

        let maxValue = data?.records?.length ? Math.max(...data.records.map(d => d.value)) : 1000;

        // X Axis
        const xScale = d3.scaleTime()
            .domain([new Date(d3.timeFormat("%B %d, %Y")(dateSelection)), new Date()])
            .range([chartMargin.left, width])
            .nice()

        // Y Axis
        const yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, chartMargin.bottom])
            .nice()

        // Draw X Axis
        svg.append("g")
            .attr("class", styles.chartAxis)
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(vw > 900 ? 8 : 4).tickPadding(vw > 600 ? 15 : 8));

        // Draw Y Axis
        svg.append("g")
            .attr("class", styles.chartAxis)
            .attr("transform", "translate(" + chartMargin.left + ",0)")
            .call(d3.axisLeft(yScale).ticks(vw > 900 ? 8 : 4).tickPadding(vw > 600 ? 15 : 6));

        // Add X Gridlines
        svg.append("g")
            .attr("class", styles.chartGrid)
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(xScale)
                .ticks(vw > 900 ? 8 : 4)
                .tickSize(-(height - (chartMargin.bottom - 10)))
                .tickFormat("")
            )

        // Add Y Gridlines
        svg.append("g")
            .attr("class", styles.chartGrid)
            .attr("transform", "translate(" + (chartMargin.left - 10) + ",0)")
            .call(d3.axisLeft(yScale)
                .ticks(vw > 900 ? 8 : 4)
                .tickSize(-(width - (chartMargin.left - 10)))
                .tickFormat("")
            )

        // DRAWING THE CHART 👇 📈

        // Add the line
        svg.append("path")
            .datum(data?.records)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "#FF729F")
            .attr("stroke-width", vw > 900 ? `2` : vw > 600 ? `1.5` : `1`)
            .attr("d", d3.line()
                .x(function(d) { return xScale(new Date(d.timestamp))})
                .y(function(d) { return height })
            )

        // Animate the line to position it
        d3.selectAll(".line-path")
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return xScale(new Date(d.timestamp))})
                .y(function(d) { return yScale(d.value) })
            )

    }

    return (
        <svg
            id={'chart-svg'}
            style={{
                height: `100%`,
                width: `100%`,
            }}
        >
        </svg>
    )
}

export default Chart;