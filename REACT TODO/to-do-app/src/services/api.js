const API_URL = 'http://localhost:8080/api';

export const api = {
  getAllTodos: async () => {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },

  getTodoById: async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}`);
    if (!response.ok) throw new Error('Задача не найдена');
    return response.json();
  },

  createTodo: async (todo) => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Ошибка создания');
    return response.json();
  },

  updateTodo: async (id, todo) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Ошибка обновления');
    return response.json();
  },

  deleteTodo: async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Ошибка удаления');
  },
};