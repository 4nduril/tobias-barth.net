---
title: Build a looping video player with React
tags:
  - video
  - react
description: Rendering an HTML video tag with a source element is as easy as it gets. But when you are combining multiple video snippets which should follow each other seamlessly and loop the whole set – it gets tricky.
date: '2021-03-15'
---

### The task

For a recent project I needed to implement the following: A video player without controls (besides play/pause). It gets a set of video files, each around ten to twenty seconds duration. Once started the videos should play one after another without pause or visible hiccups between them so that it looks like one long video playback with mere cuts. When the last file has ended playing the player should start all over again with the first video of the set. Why not just merging all files into one and just looping that you ask? Well, each time the player is loaded, the videos will have a different, randomized order so they need to be individual files. Oh and there is also audio which follows the same rules and is not connected to the video files but needs to play and pause in sync with the video.

Sounds unrealistic? Try working with an artist. Anyway, I thought since nobody seems to have done this before under such tight conditions I should share it.

### Technical setup

I built the whole page with [NextJS](https://nextjs.org/). The media content is coming from an external API, for styling I chose [TailwindCSS](https://tailwindcss.com/) — mostly because it was there in the NextJS example with which I started.

So let's start the player component:

```typescript
type VideoPlayerProps = {
  videoFiles: { file: string; caption: string; type: string }[]
  audioFiles: string[]
}

export const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({
  videoFiles,
  audioFiles,
}) => {
  return (
    <video playsInline muted>
      <source />
    </video>
  )
}
```
