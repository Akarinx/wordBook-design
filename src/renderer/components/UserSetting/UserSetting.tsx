import { Avatar, Icon, Tooltip } from 'antd';
import * as React from 'react';
import * as echarts from 'echarts'
import { useState, useEffect, useContext } from 'react';
import s from './UserSetting.module.scss'
import { context, IContext } from '@/store/reducer';
import { store } from '@/components/App/App'
export interface UserSettingProps {

}

const UserSetting: React.FC<UserSettingProps> = () => {
  const { state, dispatch } = useContext<IContext>(context)
  console.log(state)
  const { userName } = state.user
  const checkinDays = 1
  const optionPie = {
    title: {
      text: '近五日学习时长',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '学习时长',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '五天前' },
          { value: 735, name: '四天前' },
          { value: 580, name: '三天前' },
          { value: 484, name: '两天前' },
          { value: 300, name: '一天前' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  const optionLine = {
    title: {
      text: '近五日错题数',
    },
    legend: {
      data: ['错题数']
    },
    xAxis: {
      type: 'category',
      data: ['五天前', '四天前', '三天前', '二天前', '一天前']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '错题数',
      type: 'bar',
      data: [5, 20, 36, 10, 10]
    }]
  }


  const [timeCounter, setTimeCounter] = useState<number>(0)
  const [wordCounter, setWordCounter] = useState<number>(0)
  const [picType, setPicType] = useState<Boolean>(true)
  // eslint-disable-next-line no-undef
  let t: null | NodeJS.Timeout = null
  const time: () => void = () => {
    if (t) {
      clearTimeout(t)
    }
    const dt = new Date()
    const h = dt.getHours()
    const min = dt.getMinutes()
    const beginTime = store.get('beginTime')
    if (beginTime) {
      const [beginHours, beginMinutes] = beginTime.split(':')
      const learningTime = (h - Number(beginHours)) * 60 + min - Number(beginMinutes)
      setTimeCounter(learningTime)
    }
    console.log('xieloul')
    t = setTimeout(time, 1000);
  }

  useEffect(() => {
    time()
    const dom = document.getElementById('container')
    if (dom) {
      var myChart = echarts.init(dom);
      const option = picType ? optionPie : optionLine;
      myChart.setOption(option);
    }
    return () => {
      t && clearTimeout(t)
    }
  }, [picType])

  return (
    <div className={s.Wrapper}>
      <div className={s.mainBody}>
        <div id="container" className={s.mainLeft}>

        </div>
        <div className={s.mainRight}>
          <div className={s.head}>
            <Avatar size={100} icon="user" src={`http://localhost:3001/${localStorage.getItem('username')}/Avatar.png`} style={{ borderRadius: "50%" }} />
          </div>
          <h2 className={s.rightName} >Hi, {userName}</h2>
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
            <div className={s.picSelectWrapper}>
              <span className={s.hov} >
                <Tooltip title="近五日学习时长" placement={"bottom"}>
                  <Icon style={{ fontSize: "20px", cursor: "pointer" }} type="line-chart" onClick={() => setPicType(true)} />
                </Tooltip>
              </span>
              <span className={s.hov} >
                <Tooltip title="近五日错题分析" placement={"bottom"}>
                  <Icon style={{ fontSize: "20px", cursor: "pointer" }} type="pie-chart" onClick={() => setPicType(false)} />
                </Tooltip>
              </span>


            </div>

          </div>
        </div>
      </div>


    </div>
  );
}

export default UserSetting;