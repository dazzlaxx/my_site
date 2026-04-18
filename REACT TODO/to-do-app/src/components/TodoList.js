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
      
      //Русские задачи для замены
      const russianTasks = [
        'Купить продукты',
        'Позвонить маме',
        'Сходить в спортзал',
        'Прочитать книгу',
        'Написать отчёт',
        'Встретиться с друзьями',
        'Оплатить счета',
        'Записаться к врачу',
        'Сделать уборку',
        'Приготовить ужин',
        'Посмотреть вебинар',
        'Обновить резюме',
        'Заказать подарок',
        'Погулять с собакой',
        'Медитация 10 минут',
        'Разобрать почту',
        'Полить цветы',
        'Спланировать выходные',
        'Выучить 10 новых слов',
        'Сделать зарядку'
      ];
      
      //Пробуем загрузить с сервера
      const response = await fetch('https://jsonplaceholder.cypress.io/todos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      //Заменяем английские названия на русские
      const formattedTodos = data.slice(0, 15).map((todo, index) => ({
        id: todo.id,
        title: russianTasks[index % russianTasks.length],
        completed: todo.completed,
        userId: todo.userId
      }));
      
      setTodos(formattedTodos);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить задачи с сервера. Используем локальные данные.');
      
      //Запасные данные на русском
      const fallbackTodos = [
        { id: 1, title: 'Создать красивый дизайн', completed: true, userId: 1 },
        { id: 2, title: 'Добавить анимации', completed: false, userId: 1 },
        { id: 3, title: 'Настроить загрузку с сервера', completed: false, userId: 1 },
        { id: 4, title: 'Сделать утреннюю зарядку', completed: true, userId: 1 },
        { id: 5, title: 'Прочитать книгу', completed: false, userId: 1 },
        { id: 6, title: 'Купить продукты', completed: false, userId: 1 },
        { id: 7, title: 'Позвонить маме', completed: true, userId: 1 },
        { id: 8, title: 'Сходить в спортзал', completed: false, userId: 1 },
      ];
      setTodos(fallbackTodos);
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