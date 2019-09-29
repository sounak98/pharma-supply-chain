import React from "react";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

export default withScriptjs(
  withGoogleMap(props => (
    <GoogleMap defaultZoom={15} defaultCenter={props.position}>
      <Marker position={props.position} />
    </GoogleMap>
  ))
);
