document.addEventListener('DOMContentLoaded', () => {
  // sanity test
  
  let preview = document.querySelector('#preview')
  let title_field = document.querySelector('#title-field')
  let preview_button = document.querySelector('#preview-button')
  let manual_button = document.querySelector('#manual-button')
  preview_button.addEventListener('click', () => {
    if (title_field.value) {
      fetch(`https://www.googleapis.com/youtube/v3/search?id=7lCDEYXw3mM&key=AIzaSyBiBeW3GjLcONRbJvfWJs_BjHxFzNeINTA&q=${title_field.value}&type=video&maxResults=1&part=snippet`)
      .then(response => response.json())
      .then(data => {
        console.log(data.items[0])
        let video = data.items[0]
        // console.log(video.snippet.tags)
        preview.innerHTML = `
        <h2>Youtube Preview</h2>
        <br>
        <h3>${video.snippet.title}</h3>
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}">https://www.youtube.com/watch?v=${video.id.videoId}
        </a>
        <br><br>
        <iframe width="500" height="281.25"
        src="https://www.youtube.com/embed/${video.id.videoId}">
        </iframe>
        <p>${video.snippet.description}<p>`;

        document.querySelector('#manual-fields').style.display = 'none'
      })
    } else {
      preview.innerHTML = '<b>Title Field Empty</b>'
    }
  })
  manual_button.addEventListener('click', () => {
    document.querySelector('#manual-fields').style.display = 'block'
    preview.innerHTML = ''
  })
})
