import { Avatar } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import s from './UserSetting.module.scss'
export interface UserSettingProps {

}

const UserSetting: React.FC<UserSettingProps> = () => {
  return (
    <div className={s.main}>
      <div className={s.head}>
        <Avatar size="large" icon="user" />
      </div>
      <div className={s.setting}>

      </div>
    </div>
  );
}

export default UserSetting;