import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

const API_URL = 'http://localhost:8080/api';

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
      setError(null);
      
      const response = await fetch(`${API_URL}/todos`);
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить задачи с сервера');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      
      if (response.ok) {
        setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      }
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      try {
        const newTodo = {
          title: newTodoTitle,
          completed: false,
          userId: 1
        };
        
        const response = await fetch(`${API_URL}/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
        });
        
        if (response.ok) {
          const createdTodo = await response.json();
          setTodos([createdTodo, ...todos]);
          setNewTodoTitle('');
        }
      } catch (err) {
        console.error('Ошибка добавления:', err);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
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
        <p>Загружаем задачи...</p>
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

        {error && (
          <div className="info-message">
            {error}
          </div>
        )}

        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Что нужно сделать?"
            className="add-todo-input"
          />
          <button type="submit" className="add-btn">
            Добавить
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
            Завершённые
          </button>
        </div>

        <div className="todo-stats">
          <span>Всего: {todos.length}</span>
          <span>Выполнено: {todos.filter(t => t.completed).length}</span>
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
                  title="Подробнее"
                >
                  ›
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <p>Список пуст</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;