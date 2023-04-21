import { getComments } from "./api.js";
import {
  listElement,
  nameInputElement,
  commentTxtareaElement,
  addButtonElement,
} from "./flex-vars.js";
import { handlePostClick, delValue } from "./applied-functions.js";

// Объявление переменных

const delButtonElement = document.getElementById("delete-button");
const mainForm = document.querySelector(".add-form");
listElement.textContent = "Пожалуйста подождите, комментарии загружаются...";

getComments();

// Расширенная валидация

window.addEventListener("input", () => {
  if (nameInputElement.value !== "" && commentTxtareaElement.value !== "") {
    addButtonElement.classList.remove("add-form-button--inactive");
    addButtonElement.disabled = false;
  }
});

addButtonElement.addEventListener("click", handlePostClick);

// Добавление нового комментария посредством нажатия Enter

mainForm.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    addButtonElement.click();
    delValue();
  }
});

// Удаление последнего комментария

delButtonElement.addEventListener("click", () => {
  if (listElement.lastElementChild) {
    listElement.lastElementChild.remove();
  }
});
