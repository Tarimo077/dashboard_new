"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import DataCard from "./components/DataCard";
import { SlEnergy } from "react-icons/sl";
import { GrMoney } from "react-icons/gr";
import { RxLapTimer } from "react-icons/rx";
import { GiHotMeal, GiSmokingVolcano, GiPressureCooker } from "react-icons/gi";
import Dropdown from "./components/Dropdown";
import classifyAndCountMeals from "@/mealCounter";
import MealDurationChart from "./components/MealDurationChart";
import DoughnutChart from "./components/DoughnutChart";

interface ApiData {
  totalkwh: number;
  runtime: Record<string, number>;
  deviceMealCounts: Record<string, { count: number; last_txtime: string }>;
  mealsWithDurations: Array<{
    deviceID: string;
    startTime: string;
    endTime: string;
    duration: string;
    totalKwh: number;
  }>;
  rawData: Array<{
    time: string;
    deviceID: string;
    kwh: number;
    lat: number;
    long: number;
    status: string;
    txtime: string;
  }>;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ApiData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("9999999"); // Default to "All Time"
  const [mealStats, setMealStats] = useState<{ mealCount: number; totalCookingTime: number; devs: number }>({
    mealCount: 0,
    totalCookingTime: 0,
    devs: 0
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      signIn();
    } else {
      fetchData(selectedTimeRange); // Fetch data based on the selected time range
    }
  }, [session, status, selectedTimeRange]); // Add selectedTimeRange to dependencies

  if (status === "loading") {
    return <div>Loading... <span className="loading loading-spinner text-success"></span></div>;
  }

  const timeRangeMapping: Record<string, string> = {
    "All Time": "9999999",
    "5 mins": "5",
    "30 mins": "30",
    "1 hr": "60",
    "3 hrs": "180",
    "12 hrs": "720",
    "24 hrs": "1440",
    "3 days": "4320",
    "7 days": "10080",
    "2 weeks": "20160",
    "1 month": "43200",
    "3 months": "129600",
    "6 months": "259200",
    "1 year": "525600",
    "3 years": "1576800",
  };

  const fetchData = async (timeRange: string) => {
    try {
      const response = await fetch(`https://appliapay.com/allDeviceDataDjango?range=${encodeURIComponent(timeRange)}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const fetchedData = await response.json();

      // Ensure txtime is of type string by mapping over rawData
      const processedData: ApiData = {
        ...fetchedData,
        rawData: fetchedData.rawData.map((entry: any) => ({
          ...entry,
          txtime: String(entry.txtime), // Convert txtime to string
        }))
      };

      // Classify and count meals after processing data
      const mealCounts = classifyAndCountMeals(processedData.rawData);
      
      // Calculate total cooking time from mealsWithDurations instead of runtime
      const totalCookingTime = processedData.mealsWithDurations.reduce((total, meal) => {
        const duration = parseFloat(meal.duration)/60; // Convert duration to a number
        return total + (isNaN(duration) ? 0 : duration); // Add to total if it's a valid number
      }, 0);
      const devs = Object.keys(processedData.deviceMealCounts).length;
      setMealStats({
        mealCount: Object.values(mealCounts.deviceMealCounts).reduce((total, device) => total + device.count, 0),
        totalCookingTime: totalCookingTime, // Use the total cooking time calculated from runtime
        devs: devs
      });

      // Aggregate the meals before setting the state
      const aggregatedMeals = aggregateMealData(processedData.mealsWithDurations);
        // Extract deviceIDs and totalKwh for DoughnutChart
      const deviceIDs = aggregatedMeals.map((meal) => meal.deviceID) || [];
      const totalKwhData = aggregatedMeals.map((meal) => meal.totalKwh) || [];
      setData({
        ...processedData,
        mealsWithDurations: aggregatedMeals, // Update the mealsWithDurations with aggregated data
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const aggregateMealData = (meals: Array<{ deviceID: string; startTime: string; endTime: string; duration: string; totalKwh: number; }>) => {
    const aggregated: Record<string, { duration: number; totalKwh: number; startTime: string; endTime: string }> = {};
  
    meals.forEach(meal => {
      const deviceID = meal.deviceID;
      const duration = parseFloat(meal.duration); // Convert duration to a number
  
      if (!aggregated[deviceID]) {
        // Initialize with the first meal's startTime and endTime
        aggregated[deviceID] = {
          duration: 0,
          totalKwh: 0,
          startTime: meal.startTime,
          endTime: meal.endTime
        };
      }
  
      aggregated[deviceID].duration += duration; // Sum durations
      aggregated[deviceID].totalKwh += meal.totalKwh; // Sum kWh
  
      // Update startTime and endTime
      if (new Date(meal.startTime) < new Date(aggregated[deviceID].startTime)) {
        aggregated[deviceID].startTime = meal.startTime; // Set to the earliest startTime
      }
      if (new Date(meal.endTime) > new Date(aggregated[deviceID].endTime)) {
        aggregated[deviceID].endTime = meal.endTime; // Set to the latest endTime
      }
    });

    
  
    // Transform the aggregated object back into an array
    return Object.entries(aggregated).map(([deviceID, { duration, totalKwh, startTime, endTime }]) => ({
      deviceID,
      startTime,
      endTime,
      duration: duration.toString(), // Convert back to string if necessary
      totalKwh,
    }));
  };
  

  const handleSelect = (selectedItem: string) => {
    const timeRange = timeRangeMapping[selectedItem];
    setSelectedTimeRange(timeRange); // Update the selected time range
    fetchData(timeRange); // Fetch data for the new time range
  };

  return (
    <main className="block">
      <div>
      <label className="text-sm text-orange-500">Change Time Range: </label>
      <Dropdown
        items={Object.keys(timeRangeMapping)}
        onSelect={handleSelect} // Use handleSelect for mapping and fetching
      />
      </div>
      <div role="tablist" className="tabs tabs-lifted z-0">
        <input type="radio" name="my_tabs_2" role="tab" className="tab text-orange-500 tab-border-3" aria-label="Energy Summary" defaultChecked />
        <div role="tabpanel" className="tab-content bg-base-200 rounded-box p-6">
          <h2 className="mb-4 mt-0 text-lg text-orange-500 font-bold">Energy Summary</h2>
          <div className="flex gap-4">
            <DataCard title="Energy Use" unit="kWh" value={`${data?.totalkwh.toFixed(2) || "N/A"}`} icon={<SlEnergy />} />
            <DataCard title="Energy Cost" unit="KSH" value={`${data ? (data.totalkwh * 23.0).toFixed(1) : "N/A"}`} icon={<GrMoney />} />
          </div>
          <div className="collapse bg-base-100 mt-4 w-full border-double border-4 border-green-700 group rounded-lg shadow-2xl">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium text-center text-orange-500 group-hover:animate-bounce">Click me to see more</div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
        </div>

        <input type="radio" name="my_tabs_2" role="tab" className="tab text-orange-500 tab-border-3" aria-label="Cooking Summary" />
        <div role="tabpanel" className="tab-content bg-base-200 rounded-box p-6">
          <h2 className="mb-4 mt-0 text-lg text-orange-500 font-bold">Cooking Summary</h2>
          <div className="flex gap-4 mr-8">
            <DataCard title="Cooking Time" unit="Hours" value={`${(mealStats.totalCookingTime).toFixed(1) || "N/A"}`} icon={<RxLapTimer />} />
            <DataCard title="Meals Prepared" unit="Meals" value={`${mealStats.mealCount || "N/A"}`} icon={<GiHotMeal />} />
          </div>
        </div>

        <input type="radio" name="my_tabs_2" role="tab" className="tab text-orange-500 tab-border-3" aria-label="Emissions Summary" />
        <div role="tabpanel" className="tab-content bg-base-200 rounded-box p-6">
          <h2 className="mb-4 mt-0 text-lg text-orange-500 font-bold">Emissions Summary</h2>
          <div className="flex gap-4 mr-8">
            <DataCard title="CO₂ Released" unit="kg CO₂" value={`${data ? (data.totalkwh * 0.4999 * 0.28).toFixed(2) : "N/A"}`} icon={<GiSmokingVolcano />} />
            <DataCard title="Active Devices" unit="devices" value={`${mealStats.devs}` || "N/A"} icon={<GiPressureCooker />} />
          </div>
        </div>
      </div>
      <div className="inline-flex w-full mt-4 gap-2 h-1/4">
      <MealDurationChart mealsWithDurations={data?.mealsWithDurations || []} />
      <div className="bg-base-200 rounded-lg w-4/12 p-4">
  <div className="carousel w-full">
    
    {/* Slide 1 */}
    <div id="slide1" className="carousel-item w-full block">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Cooking Durations</h2>
      <div className="flex items-center justify-between">
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={data?.mealsWithDurations.map((meal) => parseFloat(meal.duration)) || []}
            labels={data?.mealsWithDurations.map((meal) => meal.deviceID) || []}
            title="Energy Consumption by Device"
            units="minutes"
          />
        </div>
        <a href="#slide2" className="btn btn-circle bg-green-500 text-white">❯</a>
      </div>
      <label className="text-orange-500">Slide 1 of 4</label>
    </div>
    
    {/* Slide 2 */}
    <div id="slide2" className="carousel-item w-full block">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Energy Distribution</h2>
      <div className="flex items-center justify-between">
        <a href="#slide1" className="btn btn-circle text-white bg-green-500 mr-4">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={data?.mealsWithDurations.map((meal) => meal.totalKwh) || []}
            labels={data?.mealsWithDurations.map((meal) => meal.deviceID) || []}
            title="Energy Consumption by Device"
            units="kwh"
          />
        </div>
        <a href="#slide3" className="btn btn-circle text-white bg-green-500">❯</a>
      </div>
      <label className="text-orange-500">Slide 2 of 4</label>
    </div>

    {/* Slide 3 */}
    <div id="slide3" className="carousel-item w-full block">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Cost Distribution</h2>
      <div className="flex items-center justify-between">
      <a href="#slide2" className="btn btn-circle text-white bg-green-500">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={data?.mealsWithDurations.map((meal) => (meal.totalKwh*23.0)) || []}
            labels={data?.mealsWithDurations.map((meal) => meal.deviceID) || []}
            title="Energy Consumption by Device"
            units="KSH"
          />
        </div>
        <a href="#slide4" className="btn btn-circle text-white bg-green-500">❯</a>
      </div>
      <label className="text-orange-500">Slide 3 of 4</label>
    </div>

    {/* Slide 4 */}
    <div id="slide4" className="carousel-item w-full block">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Emission Distribution</h2>
      <div className="flex items-center justify-between">
      <a href="#slide3" className="btn btn-circle text-white bg-green-500">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={data?.mealsWithDurations.map((meal) => (meal.totalKwh*0.4999*0.28)) || []}
            labels={data?.mealsWithDurations.map((meal) => meal.deviceID) || []}
            title="Energy Consumption by Device"
            units="kg CO₂"
          />
        </div>
      </div>
      <label className="text-orange-500">Slide 4 of 4</label>
    </div>

  </div>
</div>



      </div>
    </main>
  );
}
