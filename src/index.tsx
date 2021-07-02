import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider, } from "@chakra-ui/react"
import theme from "./theme"

import './index.css';
// import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import TodoList from './features/todolist/TodoList';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <TodoList />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

