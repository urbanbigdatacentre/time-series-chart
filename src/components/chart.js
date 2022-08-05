// Component used to render the time-series visualisation.

import {useEffect} from "react";
import * as d3 from "d3";
import axios from "axios";
import {useState} from "react";
import styles from '../chart.module.css'


// Dummy Data Config
let dummyData = require('./data.json');

// Chart Component
const Chart = ({dateSelection}) => {

    const [data, setData] = useState({});

    useEffect(() => {

        // Select and Clear the Chart
        const svg = d3.select('#chart-svg')
        svg.selectAll("*").remove();

        // Draw the chart again
        drawChart();
    })

    const API_URL = "https://glasgow-cctv.ubdc.ac.uk/public_files"

    axios.get(API_URL)
        .then(function(res) {
            setData(res)
        })

    const drawChart = () => {

        const rolledData = d3.flatRollup(dummyData, v => d3.mean(v, d => d.value), d => d3.timeDay(new Date(d.timestamp)))

        const unrolledData = []

        rolledData.forEach(function(item) {
            unrolledData.push(
                {
                    "timestamp": item[0],
                    "value": item[1]
                }
            )
        })

        const filteredData = unrolledData.filter(d => ((d.timestamp <= new Date()) && (d.timestamp >= new Date(d3.timeFormat("%B %d, %Y")(dateSelection)))))

        // Get viewport dimensions
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        // Set Margins
        const chartMargin = {
            left: vw > 900 ? `85` : vw > 600 ? `50` : `35`,
            right: vw > 600 ? `85` : `20`,
            top: vw > 900 ? `75` : vw > 600 ? `50` : `35`,
            bottom: vw > 900 ? `75` : vw > 600 ? `50` : `35`,
        }

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

        // ============
        // AXIS & GRIDLINES
        // ============

        // X Axis - Needs refactoring **
        const xScale = d3.scaleTime()
            .domain([new Date(d3.timeFormat("%B %d, %Y")(dateSelection)), new Date()])
            .range([chartMargin.left, width])
            .nice()

        // Y Axis
        const yScale = d3.scaleLinear()
            .domain([0, 600])
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
            .call(d3.axisLeft(yScale).ticks(vw > 900 ? 8 : 10).tickPadding(vw > 600 ? 15 : 6));

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
                .ticks(vw > 900 ? 8 : 10)
                .tickSize(-(width - (chartMargin.left - 10)))
                .tickFormat("")
            )

        // ============
        // DRAWING & ANIMATING OUR LINE
        // ============

        // Add the line
        svg.append("path")
            .datum(filteredData)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "#FF729F")
            .attr("stroke-width", vw > 900 ? `3` : vw > 600 ? `2` : `1.5`)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.timestamp)})
                .y(function(d) { return height })
            )

        // Animate the line to position it
        d3.selectAll(".line-path")
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) {return xScale(d.timestamp)})
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