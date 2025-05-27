export function getCurrentLocation(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      // success callback
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Coordinates:", { latitude, longitude });

        const apiKey = "19f62bc6a4db4429b1cb7a573b8c5a22";
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.results.length > 0) {
            const comps = data.results[0].components;
            const city = comps.city || "Unknown City";
            const postal = comps.postcode || "Unknown Postal";
            const province = comps.region || "Unknown Province";
            const country = comps.country || "Unknown Country";

            const locationString = `${city}, ${postal}, ${province}, ${country}`;
            return resolve(locationString);
          } else {
            console.warn("No results found for coordinates.");
            return resolve(null);
          }
        } catch (err) {
          console.error("Error fetching location data:", err);
          return resolve(null);
        }
      },
      // error callback
      (err) => {
        console.error("Geolocation error:", err.message);
        resolve(null);
      },
      // options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
