import React from 'react'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useGlobalStore } from "Store";
import { useObserver } from 'mobx-react-lite';

const ResultShow = () => {
  const store = useGlobalStore();
  return useObserver(() => (
    <div>
      ResultShow
    </div>
  ))
}

export default ResultShow
