interface DeviceRecord {
    time: string;
    deviceID: string;
    kwh: number;
    lat: number;
    long: number;
    status: string;
    txtime: number;
  }
  
  function categorizeKwh(data: DeviceRecord[]): { morningKwh: number; afternoonKwh: number; nightKwh: number } {
    let morningKwh = 0;
    let afternoonKwh = 0;
    let nightKwh = 0;
  
    data.forEach((record) => {
      const hour = parseInt((record.txtime).toString().slice(8, 10), 10); // Extract hour from the 'txtime' field YYYYMMDDHHmmss
      if (hour >= 4 && hour < 11) {
        morningKwh += record.kwh;
      } else if (hour >= 11 && hour < 17) {
        afternoonKwh += record.kwh;
      } else {
        nightKwh += record.kwh;
      }
    });
  
    return { morningKwh, afternoonKwh, nightKwh };
  }
  export default categorizeKwh;