import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useGlobalStore } from "Store";

const useStyles = makeStyles((theme: Theme) => ({
  // headerText: {
  //   paddingLeft: theme.spacing(2),
  // },
  root: {
    "& > *": {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    display: "none",
  },
}));

const Header = () => {
  const classes = useStyles();
  const store = useGlobalStore();
  const { setData } = store as any;
  const uploadFile = (e: any) => {
    const file = e.target.files[0];
    setData(file);
  };
  return (
    <div className={classes.root}>
      <Typography variant="h6">Vis for Similarity Search</Typography>
      <input
        accept=".csv"
        className={classes.input}
        id="upload-csv"
        // multiple
        type="file"
        onChange={uploadFile}
      />
      <label htmlFor="upload-csv">
        <Button
          variant="contained"
          color="primary"
          size="small"
          component="span"
        >
          Upload
        </Button>
      </label>
    </div>
  );
};

export default Header;
