// Объявление переменных

const addButtonElement = document.getElementById("add-button");
const delButtonElement = document.getElementById("delete-button");
const listElement = document.getElementById("list");
const commentHeaderElement = document.getElementById("comment-header");
const commentTextElement = document.getElementById("comment-text");
const nameInputElement = document.getElementById("name-input");
const commentTxtareaElement = document.getElementById("comment-txtarea");
const mainForm = document.querySelector(".add-form");

// Массив комментариев

const comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22, 12:18",
    text: "Это будет первый комментарий на этой странице",
    counter: "3",
    isLiked: true,
    isEdit: false,
  },
  {
    name: "Варвара Н.",
    date: "13.02.22, 19:22",
    text: "Мне нравится как оформлена эта страница! ❤",
    counter: "75",
    isLiked: true,
    isEdit: false,
  },
];

// Функция очистки полей ввода и блокировки кнопки "Написать"

const delValue = () => {
  nameInputElement.value = "";
  commentTxtareaElement.value = "";
  addButtonElement.classList.add("add-form-button--inactive");
  addButtonElement.disabled = true;
};

// Функция обработчика событий лайков

const initLikeButtonsListeners = () => {
  const likeButtonsElements = document.querySelectorAll(".like-button");

  for (const likeButtonElement of likeButtonsElements) {
    likeButtonElement.addEventListener("click", () => {
      const index = likeButtonElement.dataset.index;

      if (comments[index].isLiked === true) {
        comments[index].isLiked = false;
        comments[index].counter -= 1;
      } else if (comments[index].isLiked === false) {
        comments[index].isLiked = true;
        comments[index].counter += 1;
      }
      renderComments();
    });
  }
};

// Функция редактирования комментариев work in progress

// const initEditButtonsListeners = () => {
//   const editButtonsElements = document.querySelectorAll(".edit-button");

//   for (const editButtonElement of editButtonsElements) {
//     editButtonElement.addEventListener("click", () => {
//       const index = editButtonElement.dataset.index;

//       if (comments[index].isEdit === true) {
//         comments[index].isEdit = false;
//       } else if (comments[index].isEdit === false) {
//         comments[index].isEdit = true;
//       }
//     });
//   }
// };

// Рендер-функция

const renderComments = () => {
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
                : `<div class ="comment-text">${comment.text}
            </div>`
            }
          </div>
          <div class="comment-footer">
            <button data-index="${index}" class="add-form-button edit-button">Редактировать</button>
            <div class="likes">
              <span class="likes-counter">${comment.counter}</span>
              <button data-index="${index}" class="${
        comment.isLiked ? "like-button -active-like" : "like-button"
      }"></button>
            </div>
          </div>
        </li>`;
    })
    .join("");
  listElement.innerHTML = commentsHtml;

  initLikeButtonsListeners();
};

renderComments();

// Работа с датой комментариев

const dateOptions = {
  year: "2-digit",
  month: "numeric",
  day: "numeric",
  timezone: "UTC",
  hour: "numeric",
  minute: "2-digit",
};
const date = new Date().toLocaleString("ru-RU", dateOptions);

// Расширенная валидация

window.addEventListener("input", () => {
  if (nameInputElement.value !== "" && commentTxtareaElement.value !== "") {
    addButtonElement.classList.remove("add-form-button--inactive");
    addButtonElement.disabled = false;
  }
});

// Функция добавления нового комментария

addButtonElement.addEventListener("click", () => {
  comments.push({
    name: nameInputElement.value,
    date: date,
    text: commentTxtareaElement.value,
    counter: 0,
    isLiked: false,
    isEdit: false,
  });

  renderComments();
  delValue();
});

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
