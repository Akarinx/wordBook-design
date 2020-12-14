export interface TODO {
  todoName: string;
  todoType: 'todo' | 'pending' | 'finished';
  key: number
}
export interface IInitstate {
  point: number;
  token: string | null;
  fileName: string[];
  todos: TODO[]
}

let key = 0

export const initstate: IInitstate = {
  point: 0,
  token: localStorage.getItem('token'),
  fileName: [],
  todos: []
}

