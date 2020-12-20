function showPost(tutorial_id) {
  const overlay = document.querySelector('.overlay')
  const active_tutorial = document.querySelector('.active_tutorial')
  fetch(`/tutorials/${tutorial_id}`)
  .then(response => response.json())
  .then(data => {
    console.log(data, overlay)
  })
}