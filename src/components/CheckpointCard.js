import React, { Component } from "react";

import ReactJson from "react-json-view";

import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Collapse,
  CardActions,
  IconButton
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import red from "@material-ui/core/colors/red";
import { withStyles } from "@material-ui/styles";

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

class CheckpointCard extends Component {
  state = {
    expanded: false
  };

  handleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes } = this.props;
    const time = new Date(Number(this.props.checkpointDetails.template.timestamp));
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {this.props.serial}
            </Avatar>
          }
          title={this.props.checkpointDetails.name}
          subheader={time.toLocaleString()}
        />
        {this.props.children}
        <CardActions disableSpacing>
          <IconButton onClick={this.handleExpand}>
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ReactJson src={this.props.checkpointDetails.template} />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(CheckpointCard);
