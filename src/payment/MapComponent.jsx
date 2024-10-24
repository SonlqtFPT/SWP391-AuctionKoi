import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import SearchLocation from "./SearchLocation"; // Import the search component
import polyline from "@mapbox/polyline"; // Import polyline decoder

// Custom red icon for the end marker
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = ({
  startPoint,
  endPoint,
  setEndPoint,
  setDistance,
  setAddress,
}) => {
  const [route, setRoute] = useState([]);
  const [address, setAddressState] = useState(""); // Local state to store address

  // Fetch route whenever start or end points change
  useEffect(() => {
    if (startPoint && endPoint) {
      const fetchRoute = async () => {
        try {
          const apiKey =
            "5b3ce3597851110001cf624889830b6e463b49a794377ea4aeb8107f"; // OpenRouteService API Key
          const response = await axios.post(
            `https://api.openrouteservice.org/v2/directions/driving-car`,
            {
              coordinates: [
                [startPoint.lng, startPoint.lat],
                [endPoint.lng, endPoint.lat],
              ],
            },
            {
              headers: {
                Authorization: apiKey,
                "Content-Type": "application/json",
              },
            }
          );

          const geometry = response.data.routes[0].geometry;

          // Decode the polyline geometry using @mapbox/polyline
          const routeCoords = polyline.decode(geometry);
          const leafletRoute = routeCoords.map((coord) => ({
            lat: coord[0],
            lng: coord[1],
          }));
          setRoute(leafletRoute);

          const distanceInMeters = response.data.routes[0].summary.distance;
          setDistance(distanceInMeters / 1000); // Convert to km
        } catch (error) {
          console.error("Error fetching the route", error);
        }
      };

      fetchRoute();
    }
  }, [startPoint, endPoint, setDistance]);

  // Reverse geocoding function to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      return response.data.display_name; // Return the formatted address
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return null;
    }
  };

  return (
    <div className="relative z-10">
      {/* Search Component for End Point */}
      <SearchLocation
        setEndPoint={setEndPoint}
        setAddress={setAddress}
        address={address} // Pass the local address state here
      />

      {/* Map */}
      <MapContainer
        center={[10.8412, 106.8098]} // Center the map on Dai Hoc FPT
        zoom={17}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Start Marker */}
        {startPoint && <Marker position={startPoint} />}

        {/* End Marker with draggable feature */}
        {endPoint && (
          <Marker
            position={endPoint}
            icon={redIcon}
            draggable={true}
            eventHandlers={{
              dragend: async (event) => {
                const newLatLng = event.target.getLatLng();
                setEndPoint({ lat: newLatLng.lat, lng: newLatLng.lng });

                // Perform reverse geocoding to get the new address
                const newAddress = await reverseGeocode(
                  newLatLng.lat,
                  newLatLng.lng
                );
                if (newAddress) {
                  setAddressState(newAddress); // Update local state for SearchLocation
                  setAddress(newAddress); // Update the address in parent component (shipping details)
                }
              },
            }}
          />
        )}

        {/* Display the Route */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
