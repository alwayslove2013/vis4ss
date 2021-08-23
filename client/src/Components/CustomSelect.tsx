import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

const CustomSelect = ({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: number;
  setValue: (arg: any) => void;
  options: any[];
}) => {
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value);
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
      >
        {options.map((value: any) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
