import React from 'react'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useGlobalStore } from "Store";
import { useObserver } from 'mobx-react-lite';

const TargetShow = () => {
  const store = useGlobalStore();
  return useObserver(() => (
    <div>
      TargetShow
    </div>
  ))
}

export default TargetShow
