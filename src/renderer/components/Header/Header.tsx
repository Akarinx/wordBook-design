import React, { useState } from 'react';
import s from './Header.module.scss'
export const Header = () => {
    const [title]=useState('wordBook')
    console.log(s,123)
    return (
        <div className={s.title} >{title}</div>
    )
}