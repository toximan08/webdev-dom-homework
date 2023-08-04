import { getComments, postComments, deleteComments, loginUser } from "./api.js";
import { renderAuthComponent } from "./components/login-component.js";
export let comments = [];
let token = null;
let currentUser = null;

// Работа с датой комментариев

const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  timezone: "UTC",
  hour: "numeric",
  minute: "2-digit",
};
export const date = new Date().toLocaleString("ru-RU", dateOptions);

export const setToken = (newToken) => {
  token = newToken;

  localStorage.setItem("currentToken", newToken);
};

export const setUser = (newUser) => {
  currentUser = newUser;
  localStorage.setItem("currentUser", newUser);
};
const fetchCommentsAndRender = () => {
  return getComments({ token }).then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        date: new Date(comment.date).toLocaleString("ru-RU", dateOptions),
        text: comment.text,
        likes: comment.likes,
        isLiked: false,
        isEdit: false,
        isReplied: false,
      };
    });

    comments = appComments;
    renderApp(token);
  });
};

fetchCommentsAndRender();
// Рендер-функция

const renderApp = (token) => {
  // let isAuthMode = true;
  const appEl = document.getElementById("app");

  const commentsHtml = comments
    .map((comment, index) => {
      return `<li class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            ${
              comment.isEdit
                ? `<textarea class ="area-text">${comment.text}</textarea>`
                : `<div data-index="${index}" class ="comment-text">
                ${
                  comment.isReplied
                    ? `<div class="quote">${quote
                        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                        .replaceAll("QUOTE_END", "</div>")}</div>`
                    : ``
                }
            ${comment.text}`
            }
          </div>
          <div class="comment-footer">
            <button data-index="${index}" class="add-form-button edit-button">${
        comment.isEdit ? `Сохранить` : `Редактировать`
      }</button>
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button data-index="${index}" class="${
        comment.isLiked ? "like-button -active-like" : "like-button"
      }"></button>
            </div>
          </div>
        </li>`;
    })
    .join("");
  if (!token) {
    const appHtml = `
    <div class="container">
      <ul class="comments" id="list">
        ${commentsHtml}
      </ul>
      <div class="add-form">
        Чтобы оставить комментарий
        <button class="add-form-button" id="auth-button">Авторизуйтесь</button>
      </div>
    </div> `;

    appEl.innerHTML = appHtml;
    // fetchCommentsAndRender();
    document.getElementById("auth-button").addEventListener("click", () => {
      renderAuthComponent({
        appEl,
        setToken,
        setUser,
        fetchCommentsAndRender,
      });
    });
  } else {
    // isAuthMode = false;
    const appHtml = `
    <div class="container">
      <ul class="comments" id="list">
        ${commentsHtml}
      </ul>
      <div class="add-form">
        <input
          id="name-input"
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"
          hidden
        />
        <textarea
          id="comment-txtarea"
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button
            class="add-form-button add-form-button--inactive"
            id="add-button"
            disabled
          >
            Написать
          </button>
          <button class="add-form-button" id="delete-button">Удалить</button>
        </div>
      </div>
    </div> `;

    appEl.innerHTML = appHtml;

    const mainForm = document.querySelector(".add-form");
    // listElement.textContent = 'Пожалуйста подождите, комментарии загружаются';

    // Функция добавления нового комментария
    const addButtonElement = document.getElementById("add-button");
    addButtonElement.addEventListener("click", handlePostClick);

    const commentTxtareaElement = document.getElementById("comment-txtarea");
    // Расширенная валидация

    window.addEventListener("input", () => {
      if (commentTxtareaElement.value !== "") {
        addButtonElement.classList.remove("add-form-button--inactive");
        addButtonElement.disabled = false;
      }
    });

    // Добавление нового комментария посредством нажатия Enter

    mainForm.addEventListener("keyup", (e) => {
      if (e.code === "Enter") {
        addButtonElement.click();
        delValue();
      }
    });

    initLikeButtonsListeners();
    initEditButtonsListeners();
    replyListeners();
    deleteCommentListener();
  }
};

// Функция удаления комментария
const deleteCommentListener = () => {
  // Удаление комментария
  const delButtonElement = document.getElementById("delete-button");
  delButtonElement.addEventListener("click", (event) => {
    event.stopPropagation();

    const id = deleteButton.dataset.id;

    deleteComments({
      token,
      id,
    }).then((responseData) => {
      comments = responseData.comments;
      renderApp();
    });
  });
};

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
      renderApp(comments);
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
      const quote = `QUOTE_BEGIN ${comments[index].name} \n ${comments[index].text} QUOTE_END`;
      commentTextElement.setAttribute("readonly", true);
      if (comments[index].isReplied) {
        renderApp(comments);
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
      renderApp(comments);
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
  commentTxtareaElement.value = "";
  addButtonElement.classList.add("add-form-button--inactive");
  addButtonElement.disabled = true;
};

const handlePostClick = () => {
  // Прогрузка добавления комментариев
  const addFormElement = document.querySelector(".add-form");
  const container = document.querySelector(".container");
  const commentTxtareaElement = document.getElementById("comment-txtarea");
  const addingComment = document.createElement("p");
  addFormElement.style.display = "none";

  addingComment.textContent =
    "Пожалуйста подождите, Ваш комментарий добавляется...";
  container.appendChild(addingComment);

  // POST
  postComments({ text: protectInput(commentTxtareaElement.value), token })
    .then((responseData) => {
      comments = responseData;
      return fetchCommentsAndRender();
    })
    .then(() => {
      addFormElement.style.display = "flex";
      container.removeChild(addingComment);
    })
    .catch((error) => {
      addFormElement.style.display = "flex";
      container.removeChild(addingComment);
      switch (error.message) {
        case "Сервер упал, повторите попытку позже":
          handlePostClick();
          break;
        case "Имя и комментарий должны быть не короче 3 символов":
          alert("Имя и комментарий должны быть не короче 3 символов");
          break;
        case "Нет авторизации":
          alert("Нет авторизации");
          break;
        default:
          alert("Похоже у Вас пропал интернет, проверьте подключение");
          break;
      }
    });

  fetchCommentsAndRender();
  delValue();
};

export { renderApp };
