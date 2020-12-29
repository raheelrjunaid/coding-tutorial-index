# Raheel's (Coding) Tutorial Index

This app is a collection or "index" of recommended YouTube videos from the developer community. It uses Google's YouTube API to search and return existing videos and store them in SQlite database.

## Table of Contents

- [Front-End](#front-end)
  * [HTML](#html)
  * [CSS](#css)
  * [SCSS](#scss)
  * [Summary](#summary)
- [Back-End](#back-end)
  * [Authentication](#authentication)
  * [Tutorial Posting](#tutorial-posting)
  * [Models](#models)
- [Javascript](#javascript)
  * [Tutorial Preview](#tutorial-preview)
  * [Closing tutorial Preview](#closing-tutorial-preview)
  * [Deleting Tutorials](#deleting-tutorials)
  * [Voting](#voting)
  * [Commenting](#commenting)
  * [Replying](#replying)
  * [Deleting Comments and Replies](#deleting-comments-and-replies)
  * [Tutorial Posting](#tutorial-posting-1)
- [Justification](#justification)

## Front-End

Let's start with the frontend so we may then explore the core functionality on the client-side and the server-side.

### HTML

I wanted to use semantic HTML to separate elements on the page and make it accessible as possible to screen readers without using `aria-label`. I did this using the following tags:

- `<header>` to represent the mostly static element throughout pages (the category carousel)
- `<main>` to represent the primary content
- `<footer>` to make sure the page has an end-point
- `<article>` to separate tutorials from each other
- `<a>` and `<button>` interchangeably to show visual hierarchy (even if needed extra Javascript)
- `<div>` and `<span>` to serve the distinction of text-based content and display types (`block` and `inline`)
- `<details>` and `<summary>` to have a quick dropdown without Javascript

I utilized combo-classes (primarily visible on all buttons) to assign different properties to similar elements. One aspect I could've improved on was the naming of id's and classes as I commonly went with snake_case instead of kebab-case.

> snake_case is used for JS variables as JS doesn't support hyphens.

I used a double-template-inheritance structure for my category page, as only a few elements needed to change, all placed within the header. The index template extends the primary layout, and the category template extends the index template.

**Icons**: You may have spotted the `<i>` tags throughout the templates. These hold icons from Font Awesome that can be customized using font and text CSS properties. These also utilize the combo-classes that are provided with FA's CDN.

### CSS

I didn't use pure CSS, I used...

### SCSS

I used the `Django-sass` pip module to watch my SCSS files concurrently. I utilized a lot of SCSS's (not to be confused with Sass) features such as:

- `@extend` for adding similar properties to multiple existing elements
- `@mixin/@include` for adding similar properties to multiple elements
- `$variables` for reusing properties in
  - media queries
  - sizes
  - colors
- Selector nesting
- `@import` for importing different aspects of the application (such as \_nav, \_utilites, \_variables, etc.)
- Collapsed CSS compile which I hear provides better performance (see main.css)

An important part was the `@import` statements that allowed me to divide my workflow and make it more "semantic" per se. I tried to make my SCSS code as simple as possible by using short-hands such as `flex`.

### Summary

The Frontend code is distinct from many aspects of the First CS50 Project as it

- used semantic HTML
- utilized various combo classes
- optimized the site for a minor-performance boost
- made the site more accessible to people with vision disabilities using appropriate contrast-standards **(AA and AAA)**
- utilized the SCSS pre-processor to create simpler and optimized styling

## Back-End

I of course I used the `"include"` statement in my `urlpatterns` to separate my project URLs from my app URLs.

### Authentication

The whole theme of the app was to make the users who post tutorials **anonymise**. This is because the tutorials, or rather the quality of the tutorials should not be associated with specific users (or at least not visibly). This allows for a **decentralized** community in which tutorials are adequately rewarded with views as the number of likes rises. This doesn't mean that users weren't excluded entirely as this would mean that the app wouldn't know if someone was the owner of the tutorial, making them unable to **delete** it if such a time came.

I didn't go further than making the AbstractUser the default user as the model came with everything I needed (which was just a username, email, and password). What I did need to add was a `natural_key` attribute as the JSON representation of a `User` foreign-key was unhelpful, so I made it display the corresponding `username` attribute. I could have used the `__str__` function, but I never tested if that worked. Registering and logging in the user was easy as I utilized the `.create_user` function (this allows the password to become serialized). Logging in the user with server-side validation was also quite simple as we had done it in previous projects.

I made sure to enforce the `@login_required` decorator on the `logout_view` as this would redirect to the `login_view` if the user wasn't logged in.

### Tutorial Posting

This site isn't a site to post videos, it's a site to vote and organize existing videos. This means that posting the tutorials had to be as seamless as possible. I decided to choose YouTube as my video provider as most of the tutorials are on the platform, and I could use Google's YouTube Search API. Users could fill in the information manually such as the Title, Description, and Video ID (most important), but using the API made everything much quicker. I used Javascript to show and hide the corresponding options (Manual and Automatic)

**API**: I first registered my Google Developer account and got my API key. I then learned about converting video results into usable snippets for use. I didn't always use the snippets as the snippets didn't include the video ID, so I just requested some regular results.

I was going to have an interval timer, but I didn't want to peak my 100 request quota from Google, so I just made a "Generate Preview" button for getting search results. The request searched up the video and returned the first result (there was only ever one result). The reason I did this was that I didn't want people going onto YouTube and having to copy and paste the title of the videos as this would quickly become impractical and would defeat the purpose. The API would then generate results using the `.innerHTML` DOM attribute, allowing the user to see if they need to make a better search query. This would also automatically fill up the manual entries on a separate tab, allowing for all of the form data to be submitted.

The optional field was the category field which consisted of:

- A choose an existing category from a multi-select dropdown
- A create your category field (this is similar to YouTube's tagging structure)

This was originally mandatory but I decided that enforcement of such an aspect shouldn't be present. There is some more server-side validation along with conditionals for the categories. The create-your-own-categories functionality utilizes Python's `split(", ")` function. The user is then redirected to the index page where their tutorial is put at the bottom of the list. This is because the tutorials are ordered with the highest number of likes.

> **NOTE**: Some model fields are allowed to be null. This isn't true as it was a temporary requirement for making applicable migrations and such fields wouldn't be left null.

### Models

Of course, there was the tutorial model which included

- The title and description
- The video ID
- The categories associated with the tutorial (I purposely made this a ManytoMany field so the categories exist after tutorial deletion)
- The likes (upvotes) and dislikes (downvotes) from specific users
- The user who "created" the tutorial

The category model was just the name of the category.

The comment model was a bit more complex, including:

- Comment author
- The comment itself (the content)
- The replies received on that comment
- If the comment was a reply
  - This was useful to remove duplicates when returning a tutorial JSON-Response
- Which tutorial it was commented on

The reply functionality was tricky as I wanted to make the JSON data readable and simple when one requested it. I used some nested objects for easy access to particular comments' replies and included all of the same fields. Maybe this was a good introduction to Data Structures?

## Javascript

I used vanilla Javascript instead of a library or framework to test my abilities, and learn a bit about variable scope and hoisting.

### Tutorial Preview

This section is primarily focused on how the user interacts with the tutorials when they're being previewed. I cover:

- Tutorial preview
- Exiting tutorial preview
- Deleting tutorials
- Upvoting and downvoting tutorials
- Commenting
- Replying
- Deleting comments and replies

My `index.js` file first begins with declaring and assigning my variables. I used `let` as it didn't pose any issues on variable reassignment. The tutorial is showed using the `showTutorial()` function which accepts the username of the currently logged in user, and the ID of the tutorial. This ID is used to request the `get_tutorials` API to get all information about the tutorial. This is displayed using a predefined template nested inside of the `.active-tutorial` element. The common property used to fill information is the `.innerHTML` property.

Some elements needed direct modification, so I used the DOM. Although I ran into the issue where `onclick` and `onsubmit` attributes wouldn't be reassigned, so I used the `setAttribute` function. I added and removed classes on my upvote and downvote buttons to correctly serve the current user's preference. They can either upvote or downvote, but not both. If the user is not signed in, they will not be able to vote, although the current votes are still visible.

To tell if the user has voted up or down, I use the `.includes()` function of the `Array` object (similar to `if item in list` from Python). I iterated through all of the comments using the `forEach()` function and iterated through all of the replies using a for loop.

> I don't remember why I didn't just use the same `.forEach()` function for reply iteration

### Closing tutorial Preview

I cleared all of the preview data so no one could go inside their browser's Dev Tools and see the remaining data. Don't ask me why I did this, I'm still trying to figure it out. Instead of removing the overlay completely from the DOM, I set it's visibility to hidden which conveniently disabled `pointer-events`.

### Deleting Tutorials

I sent an empty put request to the `update_tutorial` view which initiated a deletion if the owner of the tutorial was the one initiating the request. The `update_tutorial` view can

- Upvote
- Downvote
- Comment
- Reply
- Delete a Tutorial
- Delete a comment

All using conditionals, which I found was simpler than making a separate view for each purpose. It executed the action based on the `action` argument provided. To show the user the tutorial had been deleted, I used the `.remove()` function to remove the element from the DOM entirely (I originally had it go to `display: none;`). I then ran the `closeTutorial()` function mentioned above.

### Voting

I again sent an empty put request to the `update_tutorial` view, this time setting the action argument to `like` or `dislike`. The view would then see if the user who initiated the request had already liked or disliked the tutorial. If so, it would then unlike or un-dislike, and vice-versa if the user hadn't liked or disliked. The view also automatically removes the user from the list of the opposing vote to prevent someone from liking and disliking at the same time.

On the Javascript end, I used the `vote_tutorial` function to add and remove the corresponding classes (with similar functionality to the paragraph above).

### Commenting

Commenting is done with a small form at the bottom of the tutorial preview. The data from the input is sent to the `update_tutorial` view using a put request and the "comment" argument. The put request only contained the content of the comment. To identify the comment posted on the client-side for future deletion, I needed to obtain the primary key of that comment, so I made sure that the `update_tutorial` view returned the same JSON response as the `get_tutorials` view (they use the same function). This way, I could obtain the necessary data to find the latest comment by targeting the last comment returned in the "comments" array (since they're arranged in chronological order).

In the `addComment()` function I collected and displayed the promise response. I needed to find the latest comment made which would be at the end of the `comments` array. By default, the index of -1 doesn't exist on Javascript arrays as it does with Python, so a workaround was to subtract 1 from the total length of the array and then use that as the index. I could then tie the ID of that comment to the `deleteObject()` function as that was one of the optional parameters.

### Replying

You may say, "Raheel, isn't replying the same as commenting except appending a different class name to distinguish between the two on the client-side?" I wish it were that easy. I created a whole different function for replying as it had quite a few distinctions. Using the `reply()` function, I needed to specify what comment the reply was replying to (passed in as an id through the parameter). I then sent the reply content and the comment id that it was replying to in a put request to `update_tutorial`. Now the reply was officially made on the server-side and the user would need to refresh the page to see it.

To show the reply on the client-side under the right comment, I needed a couple of things:

- The index of the comment relative to the `.comments` element
- The comment id (which I already have)

To find the comment index, I first needed to convert the `.comments` selector into an array using the `Array.from()` function. I needed to target the parent node of the comment, but that was unnecessary as I already had access to the `.comments` querySelector. I already knew the comment I was trying to target as I included the comment-id in a dataset attribute. This means I could find the index of that item in the array using the `indexOf()` function, and pass in the comment as an argument.

Now that I found the index, I was able to find the ID of the corresponding reply from the fetch request using the `commentIndex` variable. Phew.

I reused the same function for showing the reply form, posting a comment, and removing the reply form subsequently (this is based on if the form is in the Document already).

### Deleting Comments and Replies

I reused the `deleteObject` function (because comments are objects) to delete the comments and replies. I did this by passing in a comment ID as an argument. Comments and replies **aren't** distinct in the DOM except for their classes, which means I don't have to create separate functions for both. The function deletes the object as you would expect by sending over the comment ID to be deleted and then removing the comment/reply from the DOM.

### Tutorial Posting

I have client-side validation using the `get_tutorials()` API to ensure that:

- There aren't any duplicate tutorials (by comparing the entered video ID to all existing video ID's)
- There aren't any non-existent videos (meaning no video ID was provided from the user)

Everything else was just the generation of the HTML video preview from YouTube.

## Justification

This project is much more complex than any other of the project combined for the following reasons:
- The HTML and CSS(SCSS) implement modern, responsive design techniques with a simple, accessible, and scalable User Interface
- Git was further explored using multiple development branches such as `master`, `feature`, `design` and `hotfix`. 
  - Git's **stashing** functionality was used from meaningful commits
  - A proper `.gitignore` file was included to exclude migrations and extra unnecessary cached files
- Some extra python functions were used such as `split()`
  - I utilized list comprehensions in my returning of JSON data
- I explored further spectrums of Django's handling of POST data, especially how it handles it without Django Forms
  - I explored `natural_key`'s and how to best present data in the Admin app
  - I also leveraged Django's `.values()` function to make sure the Query Sets were JSON serializable
- I explored the differences between ManytoMany relationships and Foreign Keys and their relation to cascading deletion
- Javascript was used for multiple number operations on existing DOM data
  - It was used for interactive manipulation of the DOM and quick access to the creation of comments and tutorials
  - I explored different callbacks for promises and how them not returning a value quick enough can hinder your desired JSON response
  - I reused functions for stability and simplicity using conditionals
- I optimized the User Interface for mobile devices, giving the feel of a Progressive Web App. I port forwarded my URL to my phone to test the website on an actual device.
  - I conducted cross-browser testing using different editions of Firefox and different builds of Safari (my default was Google Chrome and Microsoft Edge)