import {
  renderComments,
  getAndRenderComments,
  renderAddForm,
} from "./render.js";

let token = localStorage.getItem("currentToken");
console.log(token);
// renderComments(1); //Заглушка на комментариях

getAndRenderComments(token); // Получаем с сервера и отрисовываем
