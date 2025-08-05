// Функция для экранирования и замены переносов строк
function escapeAndNl2br(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}

// Функция для экранирования спецсимволов (используется для кода и plain-текста)
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Функция для добавления копи-кнопки к сообщению.
 * parent: DOM-элемент (div.message), к которому добавить кнопку
 * text: текст для копирования
 */
function appendCopyButton(parent, text) {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.dataset.text = text;
    btn.textContent = "📋";
    btn.addEventListener("click", function () {
        // Создаем временный textarea для копирования
        const tempInput = document.createElement("textarea");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        // Показываем уведомление об успехе
        btn.textContent = "✅";
        setTimeout(() => {
            btn.textContent = "📋";
        }, 1000);
    });
    parent.appendChild(btn);
}

// Обработка отправки формы чата
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

    // --- Добавляем сообщение пользователя с кнопкой копирования ---
    // Обертка для сообщения пользователя
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.innerHTML = `<strong>Вы:</strong> ${escapeAndNl2br(userMessage)}`;
    // Добавить кнопку копирования
    appendCopyButton(userDiv, userMessage);
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';

    try {    
        // Отправляем запрос на сервер (/chat)
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: userMessage})
        });
        const data = await response.json();

        // --- Добавляем ответ ИИ с кнопкой копирования ---
        const llmDiv = document.createElement('div');
        llmDiv.className = 'message llm';

        // Ответ может содержать свой форматирование, используем <pre> и escapeHTML
        const escapedAIReply = `<pre>${escapeHTML(data.reply)}</pre>`;
        llmDiv.innerHTML = `<strong>ИИ:</strong> ${escapedAIReply}`;
        appendCopyButton(llmDiv, data.reply);

        chatBox.appendChild(llmDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

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

// Автоматическое изменение высоты textarea при вводе
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('user-input');
    // Функция для авторазмера
    function autoResize() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 8 + 'px';
    }
    textarea.addEventListener('input', autoResize);
    autoResize();
});

// Реализация копирования для кнопок, которые уже существуют на странице (например, из chat_history)
document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = button.dataset.text;
            // Создаем временный textarea
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            // Уведомление об успешном копировании
            button.textContent = '✅';
            setTimeout(() => {
                button.textContent = '📋';
            }, 1000);
        });
    });
});
