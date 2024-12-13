"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Switch from '../../components/Switch';
import Dropdown from '../../components/Dropdown';
import DataCard from '@/app/components/DataCard';
import { SlEnergy } from "react-icons/sl";
import { GrMoney } from "react-icons/gr";
import { RxLapTimer } from "react-icons/rx";
import { GiHotMeal, GiSmokingVolcano } from "react-icons/gi";
import categorizeKwh from '@/categorize_kwh';
import DoughnutChart from "@/app/components/DoughnutChart";

interface DeviceData {
  runtime: number;
  sumKwh: number;
  deviceMealCounts: { [key: string]: { count: number; last_txtime: string } };
  totalMealsPerDay: { [date: string]: number };
  status: boolean;
  avgCookingTime: number;
  mealDurations: number[];
  mealsWithDurations: { startTime: string; endTime: string; mealDuration: number; totalKwh: number; deviceID: string }[];
  rawData: Array<{
    time: string;
    deviceID: string;
    kwh: number;
    lat: number;
    long: number;
    status: string;
    txtime: number;
  }>;
}

const DeviceDetails = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [status, setStatus] = useState(false);
  const [selectedRange, setSelectedRange] = useState("9999999");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceIDList, setDeviceIDList] = useState<string[]>([]);
  const [kwhArr, setKwhArr] = useState<number[]>([0, 0, 0]);
  const [costArr, setCostArr] = useState<number[]>([0, 0, 0]);
  const [emissionsArr, setEmissionsArr] = useState<number[]>([0, 0, 0]);
  const labels = ['Breakfast', 'Lunch', 'Supper'];

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

  const deviceID = pathname?.split('/')[2];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDeviceIDs = sessionStorage.getItem('deviceIDs');
      if (storedDeviceIDs) {
        setDeviceIDList(JSON.parse(storedDeviceIDs));
      }

      const storedDevice = sessionStorage.getItem('selectedDevice');
      if (storedDevice) {
        setSelectedDevice(storedDevice);
      } else if (deviceID) {
        setSelectedDevice(deviceID);
        sessionStorage.setItem('selectedDevice', deviceID); // Set initial device if it exists in URL
      }
    }
  }, [deviceID]);

  useEffect(() => {
    if (!selectedDevice || !selectedRange) return;

    const fetchData = async () => {
      const response = await fetch(`https://appliapay.com/deviceDataDjangoo?device=${selectedDevice}&range=${selectedRange}`);
      const data = await response.json();
      setDeviceData(data);
      setStatus(data.status);
      if (data.rawData) {
        const { morningKwh, afternoonKwh, nightKwh } = categorizeKwh(data.rawData);
        setKwhArr([morningKwh, afternoonKwh, nightKwh]);
        setCostArr([parseFloat((morningKwh * 23.0).toFixed(1)), parseFloat((afternoonKwh * 23.0).toFixed(1)), parseFloat((nightKwh * 23.0).toFixed(1))]);
        setEmissionsArr([morningKwh * 0.4999 * 0.28, afternoonKwh * 0.4999 * 0.28, nightKwh * 0.4999 * 0.28]);
      }
    };

    fetchData();
  }, [selectedDevice, selectedRange]);

  const transformedMeals = deviceData?.mealsWithDurations.map((meal) => ({
    ...meal,
    duration: (meal.mealDuration / 60).toFixed(2),
    deviceID: selectedDevice as string,
  })) || [];

  const handleTimeRangeSelect = (selectedItem: string) => {
    const timeRange = timeRangeMapping[selectedItem];
    setSelectedRange(timeRange);
  };

  const handleDeviceSelect = (selected: string) => {
    setSelectedDevice(selected);
    sessionStorage.setItem('selectedDevice', selected); // Store selected device in sessionStorage
    router.push(`/device/${selected}`);
  };

  if (!deviceData) {
    return <p>Loading...</p>;
  }

  const totalKwh = deviceData.mealsWithDurations.reduce((sum, meal) => sum + meal.totalKwh, 0) || 0;
  const totalDuration = deviceData.mealsWithDurations.reduce((sum, meal) => sum + meal.mealDuration, 0) || 0;
  const mealCount = deviceData.mealsWithDurations.length || 0;

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <label className='text-orange-500 text-sm mr-1'>Change Device:</label>
          <Dropdown items={deviceIDList} onSelect={handleDeviceSelect} />
        </div>
        <div>
          <label className='text-orange-500 text-sm mr-1'>Change Time Range:</label>
          <Dropdown items={Object.keys(timeRangeMapping)} onSelect={handleTimeRangeSelect} />
        </div>
        <div className='inline-flex'>
          <label className='text-orange-500 text-sm mr-2 mt-2'>Status: </label>
          <Switch
            status={status}
            deviceId={selectedDevice as string}
            endpoint="changeStatus"
          />
        </div>
      </div>
      <div className='bg-base-300 mb-4 items-center place-content-between justify-center p-4 flex gap-4 rounded-lg' style={{ height: '15vh' }}>
        <DataCard title='Total Energy' icon={<SlEnergy />} unit='kWh' value={totalKwh.toFixed(2)} />
        <DataCard title='Cooking Time' icon={<RxLapTimer />} unit='hours' value={(totalDuration/3600).toFixed(1)} />
        <DataCard title='Total Meals' icon={<GiHotMeal />} unit='meals' value={mealCount.toString()} />
        <DataCard title='Energy Cost' icon={<GrMoney />} unit='KSH' value={(totalKwh * 23.0).toFixed(1)} />
        <DataCard title='CO₂ Released' icon={<GiSmokingVolcano />} unit='kg CO₂' value={(totalKwh * 0.4999 * 0.28).toFixed(2)} />
      </div>
      <div className='flex gap-2'>
      <div className="bg-base-300 p-4 rounded-lg text-center text-green-500 overflow-x-auto w-8/12" style={{ height: '62vh' }}>
      <h2 className='text-orange-500 font-bold text-xl text-center mb-2'>Cooking Events</h2>
      <table className="table table-xs table-pin-rows table-pin-cols text-center text-green-500 table-auto w-full border-collapse border border-green-500">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Cooking Start</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Cooking Duration</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Cooking Stop</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Energy Use</th>
              <th className='border px-4 py-2 text-base border-green-500 text-green-500'>Energy Cost</th>
              <th className='border px-4 py-2 text-base border-green-500 text-green-500'>CO₂ Released</th>
            </tr>
          </thead>
          <tbody>
  {[...deviceData.mealsWithDurations].reverse().map((meal, index) => {
    const startDate = new Date(meal.startTime);
    const endDate = new Date(meal.endTime);

    // Convert UTC date to local time format without timezone offset
    const formattedStart = startDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    const formattedEnd = endDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    return (
      <tr key={index}>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{formattedStart}</td>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{(meal.mealDuration / 60).toFixed(0)} minutes</td>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{formattedEnd}</td>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{meal.totalKwh.toFixed(3)} kWh</td>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{(meal.totalKwh * 23.0).toFixed(1)} KSH</td>
        <td className="border px-4 py-2 text-sm text-green-500 border-green-500">{(meal.totalKwh * 0.4999 * 0.28).toFixed(3)} kg CO₂</td>
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
      <div className="carousel w-4/12 rounded-lg bg-base-300 p-2">
    {/* Slide 1 */}
    <div id="slide1" className="carousel-item w-full block p-2 gap-4">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Energy Use per Meal</h2>
      <div className="flex items-center justify-between mt-4">
      <a href="#slide3" className="btn btn-circle text-white bg-green-500">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={kwhArr}
            labels={labels}
            title="Energy Consumption by Meal"
            units="kwh"
          />
        </div>
        <a href="#slide2" className="btn btn-circle bg-green-500 text-white">❯</a>
      </div>
      <label className="text-orange-500">Slide 1 of 3</label>
    </div>
    
    {/* Slide 2 */}
    <div id="slide2" className="carousel-item w-full block p-2">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Energy Cost per Meal</h2>
      <div className="flex items-center justify-between">
        <a href="#slide1" className="btn btn-circle text-white bg-green-500">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={costArr}
            labels={labels}
            title="Energy Cost Per Meal"
            units="KSH"
          />
        </div>
        <a href="#slide3" className="btn btn-circle text-white bg-green-500">❯</a>
      </div>
      <label className="text-orange-500">Slide 2 of 3</label>
    </div>

    {/* Slide 3 */}
    <div id="slide3" className="carousel-item w-full block p-2">
      <h2 className="text-center mb-4 text-xl font-semibold text-orange-500">Emissions per Meal</h2>
      <div className="flex items-center justify-between">
      <a href="#slide2" className="btn btn-circle text-white bg-green-500">❮</a>
        <div className="flex-1" style={{'height': '25vh'}}>
          <DoughnutChart
            data={emissionsArr}
            labels={labels}
            title="Emissions per Meal"
            units="kg CO₂"
          />
        </div>
        <a href="#slide1" className="btn btn-circle text-white bg-green-500">❯</a>
      </div>
      <label className="text-orange-500">Slide 3 of 3</label>
    </div>

  </div>
      </div>
      

    </div>
  );
};

export default DeviceDetails;
