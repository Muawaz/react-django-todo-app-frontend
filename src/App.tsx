import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/todos/")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === "") return; // Prevent adding empty todos
    axios
      .post("http://127.0.0.1:8000/api/todos/", {
        title: newTodo,
        completed: false,
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      })
      .catch((error) => console.error(error));
  };

  const deleteTodo = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/todos/${id}/`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const toggleTodoCompletion = (id: number) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    axios
      .patch(`http://127.0.0.1:8000/api/todos/${id}/`, {
        completed: !todoToToggle.completed,
      })
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: response.data.completed } : todo
          )
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Todo App</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-button">
          Add
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id)}
                className="todo-checkbox"
              />
              <span
                className={`todo-title ${todo.completed ? "todo-completed" : ""}`}
              >
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="todo-delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
