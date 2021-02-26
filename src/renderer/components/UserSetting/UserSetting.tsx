import { Avatar, Icon } from 'antd';
import * as React from 'react';
import { useState, useEffect } from 'react';
import s from './UserSetting.module.scss'
export interface UserSettingProps {

}

const UserSetting: React.FC<UserSettingProps> = () => {
  const username = 123
  const checkinDays = 1
  const [timeCounter, setTimeCounter] = useState<number>(0)
  const [wordCounter, setWordCounter] = useState<number>(0)
  // eslint-disable-next-line no-undef
  let t: null | NodeJS.Timeout = null
  const time: () => void = () => {
    if (t) {
      clearTimeout(t)
    }
    const dt = new Date()
    const h = dt.getHours()
    const min = dt.getMinutes()
    const sec = dt.getSeconds()
    setTimeCounter(min)
    t = setTimeout(time, 1000);
  }

  useEffect(() => {
    time()
  }, [])

  return (
    <div className={s.Wrapper}>
      <div className={s.mainBody}>
        <div className={s.mainLeft}>

        </div>
        <div className={s.mainRight}>
          <div className={s.head}>
            <Avatar size={100} icon="user" src={`http://localhost:3001/bb.png`} style={{ borderRadius: "50%" }} />
          </div>
          <h2 className={s.rightName} >Hi, {username}</h2>
          <div className={s.checkinBox}>
            已学习
            <span className={s.checkinDays}>
              {checkinDays}
            </span>
            天
          </div>
          <div className={s.setting}>
            <div className={s.timeCounter}>
              <Icon type="clock-circle" />&nbsp;
                此次在线时长
              <span className={s.timeMin}>
                {timeCounter}
              </span>
              分
            </div>
            <div className={s.wordCounter}>
              <Icon type="book" />&nbsp;
               已学习
              <span className={s.wordCount}>
                {wordCounter}
              </span>
              个单词
            </div>

          </div>
        </div>
      </div>


    </div>
  );
}

export default UserSetting;