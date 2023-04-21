import { renderComments } from "./render.js";
import {
  date,
  dateOptions,
  addFormElement,
  container,
  nameInputElement,
  commentTxtareaElement,
  addingComment,
} from "./flex-vars.js";
import { protectInput, handlePostClick } from "./applied-functions.js";
let comments = [];

// GET

const getComments = () => {
  return fetch(
    "https://webdev-hw-api.vercel.app/api/v1/gladyshko-fedor/comments",
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
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
      renderComments(comments);
    });
};

// POST

const postComments = () => {
  fetch("https://webdev-hw-api.vercel.app/api/v1/gladyshko-fedor/comments", {
    method: "POST",
    body: JSON.stringify({
      name: protectInput(nameInputElement.value),
      text: protectInput(commentTxtareaElement.value),
      date: date,
      likes: 0,
      isLiked: false,
      isEdit: false,
      isReplied: false,
      // forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 500) {
        throw new Error("Сервер упал, повторите попытку позже");
        // return Promise.reject("Сервер упал.");
      } else if (response.status === 400) {
        throw new Error("Имя и комментарий должны быть не короче 3 символов");
      }
    })
    .then((responseData) => {
      comments = responseData;
      return getComments();
    })
    .then((data) => {
      addFormElement.style.display = "flex";
      container.removeChild(addingComment);
    })
    .catch((error) => {
      addFormElement.style.display = "flex";
      container.removeChild(addingComment);
      if (error.message === "Сервер упал, повторите попытку позже") {
        handlePostClick();
      } else {
        alert("Похоже у Вас пропал интернет, проверьте подключение");
      }
    });

  renderComments(comments);
};

export { getComments, postComments, comments };
