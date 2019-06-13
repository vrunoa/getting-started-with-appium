const wd = require('wd');
const sleep = require('asyncbox').sleep
const chai = require('chai');
const path = require('path');
const pkgDir = require('pkg-dir');
const uploader = require('sauce-uploader');

const expect = chai.expect

let driver, res;
let app = path.join(pkgDir.sync(__dirname), 'ios-apps', 'Calculator', 'DerivedData', 'Calculator', 'Build', 'Products', 'Debug-iphonesimulator', 'Calculator.app');
let endpoint = 'http://localhost:4723/wd/hub'
let caps = {
    'deviceName': 'appium-simulator',
    'platformName': 'iOS',
    'platformVersion': '12.2',
    'app': app,
    'public': true
}
console.log(app);
describe('iOS calculator tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
        console.log(`Session ID ${res[0]}`);
    });
    after(async () => {
        await driver.quit()
    });
    it('Test can multiply numbers', async () => {
        let el = await driver.elementByAccessibilityId("2");
        expect(el).to.not.equal(null);
        await el.click();
        el = await driver.elementByAccessibilityId("×");
        expect(el).to.not.equal(null);
        await el.click();
        el = await driver.elementByAccessibilityId("3");
        expect(el).to.not.equal(null);
        await el.click();
        el = await driver.elementByAccessibilityId("=");
        expect(el).to.not.equal(null);
        await el.click();
        el = await driver.elementByXPath('//XCUIElementTypeStaticText[@name="6.0"]')
        expect(el).to.not.equal(null);
    });
});
