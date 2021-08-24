import React from 'react'
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
