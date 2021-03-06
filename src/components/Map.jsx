import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import useGeoLocation from "../hooks/useGeoLocation";
import "../App.css";
const libraries = ["places"];
const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const location = useGeoLocation();

  const mapRef = useRef();

  const center = location.coordinates;
  const spot = `${center.lat}, ${center.lng}`;

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const onChangeHandler = (event) => {
    let spots = spot.event.target.value;
  };

  if (!isLoaded) {
    return <p className="text-center">Loading...</p>;
  }
  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.BICYCLING,
    });
    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    setPrice(
      1 + parseInt(results.routes[0].legs[0].duration.text) * 0.22 + "€"
    );
  };

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    setPrice("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };
  return (
    <div>
      <div className=" customBg fixed-top container-fluid shadow pt-1 mt-2 w-75  ">
        <div className=" hstack gap-2  row rounded p-2 pt-1    ">
          <Autocomplete>
            <InputGroup>
              <input
                className=" form-control me-auto border border-warning "
                type="text"
                placeholder="Origin"
                ref={originRef}
                value={spot}
                onChange={(event) => onChangeHandler(event)}
              />
              <Button
                id="button-addon2"
                variant="warning"
                onClick={() => {
                  window.location.reload(true);
                  map.panTo(center);
                  map.setZoom(15);
                }}
              >
                <FaLocationArrow />
              </Button>
            </InputGroup>
          </Autocomplete>

          <Autocomplete>
            <InputGroup>
              <input
                className="form-control me-auto border border-warning bg-light  "
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
              <Button onClick={clearRoute} variant="warning">
                <FaTimes />
              </Button>
            </InputGroup>
          </Autocomplete>
        </div>
        <div className=" pb-1 d-flex justify-content-center ">
          <Form.Select
            placeholder="Select service"
            aria-label="Default select example"
            className=" border border-warning w-50 bg-light "
          >
            <option value="1">Tier</option>
            <option value="2">Joe</option>
            <option value="3">Voi</option>
          </Form.Select>
        </div>
        <div className="  pb-1 pt-0  d-flex justify-content-center">
          <Button
            size="l"
            variant="warning"
            type="submit"
            className="w-50"
            onClick={calculateRoute}
          >
            Calculate
          </Button>
        </div>
      </div>
      <GoogleMap
        center={center}
        zoom={15}
        ref={mapRef}
        mapContainerClassName="map-container"
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
        }}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={center} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      {price.length === 0 ? (
        <div></div>
      ) : (
        <div className=" asd d-flex justify-content-around fw-bold bg-warning fixed-bottom border border-dark container-fluid  pt-1   ">
          <div className="d-flex align-items-center ">
            Distance:
            <br />
            {distance}
          </div>
          <div className="d-flex align-items-center">
            Duration:
            <br />
            {duration}
          </div>
          <div className="d-flex align-items-center">
            Price:
            <br />
            {price}
          </div>
        </div>
      )}
    </div>
  );
};
export default Map;
