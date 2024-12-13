"use client";
import { useEffect, useState } from 'react';
import Switch from '../components/Switch';
import DataCard from '../components/DataCard';
import { GiPressureCooker } from "react-icons/gi";
import { FaPowerOff, FaRegCheckCircle } from "react-icons/fa";
import Link from 'next/link'; // Import Link from next/link
import {GiMagnifyingGlass} from "react-icons/gi";

// Define the type for a device
interface Device {
  deviceID: string;
  time: string;
  active: boolean;
}

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]); // Declare the state with the correct type
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://appliapay.com/command');  // Replace with your endpoint
        const data = await response.json();

        // Sort devices based on the deviceID
        const sortedDevices = data.sort((a: Device, b: Device) => {
          const getDeviceNumber = (deviceID: string): number => {
            if (deviceID.startsWith('device')) {
              return parseInt(deviceID.slice(6)); // Extract number after 'device'
            } else if (deviceID.startsWith('JD-29ED')) {
              return parseInt(deviceID.slice(7)); // Extract number after 'JD-29ED'
            } else if (deviceID.startsWith('OfficeFridge')) {
              return 9999999999999; // Arbitrary high number to keep this device at the end
            } else {
              return parseInt(deviceID); // For other numeric-based device IDs
            }
          };

          return getDeviceNumber(a.deviceID) - getDeviceNumber(b.deviceID);
        });

        setDevices(sortedDevices);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();
  }, []);

   // Calculate active and inactive device counts
   const activeDevicesCount = devices.filter(device => device.active).length;
   const inactiveDevicesCount = devices.filter(device => !device.active).length;
   const deviceIDs = devices.map(device => device.deviceID);
   sessionStorage.setItem('deviceIDs', JSON.stringify(deviceIDs));

  return (
    <>
      <div className='bg-base-300 mb-4 items-center place-content-between justify-center p-4 flex gap-4 rounded-lg' style={{height: '15vh'}}>
        <DataCard title='Total Devices' icon={<GiPressureCooker />} unit='devices' value={devices.length.toString()} />
        <DataCard title='Active Devices' icon={<FaRegCheckCircle />} unit='devices' value={activeDevicesCount.toString()} />
        <DataCard title='Inactive Devices' icon={<FaPowerOff />} unit='devices' value={inactiveDevicesCount.toString()} />
      </div>
      <div className='bg-base-300 p-4 text-center text-green-500 overflow-x-auto rounded-lg' style={{ height: '70vh' }}>
        <h2 className='mb-2 text-2xl font-bold text-orange-500'>Devices</h2>
        <table className="table table-xs table-pin-rows table-pin-cols text-center text-green-500 table-auto w-full border-collapse border border-green-500">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Device ID</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Active</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Last Status Change</th>
              <th className="border px-4 py-2 text-base border-green-500 text-green-500">Control</th>
              <th className='border px-4 py-2 text-base border-green-500 text-green-500'>Device Data</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.deviceID}>
                <td className="border px-4 py-2 border-green-500">{device.deviceID}</td>
                <td className="border px-4 py-2 border-green-500 text-center">
                  <span
                    className={`px-2 py-1 rounded ${
                      device.active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {device.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="border px-4 py-2 border-green-500">{new Date(device.time).toLocaleString()}</td>
                <td className="border px-4 py-2 border-green-500 justify-items-center">
                  <Switch
                    status={device.active}
                    deviceId={device.deviceID}
                    endpoint="changeStatus"
                  />
                </td>
                <td className="border px-4 py-2 border-green-500 justify-items-center">
                <div className='inline-flex bg-green-500 hover:bg-green-800 text-white px-2 py-1 rounded-lg gap-2 place-content-center justify-center h-full'>
                <Link
                    href={`/device/${device.deviceID}`}
                    
                  >
                    View Details 
                  </Link>
                  <GiMagnifyingGlass />
                </div>
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Devices;
