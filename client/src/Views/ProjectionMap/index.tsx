import React from 'react'
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useGlobalStore } from "Store";
import { useObserver } from 'mobx-react-lite';

const ProjectionMap = () => {
  const store = useGlobalStore();
  return useObserver(() => (
    <div>
      ProjectionMap
    </div>
  ))
}

export default ProjectionMap
