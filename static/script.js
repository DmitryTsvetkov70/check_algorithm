// Функция для экранирования и замены переносов строк
function escapeAndNl2br(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}

document.getElementById('chat-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Получаем элементы
     const submitBtn = document.getElementById('submit-btn');
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userMessage = input.value.trim();


    if (!userMessage) return;

    // Блокируем кнопку и меняем текст
    submitBtn.disabled = true;
    submitBtn.textContent = 'Думаю...';

    // Отображаем сообщение пользователя
    chatBox.innerHTML += `<div class="message user"><strong>Вы:</strong> ${escapeAndNl2br(userMessage)}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';



    try {    
        // Отправляем запрос
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: userMessage})
        });
        const data = await response.json();

        /// Отображаем ответ
        // Функция экранирует спец. символы в строке
        function escapeHTML(str) {
            if (!str) return "";
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }


        // Экранируй ответ, выводи в pre (для структурированного кода)
        const escapedAIReply = `<pre>${escapeHTML(data.reply)}</pre>`;
        chatBox.innerHTML += `<div class="message llm"><strong>ИИ:</strong> ${escapedAIReply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight
    } catch (error) {
        //Передаем сообщение об ошибке в консоль
        console.error('Ошибка:', error);
        // Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';        
    } finally {
        // Возвращаем кнопку в исходное состояние
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }

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
