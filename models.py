from flask_sqlalchemy import SQLAlchemy
import openai
import dotenv

env = dotenv.dotenv_values(".env")

db = SQLAlchemy()


class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_message = db.Column(db.Text, nullable=False)
    llm_reply = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())



class LLMService:
    def __init__(self, model_name):
        try:
            # Создаем клиент с вашим токеном
            self.client = openai.OpenAI(
                api_key=env["YA_API_KEY"],
                base_url="https://llm.api.cloud.yandex.net/v1",
            )
            # Формируем системный промпт
            # Указываем путь к модели, 
            # Здесь нужно будет указать идентификатор своего аккаунта
            acc_key=env["YA_ACC_KEY"]
            self.model = f"gpt://{acc_key}/{model_name}"

        except Exception as e:
            return f"Произошла ошибка: {str(e)}"

    def chat(self, message, sys_promt, temperature, max_tokens):
        try:
            # Обращаемся к API
            response = self.client.chat.completions.create(
                model = self.model,
                messages=[
                    {"role": "system", "content": sys_promt},
                    {"role": "user", "content": message},
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )

            # Возвращаем ответ
            return response.choices[0].message.content

        except Exception as e:
            return f"Произошла ошибка: {str(e)}"
