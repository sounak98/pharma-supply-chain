import React, { Component } from "react";

import ReactJson from "react-json-view";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar
  // Typography
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { withStyles } from "@material-ui/styles";

import Map from "./Map";

const styles = theme => ({
  card: {
    width: "750px"
  },
  media: {
    height: "300px"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

const GOOGLE_API_KEY = "AIzaSyAelQF4Hbrbm6QluyTRaQ7y1Ge9AKWit0s";

class CheckpointCard extends Component {
  // componentDidMount() {
  //   console.log(this.props.checkpointDetails);
  // }

  render() {
    const { classes } = this.props;
    let locations = [];
    if (this.props.checkpointDetails.name === "Purchase") {
      locations.push(this.props.checkpointDetails.template.buyer.location);
      locations.push(this.props.checkpointDetails.template.seller.location);
    }
    if (this.props.checkpointDetails.name === "Transfer") {
      locations.push(
        this.props.checkpointDetails.template.distributor.location
      );
      locations.push(this.props.checkpointDetails.template.pharmcay.location);
    }
    for (let l of locations) {
      l.lat = Number(l.lat);
      l.lng = Number(l.lon);
      delete l.lon;
    }
    console.log(locations);
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {this.props.serial}
            </Avatar>
          }
          title={this.props.checkpointDetails.name}
          // subheader={this.props.checkpointDetails.datetime.toLocaleString()}
        />
        {locations.length > 0 && (
          <CardMedia className={classes.media}>
            <Map
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
              loadingElement={
                <div style={{ width: "750px", height: "300px" }} />
              }
              containerElement={
                <div style={{ width: "750px", height: "300px" }} />
              }
              mapElement={<div style={{ width: "750px", height: "300px" }} />}
              positions={locations}
            />
          </CardMedia>
        )}
        <CardContent>
          <ReactJson src={this.props.checkpointDetails.template} />
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(CheckpointCard);
