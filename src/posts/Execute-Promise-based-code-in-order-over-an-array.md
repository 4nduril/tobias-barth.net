---
title: Execute Promise-based code in order over an array
tags:
  - javascript
  - recursion
  - promises
  - async-await
description: I had a list of input data and wanted to execute a function for every item in that list. What I need is a way to traverse the array, execute the function for the current element, wait until the Promise resolves and only then go to the next element and call the function with it.
date: '2019-04-18 14:47:53'
---

### The problem

I recently faced a problem: I had a list (an array) of input data and wanted to execute a function for every item in that list.

No problem, you say, take `Array.prototype.map`, that's what it's for. **BUT** the function in question returns a Promise and I want to be able to only continue in the program flow when all of these Promises are resolved.

No problem, you say, wrap it in `Promise.all`, that's what it's for. **BUT** the function in question is very expensive. So expensive that it spawns a child process (the whole code runs in NodeJS on my computer) and that child process is using so much CPU power that my computer comes to grinding halt when my input list is longer than a few elements.

And that's because effectively, all the heavy child processes get started in near parallel. Actually they get started in order but the next will not wait for the previous to finish.

### The first solution

So what I need is a way to traverse the array, execute the function for the current element, _wait_ until the Promise resolves and _only then_ go to the next element and call the function with it. That means `map` will not work because I have no control over the execution flow. So I will have to build my own `map`. And while I am on it, I will implement it a bit nicer as stand-alone function that takes the mapper function first and then the data array:

```javascript
const sequentialMap = fn =>
  function innerSequentialMap([head, ...tail]) {
    if (!head) {
      return Promise.resolve([])
    }
    return fn(head).then(headResult =>
      innerSequentialMap(tail).then(tailResult => [headResult, ...tailResult])
    )
  }
```

So, what does this? It takes the function `fn` that should be applied to all values in the array and returns a new function. This new function expects an array as input. You see that the function is curried in that it takes only ever one argument and the real execution starts when all arguments are provided. That allows us for example to "preload" `sequentialMap` with a mapper function and reuse it on different input data:

```javascript
// preloading
const mapWithHeavyComputations = sequentialMap(heavyAsyncComputation)

// execution
const result = mapWithHeavyComputations([…])
```

But in this case the currying enables (or simplifies) another technique: recursion.

We say a function is recursive when it calls itself repeatedly. Recursion is the functional equivalent to looping in imperative programming. You can refactor one into the other as long as the programming language allows both ways. Or so I thought.

I used a recursive function here because I could not think of a way to wait for a Promise resolving in a loop. How would I use `.then()` and jump to the next iteration step _within_ that `then`?

Anyway, let's go further through the code. In the body of the internal or second function firstly I define a condition to terminate the recursion: I check if the first element is falsy and if it is falsy I just return a Promise that resolves to an empty array. That is because the main path of the function returns its data as an array wrapped in a Promise. So if we return the same type of data when we terminate all will fit nicely together.

Next, if we don't terminate (which means the first element of the given list is truthy) we apply the mapper function to it. That will return a Promise and we wait for its resolving with `.then`. Once it resolves the whole thing gets a bit magical, but not too much.

What we do then is to build a nested Promise. Normally, when you work with Promises and want to apply several functions to the inner values you would build a "Promise chain":

```javascript
const result = firstPromise
  .then(doSomethingWithIt)
  .then(doSomthingElseAfterThat)
  …
```

The problem we have here is that to build the final result (the mapped array), we need the result from the first resolved Promise and then also the result values from all the other Promises which are not computed _upon_ each other but _independent_.

So we use two features to solve that: nested scope and Promise-flattening (did someone say Monad?).

For the nested scope first: When we define a function within a function then the inner function can access variables that are defined not within itself but in the outer function (the outer or surrounding scope):

```javascript
function outer(arg1) {
  const outerValue = arg1 + 42

  function inner() {
    return outerValue + 23
  }

  console.log(inner())
}

outer(666) // logs 731
```

And Promise-flattening means essentially that if you have a Promise of a Promise of a value that is the same as if you just had a Promise of the value.

```javascript
const p2 = Promise.resolve(Promise.resolve(1))
const p1 = Promise.resolve(1)

p2.then(console.log) // logs 1
p1.then(console.log) // logs 1
```

To recall, here is what the code we are talking about looks like:

```javascript
return fn(head).then(headResult =>
  sequentialMapInternal(tail).then(tailResult => [headResult, ...tailResult])
)
```

We keep the `headResult` in scope and then we generate the next Promise by calling the inner function recursively again but with a shorter list without the first element. We wait again with `.then` for the final result and only then we build our result array.

This is done by spreading the `tailResult` after the `headResult`: We know we get one value from calling `fn(head)` but we get a list of values from calling `sequentialMapInternal(tail)`. So with the spread operator we get a nice flat array of result values.

Note that the function inside the first `then`, that gets `headResult` as parameter immediately returns the next Promise(-chain). And that is essentially where we use Promise-flattening. `.then` returns a Promise in itself and now we are returning a Promise inside of that. But the result will look like an ordinary Promise – no nesting visible.

### The better way

While that works perfectly and my computer remains usable also when I call my script now, all these nested `then`s do not look so nice. We can fix that when we have async functions at our disposal:

```javascript
const sequentialMap = fn =>
  async function innerSequentialMap([head, ...tail]) {
    if (!head) {
      return Promise.resolve([])
    }
    const headResult = await fn(head)
    const tailResult = await innerSequentialMap(tail)
    return [headResult, ...tailResult]
  }
```

Yes, that is much better. Now the exection is paused until `headResult` is there and then paused again until `tailResult` is there and only then we build our result array and are finished.

### The shortest way

Wait. Did I just say I can pause execution with `await`? Wouldn't this work also within a loop?

```javascript
const loopVersion = fn => async list => {
  const result = []
  for (const elem of list) {
    result.push(await fn(elem))
  }
  return result
}
```

See, this is what happens to people like me that are too deep into functional programming paradigms. Yes, you should generally avoid loops because they are not declarative and you end up telling the machine (and your coworker) not _what_ you want to happen but _how_ you want it to happen. That is, again, generally, no good practice. But in this case that is exactly what we wanted: To give a step-by-step schema on how to execute our code. To optimize for resource usage.
