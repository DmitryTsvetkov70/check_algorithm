document.getElementById('chat-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // Display user message
    chatBox.innerHTML += `<div class="message user"><strong>Вы:</strong> ${userMessage}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';

    // Send to backend (adjust endpoint as needed)
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: userMessage})
    });
    const data = await response.json();

    // Display LLM response
    chatBox.innerHTML += `<div class="message llm"><strong>ИИ:</strong> ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});

// В файле script.js добавляем следующий код Commmit 2
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('user-input');
    
    // Функция для автоматического изменения высоты
    function autoResize() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 8 + 'px';
    }
    
    // Привязываем обработчик события
    textarea.addEventListener('input', autoResize);
    
    // Инициализируем начальное состояние
    autoResize();
});

// Добавим JavaScript для реализации копирования:
document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.dataset.text;
            
            // Создаем временный input
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            
            // Выделяем и копируем текст
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Показываем уведомление об успешной копии
            button.textContent = '✅';
            setTimeout(() => {
                button.textContent = '📋';
            }, 1000);
        });
    });
});
