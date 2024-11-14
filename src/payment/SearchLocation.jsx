import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchLocation.css"; // Import custom styles for dropdown

const SearchLocation = ({ setEndPoint, setAddress, address }) => {
  const [query, setQuery] = useState(""); // Initialize query

  // Listen for changes in the address prop and update the query
  useEffect(() => {
    if (address) {
      setQuery(address); // Update search bar value when the address prop changes
    }
  }, [address]);

  const [suggestions, setSuggestions] = useState([]);

  // Search Location function using Nominatim
  const searchLocation = async (query) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=VN&addressdetails=1&limit=5`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  // When a user selects a location from the dropdown
  const selectLocation = (location) => {
    const latLng = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
    setEndPoint(latLng); // Set the selected location as the end point
    setQuery(location.display_name); // Set the search bar value to the selected location
    setSuggestions([]); // Clear the dropdown after selection
    setAddress(location.display_name); // Set address in parent component
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchLocation(e.target.value); // Call search API on each keystroke
        }}
        placeholder="Search for a location"
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((location, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => selectLocation(location)}
            >
              {location.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;
