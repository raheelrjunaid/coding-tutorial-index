document.addEventListener('DOMContentLoaded', () => {
  // sanity test
  
  let preview = document.querySelector('#preview')
  let title_field = document.querySelector('#title-field')
  let preview_button = document.querySelector('#preview-button')
  let manual_button = document.querySelector('#manual-button')
  preview_button.addEventListener('click', (event) => {
    if (title_field.value) {
      fetch(`https://www.googleapis.com/youtube/v3/search?id=7lCDEYXw3mM&key=AIzaSyBiBeW3GjLcONRbJvfWJs_BjHxFzNeINTA&q=${title_field.value}&type=video&maxResults=1&part=snippet`)
      .then(response => response.json())
      .then(data => {
        console.log(data.items[0])
        let preview_loaded = true
        let video = data.items[0]
        preview.innerHTML = `<h2>Youtube Preview<span style="font-weight: 100;"> (5 second interval)</span></h2><br><h3>${video.snippet.title}</h3><a href="https://www.youtube.com/watch?v=${video.id.videoId}">https://www.youtube.com/watch?v=${video.id.videoId}</a><br><br><div style="width: 400px;"><img src="${video.snippet.thumbnails.high.url}"></div><p>${video.snippet.description}<p>`
      })
    } else {
      console.log('Title Field Empty')
    }
  })
  // category_field = document.querySelector('#category-field')
  // category_field.addEventListener('click', () => {
  //   clearInterval(timer)
  // })
})
