import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TodoDetail.css';

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    fetchTodoDetail();
  }, [id]);

  const fetchTodoDetail = async () => {
  try {
    setLoading(true);
    
    // Пробуем основной API
    let response = await fetch(`https://dummyjson.com/todos/${id}`);
    
    if (!response.ok) {
      // Если не получилось, пробуем запасной
      response = await fetch(`https://jsonplaceholder.cypress.io/todos/${id}`);
    }
    
    if (!response.ok) {
      throw new Error('задача не найдена');
    }
    
    const data = await response.json();
    
    // Приводим к единому формату
    const todo = {
      id: data.id,
      title: data.todo || data.title,
      completed: data.completed,
      userId: data.userId
    };
    
    setTodo(todo);
    setEditedTitle(todo.title);
    setError(null);
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    setError('не удалось загрузить детали задачи');
    
    // Создаём локальные данные для этой задачи
    setTodo({
      id: parseInt(id),
      title: `Задача ${id}`,
      completed: false,
      userId: 1
    });
    setEditedTitle(`Задача ${id}`);
  } finally {
    setLoading(false);
  }
};

  const handleSave = () => {
    if (editedTitle.trim()) {
      setTodo({ ...todo, title: editedTitle });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загружаем...</p>
      </div>
    );
  }

  if (!todo) {
    return null;
  }

  return (
    <div className="detail-container">
      <button onClick={goBack} className="back-btn">
        ← Назад
      </button>
      
      <div className="detail-card">
        <div className="detail-header">
          <h2>Детали</h2>
          <div className={`status-badge ${todo.completed ? 'completed' : 'active'}`}>
            {todo.completed ? '✓ выполнено' : '○ в процессе'}
          </div>
        </div>
        
        <div className="detail-content">
          <div className="detail-field">
            <span className="field-label">ID</span>
            <span className="field-value">{todo.id}</span>
          </div>

          <div className="detail-field">
            <span className="field-label">Пользователь</span>
            <span className="field-value">{todo.userId}</span>
          </div>

          <div className="detail-field title-field">
            <span className="field-label">Задача</span>
            {isEditing ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="edit-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-btn">
                    Сохранить
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="title-display">
                <span className="field-value">{todo.title}</span>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Изменить
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="info-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDetail;