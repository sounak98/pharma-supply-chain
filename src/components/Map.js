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
      centerLat += Number(position.lat);
      centerLng += Number(position.lng);
    }
    centerLat /= props.positions.length;
    centerLng /= props.positions.length;
    return (
      <GoogleMap
        defaultZoom={3}
        defaultCenter={{ lat: centerLat, lng: centerLng }}
      >
        {props.positions.map((value, index) => {
          return (
            <Marker
              position={{ lat: Number(value.lat), lng: Number(value.lng) }}
              key={index}
            />
          );
        })}
      </GoogleMap>
    );
  })
);
