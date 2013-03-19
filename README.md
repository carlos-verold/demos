#verold-boilerplate

Verold Studio (http://studio.verold.com) is a web-based environment for creating 3D scenes. This repository 
contains examples of how to use the Boilerplate code generated from Verold Studio.

### Formalities:

Verold Studio and the associated runtime engine are both free to use for non-commercial purposes. If you want to 
build a game or website for a client, or for sale, contact us at info@verold.com and we'll work something out. 

### How it works:

The workflow to build a game or application using the Verold platform is to first lay out your scene and models 
using Verold Studio, then download the boilerplate code and create your game using Javascript. Here are a couple 
of examples to showcase what is possible:

> [Falling in Circles](http://labs.verold.com/falling-in-circles)

> [Air Hockey](http://airhockey.jit.su)

Let's look at the Air Hockey game in more detail: this game started as a project in Verold Studio. You can see that project [here](http://studio.verold.com/projects/5130099e21d65002000000f6). The airhockey table and puck were purchased from [Turbosquid](http://www.turbosquid.com), an online marketplace for 3D assets. The game developer didn't have to know how anything about 3D modelling; the assets were simply purchased, then imported to Verold Studio. 

So far, we have a 3D scene that renders on the web. But we don't yet have a game. The next step is to download the Boilerplate for this project (available from the property inspector in projects you own), and work from it. The Boilerplate includes template HTML for the project, including a loading screen and basic menus. It also includes the starting point 
for adding logic and gameplay to your 3D application. When you run the Boilerplate as-is, you will see your 3D scene load up, with a camera pointing at the first object in the scene. For the Air Hockey game, the developer then added friction to the table, a simple physics engine, and deployed to a Node server to get multi-player synchronization. This is a fairly complicated example to start from, but a web developer with no 3D experience was able to build the first version in about 3 hours. It not only works on his desktop, but with the fallbacks in our engine it also works great on mobile devices that support WebGL (e.g. Blackberry, Android). 

### Quick Start:
If you'd like to try out the API without going to the trouble of creating a 3D project, you can grab a sample Boilerplate
from [here](https://github.com/Verold/verold-boilerplate/tree/master/examples/01-spaceship). You can see the initial 3D project [here](http://studio.verold.com/projects/5145fdd0e810360200000342). This boilerplate code is exactly what you would get if this was your own project and you downloaded the boilerplate from it. Go ahead and grab the boilerplate and run it. You'll see the scene load. If you know THREE.js, dive in and make this project your own. Or use the samples elsewhere in this repo to play around. 

### This repo:

In this repository, you will find example code to show you how to implement specific features using the Verold 3D engine. It's important to note that, since we run on THREE.js, most of the THREE.js examples will also run on our engine. This means it's easy for you to take camera controls, third party plugins, or pretty much anything else you find exciting in the THREE.js world and integrate it with your app. 

### Getting help:

Post your questions to the forums here; we monitor that closely. If you've got a framework/tool/runtime/... that you'd like to integrate with our engine, contact us at info@verold.com. And if you make something awesome, be sure to share it with us on [Facebook](http://www.facebook.com/verold), [Twitter](http://twitter.com/verold), and of course here on GitHub. 

Let's make something amazing together!






