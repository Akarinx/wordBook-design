import React, { useState } from 'react';
import './Header.scss'
export const Header = () => {
    const [title]=useState('wordBook')
    return (
        <div className='Header-title' >{title}</div>
    )
}