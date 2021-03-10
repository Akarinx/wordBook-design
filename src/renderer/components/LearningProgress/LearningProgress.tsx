import * as React from 'react';
import { useState } from 'react';
import s from './LearningProgress.module.scss'
export interface LearningProgressProps {

}

export const LearningProgress: React.FC<LearningProgressProps> = () => {
  return (
    <div className={s.Wrapper}>
      LearningProgress
    </div>);
}

