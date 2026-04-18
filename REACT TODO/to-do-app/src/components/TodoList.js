import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTodos(data.slice(0, 20));
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      const newTodo = {
        id: Date.now(),
        title: newTodoTitle,
        completed: false,
        userId: 1
      };
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  const goToDetail = (id) => {
    navigate(`/todo/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка задач...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h2>Мои задачи</h2>
          <button onClick={fetchTodos} className="refresh-btn">
            Обновить
          </button>
        </div>

        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Добавить новую задачу..."
            className="add-todo-input"
          />
          <button type="submit" className="add-btn">
            + Добавить
          </button>
        </form>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Выполненные
          </button>
        </div>

        <div className="todo-stats">
          <span>Всего: {todos.length}</span>
          <span>Выполнено: {todos.filter(t => t.completed).length}</span>
          <span>Осталось: {todos.filter(t => !t.completed).length}</span>
        </div>

        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span 
                className="todo-title"
                onClick={() => goToDetail(todo.id)}
              >
                {todo.title}
              </span>
              <div className="todo-actions">
                <button 
                  onClick={() => goToDetail(todo.id)}
                  className="detail-btn"
                  title="Посмотреть детали"
                >
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <p>Нет задач</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;