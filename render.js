import {
  initEditButtonsListeners,
  initLikeButtonsListeners,
  replyListeners,
} from "./applied-functions.js";
import { quote, listElement } from "./flex-vars.js";

// Рендер-функция

const renderComments = (arr) => {
  const commentsHtml = arr
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
  listElement.innerHTML = commentsHtml;

  initLikeButtonsListeners();
  initEditButtonsListeners();
  replyListeners();
};

export { renderComments };
