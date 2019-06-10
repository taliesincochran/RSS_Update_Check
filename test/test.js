const assert = require('assert');
const chai = require('chai');
const RSSUpdate = require('../index');
const testDictionary = require('./testDictionary.json');
chai.use(require('chai-datetime'));


const expect = chai.expect;
const rssTest = new RSSUpdate(testDictionary, 5);
const { adjustDate, adjustedDate } = rssTest;
describe('Testing adjust date method', function () {
    it('should return May 30th 2019 for June 5 2019 and 5 days', function () {
        let date = new Date(2019, 6, 5);
        let date2 = new Date(2019, 5, 30);
        let testDate = adjustDate(5, date);
        expect(testDate.getDate()).to.equal(date.getDate());
        expect(testDate.getMonth()).to.equal(date.getMonth());
        expect(testDate.getFullYear()).to.equal(date.getFullYear());
    });
    it('An date adusted by 5 days should equal the adjusted date variable of rssTest', function () {
        let testDate2 = adjustDate(5);
        expect(testDate2.getDate()).to.equal(adjustedDate.getDate());
        expect(testDate2.getMonth()).to.equal(adjustedDate.getMonth());
        expect(testDate2.getFullYear()).to.equal(adjustedDate.getFullYear());
    });
});
describe('Test the rss update search', function () {
    it('should return a set of unupdated sites', async function(done) {
        rssTest.getFeeds();
        let { hasUpdated, notUpdated } = await rssTest.then(data => {
            expect(notUpdated.size).to.equal(1);
            expect(hasUpdated.size).to.equal(2);
            done();
        });
    });
});