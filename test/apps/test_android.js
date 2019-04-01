const wd = require('wd');
const sleep = require('asyncbox').sleep
const chai = require('chai');
const path = require('path');
const pkgDir = require('pkg-dir');
const uploader = require('sauce-uploader');

const expect = chai.expect

let driver, res;
let app = path.join(pkgDir.sync(__dirname), 'android-app', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
let endpoint = 'http://localhost:4723/wd/hub'
let caps = {
    'appPackage': 'io.appium.appiumworkshop',
    'appActivity': '.SplashActivity',
    'appWaitActivity': '.SplashActivity',
    'deviceName': 'Android GoogleApi Emulator',
    'platformName': 'Android',
    'platformVersion': '8.0',
    'app': app,
    'public': true
}

if (process.env.CLOUD_PROVIDER) {
    endpoint = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`
    let [err, response] = uploader.uploadSync({
        user: process.env.SAUCE_USERNAME,
        access_key: process.env.SAUCE_ACCESS_KEY,
        app_path: app
    })
    if (err) {
        throw new Error("Failed to upload app! :(");
    }
    caps['app'] = 'sauce-storage:app-debug.apk'
    caps['name'] = "Getting Started with Appium - Android test"
}

describe('Android Workshop tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
        console.log(`Session ID ${res[0]}`);
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
        let el = await driver.elementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.view.ViewGroup/android.widget.TextView');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Getting started with appium');
    });
    it('Test LoginActivity has all elements displayed', async () => {
        let el = await driver.elementById('yourNameText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('What\'s your name?');
        el = await driver.elementById('editText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('');
        el = await driver.elementById('checkbox');
        expect(JSON.parse(await el.getAttribute('checked'))).to.equal(false);
        expect(await el.isDisplayed()).to.equal(true);
        el = await driver.elementById('haveFunText');
        expect(await el.text()).to.equal('I agree to have fun doing this workshop');
        expect(await el.isDisplayed()).to.equal(true);
        el = await driver.elementById('beginBtt');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('BEGIN THE WORKSHOP');
    });
    it('Test you cant start the workshop without setting your name', async() => {
        let el = await driver.elementById('beginBtt');
        await el.click();
        el = await driver.elementById('alertText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Please enter your name to move forward');
    });
    it('Test you can enter your name but cant start the workshop without agreeing terms', async() => {
        let el = await driver.elementById('editText');
        await el.sendKeys('vrunoa')
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
        el = await driver.elementById('beginBtt');
        await el.click()
        el = await driver.elementById('alertText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('You must agree to have fun to proceed with the workshop');
    });
    it('Test you can click on agree and move to the next activity', async () => {
        let el = await driver.elementById('checkbox');
        await el.click();
        el = await driver.elementById('beginBtt');
        await el.click();
        let activity = await driver.getCurrentDeviceActivity();
        expect(activity).to.equal('.MainActivity');
        el = await driver.elementByXPath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.TextView');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Welcome vrunoa');
        el = await driver.elementByXPath('//android.widget.ImageButton[@content-desc="Navigate up"]');
        expect(await el.isDisplayed()).to.equal(true);
    });
    it('Test menus opens and elements are displayed', async () => {
        let el = await driver.elementByXPath('//android.widget.ImageButton[@content-desc="Navigate up"]');
        await el.click();
        el = await driver.elementById('appiumLogo');
        expect(await el.isDisplayed()).to.equal(true);
        el = await driver.elementById('navHeaderText');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Welcome to\nAppium Conference 2019');
        el = await driver.elementById('bttSchedule');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('SCHEDULE');
        el = await driver.elementById('bttSponsors');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('SPONSORS');
        el = await driver.elementById('bttLocation');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('LOCATION');
        el = await driver.elementById('bttWorkshops');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('WORKSHOPS');
        el = await driver.elementById('bttConduct');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('CODE OF CONDUCT');
        el = await driver.elementById('bttTerms');
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('TERMS');
        await driver.back();
    });
    it('Test terms section is opened and shows the correct text', async () => {
        let el = await driver.elementByXPath('//android.widget.ImageButton[@content-desc="Navigate up"]');
        await el.click();
        el = await driver.elementById('bttTerms');
        expect(await el.isDisplayed()).to.equal(true);
        await el.click();
        let ctxs = await driver.contexts();
        expect(ctxs.length).to.equal(2);
        await driver.context('WEBVIEW_io.appium.appiumworkshop');
        el = await driver.elementById('section_title')
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Terms & Conditions');
        await driver.context('NATIVE_APP');
    });
    it('Test conduct section is opened and shows the correct text', async () => {
        let el = await driver.elementByXPath('//android.widget.ImageButton[@content-desc="Navigate up"]');
        await el.click();
        el = await driver.elementById('bttConduct');
        expect(await el.isDisplayed()).to.equal(true);
        await el.click();
        let ctxs = await driver.contexts();
        expect(ctxs.length).to.equal(2);
        await driver.context('WEBVIEW_io.appium.appiumworkshop');
        el = await driver.elementByClassName('section_title')
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal('Code of Conduct');
        await driver.context('NATIVE_APP');
    });
    it('Test location opens GoogleMaps app', async () => {
        let el = await driver.elementByXPath('//android.widget.ImageButton[@content-desc="Navigate up"]');
        await el.click();
        el = await driver.elementById('bttLocation');
        await el.click();
        await sleep(4000);
        let pkg = await driver.getCurrentPackage();
        expect(pkg).to.equal('com.google.android.apps.maps');
        let activity = await driver.getCurrentDeviceActivity();
        expect(activity).to.equal('com.google.android.maps.MapsActivity');
        // going back to our app
        await driver.back();
        await driver.back();
        pkg = await driver.getCurrentPackage();
        expect(pkg).to.equal('io.appium.appiumworkshop');
        activity = await driver.getCurrentDeviceActivity();
        expect(activity).to.equal('.MainActivity');
        await driver.back();
    });
});