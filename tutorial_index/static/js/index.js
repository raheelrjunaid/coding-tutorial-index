const overlay = document.querySelector('.overlay');
const active_tutorial_container = document.querySelector('.active_tutorial');
const tutorial_title = document.querySelector('.active_tutorial h1');
const tutorial_description = document.querySelector('.active_tutorial p');
const tutorial_categories = document.querySelector('.active_tutorial #categories');
const tutorial_video = document.querySelector('.active_tutorial iframe');

function showTutorial(tutorial_id='None') {
  if(tutorial_id != 'None') {
    fetch(`/tutorials/${tutorial_id}`)
    .then(response => response.json())
    .then(data => {
      overlay.style.visibility = 'visible';
      active_tutorial_container.style.visibility = 'visible';
      tutorial_title.innerHTML = data.title;
      tutorial_description.innerHTML = data.description;
      tutorial_video.src = `https://www.youtube.com/embed/${data.video_id}`
      data.categories.forEach(category => {
        const link = document.createElement('a');
        link.classList.add('category');
        link.innerHTML = category;
        link.href = `/category/${category}`
        tutorial_categories.appendChild(link)
      })
    })
  } else {
    overlay.style.visibility = 'hidden';
    active_tutorial_container.style.visibility = "hidden";
    tutorial_title.innerHTML = '';
    tutorial_description.innerHTML = '';
    tutorial_categories.innerHTML = '';
    tutorial_video.src = '';
  }
}