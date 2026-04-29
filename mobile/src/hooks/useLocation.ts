import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

export interface GpsCoords {
  lat: number;
  lng: number;
  address: string;
}

export function useLocation() {
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(async (): Promise<GpsCoords | null> => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return null;

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;
      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      try {
        const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
        const parts = [geo.street, geo.subregion ?? geo.city, geo.region].filter(Boolean);
        if (parts.length) address = parts.join(', ');
      } catch { /* ignore reverse geocode failure */ }

      return { lat: latitude, lng: longitude, address };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Geocode a typed address string using the device OS geocoder
  const geocodeAddress = useCallback(async (address: string): Promise<GpsCoords | null> => {
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        return { lat: results[0].latitude, lng: results[0].longitude, address };
      }
    } catch { /* ignore */ }
    return null;
  }, []);

  return { getLocation, geocodeAddress, loading };
}
