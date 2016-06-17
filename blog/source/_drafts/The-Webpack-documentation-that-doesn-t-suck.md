title: "The Webpack documentation that doesn't suck'"
tags: 
- webpack 
- javascript 
- documentation
---

## Intro

We all know that Webpack is the tool of choice nowadays when it comes to build processes. Yeah, some things can easily get achieved with Grunt or Gulp and the ordinary website builder is often better off without Webpack'S insanity. But as soon as you move towards more sophisticated build chains with lots of different file types, split JS bundles – not to mention transpile steps with babel for ESnext or JSX or … you get the idea. In those cases there is (in the opinion of many) nothing else than Webpack to go to.

But.

Man (or woman) that thing is crazy! Did you see those config files? Or even worse, did you see that official "documentation"? For a beginner there is more often than not no other way than diving in, copying the examples and hope for the best. And then something won't work. You have simply no idea what or where it went wrong. Best thing is, in some cases Webpack won't even stop on error or even tell you after running that there was some kind of error.

It doesn't stop there. When you believe you got some grip on Webpack itself and its config format, there are the plugins and loaders coming in. Whose READMEs also only kind of tell you what they do or what they are supposed to do. Take css-loader for instance. Someone tells you that css-loader takes care of autoprefixing. You just have to put the config for that like so:

```javascript
```

So, this way, you won't need that less-loader-autoprefixer-plugin anymore. Yay! Is this feature mentioned somewhere in the css-loader docs? Of course not. But if you read carefully you will learn that it uses css-nano for minifying CSS. Css-nano in turn incorporates autoprefixer. And the means to set options for that are passed through all that into the Webpack config. Awesome! 

Then all of a sudden it stops working. There are no prefixes anymore. You dig half a day through all the sources and your colleague has already put the less-plugin back into the chain. Finally you find that someone in the team has passed the `-minify` option to Webpack's css-loader while in dev-mode. That stops it from minifying the CSS, obviously. Well, actually, it turns off the whole damn built-in css-nano and with it the autoprefixer.

I tell you that whole story, knowing that you have your own, just to have you all in the right mood. To make my motivation for this little project a little more clear. So I thought by myself, why on earth has nobody ever did this before? Everyone is complaining on the cryptic syntax and the less-than-optimal documentation but nobody is fixing it. I am pretty sure that this is too huge of a project for me alone to do this really exhaustive but I want to give beginners a place to start. I want them and everyone to have nice explanations of the concepts and the syntax. I want provide example code, not only of syntax but also of input and outcome from Webpack consuming this coniguration. And I simply want to have a place for myself to look into when I set up a new project or tweaking existing ones.

I hope I will keep on writing this and I am looking forward to everyone who has comments, fixes or the like and will happily put your help into this document. Just ping me on any of the usual channels.

But now, here we go. Let's pack some Web y'all!
