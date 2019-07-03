# DOM Homework

## Introduction

In a single evening in August 2013, French web developer Julien "Orteil" Thiennot built a simple browser-based game called "[Cookie Clicker](https://orteil.dashnet.org/cookieclicker/)", hoping to direct some traffic to his personal website while also having some fun. Overnight, the game attracted some 50,000 players, within several months garnering 1.5 million page views per day. What began as a one-night project--and something of a joke--is now considered to be a founding entry in the genre of ["idle" or "incremental" games](https://en.wikipedia.org/wiki/Incremental_game), which account for a not insignificant percentage of the \$550 million in revenue generated annually by casual, mobile video games.

By the end of your first week at Fullstack, you'll have almost all of the skills necessary to build Cookie Clicker; this homework assignment uses test-driven learning to walk you through the process of building a clone of Orteil's javascript masterpiece. Once you've passed the tests, you'll have a working browser-based interactive game-- and perhaps be well on your way to programming your very own smash hit casual game.

In the typical incremental game, the player performs some repetitive action (often, clicking) to gain or "increment" a resource, like gold, points, or cookies. This resource can then be expended to purchase "buildings" or "producers" which increment the resource automatically, giving the player the experience of "automating" the repetitive action. As the player progresses, the game begins to "play itself"; new buildings and features are unlocked, and the player's attention turns away from repetitive clicking and toward making decisions about optimizing expenditure of resources to maximize returns.

If this doesn't sound very fun, that's fine-- it's not for everyone. But it's also easier to see than it is to explain. So take a few minutes to check out [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/); just remember to come back and start the workshop, afterward!

## Coffee Clicker

Our Cookie Clicker clone will be coffee-themed. The player will click a giant Coffee emoji, incrementing a counter showing the quantity of Coffee they currently possess. Coffee can be spent to purchase coffee-producing devices, such as percolators and espresso machines; every second, the player will passively accumulate coffee proportionate to the number and kind of coffee-producing devices they've purchased.

Importantly, the price (in coffee) of each producer will increase proportionately to the number already in the player's possession. This is what enables the game to remain interesting even after coffee production has been automated: the player has to make decisions about which purchases make best use of their coffee depending on the current price of each producer. Check out the demo below or try out Cookie Clicker if what we're talking about here isn't clear.

In addition to a Coffee counter, the player will be able to see how many of each producer they possess, the current price of each producer, the CPS (coffee per second) of each producer, and the total CPS for all producers, combined. Finally, to make things more interesting, we won't show all of the producers at the start of the game-- they'll be unlocked successively as they player accumulates more coffee.

If this seems rather abstract, here's a [link to the finished product](). You might think you can view the source using your browser's developer tools to find some solutions

## What We Give You

We've written the HTML and CSS for Coffee Clicker for you. You'll be working _only_ in the `scripts.js` file. We promise that all of the tests can be passed without editing anything but `script.js`!

We've also pre-written some javascript for you. The `data.js` file contains a large object which will serve as the data for Coffee Clicker. It contains two keys: `coffee`, whose value is an integer representing how much coffee the player has accumulated, and `producers`, whose value is an array of objects. Each of these objects represents a coffee producer, and the keys and values describe the producer's properties.

While you won't need to edit the `data.js` file, you will need to programmatically access and modify the data it contains. Since you know you'll be writing your code in `script.js`, you might be wondering: how is it possible to access variables defined in one Javascript file in a different Javascript file? Later in the junior phase we'll talk about different ways to do this, but for now we've set this up for you. Near the bottom of the `index.html` file you'll see two `<script>` tags; these make sure the browser loads up `data.js` and `script.js` in sequence. This by itself means you can access variables defined in `data.js` inside of `script.js`, but if you have a linter set up in your code editor, it would complain about undefined variables inside of `script.js`.

To solve this, we set up the `data.js` file to save the data object on the browser's built-in `window` object. At the top of `script.js`, we grab the `data` key from the `window` object and make it available in `script.js`'s global scope as `data`.

We've already declared the functions being tested in `script.js`, but they don't yet do anything; it will be up to you to fill them in. You'll also see that we've pre-written a function body or two for you, and you'll shortly discover that a couple of tests are already passing. Just why we've done this will become clearer as we proceed.

## First Steps

todo

## Extra Credit

Without breaking any of the tests, can you find a way to implement one or more of the following features?

- Periodically save the game state using `window.localStorage` so that the player doesn't have to start over every time they refresh the page; load the game state from `window.localStorage` when the page loads. ([This](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) might be useful.)
- Edit `style.css` to change the application's color scheme to something more appropriate to a coffee-themed game
- Add in the ability to sell producers for a full (or partial?) refund of one's coffee
- Add in a one-time unlock-able upgrade system like Cookie Clicker's. Example upgrades: buying a Coffee Grinder upgrade might double the CPS of all percolators; buying extra cursors would increase the coffee one gets from clicks; buying a Caffeinated Cursor upgrade might make the coffee one gets from clicks in some way proportionate to total CPS. Note that this is a _giant_ feature!
