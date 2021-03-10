# 2D-not-fortnite
Fortnite FPS but it's 2-D 

# Cloning the repo from VMWare Workstation
Currently this repository is _private_ because I don't want to get slapped with academic offense if someone finds this repo and takes too much inspiration from it. So, cloning is a bit of a pain to do, and sadly we have cannot use GitHub Desktop to interact with the repository because we're using a VM that's purely CLI.

First, you much configure git in your VMWare Workstation by calling:
```
git config --global user.name "your_username"
git config --global user.email your_email@com
```
No quotes when adding email config. After you successfully added the configurations, you should then clone the repo into the `\var\www` folder by calling:
```
git clone https://github.com/elysiayong/2D-not-fortnite.git
```

DM me if something goes wrong/nothing works. (I added you as a collaborator but idk if you need to accept it for you to be able to access my repository).

# Some basic git bash commands

Create the branch on your local machine and switch in this branch :
```
$ git checkout -b [name_of_your_new_branch]
```
Push the branch on github :
```
$ git push origin [name_of_your_new_branch]
```
See all branches and the branch you're in:
```
$ git branch
```
Committing; please add message (also please pull before committing):
```
$ git commit -m "your message here" 
```
Pushing:
```
$ git push
```
Merge branch xyz to the current branch you're on:
```
$ git merge xyz
```
