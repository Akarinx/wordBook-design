import React, {useCallback, useContext } from 'react';
import { Button } from 'antd'
import { context, IContext } from '@/store/reducer'
import s from './Login.module.scss'


export interface LoginProps {

}

export const Login: React.FC<LoginProps> = () => {
  const { state, dispatch }: IContext = useContext(context)
  const handleSyncClick = async () => {
    const count = await wait()
    dispatch({ type: 'ADDSYNC', payload: count })
  }
  const wait = () => {
    return new Promise(res => {
      setTimeout(() => {
        res(1)
      }, 2000)
    })
  }
  return (
    <div className={s.login}>
      {state.point}
      <Button onClick={useCallback(() => { dispatch({ type: 'ADD' }) }, [])}>+1</Button>
      <Button onClick={handleSyncClick}>sync+1</Button>
    </div>
  );
}

export default Login;