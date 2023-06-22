import { safeInput, validate, delay, getDate } from "./applied-functions.js";
import { getComments, postComment } from "./api.js";
import { renderAuthComponent } from "./components/auth-component.js";

let token = null;
let currentUser = null;
let comments = [];

function getAndRenderComments(token) {
  getComments(token)
    .then((responseData) => {
      comments = responseData.comments;
      console.log(comments);
      renderComments(0, token);
      // comments = responseData.comments;
      // const userName = user;
      // console.log(userName);
      // renderApp(comments, token, userName);
    })
    .catch((error) => {
      console.warn(error);
      switch (error.message) {
        case "Server is broken":
          alert("Сервер сломался, попробуй позже");
          break;

        case "Failed to fetch":
          alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
}

// Рендер-функция

function renderComments(isFirstOpen = 0, token) {
  const commentsList = document.createElement("ul.comments");
  if (isFirstOpen) {
    commentsList.innerHTML = `
    <li class="comment" style="display: flex;">
    Комментарии загружаются...
    </li>`;
  } else {
    commentsList.innerHTML = comments.reduce((result, comment, index) => {
      return (
        result +
        `
    <li class="comment" data-id="${comment.id}" data-index="${index}">
    <div class="comment-header">
    <div>${comment.author.name}
    </div>
    <div>${getDate(comment.date)}
    </div>
    </div>
    <div class="comment-body">
    <div class="comment-text">   
        ${makeQuote(comment.text)}            
    </div>
    </div>
    <div class="comment-footer">
    <button class="delete-button">Удалить</button>
    <div class="likes">
        <span class="likes-counter">${comment.likes}</span>
        <button class="${
          comment.isLiked ? "like-button -active-like" : "like-button"
        }"></button>
    </div>
    </div>
    </li>`
      );
    }, "");

    addCommentListener(token);
  }
}

function addCommentListener(token) {
  const currentComments = document.querySelectorAll("li.comment");

  for (const comment of currentComments) {
    comment.addEventListener("click", (e) => {
      const index = comment.dataset.index;
      const currentToken = token;
      const likeButton = e.currentTarget.querySelector("button.like-button");
      const deleteButton = e.currentTarget.querySelector(".delete-button");

      if (e.target === likeButton) {
        like(index, currentToken);
        return;
      }
      if (e.target === deleteButton) {
        deleteComment(index, currentToken);
        return;
      }

      replyComment(index);
    });
  }
}

function replyComment(index) {
  const inputComment = document.querySelector(".add-form-text");
  inputComment.value =
    "⟪" + comments[index].text + "\n" + comments[index].author.name + "⟫";
  renderComments();
}

function makeQuote(str) {
  return str
    .replaceAll("⟪", '<blockquote class="blockquote">')
    .replaceAll("⟫", "</blockquote>");
}

function deleteComment(index, currentToken) {
  fetch(
    "https://webdev-hw-api.vercel.app/api/v2/gladyshko-fedor/comments" +
      comments[index].id,
    {
      method: "DELETE",
      headers: {
        authorization: currentToken,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        comments.splice(index, 1);
        renderComments(0, currentToken);
        // return response.json();
      }
    })
    .catch((error) => {
      console.warn(error);
      if ((error.message = "Failed to fetch")) {
        alert("Нет соединения с интернетом");
      }
    });
}

function like(index, currentToken) {
  const currentLikeButton = document.querySelectorAll(".like-button")[index];
  const commentId = comments[index].id;
  currentLikeButton.classList.add("loading-like");
  fetch(
    "https://webdev-hw-api.vercel.app/api/v2/gladyshko-fedor/comments" +
      commentId +
      "/toggle-like",
    {
      method: "POST",
      headers: {
        authorization: currentToken,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        if (comments[index].isLiked) {
          comments[index].isLiked = false;
          comments[index].likes -= 1;
        } else {
          comments[index].isLiked = true;
          comments[index].likes += 1;
        }
        renderComments(0, currentToken);
        // getAndRenderComments(currentToken);
      }
    })
    .catch((error) => {
      console.warn(error);
      if ((error.message = "Failed to fetch")) {
        alert("Нет соединения с интернетом");
      }
    });
}

function renderAddForm(form = "addForm") {
  const addFormElement = document.querySelector(".add-form");
  if (!token) {
    form = "auth";
  } else {
    form = "addForm";
  }

  switch (form) {
    case "loading":
      addFormElement.innerHTML = ` 
    <div style="display: flex;">Комментарий загружается...</div>
    `;
      break;
    case "addForm":
      addFormElement.innerHTML = `    
    <div class="user-container">
    <input type="text" class="add-form-name" placeholder="Введите Ваше имя" id="input-name" style="display: inline-block" />
    <a href=# class="logout-button">Выйти</a>
    </div>
    <textarea type="textarea" class="add-form-text" placeholder="Введите Ваш комментарий" rows="4"
    id="input-comment"></textarea>
    <div class="add-form-row">
        <button class="add-form-button" id="button-add-comment">Написать</button>
    </div>`;

      if (localStorage.getItem("currentUser")) {
        token = localStorage.getItem("currentToken");
        const nameInput = document.getElementById("input-name");
        nameInput.disabled = true;
        nameInput.value = localStorage.getItem("currentUser");
      } else {
        renderAddForm("auth");
        return;
      }

      initAddFormListeners();
      break;

    case "auth":
      addFormElement.classList.remove("add-form");
      addFormElement.innerHTML = `
        <p class="auth">Чтобы добавить комментарий <a href="#">авторизуйтесь</a></p>
        `;
      document.querySelector(".auth>a").addEventListener("click", () => {
        renderAuthComponent({
          setToken: (newToken) => {
            token = localStorage.getItem("currentToken");
          },
          setUser: (newUser) => {
            currentUser = localStorage.getItem("currentUser");
          },
        });
      });
      break;
  }
}

function initAddFormListeners() {
  const buttonAddComment = document.getElementById("button-add-comment");
  const logout = document.querySelector(".logout-button");
  const addForm = document.querySelector(".add-form");
  addForm.addEventListener("click", (event) => {
    if (event.target === buttonAddComment) {
      addComment();
      return;
    }
    if (event.target === logout) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentToken");
      renderAddForm("auth");
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.code == "Enter") addComment();
  });
}

function addComment() {
  const inputName = document.querySelector("input.add-form-name");
  const inputComment = document.querySelector(".add-form-text");
  const currentDate = new Date();
  const name = inputName.value;
  const comment = inputComment.value;

  // Валидация
  if (
    validate(inputName, "ваше имя") &&
    validate(inputComment, "ваш комментарий")
  ) {
    // Заглушка на время отправки коммента на сервер
    renderAddForm("loading");

    postComment(safeInput(name), safeInput(comment), currentDate, token)
      .then(() => {
        inputComment.value = "";
      })

      .then(() => {
        renderAddForm("addForm");
      })
      .catch((error) => {
        console.warn(error);
        switch (error.message) {
          case "Bad authorization":
            renderAuthComponent({
              setToken: (newToken) => {
                token = newToken;
              },
              setUser: (newUser) => {
                currentUser = newUser;
              },
            });
            break;

          case "Short value":
            alert(
              "Что-то пошло не так:\n" +
                "Имя или текст не должны быть короче 3 символов\n"
            );
            renderAddForm("addForm");
            document.querySelector("input.add-form-name").value = name;
            document.querySelector(".add-form-text").value = comment;
            break;

          case "Server is broken":
            postComment(safeInput(name), safeInput(comment), currentDate);
            break;

          case "Failed to fetch":
            alert("Кажется, у вас сломался интернет, попробуйте позже");
            renderAddForm("addForm");
            document.querySelector("input.add-form-name").value = name;
            document.querySelector(".add-form-text").value = comment;
            break;
        }
      });
  }
}

export { renderComments, getAndRenderComments, renderAddForm };
