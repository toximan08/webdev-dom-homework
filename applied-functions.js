import { renderComments } from "./render.js";
import { postComments, comments } from "./api.js";
import {
  quote,
  addFormElement,
  container,
  commentTxtareaElement,
  addingComment,
  nameInputElement,
  addButtonElement,
} from "./flex-vars.js";

// Функция обработчика событий лайков

const initLikeButtonsListeners = () => {
  const likeButtonsElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonsElements) {
    likeButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButtonElement.dataset.index;

      if (comments[index].isLiked === true) {
        comments[index].isLiked = false;
        comments[index].likes -= 1;
      } else if (comments[index].isLiked === false) {
        comments[index].isLiked = true;
        comments[index].likes += 1;
      }
      renderComments(comments);
    });
  }
};

// Функция ответа на комментарии work in progress (задание со звездочкой)

const replyListeners = () => {
  const commentTextElements = document.querySelectorAll(".comment-text");

  for (const commentTextElement of commentTextElements) {
    commentTextElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = commentTextElement.dataset.index;
      commentTxtareaElement.value = `> ${comments[index].text} \n ${comments[index].name}, `;
      quote = `QUOTE_BEGIN ${comments[index].name} \n ${comments[index].text} QUOTE_END`;
      commentTextElement.setAttribute("readonly", true);
      if (comments[index].isReplied) {
        renderComments(comments);
      }
    });
  }
};

// Функция редактирования комментариев

const initEditButtonsListeners = () => {
  const editButtonsElements = document.querySelectorAll(".edit-button");

  for (const editButtonElement of editButtonsElements) {
    editButtonElement.addEventListener("click", () => {
      const index = editButtonElement.dataset.index;
      const editTextArea = document.querySelector(".area-text");
      if (comments[index].isEdit === true) {
        comments[index].isEdit = false;
        comments[index].text = editTextArea.value;
      } else if (comments[index].isEdit === false) {
        comments[index].isEdit = true;
      }
      renderComments(comments);
    });
  }
};

// Функция безопасности от внедрения файлов через input

function protectInput(someEdit) {
  someEdit = someEdit
    .replaceAll("<", "&lt;")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;");
  return someEdit;
}

// Функция очистки полей ввода и блокировки кнопки "Написать"

const delValue = () => {
  nameInputElement.value = "";
  commentTxtareaElement.value = "";
  addButtonElement.classList.add("add-form-button--inactive");
  addButtonElement.disabled = true;
};

// Функция добавления нового комментария

const handlePostClick = () => {
  // Прогрузка добавления комментариев

  addFormElement.style.display = "none";

  addingComment.textContent =
    "Пожалуйста подождите, Ваш комментарий добавляется...";
  container.appendChild(addingComment);

  // POST
  postComments();
  delValue();
};

export {
  initEditButtonsListeners,
  initLikeButtonsListeners,
  replyListeners,
  protectInput,
  handlePostClick,
  delValue,
};
