const overlay = document.querySelector('.overlay')
const active_tutorial_container = document.querySelector('.active_tutorial')


function showPost(tutorial_id) {
  if(overlay.style.visibility = 'hidden') {
    fetch(`/tutorials/${tutorial_id}`)
    .then(response => response.json())
    .then(data => {
      overlay.style.visibility = 'visible'
    })
  }
}