---
title: "Build Your Own: Plugins in Empire"
date: '2017-11-30 00:00:00'
author: Dakota Nelson
excerpt_separator: <!-- more -->
byline: A new way to customize the Empire project
banner: stormtrooper-desert.jpg
layout: blogpost
description: The Empire project now has a plugin system, allowing it to be powerfully customized. Learn how Empire's plugins work and how to write plugins for Empire.
share_text: "Learn how to customize Empire with plugins at https://strikersecurity.com/blog/empire-plugins/"
tweet: "Learn how to customize Empire with plugins at https://strikersecurity.com/blog/empire-plugins/"
---

Empire now has a new feature: plugins! These allow for a great deal of flexibility and customization if you're willing to write a little bit of code, and this post is dedicated to helping you get the most out of this new way Empire can be customized to meet your needs.

<!-- more -->

The start of a plugin system was added in <a href="https://github.com/EmpireProject/Empire/pull/790" target="_blank">pull request #790</a> and will be coming soon to an Empire near you. This article will walk through:

  1. <a href="#how-to-use-empire-plugins">How to use Empire Plugins</a>
  2. <a href="#how-empire-plugins-work">How Empire Plugins Work</a>
  3. <a href="#how-to-write-a-plugin-for-empire">How to Write a Plugin for Empire</a>

## How to Use Empire Plugins

You'll notice the Empire help menu has two new commands; `plugin`, and `plugins`.

<center><img src="/images/blog/empire-plugins/start-and-help.png" width="80%" alt="Empire's help output immediately after starting Empire on the command line"></center>

Running the `plugins` command will give you a list of all the plugins you have available:

<center><img src="/images/blog/empire-plugins/plugins-command.png" width="80%" alt="The output of Empire's plugins command showing a list of available plugins"></center>

In order to make a plugin available to load, it needs to be present in the `plugins` directory - if you're not sure where to find that, the `plugins` command prints it out.

Once you've installed a plugin (by placing it in the `plugins` directory), you can load it by running `plugin $plugin-name`, like you see below:

<center><img src="/images/blog/empire-plugins/plugin-command.png" width="80%" alt="The output of Empire's plugin command being run with a plugin named example, which loads the plugin and displays loading output"></center>

Plugins are unloaded whenever Empire exits. Right now, that's the only way to unload them.

Once your plugin is loaded, running the `plugins` command will show which plugins are active by putting a row of `*` characters under the "active" heading in that plugin's row:

<center><img src="/images/blog/empire-plugins/plugins-command-active.png" width="80%" alt="The output of Empire's plugins command showing a list of available plugins, with the example plugin active"></center>

This particular plugin gives us one new capability - a command avilable from the main menu called `test`. Running the command gives you some example output:

<center><img src="/images/blog/empire-plugins/running-plugin.png" width="60%" alt="The output of a test command added to Empire by the example plugin"></center>

Obviously this command isn't very useful. :)

That's it for how to use plugins - next up, how do they actually work?


## How Empire Plugins Work

*Note: all links to code in this section are to the original commit in Github which added plugin functionality, and therefore will not reflect more recent changes.*

The core of the plugin system is in two commands added to the main Empire menu (both of which are described <a href="#how-to-use-empire-plugins">above</a>). <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/lib/common/empire.py#L391-L419" target="_blank">The plugins command</a> lists all available plugins, and notes which ones are loaded. It does this by calling <a href="https://docs.python.org/2/library/pkgutil.html#pkgutil.walk_packages" target="_blank">`pkgutil.walk_packages`</a> on the `plugins` directory, which recursively yields all modules in that directory, and comparing their names against a list of loaded plugins stored in `self.loadedPlugins` (`self` here referring to the Empire mainMenu object). The <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/lib/common/empire.py#L421-L434" target="_blank">plugin command</a>, meanwhile, starts off the same by using `pkgutil.walk_packages`, but instead of printing all of the modules it finds, it merely checks to make sure that the plugin name passed to it exists in the list of plugins it finds. If the plugin named by the user actually exists, it calls <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/lib/common/plugins.py#L7-L13" target="_blank">plugins.load_plugin</a>, which does a series of things:
  1. Take the name of a plugin and turn it into a fully-named python import (e.g. going from `examplePlugin` to `plugins.examplePlugin`).
  2. Carry out the actual import using <a href="https://docs.python.org/2.7/library/importlib.html#importlib.import_module" target="_blank">importlib.import_module</a> - any code written in the body of the plugin module outside the `Plugin` class will execute here.
  3. Instantiate the `Plugin` class found within the newly-imported module. (see <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/lib/common/plugins.py#L15-L41" target="_blank">the parent class for that object</a> and the "<a href="#how-to-write-a-plugin-for-empire">How to Write a Plugin for Empire</a>" section below for what this class looks like) Any code in the `onLoad` function of the `Plugin` class will execute here.
  4. Reference that plugin object in `mainMenu.loadedPlugins[pluginName]` so it can be accessed later by any code with access to the `mainMenu` object.

That's fundamentally it - from here, it matters what the plugin itself does. The plugin object is in charge of doing any setup work for itself, such as adding new commands to the Empire menu - we'll dive into how to do that next.

## How to Write a Plugin for Empire

A simple example plugin <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/plugins/example.py" target="_blank">ships with Empire</a>. Let's figure out how it works.

To start, we'll go over the basics: any plugin written for Empire MUST have a class named `Plugin`, which inherits from <a href="https://github.com/DakotaNelson/Empire/blob/3741b0e786ce757cadc522b8afdd204fd7bdd438/lib/common/plugins.py#L15-L41" target="_blank">`lib.common.plugins.Plugin`</a>. Working within that structure, almost anything is possible!

When the plugin is first loaded into Empire, any code you write outside the `Plugin` class will execute - for instance, the example plugin has `print("Hello from your new plugin!")`, which will run immediately when the user loads the plugin. Note that any code you put here will only run when the module is imported, **not** when a new plugin instance is created (which, right now, is a useless distinction since each thing is done once, but it's unclear if that will ever change - see the plugin loading process in "<a href="#how-empire-plugins-work">How Empire Plugins Work</a>" above).

Whenever a new instance of your `Plugin` object is created, the `onLoad` member function will be executed to allow your plugin to do any setup work it needs to do. In the example plugin, this simply prints another welcome message and sets up a variable to be used later - `self.calledTimes`, which will persist until the plugin is unloaded (e.g. Empire exits).

After the `onLoad` function is done, a critical function is called: `register`. This function is passed an instance of the `mainMenu` object, which is a core Empire component. Manipulating `mainMenu` is what allows you to add functionality to Empire. In the example plugin, we add a new command - `test`. This is done by defining a function called `do_test` (the command name is taken automatically from the name of the function) and adding it to the `mainMenu.__class__` object. This modifies the class of the `mainMenu` object, mutating it to include your new command!

From there, it's simply a matter of writing the custom functionality you want to add - you can import whatever Empire modules and packages you should need (the example imports a helper which prints output in color) to lighten the burden along the way.

If you find any bugs or want to add more features, feel free to <a href="https://github.com/EmpireProject/Empire/issues" target="_blank">open an issue on Github</a>. If you have any questions, or are confused by anything, <a href="https://strikersecurity.com/contact/" target="_blank">get in touch</a> and I'll get you some answers ASAP.
