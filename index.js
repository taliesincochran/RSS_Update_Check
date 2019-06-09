#!/usr/bin / env node
'use strict';


// set up a class for RSSSearch
// We will assume the dictionary will come in the form of JSON
// As it is a standard form of data transfer on the web and usable
// by multiple langauges

class RSSSearch {
    constructor(dictionary, numberOfDays) {
        this.dictionary = JSON.parse(dictionary);
        this.numberOfDays = numberOfDays;
        this.hasUpdated = new Set();
        this.notUpdated = new Set();
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
    
}


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
