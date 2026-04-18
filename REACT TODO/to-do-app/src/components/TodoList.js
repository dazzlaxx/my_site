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
    setError(null);
    
    //Используем другой публичный API
    const response = await fetch('https://dummyjson.com/todos');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    //Преобразуем данные под наш формат
    const formattedTodos = data.todos.map(todo => ({
      id: todo.id,
      title: todo.todo,
      completed: todo.completed,
      userId: todo.userId
    }));
    
    setTodos(formattedTodos.slice(0, 15));
    setError(null);
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    
    //Если и этот API не работает, пробуем третий вариант
    try {
      const response = await fetch('https://jsonplaceholder.cypress.io/todos');
      const data = await response.json();
      setTodos(data.slice(0, 15));
      setError(null);
    } catch (secondErr) {
      //Совсем запасной вариант
      setError('Работаем с локальными данными');
      const fallbackTodos = [
        { id: 1, title: 'Создать красивый дизайн', completed: true, userId: 1 },
        { id: 2, title: 'Добавить анимации', completed: false, userId: 1 },
        { id: 3, title: 'Настроить загрузку с сервера', completed: false, userId: 1 },
        { id: 4, title: 'Сделать утреннюю зарядку', completed: true, userId: 1 },
        { id: 5, title: 'Прочитать книгу', completed: false, userId: 1 },
        { id: 6, title: 'Написать отчёт', completed: false, userId: 1 },
        { id: 7, title: 'Встретиться с друзьями', completed: false, userId: 1 },
      ];
      setTodos(fallbackTodos);
    }
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
                </button>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Удалить"
                >
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <p> Список пуст</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;