---
title: Realtime Twitter Monitoring
date: '2016-07-11 00:00:00'
author: Dakota Nelson
excerpt_separator: "<!-- more -->"
byline: Keeping one finger on Twitter's pulse
banner: none.jpg
---

I've found myself needing to keep an eye on Twitter from time to time, either to track an ongoing event or to gather a large number of tweets for later analysis. Thankfully for the beginning OSINT practitioner (or the lazy expert), the Internet is packed with projects to collect tweets - you don't even need to write any code!

So far, the simplest tool I've used is <a href="https://github.com/bwbaugh/twitter-corpus" target="_blank">twitter corpus</a> - and I love that it has no infrastructure requirements. While most of the options I saw required a database or custom code, twitter-corpus makes mining Twitter effortless and requires no programming and no other programs.

For the curious, corpus is defined as "a collection of written texts, especially the entire works of a particular author or a body of writing on a particular subject." Let's go get everything Twitter has to say on a subject!

We'll walk through using twitter-corpus, beginning to end. You'll need to use the command line, but if you've never used it before this is an easy place to start!

### Installation
If you have git installed, you can clone twitter corpus <a href="https://github.com/bwbaugh/twitter-corpus" target="_blank">from Github</a> using `git clone https://github.com/bwbaugh/twitter-corpus.git`. If you're not sure what that meant, don't worry! You can get a zip file of all the code by visiting the page on Github and clicking the "Clone or download" button or <a href="https://github.com/bwbaugh/twitter-corpus/archive/master.zip">clicking here</a>. Unzip them into a folder somewhere you won't mind storing a lot of tweets.

### Setup
You should now have all the files available, including one called `config-sample.yaml`. This file gives you an idea of what's required to configure twitter-corpus and get it set up for use. This is what you should see inside:

```yaml
# Twitter account info.
twitter:
  # Go to http://dev.twitter.com and create an app.
  # The consumer key and secret will be generated for you after
  consumer_key: api_key_from_application_settings
  consumer_secret: api_secret_from_application_settings
  # After the step above, you will be redirected to your app's page.
  # Create an access token under the the "Your access token" section
  access_token: access_token_from_your_access_token
  access_token_secret: access_token_secret_from_your_access_token
```

Conveniently, the file also contains step-by step instructions for generating the credentials you need to access Twitter. Go ahead and do that, replacing things like `api_key_from_application_settings` with the actual key. **Once you're done, rename `config-sample.yaml` to `config.yaml`.**

Now that we have our settings in place, its time to install some software libraries that twitter-corpus needs in order to work. This is the hardest part of this guide, so stick with me here - and <a href="{{ "/contact/" | prepend: site.url }}" target="_blank">let me know if you're having trouble</a> so I can help you out.

First, ensure you have Python and pip installed - many platforms already have it, but if you don't, you can follow the instructions <a href="http://docs.python-guide.org/en/latest/starting/installation/" target="_blank">here</a> to get set up. If you don't have virtualenv installed, you can run `sudo pip install virtualenv` after you have Python and pip installed.

Once everything is prepared, open the command line, and run the following:

```
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

What's going on here? Glad you asked. The first line creates a place (python calls it a "virtual environment") to store and manage dependencies (software that twitter-corpus depends on - its writer is using other people's code so that they didn't have to write it all themselves). Once it's created, the second line activates this virtual environment so that things you install will end up there. Once that's done, the last line uses a tool called pip, which installs a list of requirements stored in `requirements.txt` given to us by the author of twitter-corpus.

Whenever you go to run twitter-corpus in the future, if you haven't run `source venv/bin/activate` in the command line window you're using, you'll have to run it again.

Congratulations! You're all set up to mine twitter for data.

### Usage


### Coding Bonus: Search from the Config File