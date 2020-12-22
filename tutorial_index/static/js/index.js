const overlay = document.querySelector(".overlay");
const active_tutorial_container = document.querySelector(".active_tutorial");
const tutorial_title = document.querySelector(".active_tutorial h1");
const tutorial_description = document.querySelector(".active_tutorial #description");
const tutorial_categories = document.querySelector(".active_tutorial #categories");
const tutorial_video = document.querySelector(".active_tutorial iframe");
// Likes
const tutorial_like_counter = document.querySelector('.active_tutorial #like_counter');
const tutorial_like_button = document.querySelector(".active_tutorial .like_button");
// Dislikes
const tutorial_dislike_counter = document.querySelector('.active_tutorial #dislike_counter');
const tutorial_dislike_button = document.querySelector(".active_tutorial .dislike_button");

function showTutorial(tutorial_id, username) {
  fetch(`/tutorials/${tutorial_id}`)
    .then((response) => response.json())
    .then((data) => {
      overlay.style.visibility = "visible";
      active_tutorial_container.style.visibility = "visible";
      tutorial_title.innerHTML = data.title;
      tutorial_description.innerHTML = data.description;
      tutorial_video.src = `https://www.youtube.com/embed/${data.video_id}`;
      // Likes
      tutorial_like_button.setAttribute("onclick", `updateTutorial(${data.tutorial_id}, '${username}', 'like')`);
      tutorial_like_counter.textContent = data.likes.length;
      if(data.likes.includes(username)) {
        tutorial_like_button.dataset.liked = true;
        tutorial_like_button.textContent = "Upvoted";
      } else {
        tutorial_like_button.dataset.liked = false;
        tutorial_like_button.textContent = "Upvote";
      }
      // Dislikes
      tutorial_dislike_button.setAttribute("onclick", `updateTutorial(${data.tutorial_id}, '${username}', 'dislike')`);
      tutorial_dislike_counter.textContent = data.dislikes.length;
      if(data.dislikes.includes(username)) {
        tutorial_dislike_button.dataset.disliked = true;
        tutorial_dislike_button.textContent = "Downvoted";
        
      } else {
        tutorial_dislike_button.dataset.disliked = false;
        tutorial_dislike_button.textContent = "Downvote";
      }
      data.categories.forEach((category) => {
        const link = document.createElement("a");
        link.classList.add("category");
        link.innerHTML = category;
        link.href = `/category/${category}`;
        tutorial_categories.appendChild(link);
      });
    });
}
function closeTutorial() {
  tutorial_dislike_button.setAttribute("onclick", '');
  overlay.style.visibility = active_tutorial_container.style.visibility = "hidden";
  tutorial_dislike_counter.textContent = tutorial_title.innerHTML = tutorial_description.innerHTML = tutorial_categories.innerHTML = tutorial_video.src = tutorial_like_button.dataset.liked = tutorial_dislike_button.dataset.disliked = '';
}
function updateTutorial(tutorial_id, username, action) {
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
  if(action == 'dislike') {
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