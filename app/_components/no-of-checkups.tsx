"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CountCheckUpByDate } from "@/controller/patient/checkup/action";
import toast from "react-hot-toast";
// import Chart from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function NoOfCheckUps() {
  const [seriesUpdate, setSeriesUpdate] = useState(false);
  const [dates, setDates] = useState<string[]>([
    "2025-01-30",
    "2025-01-31",
    "2025-02-01",
    "2025-02-02",
    "2025-02-03",
    "2025-02-04",
    "2025-02-05",
  ]);
  const [series, setSeries] = useState([
    {
      name: "Check-ups",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);
  function prevSevenDays() {
    let arr: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      arr.push(date.toISOString().split("T")[0]);
    }
    setDates(arr);
    setSeriesUpdate(true);

  }
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      type: "datetime",
      categories: dates,
    },
    dataLabels: { enabled: true },
    stroke: { curve: "smooth" }, // No error now
    fill: {
      colors: ["#7063d3"],
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.1 },
    },
    tooltip: { x: { format: "dd MMM yyyy" } },
  };

  async function FetchCheckUpsCount() {
    const result = await CountCheckUpByDate();
    if (result.status) {
      let arr: number[] = [];
      if (chartOptions.xaxis && result.data) {
        for (let i = 0; i < chartOptions.xaxis.categories.length; i++) {
          arr.push(0);
          for (let j = 0; j < result.data?.length; j++) {
            if (chartOptions.xaxis.categories[i] == result.data[j].date) {
              arr[i] = result.data[j].count;
            }
          }
        }
      }

      setSeries([{ name: series[0].name, data: arr }]);
      setSeriesUpdate(true);
    } else {
      toast.error(result.message);
    }
  }

  useEffect(() => {
    prevSevenDays();
    FetchCheckUpsCount();
    console.log("effect");
  }, [seriesUpdate]);
  return (
    <>
      <div className="mt-8 bg-customSecondary-20 rounded-md shadow-md p-4">
        <div>
          <h2 className="text-center text-sm text-slate-500 ">
            No of Checkups in previous 7 days
          </h2>
        </div>
        <Chart
          options={chartOptions}
          series={series}
          type="area"
          height={"300"}
        />
      </div>
    </>
  );
}
