import { loginUser, registerUser } from "../api.js";

export function renderAuthComponent({
  appEl,
  setToken,
  setUser,
  fetchCommentsAndRender,
}) {
  let isLoginMode = true;
  const renderForm = () => {
    const appHtml = `
    <div class="container">
    <h1>Форма ${isLoginMode ? "входа" : "регистрации"}</h1>
    <div class="add-form">
      <input
        id="login-input"
        type="text"
        class="add-form-name"
        placeholder="Введите ваш логин"
      />
      ${
        isLoginMode
          ? ""
          : `<input
        id="name-input"
        type="text"
        class="add-form-text"
        placeholder="Введите ваш имя"
      ></input>`
      }
      <input
        id="password-input"
        type="password"
        class="add-form-text"
        placeholder="Введите ваш пароль"
      ></input>
      <div class="add-form-row">
        <button
          class="add-form-button add-form-button--inactive"
          id="toggle-button"
        >Перейти
          ${isLoginMode ? " к регистрации" : " ко входу"}
        </button>
        <button class="add-form-button" id="login-button">${
          isLoginMode ? "Войти" : "Зарегистрироваться"
        }</button>
      </div>
    </div>
    </div>`;

    appEl.innerHTML = appHtml;

    document.getElementById("login-button").addEventListener("click", () => {
      if (isLoginMode) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        if (!login) {
          alert("Введите логин");
          return;
        }
        if (!password) {
          alert("Введите пароль");
          return;
        }
        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            console.log(user.user);
            setToken(`Bearer ${user.user.token}`);
            setUser("currentUser");
            fetchCommentsAndRender();
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;
        const name = document.getElementById("name-input").value;
        if (!login) {
          alert("Введите логин");
          return;
        }
        if (!password) {
          alert("Введите пароль");
          return;
        }
        if (!name) {
          alert("Введите имя");
          return;
        }
        registerUser({
          login: login,
          name: name,
          password: password,
        })
          .then((user) => {
            setToken(`Bearer ${user.user.token}`);
            setUser("currentUser");
            fetchCommentsAndRender();
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };
  renderForm();
}
