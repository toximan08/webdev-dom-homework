import { validate } from "../applied-functions.js";
import { getAndRenderComments, renderAddForm } from "../render.js";

export function renderAuthComponent({ setToken, setUser }) {
  const container = document.querySelector("body>div.container");
  let isLoginForm = true;
  const renderForm = () => {
    container.innerHTML = `
        <ul class="comments" id="comments">
          <!-- Отрисовывается из массива JS -->
        </ul>
        <div class="auth-form add-form" id="auth-form">
            ${
              isLoginForm
                ? ""
                : `
            <input type="text" class="auth-form-name" placeholder="Введите ваше имя" id="login-name">
            `
            }
            <input type="text" class="auth-form-name" placeholder="Введите ваш логин" id="login-login">
            <input type="password" class="auth-form-name" placeholder="Введите ваш пароль" id="login-password">
            
            <button class="add-form-button" id="button-login">${
              isLoginForm ? "Войти" : "Зарегистрироваться"
            }</button>
            <a class="anchor-buton" href=#>${
              isLoginForm ? "Зарегистрироваться" : "Войти"
            }</a>
            
        </div>
            `;
    document.querySelector(".anchor-buton").addEventListener("click", (e) => {
      e.stopPropagation();
      isLoginForm = !isLoginForm;
      renderForm();
    });

    if (isLoginForm) {
      document.getElementById("button-login").addEventListener("click", () => {
        const loginInput = document.getElementById("login-login");
        const passwordInput = document.getElementById("login-password");

        if (
          validate(loginInput, "Ваш логин") &&
          validate(passwordInput, "Ваш пароль")
        ) {
          const login = loginInput.value;
          const password = passwordInput.value;

          loginUser({ login, password }).then((user) => {
            const newToken = `Bearer ${user.user.token}`;
            localStorage.setItem("currentToken", newToken);
            setToken(newToken);

            const newUser = user.user.name;
            localStorage.setItem("currentUser", newUser);
            setUser(newUser);

            getAndRenderComments(newToken);
            renderAddForm("addForm");
          });
        }
      });
    } else {
      document.getElementById("button-login").addEventListener("click", () => {
        const nameInput = document.getElementById("login-name");
        const loginInput = document.getElementById("login-login");
        const passwordInput = document.getElementById("login-password");
        if (
          validate(nameInput, "Ваше имя") &&
          validate(loginInput, "Ваш логин") &&
          validate(passwordInput, "Ваш пароль")
        ) {
          const name = nameInput.value;
          const login = loginInput.value;
          const password = passwordInput.value;

          registerUser({ login, password, name }).then((user) => {
            console.log(user);
            console.log(user.user.token);
            const newToken = `Bearer ${user.user.token}`;
            setToken(newToken);
            const newUser = user.user.name;
            setUser(newUser);
            getAndRenderComments(newToken);
            renderAddForm("addForm");
          });
        }
      });
    }
  };
  renderForm();
}

function loginUser({ login, password }) {
  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",

    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      switch (response.status) {
        case 201:
          return response.json();
        case 400:
          throw new Error("Неверный логин или пароль");
        case 500:
          throw new Error("Server is broken");
      }
    })
    .catch((error) => alert(error.message));
}

function registerUser({ login, password, name }) {
  return fetch("https://webdev-hw-api.vercel.app/api/user", {
    method: "POST",

    body: JSON.stringify({
      login,
      password,
      name,
    }),
  })
    .then((response) => {
      switch (response.status) {
        case 201:
          return response.json();
        case 400:
          throw new Error("Пользователь с таким логином уже существует");
        case 500:
          throw new Error("Server is broken");
      }
      return response.json();
    })
    .catch((error) => alert(error.message));
}
