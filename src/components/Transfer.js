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

class Transfer extends Component {
  render() {
    const { classes } = this.props;
    const { template } = this.props.checkpointDetails;
    return (
      <CheckpointCard
        checkpointDetails={this.props.checkpointDetails}
        serial={3}
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
              template.distributor.location,
              template.pharmacy.location
            ]}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="body1">
            Distributor: {template.distributor.name}{" "}
            <Chip size="small" label="Verified" variant="outlined" />
            <br />
            Pharmacy: {template.pharmacy.name}{" "}
            <Chip size="small" label="Verified" variant="outlined" />
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

export default withStyles(styles)(Transfer);
