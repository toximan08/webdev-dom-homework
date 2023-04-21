let quote = "";
const listElement = document.getElementById("list");
const addFormElement = document.querySelector(".add-form");
const container = document.querySelector(".container");
const nameInputElement = document.getElementById("name-input");
const commentTxtareaElement = document.getElementById("comment-txtarea");
const addingComment = document.createElement("p");
const addButtonElement = document.getElementById("add-button");

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

export {
  quote,
  date,
  listElement,
  dateOptions,
  addFormElement,
  container,
  nameInputElement,
  commentTxtareaElement,
  addingComment,
  addButtonElement,
};
