#!/usr/bin / env node
'use strict';
const RSSParser = require('rss-parser');
const fs = require('fs');
const path = require('path');
// When called on the command line, the first argument is the relative path to the dictionary,
const pathToDictionary = path.join(__dirname, process.argv[2]);
const numberOfDays = (typeof parseInt(process.argv[3]) === 'number' && !isNaN(parseInt(process.argv[3])))? process.argv[3]: 0;
const parser = new RSSParser();

/* set up a class for RSSSearch
 * We will assume the dictionary will come in the form of JSON
 * As it is a standard form of data transfer on the web and usable
 * by multiple langauges */

class RSSSearch {
    // Dictionary is a JSON object, number of days is a number
    constructor(dictionary, numberOfDays) {
        this.dictionary = dictionary;
        this.numberOfDays = numberOfDays;
        this.hasUpdated = new Set();
        this.notUpdated = new Set();
        this.adjustedDate = this.adjustDate();
        this.adjustedDate = this.adjustDate(numberOfDays, new Date());
        this.getRSSFeed = this.getRSSFeed.bind(this);
    }

    /* We get the date, and then modify it to the adjusted date 
     * Set up with optional parameters to make testing a bit easier */

    adjustDate(num = this.numberOfDays, date = new Date()) {
        if (date instanceof Date) {
            date.setDate(date.getDate() - num);
            return date;
        }
        else {
            return null;
        }
    }

    /* JSON supports arrays, strings and objects
     * As each RSS feed has a name, we are going 
     * to assume we are using an object */

    async getRSSFeed (company, targetURL) {
        const getFeed = async () => {

            // get the url and parse it
            let feed = await parser.parseURL(targetURL);

            /* go to the first entry and check its date
             * it is most likely that it is the newest 
             * entry, because that is how RSS feeds usually are
             * This will save many calculations on each site */

            let compareDate = new Date(feed.items[0].pubDate);

            // If the date is within the range, add it to the updated list

            if(compareDate >= this.adjustedDate) {
                if(!this.hasUpdated.has(company)) {
                    this.hasUpdated.add(company);
                }

                /* also check the not updated list, if it is there
                 * remove it */

                if(this.notUpdated.has(company)) {
                    this.notUpdated.delete(company);
                }
                /* Return true so we can break the loop for multiple rss feeds
                 * for the same company. */

                return true;

            } 
            else {
                /* Add the company to the not updated list if it is not on the
                 * updated list */
                if(!this.notUpdated.has(company) && !this.hasUpdated.has(company)) {
                    this.notUpdated.add(company);
                }
                return false;
            }
        }
        // get the results and return them
        let data = await getFeed();
        return data;
    }
    /* This being async is critical with the parsing of rss data,
     * Otherwise we would return the answer before the function was
     * done processing */

    async getFeeds () {
        let dictionary = this.dictionary;
        let data = [];

        // Go through each company and get its feeds

        for(let company in dictionary) {
            let feeds = dictionary[company];

            // Go through each RSS feed until you find an updated one
            let result = false;
            for(let feed in feeds) {
                /* If something has been updated, break this for loop so that
                    * we don't waste time on a company that has already updated 
                    * one of their feeds. */
                if(result) {
                    break;
                }

                /* I know this await slows things down a lot, 
                 * but without it this returns the answer to 
                 * quickly */

                await this.getRSSFeed(company, dictionary[company][feed]).then(res => {
                    result = res;
                // Always place a catch to handle async errors
                }).catch(error => {
                    console.log(new Error(error));
                });
            }
        }
        
    }
}

/* using the relative path given in the arguments, read the dictionary
 * I'm using readFileSync instead of readFile because we need the whole 
 * object, or we will through an errror */

let dictionary = JSON.parse(fs.readFileSync(pathToDictionary));

// use an async function so that we can make sure the function is done before we give the answer.
async function doAsyncSearch(dictionary, numberOfDays) {
    let rssSearch = new RSSSearch(dictionary, numberOfDays);
    await rssSearch.getFeeds()
    // once the function is done, get the values and print them out.
    .then(() => {
        let values = rssSearch.notUpdated.values();
        console.log('These companies have not updated their RSS feeds in', numberOfDays, 'days:\n')
        for (let i = 0; i < rssSearch.notUpdated.size; i++) {
            console.log(values.next().value, '\n');
        }
    // always catch on an async
    }).catch(error => {
        console.log(new Error(error));
    });
};

doAsyncSearch(dictionary, numberOfDays);
     
// What to do better
// Setting this function up to recieve multiple input formats
// This function only works on XML sites, it would be nice if it could scrape HTML pages too.
// Optimization to speed up the process
// 

module.exports = RSSSearch;