import { useState } from "react";
import { BiCurrentLocation, BiSearch } from "react-icons/bi";

function Inputs({ setQuery, setUnits }) {
  const [city, setCity] = useState("");
  const handleSeachClick = () => {
    if (city !== "") setQuery({ q: city });
    setCity("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSeachClick();
    }
  };
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setQuery({ lat: latitude, lon: longitude });
      });
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
          <input
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="search city..."
            className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase"
          />
          <BiSearch
            onClick={handleSeachClick}
            size={30}
            className="cursor-pointer transition ease-out hover:scale-125"
          />
          <BiCurrentLocation
            onClick={handleLocationClick}
            size={30}
            className="cursor-pointer transition ease-out hover:scale-125"
          />
        </div>
        <div className="flex flex-row w-1/4 items-center justify-center">
          <button
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("metric")}
          >
            °C
          </button>
          <p className="text-2xl font-medium mx-1">|</p>
          <button
            className="text-2xl font-medium transition ease-out hover:scale-125"
            onClick={() => setUnits("imperial")}
          >
            °F
          </button>
        </div>
      </div>
    </>
  );
}

export default Inputs;
