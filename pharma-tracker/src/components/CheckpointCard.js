import React, { Component } from "react";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  Typography
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
  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {this.props.serial}
            </Avatar>
          }
          title={this.props.checkpointDetails.title}
          subheader={this.props.checkpointDetails.datetime.toLocaleString()}
        />
        <CardMedia className={classes.media}>
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ width: "750px", height: "300px" }} />}
            containerElement={
              <div style={{ width: "750px", height: "300px" }} />
            }
            mapElement={<div style={{ width: "750px", height: "300px" }} />}
            position={{ lat: 26.8504855, lng: 75.8089507 }}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {this.props.checkpointDetails.description}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(CheckpointCard);
