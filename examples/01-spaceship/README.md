# EXAMPLE: 01-spaceship

This is a simple example to show the Boilerplace AS-IS. This is exactly the code you would get if you downloaded boilerplate from your own project in [Verold Studio](http://studio.verold.com). We include this here, because it's a fast and easy way for a developer to see how the Boilerplate is structured.

> See the [running app](http://verold.github.com/verold-boilerplate/examples/01-spaceship/)

> See the [project in Verold Studio](http://studio.verold.com/projects/5145fdd0e810360200000342)

# Understanding this example:

This project includes three files that you should be aware of:

    javascripts/VeroldApp.js
    javascripts/MyApp.js
    index.html
    
Let's look at these in detail. The VeroldApp.js contains helper methods for initializing the Verold Engine, and pulling assets from your project in Verold Studio. You will not change this file.

MyApp.js is a sample to get you started with your application. It includes a few helpful methods that you will want to extend or override:

* The 'success_hierarchy' callback in the 'loadScene()' method is invoked when all assets from your project have downloaded. This is where you will setup your camera and controls.
* The 'update' method gets called on every frame. This is where your custom logic will live.
* The 'onMouseUp' comes with helper methods that show how to use picking. Useful for debugging purposes; for example, to click objects and print out their details.
* The 'onKeyPress' method lets add custom behaviour to key strokes, for example to have "B" turn on bounding boxes. Or pretty much any other behaviour you'd like to target to keystrokes.

The index.html file is where you will define the HTML elements of your game. This contains your loading page copy, menus, and other UI elements. This is also where your app is initialized:

    var veroldApp = new VeroldApp();
    console.info(veroldApp);
    var myApp = new MyApp( veroldApp );
    
    VAPI.onReady( function() {
      veroldApp.initialize( {
        container : null,
        projectId : "5145fdd0e810360200000342",
        enablePostProcess: false,
        antialias: !veroldApp.isMobile(),
        enablePicking: true,
        shadowMapEnabled: true,
        handleInput: true,
        clearColor: 0xff0000,
        forceLowEndRendering: veroldApp.isMobile(),
        success: function() {
          myApp.startup();
        }
      });
    });
    
These settings are likely to evolve over time.

# Next steps

This first sample shows you the vanilla boilerplate. It does nothing, except load your scene and provide a sandbox for you to play in. Take a look through the sample code, run it and see what happens. Then move on to some more complex samples.
