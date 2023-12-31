import React, { useState } from "react";
import Chart from "react-apexcharts";
const ChartUpdate = () => {
  const [state, setState] = useState({
    optionsMixedChart: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          endingShape: "arrow",
        },
      },
      stroke: {
        width: [4, 0, 0],
      },
      xaxis: {
        categories: [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Jun",
          "Jul",
          "Aoû",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ],
      },
      markers: {
        size: 6,
        strokeWidth: 3,
        fillOpacity: 0,
        strokeOpacity: 0,
        hover: {
          size: 8,
        },
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: 100,
      },
    },
    seriesMixedChart: [
      {
        name: "series-1",
        type: "line",
        data: [30, 40, 25, 50, 49, 21, 70, 51],
      },
      {
        name: "series-2",
        type: "column",
        data: [23, 12, 54, 61, 32, 56, 81, 19],
      },
      {
        name: "series-3",
        type: "column",
        data: [62, 12, 45, 55, 76, 41, 23, 43],
      },
    ],
    optionsRadial: {
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "70%",
            background: "#fff",
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: "front",
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24,
            },
          },
          track: {
            background: "#fff",
            strokeWidth: "67%",
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35,
            },
          },

          dataLabels: {
            showOn: "always",
            name: {
              offsetY: -20,
              show: true,
              color: "#888",
              fontSize: "13px",
            },
            value: {
              formatter: function (val) {
                return val;
              },
              color: "#111",
              fontSize: "30px",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#ABE5A1"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Percent"],
    },
    seriesRadial: [76],
    optionsBar: {
      chart: {
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 0,
      },
      xaxis: {
        categories: ["Répartition"],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 1,
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.35,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [90, 0, 100],
        },
      },

      legend: {
        position: "bottom",
        horizontalAlign: "right",
      },
    },
    seriesBar: [
      {
        name: "bleu",
        data: [32],
      },
      {
        name: "vert",
        data: [41],
      },
      {
        name: "jaune",
        data: [12],
      },
      {
        name: "rouge",
        data: [65],
      },
    ],
  });

  const updateCharts = () => {
    const max = 90;
    const min = 30;
    const newMixedSeries = [];
    const newBarSeries = [];

    state.seriesMixedChart.forEach((s) => {
      const data = s.data.map(() => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      });
      newMixedSeries.push({ data: data, type: s.type });
    });

    state.seriesBar.forEach((s) => {
      const data = s.data.map(() => {
        return Math.floor(Math.random() * (180 - min + 1)) + min;
      });
      newBarSeries.push({ data, name: s.name });
    });

    setState({
      seriesMixedChart: newMixedSeries,
      seriesBar: newBarSeries,
      seriesRadial: [Math.floor(Math.random() * (90 - 50 + 1)) + 50],
    });
  };
  return (
    <div className="card col-12" style={{ display: "flex", }}>
      <div className="col-8">
        <Chart
          options={state.optionsMixedChart}
          series={state.seriesMixedChart}
          type="line"
          height={250}
          width="100%"
        />
        <Chart
          options={state.optionsBar}
          height={140}
          series={state.seriesBar}
          type="bar"
          width="100%"
        />
      </div>
      <div className="col-4">
        <Chart
          options={state.optionsRadial}
          series={state.seriesRadial}
          type="radialBar"
          width="100%"
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="card" onClick={updateCharts}>
            Actualiser!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartUpdate;
