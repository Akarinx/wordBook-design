import React, { useCallback, useState } from 'react';
import {Button} from 'antd'
import fs from 'fs'
import {remote} from 'electron'
import {Header} from '../Header'
import './App.scss'
export const App: React.FunctionComponent = () => {
  const [file,setFile]=useState('')
  const readTxtFileData=async ()=>{
    const res=await remote.dialog.showOpenDialog({
      title:'选择txt',
    })
    fs.readFile(res.filePaths[0],'utf-8',(err,data)=>{
      if(err){
        console.error(err)
      }else{
        setFile(data.replace(/\n|\r\n/g,'<br/>'))
      }
    })
  }
  return (
    <div>
      <Header/>
      <div>Hello World!</div>
      <Button type='danger' onClick={readTxtFileData}>读文件内容</Button>
      <Button type='dashed' onClick={useCallback(()=>{setFile('')},[])}>refresh</Button>
      <div dangerouslySetInnerHTML={{__html:file}} />
    </div>
  )
};
