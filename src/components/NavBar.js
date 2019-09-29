import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import {
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import Code from "@material-ui/icons/Code";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class NavBar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Pharmaceutical Goods Tracker
          </Typography>
          <div>
            <Tooltip title="Visit Repository">
              <IconButton
                color="inherit"
                href="https://github.com/sounak98/pharma-supply-chain"
              >
                <Code />
              </IconButton>
            </Tooltip>
          </div>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(NavBar);
