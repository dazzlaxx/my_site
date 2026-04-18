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
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      if (!response.ok) {
        throw new Error('Задача не найдена');
      }
      const data = await response.json();
      setTodo(data);
      setEditedTitle(data.title);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке деталей: ' + err.message);
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
        <p>Загрузка деталей задачи...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <div className="error">{error}</div>
        <button onClick={goBack} className="back-btn">← Назад к списку</button>
      </div>
    );
  }

  if (!todo) {
    return null;
  }

  return (
    <div className="detail-container">
      <button onClick={goBack} className="back-btn">
        ← Назад к списку
      </button>
      
      <div className="detail-card">
        <div className="detail-header">
          <h2>Детали задачи</h2>
          <div className={`status-indicator ${todo.completed ? 'completed' : 'active'}`}>
            {todo.completed ? 'Выполнено' : 'В процессе'}
          </div>
        </div>
        
        <div className="detail-content">
          <div className="detail-field">
            <span className="field-label">ID задачи:</span>
            <span className="field-value">{todo.id}</span>
          </div>

          <div className="detail-field">
            <span className="field-label">ID пользователя:</span>
            <span className="field-value">{todo.userId}</span>
          </div>

          <div className="detail-field title-field">
            <span className="field-label">Название:</span>
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
                    ✓ Сохранить
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    ✗ Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="title-display">
                <span className="field-value">{todo.title}</span>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Редактировать
                </button>
              </div>
            )}
          </div>

          <div className="detail-field">
            <span className="field-label">Статус:</span>
            <span className={`status-badge ${todo.completed ? 'completed' : 'active'}`}>
              {todo.completed ? 'Задача выполнена' : 'Задача в работе'}
            </span>
          </div>
        </div>

        <div className="detail-footer">
          <p className="footer-note">
            {todo.completed 
              ? 'Отличная работа! Задача успешно завершена.' 
              : 'Продолжайте работу над задачей!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;