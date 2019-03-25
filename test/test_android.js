const wd = require('wd')
const sleep = require('asyncbox').sleep
const chai = require('chai')
const expect = chai.expect

let driver, res;
let caps = {
    'appPackage': 'io.appium.appiumworkshop',
    'appActivity': '.SplashActivity',
    'appWaitActivity': '.SplashActivity',
    'browserName': '',
    'deviceName': 'Android Emulator',
    'platformName': 'Android',
    'platformVersion': '7.1.1'
}

let endpoint = 'http://localhost:4723/wd/hub'
if (process.env.CLOUD_PROVIDER) {
    endpoint =  `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`
}

describe('Android Workshop tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
    });
    after(async () => {
        await driver.quit()
    });
    it('Test SplashActivity has all elements', async () => {
        let el = await driver.elementById('welcomeText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Welcome to\nAppium Conference 2019');
        el = await driver.elementById('appiumLogo');
        expect(await el.isDisplayed()).to.equal(true);
        await sleep(3000);
        let btt = await driver.elementById('startBtt');
        expect(await btt.isDisplayed()).to.equal(true);
        expect(await btt.text()).to.equal('LET\'S GET STARTED');
    });
    it('Test click on startBtt opens LoginActivity', async () => {
        let btt = await driver.elementById('startBtt');
        await btt.click();
        await sleep(1500);
        let activity = await driver.getCurrentDeviceActivity()
        expect(activity).to.equal('.LoginActivity');
    });
    it('Test LoginActivity has all elements displayed', async () => {
        let el = await driver.elementById('yourNameText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('What\'s your name?');
        el = await driver.elementById('editText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('');
        el = await driver.elementById('checkbox');
        expect(await el.getValue()).to.equal(false);
        expect(await el.isDisplayed()).to.equal(true);
        el = await driver.elementById('haveFunText');
        expect(await el.text()).to.equal('I agree to have fun in this workshop');
        expect(await el.isDisplayed()).to.equal(true);
        el = await driver.elementById('beginBtt');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('BEGIN THE WORKSHOP');
    });
});