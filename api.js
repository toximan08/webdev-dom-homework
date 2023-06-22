import { getAndRenderComments } from "./render.js";

const host = "https://webdev-hw-api.vercel.app/api/v2/gladyshko-fedor/comments";

// GET

const getComments = (token) => {
  return fetch(host, {
    method: "GET",
    headers: {
      authorization: token,
    },
  }).then((response) => {
    switch (response.status) {
      case 200:
        return response.json();
      case 500:
        throw new Error("Server is broken");
    }
  });
};
// .then((responseData) => {
//   const appComments = responseData.comments.map((comment) => {
//     return {
//       name: comment.author.name,
//       date: new Date(comment.date).toLocaleString("ru-RU", dateOptions),
//       text: comment.text,
//       likes: comment.likes,
//       isLiked: false,
//       isEdit: false,
//       isReplied: false,
//     };
//   });

//   comments = appComments;
//   renderComments(comments);
// });

// POST

function postComment(name, comment, date, token) {
  fetch(host, {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: JSON.stringify({
      name: name,
      text: comment,
      date: date,
      likes: 0,
      isLiked: false,
      // forceError: true,
    }),
  }).then((response) => {
    switch (response.status) {
      case 201:
        response.json().then((message) => console.log(message));
        return getAndRenderComments(token);

      case 400:
        throw new Error("Short value");

      case 401:
        throw new Error("Bad authorization");

      case 500:
        throw new Error("Server is broken");
    }
  });
}

// function responseHandler(response) {
//   switch (response.status) {
//     case 200:
//       return response.json();

//     case 201:
//       response.json().then((message) => console.log(message));
//       return getAndRenderComments();

//     case 400:
//       throw new Error("Short value");

//     case 500:
//       throw new Error("Server is broken");
//   }
// }

export { getComments, postComment };
