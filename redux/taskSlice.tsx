import {createSlice, nanoid} from '@reduxjs/toolkit';

export interface TodoTaskType {
  id: string;
  name: string;
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: nanoid(),
        name: action.payload.name,
        number: action.payload.number,
      };
      state?.push(newTask);
      console.log('NEW CONTACT ADDED: ', action.payload);
    },
    deleteTask: (state, action) => {
      return state.filter(item => item?.id !== action?.payload?.id);
    },
    updateName: (state, action) => {
      state.map((item, index) => {
        if (state[index].id === action.payload.id) {
          item.name = action.payload.name;
        }
      });
      console.log('UPdated NAME>>>>>>', state);
    },
    updateNumber: (state, action) => {
      state.map((item, index) => {
        if (state[index].id === action.payload.id) {
          item.number = action.payload.number;
        }
      });
      console.log('UPdated NUMBER>>>>>>', state);
    },
  },
});

export const {addTask, deleteTask, updateName, updateNumber} =
  taskSlice.actions;

export default taskSlice.reducer;
