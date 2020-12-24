let overlay = document.querySelector(".overlay"),
active_tutorial_container = document.querySelector(".active_tutorial"),
tutorial_title = document.querySelector(".active_tutorial h1"),
tutorial_description = document.querySelector(".active_tutorial #description"),
tutorial_categories = document.querySelector(".active_tutorial #categories"),
tutorial_video = document.querySelector(".active_tutorial iframe"),
// Comments
tutorial_comments = document.querySelector(".active_tutorial #comments"),
tutorial_comments_form = document.querySelector(".active_tutorial #commenting_form"),
// Likes
tutorial_like_counter = document.querySelector('.active_tutorial #like_counter'),
tutorial_like_button = document.querySelector(".active_tutorial .like_button"),
// Dislikes
tutorial_dislike_counter = document.querySelector('.active_tutorial #dislike_counter'),
tutorial_dislike_button = document.querySelector(".active_tutorial .dislike_button");

function showTutorial(tutorial_id, username) {
  fetch(`/tutorials/${tutorial_id}`)
    .then((response) => response.json())
    .then((data) => {
      overlay.style.visibility = "visible";
      active_tutorial_container.style.visibility = "visible";
      tutorial_title.innerHTML = data.title;
      tutorial_description.innerHTML = data.description;
      tutorial_video.src = `https://www.youtube.com/embed/${data.video_id}`;
      tutorial_comments_form.setAttribute("onsubmit", `event.returnValue=false; addComment(${data.tutorial_id}, '${username}');`);
      // Likes
      tutorial_like_button.setAttribute("onclick", `voteTutorial(${data.tutorial_id}, '${username}', 'like')`);
      tutorial_like_counter.textContent = data.likes.length;
      if(data.likes.includes(username)) {
        tutorial_like_button.dataset.liked = true;
        tutorial_like_button.textContent = "Upvoted";
      } else {
        tutorial_like_button.dataset.liked = false;
        tutorial_like_button.textContent = "Upvote";
      }
      // Dislikes
      tutorial_dislike_button.setAttribute("onclick", `voteTutorial(${data.tutorial_id}, '${username}', 'dislike')`);
      tutorial_dislike_counter.textContent = data.dislikes.length;
      if(data.dislikes.includes(username)) {
        tutorial_dislike_button.dataset.disliked = true;
        tutorial_dislike_button.textContent = "Downvoted";
        
      } else {
        tutorial_dislike_button.dataset.disliked = false;
        tutorial_dislike_button.textContent = "Downvote";
      }
      // Categories
      data.categories.forEach((category) => {
        const link = document.createElement("a");
        link.classList.add("category");
        link.innerHTML = category;
        link.href = `/category/${category}`;
        tutorial_categories.appendChild(link);
      });
      // Comments
      data.comments.forEach((comment) => {
        const newComment = document.createElement("div")
        newComment.innerHTML = `<h4>By: ${comment['fields']['author']}</h4>${comment['fields']['content']} <button>Reply</button>`
        if(comment['fields']['replies'] != '') {
          newComment.className = 'origin-comment'
        }
        console.log(comment['fields']['replies'])
        tutorial_comments.appendChild(newComment)
      })
    });
}
function closeTutorial() {
  tutorial_dislike_button.setAttribute("onclick", '');
  overlay.style.visibility = active_tutorial_container.style.visibility = "hidden";
  tutorial_dislike_counter.textContent = tutorial_title.innerHTML = tutorial_description.innerHTML = tutorial_categories.innerHTML = tutorial_video.src = tutorial_like_button.dataset.liked = tutorial_dislike_button.dataset.disliked = tutorial_comments.innerHTML = '';
}
function voteTutorial(tutorial_id, username, action) {
  // Send data to server
  fetch(`/tutorials/${tutorial_id}/${action}`, {
    method: "PUT",
    body: JSON.stringify({
      username: username,
    }),
  })
  // Update the data on the frontend
  // Liking
  if(action == 'like') {
    // Take back like from the tutorial
    if(tutorial_like_button.dataset.liked == "true") {
      tutorial_like_button.dataset.liked = false;
      tutorial_like_button.textContent = "Upvote";
      tutorial_like_counter.textContent = parseInt(tutorial_like_counter.textContent) - 1;
    // Like the tutorial
    } else {
      tutorial_like_button.dataset.liked = true;
      tutorial_like_button.textContent = "Upvoted";
      tutorial_like_counter.textContent = parseInt(tutorial_like_counter.textContent) + 1;
      if(tutorial_dislike_button.dataset.disliked == "true") {
        tutorial_dislike_button.dataset.disliked = false;
        tutorial_dislike_button.textContent = "Downvote";
        tutorial_dislike_counter.textContent = parseInt(tutorial_dislike_counter.textContent) - 1;
      }
    }
  }
  // Disliking
  else if(action == 'dislike') {
    // Take back dislike from the tutorial
    if(tutorial_dislike_button.dataset.disliked == "true") {
      tutorial_dislike_button.dataset.disliked = false;
      tutorial_dislike_button.textContent = "Downvote";
      tutorial_dislike_counter.textContent = parseInt(tutorial_dislike_counter.textContent) - 1;
    // Dislike the tutorial
    } else {
      tutorial_dislike_button.dataset.disliked = true;
      tutorial_dislike_button.textContent = "Downvoted";
      tutorial_dislike_counter.textContent = parseInt(tutorial_dislike_counter.textContent) + 1;
      if(tutorial_like_button.dataset.liked == "true") {
        tutorial_like_button.dataset.liked = false;
        tutorial_like_button.textContent = "Upvote";
        tutorial_like_counter.textContent = parseInt(tutorial_like_counter.textContent) - 1;
      }
    }
  }
}
function addComment(tutorial_id, username) {
  const input_field = document.querySelector(".active_tutorial #commenting_form input[type='text']")
  fetch(`/tutorials/${tutorial_id}/comment`, {
    method: "PUT",
    body: JSON.stringify({
      username: username,
      content: input_field.value
    }),
  })
  if(input_field.value != "") {
    const newComment = document.createElement("div")
    newComment.innerHTML = `<h4>By: ${username}</h4>${input_field.value}`
    input_field.value = ''
    tutorial_comments.appendChild(newComment)
  }
}