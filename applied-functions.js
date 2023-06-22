// Работа с датой комментариев

function getDate(date) {
  const options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const newDate = new Date(date);
  return newDate.toLocaleString("ru-RU", options).replace(",", "");
}

// Функция безопасности от внедрения файлов через input

function safeInput(someEdit) {
  return someEdit
    .replaceAll(">", "&gt;")
    .replaceAll("<", "&lt;")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
}

// Расширенная валидация

function validate(input, text) {
  if (input.value === "" || input.value === "\n") {
    input.classList.add("error__name");
    input.placeholder = "Поле не может быть пустым!";
    input.value = "";
    setTimeout(() => {
      input.classList.remove("error__name");
      input.placeholder = `Введите ${text}`;
    }, 1500);
  } else {
    return true;
  }
}

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export { safeInput, validate, getDate, delay };
