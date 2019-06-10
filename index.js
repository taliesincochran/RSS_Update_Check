#!/usr/bin / env node
'use strict';
const testDictionary = require('./test/testDictionary.json')
const RSSParser = require('rss-parser');
const parser = new RSSParser();
// set up a class for RSSSearch
// We will assume the dictionary will come in the form of JSON
// As it is a standard form of data transfer on the web and usable
// by multiple langauges

class RSSSearch {
    constructor(dictionary, numberOfDays) {
        this.dictionary = dictionary;
        this.numberOfDays = numberOfDays;
        this.hasUpdated = new Set();
        this.notUpdated = new Set();
        this.adjustedDate = this.adjustDate();
        this.adjustedDate = this.adjustDate(numberOfDays, new Date());
        this.getRSSFeed = this.getRSSFeed.bind(this);
    }
    // Set up with optional parameters to make testing a bit easier
    
    // First we get the date, and then modify it to the adjusted date */
    adjustDate(num = this.numberOfDays, date = new Date()) {
        if (date instanceof Date) {
            date.setDate(date.getDate() - num);
            console.log(date);
            return date;
        }
        else {
            return null;
        }
    }
    // JSON supports arrays, strings and strings
    // We will assume that all urls are going to be inside an array
    async getRSSFeed (company, targetURL) {
        const { hasUpdated, notUpdated, adjustedDate } = this;
        const getFeed = async () => {
            // get the url and parse it
            let feed = await parser.parseURL(targetURL);
            // go to the first entry and check its date
            // it is most likely that it is the newest 
            // entry, because that is how RSS feeds usually are
            let compareDate = new Date(feed.items[0].pubDate);
            console.log(compareDate, '\n', adjustedDate, '\n', compareDate >= adjustedDate);
            // If the date is within the range, add it to the updated list
            if(compareDate >= adjustedDate) {
                if(!hasUpdated.has(company)) {
                    console.log('has', company);
                    hasUpdated.add(company);
                }
                // also check the not updated list, if it is there
                // remove it
                if(notUpdated.has(company)) {
                    notUpdated.delete(company);
                }
            } else {
                // Add the company to the not updated list if it is not on the
                // updated list
                if(!notUpdated.has(company) && !hasUpdated.has(company)) {
                    console.log('has not', company)
                    notUpdated.add(company);
                }
            }
            // set the results
            this.hasUpdated = hasUpdated;
            this.notUpdated = notUpdated;
            let data = {hasUpdated, notUpdated}
            return await data;
        }
        let data = await getFeed();
        return data;
    }
    async getFeeds () {
        let dictionary = JSON.parse(JSON.stringify(this.dictionary));
        for(let company in dictionary) {
            let feeds = dictionary[company];
            for(let feed in feeds) {
                console.log('feed', dictionary[company][feed][0].date)
                await this.getRSSFeed(company, dictionary[company][feed]);
            }
        }
    }
}
let rssSearch = new RSSSearch(testDictionary, 5);
async function rssSearch2 () {
    await rssSearch.getFeeds().then(data => {
        console.log(rssSearch.hasUpdated);
        console.log(rssSearch.notUpdated);
    }).catch(error => {
        console.log(new Error(error));
    });
};
rssSearch2();
     
    

  // Then we will cycle through the input and retrieve the RSS feed.  

  // Each key will be a company, but a company can have more than one RSS feed. 


  /* As the company can have more than one RSS feed, we will assume 
  that the value in the key value pair is a string or an array 


  // We will type check to avoid errors 


  /* We need two variables to track, both sets. One set will track updated RSS feeds, the other not updated RSS feeds


  /* As the RSS feed is updated usually by propending to the file, we will check only the date on the first
  * entry. */  
  /* For each company, we will start with the first RSS feed. If the first entry of the first RSS feed is greater */
  /* than or equal to the adjusted date, we will add it to the updated set, and go to the next company (there is no need to check 
  /* any other RSS feeds for that company, because they have updated one).  Then we repeat with the second, third, ect. */
  // If no RSS feeds are updated, we will add it to the not updated set.
  // Once all companies are checked we will print out a list of companies into the console or print the list.


module.exports = RSSSearch;