"use client";
import { useState } from 'react';

interface SwitchProps {
  status: boolean;
  deviceId: string;
  endpoint: string;
}

const Switch = ({ status, deviceId, endpoint }: SwitchProps) => {
  // State to keep track of the switch's on/off state
  const [isOn, setIsOn] = useState(status);

  // Toggle function to switch between true and false
  const toggleSwitch = async () => {
    // Determine the action text based on current status
    const action = isOn ? 'deactivate' : 'activate';
    const confirmationMessage = `Are you sure you want to ${action} ${deviceId}?`;

    // Show confirmation box to the user
    const userConfirmed = window.confirm(confirmationMessage);

    // If user clicks 'Yes', proceed with the toggle
    if (userConfirmed) {
      const newStatus = !isOn;
      setIsOn(newStatus);

      // Prepare the body of the POST request
      const requestBody = {
        selectedDev: deviceId,
        status: !newStatus,
      };

      // Send POST request to the external endpoint
      try {
        const endp = `https://appliapay.com/${endpoint}`;
        const response = await fetch(endp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to update device status');
        }

        const data = await response.json();
        console.log('Device status updated:', data);
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    } else {
      console.log('Device activation/deactivation cancelled');
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Switch Label */}
      <span className="mr-2 text-green-500">{isOn ? 'On' : 'Off'}</span>

      {/* Switch Button */}
      <button
        onClick={toggleSwitch}
        className={`w-14 h-8 rounded-full p-1 focus:outline-none transition-colors ${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default Switch;
