import { createSlice, } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../app/store';

const initialState = [
	{ id: uuidv4(), title: 'todo 001', finished: false, updatedAt: new Date("2021-01-01"), selected: false, },
	{ id: uuidv4(), title: 'todo 002', finished: false, updatedAt: new Date("2021-01-02"), selected: false, },
];

export const todoListSlice = createSlice({
	name: 'todolist',
	initialState,
	reducers: {
		add: (state, action) => {
			const { title } = action.payload;
			const newTodo = { id: uuidv4(), title, finished: false, updatedAt: new Date(), selected: false, }
			return [newTodo, ...state]
		},
		setSelect: (state, action) => {
			const { id, selected, } = action.payload;
			return state.map((t) => {
				if (id === "-1") {
					return { ...t, selected, }
				}
				if (t.id === id) {
					return { ...t, selected, }
				}
				return { ...t }
			})
		},
		setFinish: (state, action) => {
			const { id, finished } = action.payload;
			return state.map((t) => {

				if (id === "-1") {
					if (t.selected) {
						return { ...t, finished: !t.finished, updatedAt: new Date(), }
					}
					return { ...t }
				} else {
					if (t.id === id) {
						return { ...t, finished: finished, updatedAt: new Date(), }
					}
					return { ...t }
				}
			})
		},
		remove: (state, action) => {
			const { id } = action.payload;
			return state.filter((t) => {
				if (id !== "-1") {
					return t.id !== id
				} else {
					return !t.selected
				}
			})
		}
	},

});

export const { add, setFinish, setSelect, remove, } = todoListSlice.actions;
export const allTodo = (state: RootState) => state.todolist;

export default todoListSlice.reducer;
