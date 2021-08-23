import React from 'react'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useGlobalStore } from "Store";
import { useObserver } from 'mobx-react-lite';

const ControlPanel = () => {
  const store = useGlobalStore();
  return useObserver(() => (
    <div>
      ControlPanel
    </div>
  ))
}

export default ControlPanel
