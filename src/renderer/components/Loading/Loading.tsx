import { Spin } from 'antd';
import * as React from 'react';
import s from './Loading.module.scss'
const Loading: React.FC = () => {
  return (
    <div className={s.loadingWrapper}>
      <Spin size="large" tip="Loading..." />
    </div>
  )
}
export default Loading