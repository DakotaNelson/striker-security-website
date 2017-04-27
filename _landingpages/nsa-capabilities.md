---
title: "Baby NSA: The College Years"
permalink: /source-boston-2017
headline: "Baby NSA: The College Years"
---

Thanks for making it to SOURCE Boston! The slides for my talk are available below, and you'll find my research notes further on down. I'll update this page with video once it becomes available.

<center>
<iframe src="https://docs.google.com/presentation/d/1EKTu5wmAII7XYUd2yeuQq2rLbmU9IfBXhqh8MBpRXZE/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</center>

<br>

The research notes you see here are a work-in-progress listing of NSA tools and programs along with a brief description of each. As of now, it has around 120 entries, but I hope to keep adding to that (doing this research is surprisingly fun).

<style>
.embedded-doc {
  width: 100%;
  height: 800px;
}
</style>

<iframe class="embedded-doc" src="https://docs.google.com/spreadsheets/d/1C_SHAUxi0hQOsu-gxTTK6NnmpzDIxHpBsgY8wTIeUzQ/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>

<br>

Want to grab all of the primary documents? Use this Python script:

```
""" Automatically download every document in the EFF's NSA documents collection
    available from https://www.eff.org/nsa-spying/nsadocs """


""" You'll need to install the robobrowser package """

import os
import csv
from time import sleep
from robobrowser import RoboBrowser

browser = RoboBrowser(history=True, user_agent="NSA Document Crawler", parser='html.parser')
browser.open('https://www.eff.org/nsa-spying/nsadocs')

documents = browser.select('#panel-case-page table.views-table tbody tr')

# set up a folder to put the docs in
folderpath = os.path.abspath(os.path.join(os.getcwd(), 'eff_nsa_docs'))
try:
    os.mkdir(folderpath)
except FileExistsError:
    # directory already exists
    pass

# set up a CSV file to contain the metadata
filename = 'eff_nsa_docs.csv'
with open(filename, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    # write header
    csvwriter.writerow(['date','title','source','link'])

    total = len(documents)
    this = 0 # the index of the currently-downloading document
    failed = 0 # total documents which failed to download
    print("Found {} documents.".format(total))
    for document in documents:
        attempts = 0
        this += 1
        while True:
            try:
                fields = document.select("td")

                date = fields[0].text.strip()
                link = fields[1].select('a')[0]['href']
                title = fields[1].select('a')[0].text
                source = fields[2].select('a')[0].text

                csvwriter.writerow([date,title,source,link])

                browser.follow_link(fields[1].select('a')[0])
                link_to_file = browser.select('span.file a')[0]
                filename = link_to_file.text
                file_url = link_to_file['href']

                print('({}/{}) Downloading {} ({})...'.format(this, total, title, filename))

                filepath = os.path.join(folderpath, filename)

                if os.path.isfile(filepath):
                    print("[*] File already exists!")
                    break
                else:
                    sleep(2)

                request = browser.session.get(file_url, stream=True)
                with open(filepath, "wb") as pdf_file:
                    pdf_file.write(request.content)
                break
            except IndexError:
                attempts += 1
                if attempts < 3:
                    print("[!] Failed! Retrying...")
                else:
                    print("[!] Failed too many times. Unable to download {}".format(filename))
                    failed += 1
                    break

print("Successfully downloaded {} of {} documents.".format(total-failed, total))
```
