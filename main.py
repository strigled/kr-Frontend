import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="./static"), name="static")

def reply(user_text: str) -> str:
    t = (user_text or "").lower()
    if "привет" in t or "здравствуй" in t:
        return "Привет! Рад тебя видеть. О чем поговорить хотим?"
    elif "как дела" in t or "как ты" in t:
        return "У меня все отлично, ведь я просто программа! А как твои дела?"
    elif "погода" in t:
        return "За окном отличная погода для написания кода! Прогноз посмотреть не могу — нет интернета."
    elif "имя" in t or "как тебя зовут" in t:
        return "Меня зовут Ботти, я твой личный ассистент!"
    elif "кто тебя создал" in t or "чей ты" in t:
        return "Меня создал талантливый разработчик на воркшопе по FastAPI!"
    elif "пошути" in t or "анекдот" in t:
        return "Почему программисты носят очки? Потому что они не видят C#!"
    elif "пока" in t or "до свидания" in t:
        return "До встречи! Удачи в учебе и хорошего дня!"
    return "Интересная мысль, но я не совсем понял. Можешь спросить как-то иначе?"

async def process_and_reply(ws: WebSocket, text: str):
    await asyncio.sleep(2.5)
    await ws.send_text(reply(text))

@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            text = await ws.receive_text()
            await process_and_reply(ws, text)
    except WebSocketDisconnect:
        pass
