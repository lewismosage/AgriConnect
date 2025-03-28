import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

interface MapboxViewProps {
  coordinates: [number, number][];
}

const MapboxView = ({ coordinates }: MapboxViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (coordinates.length === 0 || !mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates[0],
      zoom: 9
    });

    // Add markers
    coordinates.forEach(coord => {
      new mapboxgl.Marker()
        .setLngLat(coord)
        .addTo(map.current!);
    });

    // Add route line
    if (coordinates.length > 1) {
      map.current.on('load', () => {
        map.current!.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        });

        map.current!.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 3
          }
        });
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [coordinates]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[400px] rounded-lg"
    />
  );
};

export default MapboxView;