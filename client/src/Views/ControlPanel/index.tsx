import React, { useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { useGlobalStore } from "Store";
import { observer } from "mobx-react-lite";
import CustomSelect from "Components/CustomSelect";
import CustomInput from "Components/CustomInput";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  inputLabel: {},
  input: {},
  params: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 8
  }
}));

const a11yProps = (index: any) => ({
  id: `full-width-tab-${index}`,
  "aria-controls": `full-width-tabpanel-${index}`,
});

const ControlPanel = observer(() => {
  const classes = useStyles();
  const store = useGlobalStore();
  const { indexTypeList, indexTypeIndex, setIndexTypeIndex } = store as any;
  const handleChange = (event: React.ChangeEvent<{}>, typeIndex: number) => {
    console.log("change indexType", indexTypeList[typeIndex]);
    setIndexTypeIndex(typeIndex);
  };
  return (
    <div>
      <AppBar position="static" color="default" className={classes.root}>
        <Tabs
          value={indexTypeIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {indexTypeList.map((type: string, i: number) => (
            <Tab key={type} label={type} {...a11yProps(i)} />
          ))}
        </Tabs>
      </AppBar>
      <div className={classes.params}>
        {indexTypeIndex === 0 && <IVF_Setting />}
      </div>
    </div>
  );
});

const IVF_Setting = () => {
  const store = useGlobalStore();
  const [nlist, setNlist] = useState(32);
  const { setIndexConstructParams, setIndexSearchParams, setTargetId } =
    store as any;
  useEffect(() => {
    const params = JSON.stringify({ nlist });
    setIndexConstructParams("ivf_flat", params);
  }, [nlist]);
  const [nprobe, setNprobe] = useState(4);
  const [topK, setTopK] = useState(8);
  useEffect(() => {
    const params = JSON.stringify({ nprobe, k: topK });
    setIndexSearchParams(params);
  }, [nprobe, topK]);
  const numberOptions = [4, 8, 16, 32, 128, 256];

  const [id, setId] = useState(0);
  useEffect(() => {
    setTargetId(id);
  }, [id]);
  return (
    <>
      <CustomSelect
        label="nlist"
        options={numberOptions}
        value={nlist}
        setValue={setNlist}
      />
      <CustomSelect
        label="nprobe"
        options={numberOptions}
        value={nprobe}
        setValue={setNprobe}
      />
      <CustomSelect
        label="top k"
        options={numberOptions}
        value={topK}
        setValue={setTopK}
      />
      <CustomInput
        label="target id"
        type="number"
        value={id}
        setValue={setId}
      />
    </>
  );
};

export default ControlPanel;
