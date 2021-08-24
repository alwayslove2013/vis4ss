import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { useGlobalStore } from "Store";
import { observer } from "mobx-react-lite";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "40%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const LevelControl = observer(() => {
  const classes = useStyles();
  const store = useGlobalStore() as any;
  const { currentLevel, setCurrentLevel, numLevel } = store;
  const steps = Array.from(Array(numLevel)).map((d, i) => `step ${i + 1}`);
  return (
    <div className={classes.root}>
      <Stepper activeStep={currentLevel}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {currentLevel === steps.length - 1 ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={() => setCurrentLevel(0)}>Reset</Button>
          </div>
        ) : (
          <div>
            {/* <Typography className={classes.instructions}>
              {steps[currentLevel]}
            </Typography> */}
            <div>
              <Button
                disabled={currentLevel === 0}
                onClick={() => setCurrentLevel(currentLevel - 1)}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCurrentLevel(currentLevel + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default LevelControl;
