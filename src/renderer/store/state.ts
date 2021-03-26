export interface TODO {
  todoName: string;
  todoType: 'todo' | 'pending' | 'finished';
  key: number
}
export interface USINGTIME {
  date: string;
  time:number
}
export interface WORDCOUNT {
  date: string;
  Counter: number;
}

export interface USER {
  userName: string;
  usingtime: [USINGTIME];
  wordCount: [WORDCOUNT];
  wrongWordBook:[string]
}

export interface ANSWER {
  key: number,
  answer:'A' | 'B' | 'C' | 'D'
}

export interface singleData {
  key: number;
  question: string;
  answer: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
}

export interface ANSWER_OBJ{
  [key:number]:'A' | 'B' | 'C' | 'D'
}

export interface IInitstate {
  point: number;
  token: string | null;
  fileName: string[];
  todos: TODO[];
  user: USER;
  data: singleData[];
  answer: ANSWER_OBJ; // { '0'：'A','1':'B'}
  nowFileName: string;
}

let key = 0

export const initstate: IInitstate = {
  point: 0,
  token: localStorage.getItem('token'),
  fileName: [],
  todos: [],
  user: {
    userName: '',
    usingtime: [{
      date: '',
      time:0
    }],
    wordCount: [{
      date: '',
      Counter:0
    }],
    wrongWordBook:['']
  },
  answer: {},
  data: [],
  nowFileName:''
}

