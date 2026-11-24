const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");
const clearChatButton = document.getElementById("clear-chat");

let isTyping = false;

function addMessage(text, isUser) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(isUser ? "user-message" : "bot-message");
    const userAvatar = "/static/user.png";
    const botAvatar = "/static/bot.png";


  messageElement.innerHTML = `
        <img src="${isUser ? userAvatar : botAvatar}" alt="${isUser ? "Пользователь" : "Бот"}" class="message-avatar">
        <div class="message-text">${text}</div>
    `;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handlSendMessage() {
  const userText = userInput.value.trim();

  if (userText === "" || isTyping) return;

  addMessage(userText, true);
  userInput.value = "";

  isTyping = true;
  typingIndicator.style.display = "flex";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(userText);
  } else {
    isTyping = false;
    typingIndicator.style.display = "none";
    addMessage("Сервер недоступен!", false);
  }
}

function clearChatHistory() {
  if (isTyping) {
    isTyping = false;
    typingIndicator.style.display = "none";
  }

  const welcomMessage = chatMessages.querySelector(".bot-message");
  chatMessages.innerHTML = "";
  if (welcomMessage) {
    chatMessages.appendChild(welcomMessage);
  }
}

const wsProtocol = location.protocol == "https" ? "wss" : "ws";
const ws = new WebSocket(`${wsProtocol}://${location.host}/ws`);
ws.addEventListener("message", (e) => {
  if (isTyping) {
    isTyping = false;
    typingIndicator.style.display = "none";
  }
  addMessage(e.data, false);
});

sendButton.addEventListener("click", handlSendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handlSendMessage();
  }
});

clearChatButton.addEventListener("click", clearChatHistory);
