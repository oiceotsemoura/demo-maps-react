import React, { useState, useRef, useEffect } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import Autocomplete from "react-google-places-autocomplete";

const mapStyles = {
  width: "100%",
  height: "100%",
};

const MapContainer = (props) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const calculateDistance = () => {
    const { google } = props;
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          if (response.rows[0].elements[0].status === "OK") {
            const distance = response.rows[0].elements[0].distance.text;
            setDistance(distance);
          } else {
            console.log("No valid results returned:", response);
          }
        }
      }
    );

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);

          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(mapRef.current.map);
          directionsRenderer.setDirections(result);
        }
      }
    );
  };

  const handleOriginSelect = (place) => {
    setOrigin(place.value.description);
  };

  const handleDestinationSelect = (place) => {
    setDestination(place.value.description);
  };

  return (
    <div>
      <Autocomplete
        selectProps={{
          origin,
          onChange: handleOriginSelect,
        }}
        apiKey="AIzaSyAjl95v0vTYm8LSnDavn8gFKYq8Jo8IJis"
        searchOptions={{ types: ["address"] }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Origin" })} />
            <div>
              {loading ? <div>Loading...</div> : null}
              {suggestions.map((suggestion, index) => {
                const style = {
                  backgroundColor: suggestion.active ? "#eaeaea" : "#fff",
                };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, { style })}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Autocomplete>
      <Autocomplete
        selectProps={{
          destination,
          onChange: handleDestinationSelect,
        }}
        apiKey="AIzaSyAjl95v0vTYm8LSnDavn8gFKYq8Jo8IJis"
        searchOptions={{ types: ["address"] }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Destination" })} />
            <div>
              {loading ? <div>Loading...</div> : null}
              {suggestions.map((suggestion, index) => {
                const style = {
                  backgroundColor: suggestion.active ? "#eaeaea" : "#fff",
                };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, { style })}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Autocomplete>
      <button onClick={calculateDistance}>Calcular Distância</button>
      <p>Distância: {distance}</p>
      <Map
        google={props.google}
        zoom={14}
        ref={mapRef}
        style={mapStyles}
        initialCenter={{
          lat: -23.5617,
          lng: -46.6553,
        }}
      ></Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyAjl95v0vTYm8LSnDavn8gFKYq8Jo8IJis",
})(MapContainer);
