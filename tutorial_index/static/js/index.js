const overlay = document.querySelector(".overlay");
const active_tutorial_container = document.querySelector(".active_tutorial");
const tutorial_title = document.querySelector(".active_tutorial h1");
const tutorial_description = document.querySelector(".active_tutorial #description");
const tutorial_categories = document.querySelector(".active_tutorial #categories");
const tutorial_video = document.querySelector(".active_tutorial iframe");
// const tutorial_likes = document.querySelector('.active_tutorial caption');
const tutorial_like_button = document.querySelector(".active_tutorial .like_button");
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
      tutorial_like_button.setAttribute("onclick", `updateTutorial(${data.tutorial_id}, '${username}', 'like')`);
      tutorial_dislike_button.setAttribute("onclick", `updateTutorial(${data.tutorial_id}, '${username}', 'dislike')`);
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
  overlay.style.visibility = "hidden";
  active_tutorial_container.style.visibility = "hidden";
  tutorial_title.innerHTML = "";
  tutorial_description.innerHTML = "";
  tutorial_categories.innerHTML = "";
  tutorial_video.src = "";
}
function updateTutorial(tutorial_id, username, action) {
  fetch(`/tutorials/${tutorial_id}/${action}`, {
    method: "PUT",
    body: JSON.stringify({
      username: username,
    }),
  })
}