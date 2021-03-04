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
export interface IInitstate {
  point: number;
  token: string | null;
  fileName: string[];
  todos: TODO[];
  user: USER;
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
  }
}

