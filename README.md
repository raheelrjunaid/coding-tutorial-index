# Raheel's (Coding) Tutorial Index
This app is a collection or "index" of recommended YouTube videos from the developer community. It uses Google's YouTube API to search and return existing videos and store them in SQlite database.

## Table of Contents
- [Raheel's (Coding) Tutorial Index](#raheel-s--coding--tutorial-index)
  * [Frontend](#frontend)
    + [HTML](#html)
    + [CSS](#css)
    + [SCSS](#scss)
    + [Summary](#summary)

## Front-End
Let's start with the frontend so we may then explore the core functionality on the client-side and the server-side.

### HTML
I wanted to use semantic HTML to clearly seperate elements on the page and make it accessible as possible to screen readers without using `aria-label`. I did this using the following tags:
- `<header>` to represent the mostly static element throughout pages (the category carousel)
- `<main>` to represent the primary content
- `<footer>` to make sure the page has an end-point
- `<article>` to seperate tutorials from each other
- `<a>` and `<button>` interchangeably to show visual heiarchy (even if needed extra Javascript)
- `<div>` and `<span>` to serve the distinction of text-based content and display types (`block` and `inline`)
- `<details>` and `<summary>` to have a quick dropdown without Javascript

I utilized combo-classes (primarily visible on all buttons) to assign different properties to similar elements. One aspect I could've improved on were the naming of id's and classes as I commonly went with snake_case instead of kebab-case.

> snake_case is used for JS variables as JS doesn't support hyphens.

I used a double-template-inheritance structure for my category page, as only a few elements needed to change, all placed withing the header. The index template extends the primary layout, and the category template extends the index template.

**Icons**: You may have spotted the `<i>` tags throughout the templates. These hold icons from Font Awesome that can be customized using font and text CSS properties. These also utilize the combo-classes that are provided with FA's CDN.

### CSS
I didn't use pure CSS, I actually used...

### SCSS
I utilized a lot of SCSS's (not to be confused with Sass) features such as:
- `@extend` for adding similar properties to multiple existing elements
- `@mixin/@include` for adding similar properties to multiple elements
- `$variables` for reusing properties in
  * media queries
  * sizes properties
  * colors
- Selector nesting
- `@import` for importing different aspects of the application (such as _nav, _utilites, _variables, etc.)
- Collapsed CSS compile which I hear provides better performance (see main.css)

An important part was the `@import` statements that allowed me to divide my workflow and make it more "semantic" per say. I tried to make my SCSS code as simple as possible by using short-hands such as `flex`.

### Summary
The Frontend code is distinct from many aspects of the First CS50 Project as it
- used semantic HTML
- utilized various combo classes
- optimized the site for minor-performance boost
- made the site more accessible to people with vision disabilities using appropriate contrast-standards **(AA and AAA)**
- utilized the SCSS pre-processor to create simpler and optimized styling

## Back-End
I of course I used the `"include"` statement in my `urlpatterns` to seperate my project urls from my app urls.

### Authentication
The whole theme of the app was to make the users who post tutorials **anonymise**. This is because the tutorials, or rather the quality of the tutorials should not be associated with specific users (or at least not visibly). This allows for a **decentralized** community in which tutorials are adequately rewarded with views as the number of likes rises. This doesn't mean that users weren't excluded entirely as this would mean that the app wouldn't know if someone was the owner of the tutorial, making them unable to **delete** it if such a time came.

I didn't go further than making the AbstractUser the default user as the model came with everything I needed (which was just a username, email, and password). What I did need to add was a `natural_key` attribute as the JSON representation of a `User` foreign-key was unhelpful, so I made it display the corresponding `username` attribute. I could have used the `__str__` function, but I never tested if that worked. Registering and logging in the user was easy as I utilized the `.create_user` function (this allows the password to become serialized). Logging in the user with server-side validation was also quite simple as we had done it in previous projects.

I made sure to enforce the `@login_required` decorator on the `logout_view` as this would redirect to the `login_view` if the user wasn't logged in. 

### Tutorial Posting
This site isn't a site to post videos, it's a site to vote and organize existing videos. This means that posting the tutorials had to be as seamless as possible. I decided to choose YouTube as my video provider as most of the tutorials are on the platform, and I could use Google's YouTube Search API. Users could fill in the information manually such as the Title, Description, and the Video ID (most important), but using the API made everything much quicker. I used Javascript to show and hide the corresponding options (Manual and Automatic)

**API**: I first registered my Google Developer account and got my API key. I then learned about converting video results into usable snippets for use. I didn't always use the snippets as the snippets didn't include the video ID, so I just requested some regular results.

I was going to have an interval timer, but I didn't want to peak my 100 request quota from Google, so I just made a "Generate Preview" button for getting search results. The request searched up the video and returned the first result (there was only ever one result). The reason I did this was because I didn't want people going onto YouTube and having to copy and paste the title of the videos as this would quickly become impractical and would defeat the purpose. The API would then generate results using the the `.innerHTML` DOM attribute, allowing the user to see if they need to make a better search query. This would also automatically fill up the manual entries on a seperate tab, allowing for all of the form data to be submitted.

The optional field was the category field which consisted of:
- A choose an existing category from a multi-select dropdown
- A create your own category field (this is similar to YouTube's tagging structure)

This was originally mandatory but I decided that enforcement of such an aspect shouldn't be present. There is some more server-side validation along with conditionals for the categories. The create-your-own-categories functionality utilizes Python's `split(", ")` function. The user is then redirected to the index page where their tutorial is put at the bottom of the list. This is because the tutorials are ordered with the highest number of likes.

> **NOTE**: Some model fields are allowed to be null. This isn't true as it was a temporary requirement for making applicable migrations and such fields wouldn't be left null.

### Models
Of course, there was the tutorial model which included
- The title and description
- The video ID
- The categories associated with the tutorial (I purposely made this a ManytoMany field so the categories exist after tutorial deletion)
- The likes (upvotes) and dislikes (downvotes) from specific users
- The user who "created" the tutorial

The category model was literally just the name of the category.

The comment model was a bit more complex, including a
- Comment author
- The comment itself (the content)
- The replies received on that comment
- If the comment was a reply
  * This was useful to remove duplicates when returning a tutorial JSON-Response
- Which tutorial it was commented on

The reply functionality was tricky as I wanted to make the JSON data readable and simple when one requested for it. I used some nested objects for easy access to a particular comments' replies, and included all of the same fields. Maybe this was a good introduction to Data Structures? 

## Javascript
I used vanilla Javascript instead of a library or framework to test my abilities, and learn a bit about variable scope and hoisting.

### Tutorial Posting
I have client-side validation using the `get_tutorials()` API to ensure that:
- There aren't any duplicate tutorials
- There aren't any non-existent videos (meaning no video ID was provided)

Everthing else was just the generation of the HTML video preview from YouTube.