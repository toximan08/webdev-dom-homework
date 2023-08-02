import { date } from "./render.js";
const hostComments =
  "https://wedev-api.sky.pro/api/v2/gladyshko-fedor/comments";
const hostAuth = "https://wedev-api.sky.pro/api/user";

// GET
const getComments = () => {
  return fetch(hostComments, {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
};

// POST

const postComments = ({ text, token }) => {
  return fetch(hostComments, {
    method: "POST",
    body: JSON.stringify({
      text,
      date: date,
      likes: 0,
      isLiked: false,
      isEdit: false,
      isReplied: false,
      // forceError: true,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    switch (response.status) {
      case 500:
        throw new Error("Сервер упал, повторите попытку позже");
      case 400:
        throw new Error("Имя и комментарий должны быть не короче 3 символов");
      case 401:
        throw new Error("Нет авторизации");
      case 201:
        return response.json();
    }
  });
};

// DELETE
const deleteComments = ({ token, id }) => {
  return fetch(hostComments + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
};

const loginUser = ({ login, password }) => {
  return fetch(hostAuth + "/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    switch (response.status) {
      case 400:
        throw new Error("Неверный логин или пароль");
      case 201:
        return response.json();
    }
  });
};
const registerUser = ({ login, name, password }) => {
  return fetch(hostAuth, {
    method: "POST",
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  }).then((response) => {
    switch (response.status) {
      case 400:
        throw new Error("Пользователь с таким логином уже существует");
      case 201:
        return response.json();
    }
  });
};

export { getComments, postComments, deleteComments, loginUser, registerUser };
