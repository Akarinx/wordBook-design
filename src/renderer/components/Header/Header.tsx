import React, { useState } from 'react';
import s from './Header.module.scss'
import {Link} from 'react-router-dom'
export const Header:React.FC = () => {
    const [title]=useState('wordBook')
    return (
        <div className={s.title} >
          {title}
          <Link to="/">to/</Link>
        </div>
    )
}