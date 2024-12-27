document.addEventListener('DOMContentLoaded', function () {
    let registrationForm,
        nameInput,
        dateInput,
        genderMale,
        genderFemale,
        nameError,
        dateError,
        genderError,
        profileSlide,
        nameDiv,
        dateDiv,
        genderDiv,
        registrationModal,
        editForm,
        editNameInput,
        editDateInput,
        editGenderMale,
        editGenderFemale,
        images,
        currentIndex = 0,
        checkTestButton,
        resetTestButton,
        quizDiv,
        resultsDiv,
        galleryContainer,
        galleryImages,
        prevButton,
        nextButton,
        searchInput,
        searchButton,
        endSearchButton,
        glossaryItems,
        currentPath = window.location.pathname,
        isLoggedIn = false;

    // Function to display an error message
    function showCustomError(message, element) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        if (element && element.parentNode)
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        setTimeout(() => errorElement.remove(), 5000);
    }

    // Function to display a success message
    function showCustomSuccess(message, element) {
        const successElement = document.createElement('div');
        successElement.className = 'custom-success';
        successElement.textContent = message;
        if (element && element.parentNode)
            element.parentNode.insertBefore(successElement, element.nextSibling);
        setTimeout(() => successElement.remove(), 3000);
    }

    // Function to validate form fields
    function validateField(field, errorElement, message) {
        if (!field.value.trim() || !field.validity.valid) {
            errorElement.textContent = message;
            return false;
        } else {
            errorElement.textContent = "";
            return true;
        }
    }
    function initRegistration() {
        registrationForm = document.getElementById('registrationForm');
        nameInput = document.getElementById('nameInput');
        dateInput = document.getElementById('dateInput');
        genderMale = document.getElementById('genderMale');
        genderFemale = document.getElementById('genderFemale');
        registrationModal = document.getElementById('registrationModal');
        nameError = document.getElementById('nameError');
        dateError = document.getElementById('dateError');
        if (registrationForm && registrationModal) {
            registrationForm.addEventListener('submit', handleRegistration);
        }
    }
    function handleRegistration(event) {
        event.preventDefault();
        let isValid = true;

        isValid = validateField(nameInput, nameError, "Введите имя.");
        isValid = validateField(dateInput, dateError, "Выберите дату рождения.") && isValid;

        let selectedGender;
        if (genderMale.checked) {
            selectedGender = genderMale.value;
        } else if (genderFemale.checked) {
            selectedGender = genderFemale.value;
        } else {
            isValid = false;
            showCustomError("Выберите пол.", registrationForm);
        }

        if (isValid) {
            const registrationData = {
                name: nameInput.value,
                date: dateInput.value,
                gender: selectedGender,
            };
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
            isLoggedIn = true;
            registrationModal.style.display = 'none';
            updateProfileDisplay();
            showCustomSuccess('Регистрация прошла успешно!', registrationForm);
        }
    }

    function checkAuth() {
        const registrationData = localStorage.getItem('registrationData');
        if (registrationData) {
            isLoggedIn = true;
            updateProfileDisplay();
            if (registrationModal) registrationModal.style.display = 'none';
        } else {
            isLoggedIn = false;
            updateProfileDisplay();
            if (registrationModal) registrationModal.style.display = 'block';
            if (profileSlide) profileSlide.style.display = 'none';
        }
    }
    function updateProfileDisplay() {
        profileSlide = document.getElementById('profile-slide');
        nameDiv = document.getElementById('name');
        dateDiv = document.getElementById('date');
        genderDiv = document.getElementById('gender');

        if (!profileSlide || !nameDiv || !dateDiv || !genderDiv) return;
        try {
            const registrationData = localStorage.getItem('registrationData');
            if (registrationData) {
                const userData = JSON.parse(registrationData);
                nameDiv.textContent = userData.name ? `Имя: ${userData.name}` : '';
                dateDiv.textContent = userData.date ? `Дата рождения: ${userData.date}` : '';
                genderDiv.textContent = userData.gender ? `Пол: ${userData.gender}` : '';
                profileSlide.style.display = isLoggedIn ? 'block' : 'none';
            } else {
                profileSlide.style.display = 'none';
            }
        } catch (error) {
            showCustomError("Ошибка загрузки данных профиля.", profileSlide);
            console.error("Error parsing registration data:", error);
        }
    }
    function initGallery() {
        galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) {
            showCustomError("Галерея не найдена!", document.body);
            return;
        }
        galleryImages = galleryContainer.querySelector('.gallery-images');
        prevButton = galleryContainer.querySelector('#prevButton');
        nextButton = galleryContainer.querySelector('#nextButton');
        if (galleryImages && prevButton && nextButton) {
            images = galleryContainer.querySelectorAll('.gallery-images img');
            if (images) {
                currentIndex = 0;
                updateGallery();
                prevButton.addEventListener('click', () => {
                    currentIndex = Math.max(0, currentIndex - 1);
                    updateGallery();
                });
                nextButton.addEventListener('click', () => {
                    currentIndex = Math.min(images.length - 1, currentIndex + 1);
                    updateGallery();
                });
            } else {
                showCustomError("В галерее нет изображений", document.body);
            }
        } else {
            showCustomError("Не все элементы галереи найдены", document.body);
        }
    }
    function updateGallery() {
        if (!galleryContainer) return;
        images = images || galleryContainer.querySelectorAll('.gallery-images img');
        if (!images || images.length === 0) {
            console.error("No images in the gallery to update");
            return;
        }

        const offset = -currentIndex * 100;
        galleryImages.style.transform = `translateX(${offset}%)`;
        if (prevButton)
            prevButton.disabled = currentIndex === 0;
        if (nextButton)
            nextButton.disabled = currentIndex === images.length - 1;
    }
    function handleCheckTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError("Ошибка: Элементы quiz и results не найдены!", quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const answers = {
            q1: 'солдат-76',
            q2: 'молот, щит, рывок',
            q3: 'C',
            q4: 'A',
            q5: 'D',
            q6: 'A'
        };
        let score = 0;
        let feedback = '';
        for (let i = 1; i <= 6; i++) {
            const question = `q${i}`;
            let userAnswer;
            if (question === 'q1' || question === 'q2') {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]`).value?.toLowerCase();
            } else {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]:checked`)?.value;
            }
            if (userAnswer) {
                if (question === 'q1' || question === 'q2') {
                    if (userAnswer.includes(answers[question].toLowerCase())) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                } else {
                    if (userAnswer === answers[question]) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                }
            } else {
                feedback += `<p>Вопрос ${i}: Не был дан ответ</p>`;
            }
        }
        resultsDiv.innerHTML = `<h2>Ваш результат: ${score} из 6</h2>${feedback}`;
        if (checkTestButton) {
            checkTestButton.style.display = 'none';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'block';
        }
    }
    function handleResetTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError('Невозможно найти элементы теста.', quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const inputs = quizDiv.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio') input.checked = false;
            else if (input.type === 'text') input.value = '';
        });
        if (checkTestButton) {
            checkTestButton.style.display = 'block';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'none';
        }
    }
    function handleSearch() {
        if (!searchInput) {
            showCustomError("Нет поля ввода для поиска!", document.body);
            return;
        }
        const searchTerm = searchInput.value.toLowerCase();
        if (!glossaryItems) {
            showCustomError("Элементы для поиска не найдены!", document.body);
            return;
        }
        glossaryItems.forEach(item => {
            const term = item.querySelector('.term')?.textContent?.toLowerCase();
            item.style.display = term?.includes(searchTerm) ? 'flex' : 'none';
        });
        searchButton.style.display = 'none';
        endSearchButton.style.display = 'inline-block';
    }

    function handleEndSearch() {
        if (!searchInput) {
            showCustomError("Нет поля ввода для поиска!", document.body);
            return;
        }
        searchInput.value = '';
        if (!glossaryItems) {
            showCustomError("Элементы для поиска не найдены!", document.body);
            return;
        }
        glossaryItems.forEach(item => {
            item.style.display = 'flex';
        });
        searchButton.style.display = 'inline-block';
        endSearchButton.style.display = 'none';
    }
    function handleEditForm(event) {
        event.preventDefault();
        editNameInput = document.getElementById('editName');
        editDateInput = document.getElementById('editDate');
        editGenderMale = document.getElementById('editGenderMale');
        editGenderFemale = document.getElementById('editGenderFemale');

        const registrationData = {
            name: editNameInput.value,
            date: editDateInput.value,
            gender: editGenderMale.checked ? 'Мужской' : (editGenderFemale.checked ? 'Женский' : 'Не указан'),
        };
        if (registrationData)
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
        if (editForm)
            editForm.style.display = 'none';
        if (profileSlide)
            profileSlide.style.display = 'block';
        updateProfileDisplay();
        showCustomSuccess('Профиль изменён!', editForm);
    }
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        checkAuth();
        if (document.getElementById('registrationForm') && document.getElementById('registrationModal'))
            initRegistration();
        if (document.querySelector('.gallery-container'))
            initGallery();
        if (currentPath.includes('profile.html')) {
            updateProfileDisplay();
            const editForm = document.getElementById('editForm');
            if (editForm && isLoggedIn) {
                editForm.addEventListener('submit', handleEditForm);
                const editProfileButton = document.getElementById('editProfile');
                if (editProfileButton) {
                    editProfileButton.addEventListener('click', function () {
                        if (profileSlide && editForm) {
                            profileSlide.style.display = 'none';
                            editForm.style.display = 'block';
                        }
                    });
                }
            }
        }
        if (currentPath.includes('test.html')) {
            quizDiv = document.getElementById('quiz');
            resultsDiv = document.getElementById('results');
            checkTestButton = document.getElementById('checkTestButton');
            resetTestButton = document.getElementById('resetTestButton');
            if (checkTestButton) {
                checkTestButton.addEventListener('click', handleCheckTest);
            }
            if (resetTestButton) {
                resetTestButton.addEventListener('click', handleResetTest);
                resetTestButton.style.display = 'none';
            }
        }
        if (currentPath.includes('glossary.html')) {
            searchInput = document.getElementById('search-term');
            searchButton = document.getElementById('search-button');
            endSearchButton = document.getElementById('end-search-button');
            glossaryItems = document.querySelectorAll('#glossary-list li');
            if (searchButton && endSearchButton && searchInput && glossaryItems) {
                searchButton.addEventListener('click', handleSearch);
                endSearchButton.addEventListener('click', handleEndSearch);
            }
        }
    });
});