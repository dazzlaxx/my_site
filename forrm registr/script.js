document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт работает');
    
    //Константа для максимального возраста
    const MAX_AGE = 100;
    
    //Получаем ссылки на элементы страницы
    const usernameInput = document.getElementById('username');
    const ageInput = document.getElementById('age');
    const checkButton = document.getElementById('checkBtn');
    const outputDiv = document.getElementById('outputMessage');
    const form = document.getElementById('registerForm');

    //Функция для отображения сообщения
    function setSuccessMessage(text) {
        if (outputDiv) {
            outputDiv.textContent = text;
            outputDiv.style.color = 'var(--text-soft)';
        }
    }

    //Функция для очистки сообщения
    function clearMessage() {
        if (outputDiv) {
            outputDiv.textContent = ''; 
        }
    }

    //Функция для удаления всех всплывающих ошибок
    function removeAllPopups() {
        const popups = document.querySelectorAll('.popup-error');
        popups.forEach(popup => popup.remove());
    }

    //Функция для показа всплывающей ошибки
    function showPopupError(element, message) {
        if (!element) return;
        
        //Удаляем предыдущие всплывающие ошибки у этого элемента
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            const existingPopup = formGroup.querySelector('.popup-error');
            if (existingPopup) {
                existingPopup.remove();
            }
        }
        
        //Создаем элемент всплывающей ошибки
        const popup = document.createElement('div');
        popup.className = 'popup-error';
        popup.textContent = message;
        
        //Находим родительский form-group и добавляем popup
        if (formGroup) {
            formGroup.appendChild(popup);
            
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 3000);
        }
    }

    function resetErrors() {
        if (usernameInput) usernameInput.classList.remove('error-border');
        if (ageInput) ageInput.classList.remove('error-border');
        removeAllPopups();
    }

    //Функция проверки возраста с учетом верхней границы
    function isValidAge(age) {
        return !isNaN(age) && age > 0 && age <= MAX_AGE && Number.isInteger(age);
    }

    //Функция проверки и обработки данных
    function checkAccess() {
        console.log('checkAccess вызван');
        
        resetErrors();
        clearMessage(); 

        const name = usernameInput ? usernameInput.value.trim() : '';
        const ageString = ageInput ? ageInput.value.trim() : '';

        console.log('Имя:', name, 'Возраст:', ageString);

        if (name === '') {
            if (usernameInput) {
                usernameInput.classList.add('error-border');
                showPopupError(usernameInput, 'Имя не может быть пустым');
            }
            return;
        }

        if (ageString === '') {
            if (ageInput) {
                ageInput.classList.add('error-border');
                showPopupError(ageInput, 'Укажите возраст');
            }
            return;
        }

        const age = Number(ageString);
        
        //Проверка, что возраст - число больше 0 и не превышает MAX_AGE
        if (!isValidAge(age)) {
            if (ageInput) {
                ageInput.classList.add('error-border');
                if (age > MAX_AGE) {
                    showPopupError(ageInput, `Возраст не может превышать ${MAX_AGE} лет`);
                } else if (age <= 0) {
                    showPopupError(ageInput, 'Возраст должен быть больше 0');
                } else if (!Number.isInteger(age)) {
                    showPopupError(ageInput, 'Возраст должен быть целым числом');
                } else {
                    showPopupError(ageInput, 'Введите корректный возраст');
                }
            }
            return;
        }

        //Определение сообщения по возрасту
        let accessMessage = '';
        
        if (age < 18) {
            accessMessage = 'Доступ ограничен';
        } else if (age >= 18 && age <= 65) {
            accessMessage = 'Доступ разрешен';
        } else {
            accessMessage = 'Рекомендуется упрощенный режим';
        }

        //Выводим результат с именем
        setSuccessMessage(`${name}, ${accessMessage}`);
        console.log('Результат:', `${name}, ${accessMessage}`);
    }

    //Добавляем обработчик клика на кнопку
    if (checkButton) {
        checkButton.addEventListener('click', checkAccess);
        console.log('Обработчик клика добавлен на кнопку');
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Отправка формы предотвращена');
            checkAccess();
        });
    }

    //Функция для обработки изменений в полях
    function handleInputChange() {
        clearMessage();
        if (usernameInput) usernameInput.classList.remove('error-border');
        if (ageInput) ageInput.classList.remove('error-border');
        removeAllPopups();
    }

    //Убираем красную рамку и всплывающие ошибки при начале ввода
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            handleInputChange();
        });
        
        //убираем ошибку при клике на поле
        usernameInput.addEventListener('click', function() {
            handleInputChange();
        });
        
        //Очищаем сообщение при фокусе на поле
        usernameInput.addEventListener('focus', function() {
            clearMessage();
        });
    }
    
    if (ageInput) {
        ageInput.addEventListener('input', function() {
            handleInputChange();
        });
        
        //убираем ошибку при клике на поле
        ageInput.addEventListener('click', function() {
            handleInputChange();
        });
        
        //Очищаем сообщение при фокусе на поле
        ageInput.addEventListener('focus', function() {
            clearMessage();
        });
        
        //Проверка при потере фокуса 
        ageInput.addEventListener('blur', function() {
            const ageString = this.value.trim();
            if (ageString !== '') {
                const age = Number(ageString);
                if (!isValidAge(age)) {
                    this.classList.add('error-border');
                    if (age > MAX_AGE) {
                        showPopupError(this, `Максимальный возраст: ${MAX_AGE} лет`);
                    } else if (age <= 0) {
                        showPopupError(this, 'Возраст должен быть больше 0');
                    } else if (!Number.isInteger(age)) {
                        showPopupError(this, 'Введите целое число');
                    }
                }
            }
        });
    }

    //Проверка имени при потере фокуса
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            const name = this.value.trim();
            if (name === '') {
                this.classList.add('error-border');
                showPopupError(this, 'Имя обязательно для заполнения');
            }
        });
    }

    //Автоматическая корректировка возраста при изменении
    if (ageInput) {
        ageInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (!isNaN(value)) {
                if (value > MAX_AGE) {
                    this.value = MAX_AGE;
                    showPopupError(this, `Значение установлено на ${MAX_AGE}`);
                    clearMessage(); // Очищаем сообщение при корректировке
                } else if (value < 1) {
                    this.value = 1;
                    showPopupError(this, 'Значение установлено на 1');
                    clearMessage(); // Очищаем сообщение при корректировке
                }
            }
        });
    }

    console.log('Скрипт инициализирован полностью');
});