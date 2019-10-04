import React from "react";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

export default withScriptjs(
  withGoogleMap(props => {
    let centerLat = 0,
      centerLng = 0;
    for (let position of props.positions) {
      centerLat += position.lat;
      centerLng += position.lng;
    }
    centerLat /= props.positions.length;
    centerLng /= props.positions.length;
    return (
      // <GoogleMap defaultZoom={5} defaultCenter={props.positions[0]}>
      <GoogleMap
        defaultZoom={1}
        defaultCenter={{ lat: centerLat, lng: centerLng }}
      >
        {props.positions.map((value, index) => {
          return <Marker position={value} key={index} />;
        })}
      </GoogleMap>
    );
  })
);
