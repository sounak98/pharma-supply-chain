import React, { Component, Fragment } from "react";

import {
  Container,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Grid
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";

import NavBar from "./NavBar";
import CheckpointCard from "./CheckpointCard";
import Hero from "../assets/hero.jpg";

import { getCheckpointsFromBatchId } from "../utils";

const styles = theme => ({
  hero: {
    width: "100%",
    height: "500px",
    backgroundImage: `url('${Hero}')`,
    backgroundSize: "cover"
  },
  heroText: {
    paddingTop: theme.spacing(8)
  },
  heroTextItem: {
    marginBottom: theme.spacing(1)
  },
  medicineSearch: {
    marginTop: "-35px",
    display: "flex",
    padding: "10px 20px",
    width: "100%",
    borderRadius: "40px"
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  iconButton: {
    padding: "10px"
  },
  gutterBottom: {
    marginBottom: theme.spacing(4)
  }
});

const manufacturer = {
  location: {
    lat: 100,
    lon: 100
  },
  datetime: new Date(),
  title: "Manufacturer XYZ",
  description: "This is xyz the leading producer of paracetamols."
};

class Home extends Component {
  state = {
    batchId: "ARP6FRGFDZ42UMVH5JGUODO5ESGYBVHYV6MKMDHZPGBESLC4IHIM6SP5VY"
  };

  getCheckpoints = async () => {
    let checkpoints = await getCheckpointsFromBatchId(this.state.batchId);
    console.log(checkpoints);
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <NavBar />
        <Container maxWidth={false} className={classes.hero}>
          <Container maxWidth="md" className={classes.heroText}>
            <Typography
              variant="h2"
              align="center"
              className={classes.heroTextItem}
            >
              Pharmaceutical Goods Tracker
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary">
              Track your medicines with ease using a Supply Chain on the
              Algorand Blockchain
            </Typography>
          </Container>
        </Container>
        <Container maxWidth="md" className={classes.gutterBottom}>
          <Paper className={classes.medicineSearch} elevation={10}>
            <InputBase
              className={classes.input}
              placeholder="Enter the Batch Address on your Medicine Packaging"
            />
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              onClick={this.getCheckpoints}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>
        <Container maxWidth="md" className={classes.gutterBottom}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <CheckpointCard checkpointDetails={manufacturer} serial={1} />
            </Grid>
            <Grid item>
              <CheckpointCard checkpointDetails={manufacturer} serial={2} />
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Home);
