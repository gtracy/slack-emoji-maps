# Slack Emoji Reaction Map

This project will render the Emoji Reaction maps users see in their workspaces. 

This is pretty hacky and for reasons that aren't totally clear, does not scale well as the number of user grows. Puppeteer just doesn't like to spawn hundrends of browsers before falling over. 

## Getting Started

The code assumes you have a CSV that discribes each user's emoji use. Take a look at reactions_by_user.csv for a sample. Note that there is an assumption right now that the list is ordered for each user. Someone should fix this. ;)

## Let it rip
    > npm install
    > npm start

Output png files are in the results folder

