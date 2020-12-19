document.addEventListener('DOMContentLoaded', () => {
  // sanity test
  
  const preview = document.querySelector('#preview')
  const title_field = document.querySelector('#title-field')
  const preview_button = document.querySelector('#preview-button')
  
  const manual_fields_toggle = document.querySelector('#manual-button')
  const manual_fields_container = document.querySelector('#manual-fields')
  const manual_fields_description = document.querySelector('#manual-fields input[name="description"]')
  const manual_fields_url = document.querySelector('#manual-fields input[name="url"]')

  preview_button.addEventListener('click', () => {
    if (title_field.value) {
      fetch(`https://www.googleapis.com/youtube/v3/search?id=7lCDEYXw3mM&key=AIzaSyBiBeW3GjLcONRbJvfWJs_BjHxFzNeINTA&q=${title_field.value}&type=video&maxResults=1&part=snippet`)
      .then(response => response.json())
      .then(data => {
        console.log(data.items[0])
        let video = data.items[0]
        preview.innerHTML = `
        <h2>Youtube Preview</h2>
        <br>
        <h3>${video.snippet.title}</h3>
        <a href="video.snippet.description">https://www.youtube.com/watch?v=${video.id.videoId}
        </a>
        <br><br>
        <iframe width="500" height="281.25"
        src="https://www.youtube.com/embed/${video.id.videoId}">
        </iframe>
        <p>${video.snippet.description}<p>`;
        manual_fields_container.style.visibility = 'hidden'
        title_field.value = video.snippet.title
        manual_fields_description.value = video.snippet.description
        manual_fields_url.value = `https://www.youtube.com/watch?v=${video.id.videoId}`
      })
    } else {
      preview.innerHTML = '<b>Title Field Empty</b>'
    }
  })
  manual_fields_toggle.addEventListener('click', () => {
    manual_fields_container.style.visibility = 'visible'
    preview.innerHTML = ''
    manual_fields_description.value = ''
    manual_fields_url.value = ''
  })
})