import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { StoreProvider } from "Store";

const useStyles = makeStyles((theme: Theme) => {
  const headerHeight = theme.spacing(4);
  const leftContainer = "80%";
  const border = "1px solid #aaa";
  const rightTopHeight = "24%";
  const rightMiddleHeight = "20%";
  const rightBottomHeight = `calc(99% - ${rightTopHeight} - ${rightMiddleHeight})`;
  return {
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    header: {
      position: "absolute",
      width: "100%",
      height: headerHeight,
      backgroundColor: "#333",
      display: "flex",
      alignItems: "center",
      color: "#fff",
    },
    headerText: {
      paddingLeft: theme.spacing(2),
    },
    mainContainer: {
      position: "absolute",
      top: headerHeight,
      bottom: 0,
      width: "100%",
      display: "flex",
    },
    leftContainer: {
      height: "100%",
      width: "80%",
    },
    rightContainer: {
      height: "100%",
      width: `calc(100% - ${leftContainer})`,
      borderLeft: border,
    },
    rightTopContainer: {
      width: "100%",
      height: rightTopHeight,
      borderBottom: border,
    },
    rightMiddleContainer: {
      width: "100%",
      height: rightMiddleHeight,
      borderBottom: border,
    },
    rightBottomContainer: {
      width: "100%",
      height: rightBottomHeight,
      overflow: "auto",
    },
  };
});

function App() {
  const classes = useStyles();
  return (
    <StoreProvider>
      <div className={classes.root}>
        <header className={classes.header}>
          <Typography variant="h6" className={classes.headerText}>
            Vis for Similarity Search
          </Typography>
        </header>
        <div className={classes.mainContainer}>
          <div className={classes.leftContainer}></div>
          <div className={classes.rightContainer}>
            <div className={classes.rightTopContainer}></div>
            <div className={classes.rightMiddleContainer}></div>
            <div className={classes.rightBottomContainer}></div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
