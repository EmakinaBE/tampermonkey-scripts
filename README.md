# Tampermonkey Scripts

![GitHub Downloads All Releases](https://img.shields.io/github/downloads/EmakinaBE/tampermonkey-scripts/total?label=Downloads+(Total))
[![GitHub Release](https://img.shields.io/github/release/EmakinaBE/tampermonkey-scripts?style=flat)]()
![GitHub Release Date](https://img.shields.io/github/release-date/EmakinaBE/tampermonkey-scripts?label=Release+Date)
[![GitHub last commit](https://img.shields.io/github/last-commit/EmakinaBE/tampermonkey-scripts?style=flat)]()

## Overflow
this is the Tampermonkey for the Emakina Group. 
The Scripts helps you by the daily work and your timesheeting.

This script gets time to time a new update for bug fixing, new features and optimising. 

## Hints for working with the files
### **Working with the Project**
The Important thing first. everything we want to change is in an iframe. When you want to change something you must wait, until the iframe is completely loaded. For this gives an extra Function how you can use it. 
The function name is getElementsFromDocument

### **CSS**
We move all Stylings to a separate CSS File.  Wenn you want to chance some colours, fonts or other CSS staff, please include it in the CSS file. Don't use JS for Styling.

### **Development**
We use here now the GitWorkflow. Please start your working from Development. Create please a feature, bug or hoftix branch. When you want to change something.

By Working on the new branch you must change the URL in the files.
The URL you must change you find at the the head at all files.
Change it on this lines:
```
@downloadURL 
@updateURL
```

### **Add a new File**
When you change files you must change the File URL on the Main file.
On the Main file "wf-combined.js" you must change the URL on the Line 
```
@require
```

When you create a new file you must add the file on the main.

