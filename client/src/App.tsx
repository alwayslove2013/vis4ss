import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { StoreProvider } from "Store";
import Header from "Views/Header";
import ControlPanel from "Views/ControlPanel";
import TargetShow from "Views/TargetShow";
import ResultShow from "Views/ResultShow";
import ProjectionMap from "Views/ProjectionMap";

const useStyles = makeStyles((theme: Theme) => {
  const headerHeight = theme.spacing(4);
  const leftContainer = "82%";
  const border = "1px solid #aaa";
  const rightTopHeight = "40%";
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
    mainContainer: {
      position: "absolute",
      top: headerHeight,
      bottom: 0,
      width: "100%",
      display: "flex",
    },
    leftContainer: {
      height: "100%",
      width: leftContainer,
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
          <Header />
        </header>
        <div className={classes.mainContainer}>
          <div className={classes.leftContainer}>
            <ProjectionMap />
          </div>
          <div className={classes.rightContainer}>
            <div className={classes.rightTopContainer}>
              <ControlPanel />
            </div>
            <div className={classes.rightMiddleContainer}>
              <TargetShow />
            </div>
            <div className={classes.rightBottomContainer}>
              <ResultShow />
            </div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;
