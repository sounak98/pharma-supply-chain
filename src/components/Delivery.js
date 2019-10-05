import React, { Component } from "react";

import { CardMedia, Typography, CardContent, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

import CheckpointCard from "./CheckpointCard";
import Map from "./Map";

const GOOGLE_API_KEY = "AIzaSyD0kEY4HhNzZB4ADneitSZ0uBIMoBzMKsY";

const styles = theme => ({
  card: {
    width: "750px"
  },
  media: {
    height: "300px"
  }
});

class Delivery extends Component {
  render() {
    const { classes } = this.props;
    const { template } = this.props.checkpointDetails;
    return (
      <CheckpointCard
        checkpointDetails={this.props.checkpointDetails}
        serial={2}
      >
        <CardMedia className={classes.media}>
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ width: "750px", height: "300px" }} />}
            containerElement={
              <div style={{ width: "750px", height: "300px" }} />
            }
            mapElement={<div style={{ width: "750px", height: "300px" }} />}
            positions={[
              template.manufacturer.location,
              template.distributor.location
            ]}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="body1">
            Manufacturer: {template.manufacturer.name}{" "}
            <Chip size="small" label="Verified" variant="outlined" />
            <br />
            Transporter: {template.transporter.name}{" "}
            <Chip size="small" label="Verified" variant="outlined" />
            <br />
            Vehicle Number: {template.transporter.vehicleNo}
            <br />
            Transportation Quality Index:{" "}
            {template.transporter.tempSensor.ideal} /{" "}
            {template.transporter.tempSensor.ideal +
              template.transporter.tempSensor.crossed}
            <br />
            Medicine: {template.medicines[0].name}
            <br />
            Quantity: {template.medicines[0].quantity}
            <br />
            Price: {template.medicines[0].price}
          </Typography>
        </CardContent>
      </CheckpointCard>
    );
  }
}

export default withStyles(styles)(Delivery);
