document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, скрипт работает');
    
    //Константа для максимального возраста
    const MAX_AGE = 100;
    
    //Получаем ссылки на элементы страницы
    const usernameInput = document.getElementById('username');
    const ageInput = document.getElementById('age');
    const checkButton = document.getElementById('checkBtn');
    const form = document.getElementById('registerForm');

    //Функция для удаления всех всплывающих элементов
    function removeAllPopups() {
        //Удаляем всплывающие ошибки у полей
        const fieldPopups = document.querySelectorAll('.popup-error');
        fieldPopups.forEach(popup => popup.remove());
        
        //Удаляем глобальные всплывающие уведомления
        const globalPopups = document.querySelectorAll('.global-popup');
        globalPopups.forEach(popup => popup.remove());
    }

    //Функция для показа всплывающей ошибки у поля
    function showFieldError(element, message) {
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
            
            //Автоматически скрываем через 3 секунды
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 3000);
        }
    }

    //Функция для показа глобального всплывающего уведомления
    function showGlobalPopup(message, type = 'info') {
        //Удаляем предыдущее глобальное уведомление
        const existingGlobal = document.querySelector('.global-popup');
        if (existingGlobal) {
            existingGlobal.remove();
        }
        
        //Создаем элемент уведомления
        const popup = document.createElement('div');
        popup.className = `global-popup ${type}`;
        popup.textContent = message;
        
        //Добавляем на страницу
        document.body.appendChild(popup);
        
        //Автоматически скрываем через 3 секунды
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 3000);
    }

    //Функция для сброса ошибок
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
        
        //Сброс ошибок
        resetErrors();

        //Считываем значения
        const name = usernameInput ? usernameInput.value.trim() : '';
        const ageString = ageInput ? ageInput.value.trim() : '';

        console.log('Имя:', name, 'Возраст:', ageString);

        //Проверка имени
        if (name === '') {
            if (usernameInput) {
                usernameInput.classList.add('error-border');
                showFieldError(usernameInput, 'Имя не может быть пустым');
            }
            return;
        }

        //Проверка возраста
        if (ageString === '') {
            if (ageInput) {
                ageInput.classList.add('error-border');
                showFieldError(ageInput, 'Укажите возраст');
            }
            return;
        }

        const age = Number(ageString);
        
        //Проверка, что возраст - число больше 0 и не превышает MAX_AGE
        if (!isValidAge(age)) {
            if (ageInput) {
                ageInput.classList.add('error-border');
                if (age > MAX_AGE) {
                    showFieldError(ageInput, `Возраст не может превышать ${MAX_AGE} лет`);
                } else if (age <= 0) {
                    showFieldError(ageInput, 'Возраст должен быть больше 0');
                } else if (!Number.isInteger(age)) {
                    showFieldError(ageInput, 'Возраст должен быть целым числом');
                } else {
                    showFieldError(ageInput, 'Введите корректный возраст');
                }
            }
            return;
        }

        //Определение сообщения по возрасту
        if (age < 18) {
            showGlobalPopup(`${name}, доступ ограничен`, 'warning');
        } else if (age >= 18 && age <= 65) {
            showGlobalPopup(`${name}, доступ разрешен`, 'success');
        } else {
            showGlobalPopup(`${name}, рекомендуется упрощенный режим`, 'info');
        }
    }

    //Добавляем обработчик клика на кнопку
    if (checkButton) {
        checkButton.addEventListener('click', checkAccess);
        console.log('Обработчик клика добавлен на кнопку');
    }

    //Блокируем отправку формы 
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Отправка формы предотвращена');
            checkAccess();
        });
    }

    //Функция для обработки изменений в полях
    function handleInputChange() {
        //Убираем красные рамки
        if (usernameInput) usernameInput.classList.remove('error-border');
        if (ageInput) ageInput.classList.remove('error-border');
        //Убираем все всплывающие элементы
        removeAllPopups();
    }

    //Убираем красную рамку и всплывающие ошибки при начале ввода
    if (usernameInput) {
        usernameInput.addEventListener('input', handleInputChange);
        usernameInput.addEventListener('click', handleInputChange);
        usernameInput.addEventListener('focus', handleInputChange);
    }
    
    if (ageInput) {
        ageInput.addEventListener('input', handleInputChange);
        ageInput.addEventListener('click', handleInputChange);
        ageInput.addEventListener('focus', handleInputChange);
        
        //Проверка при потере фокуса
        ageInput.addEventListener('blur', function() {
            const ageString = this.value.trim();
            if (ageString !== '') {
                const age = Number(ageString);
                if (!isValidAge(age)) {
                    this.classList.add('error-border');
                    if (age > MAX_AGE) {
                        showFieldError(this, `Максимальный возраст: ${MAX_AGE} лет`);
                    } else if (age <= 0) {
                        showFieldError(this, 'Возраст должен быть больше 0');
                    } else if (!Number.isInteger(age)) {
                        showFieldError(this, 'Введите целое число');
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
                showFieldError(this, 'Имя обязательно для заполнения');
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
                    showFieldError(this, `Значение установлено на ${MAX_AGE}`);
                } else if (value < 1) {
                    this.value = 1;
                    showFieldError(this, 'Значение установлено на 1');
                }
            }
        });
    }

    console.log('Скрипт инициализирован полностью');
});