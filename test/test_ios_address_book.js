const wd = require('wd');
const sleep = require('asyncbox').sleep
const chai = require('chai');
const path = require('path');
const pkgDir = require('pkg-dir');
const uploader = require('sauce-uploader');

const expect = chai.expect

let driver, res;
let endpoint = 'http://localhost:4723/wd/hub'
let caps = {
    'deviceName': 'appium-simulator',
    'platformName': 'iOS',
    'platformVersion': '12.2',
    'bundleId': 'com.apple.MobileAddressBook'
}
describe('iOS system apps tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
        console.log(`Session ID ${res[0]}`);
    });
    after(async () => {
        await driver.quit()
    });
    it('Test can search contacts in the simulator AddressBook system app', async () => {
        let el = await driver.elementByAccessibilityId('Add');
        expect(el).to.not.equal(null);
        await el.click();
        await sleep(2500);
        el = await driver.elementByAccessibilityId('First name');
        expect(el).to.not.equal(null);
        await el.sendKeys('John');
        el = await driver.elementByAccessibilityId('Last name');
        expect(el).to.not.equal(null);
        await el.sendKeys('Appium');
        el = await driver.elementByAccessibilityId('Done');
        expect(el).to.not.equal(null);
        await el.click();
        await sleep(2500);
        el = await driver.elementByXPath('//XCUIElementTypeButton[@name="Contacts"]');
        await el.click()
        el = await driver.elementByAccessibilityId("Search");
        expect(el).to.not.equal(null);
        await el.click();
        await el.sendKeys('John Appium');
        await sleep(1500);
        el = await driver.elementByXPath('//XCUIElementTypeCell[@name="John Appium"]/XCUIElementTypeOther[2]');
        await el.click();
        await sleep(1500);
    });
});
