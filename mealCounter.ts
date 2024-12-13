interface DataEntry {
    deviceID: string;
    txtime: string;
  }
  
  interface DeviceMealCount {
    count: number;
    lastTxtime: Date | null;
  }
  
  interface DayMealCounts {
    [deviceID: string]: number;
  }
  
  interface MealCounts {
    deviceMealCounts: Record<string, DeviceMealCount>;
    totalMealsPerDay: Record<string, number>;
  }
  
  function classifyAndCountMeals(data: DataEntry[]): MealCounts {
    const sortedData = data.sort((a, b) => {
      if (a.deviceID === b.deviceID) {
        return parseInt(a.txtime) - parseInt(b.txtime);
      }
      return a.deviceID.localeCompare(b.deviceID);
    });
  
    const deviceMealCounts: Record<string, DeviceMealCount> = {};
    const dayMealCounts: Record<string, DayMealCounts> = {};
    const lastTxtimePerDay: Record<string, Date> = {}; // Separate timestamps by date
  
    sortedData.forEach((entry) => {
      if (entry.deviceID !== "OfficeFridge1") {
        const deviceId = entry.deviceID;
        const txtime = new Date(
          `${entry.txtime.slice(0, 4)}-${entry.txtime.slice(4, 6)}-${entry.txtime.slice(6, 8)}T${entry.txtime.slice(8, 10)}:${entry.txtime.slice(10, 12)}:${entry.txtime.slice(12)}`
        );
  
        if (!deviceMealCounts[deviceId]) {
          deviceMealCounts[deviceId] = { count: 0, lastTxtime: null };
        }
  
        if (deviceMealCounts[deviceId].lastTxtime) {
          const timeDiff = (txtime.getTime() - deviceMealCounts[deviceId].lastTxtime!.getTime()) / (1000 * 60);
          if (timeDiff > 20) {
            deviceMealCounts[deviceId].count += 1;
          }
        } else {
          deviceMealCounts[deviceId].count += 1;
        }
  
        const date = txtime.toISOString().split("T")[0];
  
        if (!dayMealCounts[date]) {
          dayMealCounts[date] = {};
          lastTxtimePerDay[date] = txtime;
        }
        if (!dayMealCounts[date][deviceId]) {
          dayMealCounts[date][deviceId] = 0;
        }
  
        const lastTxtime = lastTxtimePerDay[date];
        const timeDiff = (txtime.getTime() - lastTxtime.getTime()) / (1000 * 60);
        if (timeDiff > 20) {
          dayMealCounts[date][deviceId] += 1;
        }
  
        deviceMealCounts[deviceId].lastTxtime = txtime;
        lastTxtimePerDay[date] = txtime; // Update last timestamp for the date
      }
    });
  
    const totalMealsPerDay = Object.fromEntries(
      Object.entries(dayMealCounts).map(([date, counts]) => [
        date,
        Object.values(counts).reduce((sum, count) => sum + count, 0)
      ])
    );
  
    return { deviceMealCounts, totalMealsPerDay };
  }
  
  export default classifyAndCountMeals;
  