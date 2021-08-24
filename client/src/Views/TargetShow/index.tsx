import React from 'react'
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
