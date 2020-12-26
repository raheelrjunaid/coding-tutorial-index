let preview = document.querySelector('#preview'),
search_query = document.querySelector('#search_query'),
preview_toggle = document.querySelector('#preview-button'),
preview_fields = document.querySelector('#preview_fields')
// Manual Fields
manual_fields_toggle = document.querySelector('#manual-button'),
manual_fields = document.querySelector('#manual_fields'),
manual_fields_id = document.querySelector('input[name="id"]'),
manual_fields_title = document.querySelector('input[name="title"]'),
manual_fields_description = document.querySelector('textarea[name="description"]'),
generate_preview = document.querySelector('#generate_preview')

submit_button = document.querySelector('#submit_button')

generate_preview.addEventListener('click', () => {
  if (search_query.value) {
    fetch(`https://www.googleapis.com/youtube/v3/search?id=7lCDEYXw3mM&key=AIzaSyBiBeW3GjLcONRbJvfWJs_BjHxFzNeINTA&q=${search_query.value}&type=video&maxResults=1&part=snippet`)
    .then(response => response.json())
    .then(data => {
      console.log(data.items[0])
      let video = data.items[0]
      preview.innerHTML = `
      <h2 class="my-1">${video.snippet.title}</h2>
      <p>${video.snippet.description}<p>
      <br>
      <div class="iframe-container" ><iframe src="https://www.youtube.com/embed/${video.id.videoId}"></iframe></div>`;
      manual_fields_title.value = video.snippet.title;
      manual_fields_description.value = video.snippet.description;
      manual_fields_id.value = video.id.videoId;
    })
  } else {
    preview.innerHTML = '<b>Title Field Empty</b>'
  }
})
manual_fields_toggle.addEventListener('click', () => {
  preview.innerHTML = '';
  preview_toggle.classList.add('disabled');
  preview_fields.classList.add('disabled');
  manual_fields.classList.remove('disabled')
  manual_fields_toggle.classList.remove('disabled');
})
preview_toggle.addEventListener('click', () => {
  preview_toggle.classList.remove('disabled');
  preview_fields.classList.remove('disabled');
  manual_fields.classList.add('disabled')
  manual_fields_toggle.classList.add('disabled');
})
submit_button.addEventListener('click', _ => {
  const error = document.querySelector('.error_message');
  let stop_form_submission;
  
  if(manual_fields_id.value === '') {
    error.textContent = 'Video ID is empty';
  }
  else {
    fetch(`tutorials/`)
    .then(response => response.json())
    .then(data => {
      for(i = 0; i <= (data['tutorials'].length - 1); i++) {
        if(manual_fields_id.value === data['tutorials'][i].video_id){
          error.textContent = 'Video already exists';
          stop_form_submission = true;
          break;
        } else {
          stop_form_submission = false;
        }
      }
      if(stop_form_submission == false) {
        return document.querySelector('form').submit();
      }
    })
  }
})