const wd = require('wd');
const sleep = require('asyncbox').sleep
const chai = require('chai');

const expect = chai.expect
let driver, res;
let endpoint = 'http://localhost:4723/wd/hub'

let caps = {
    'appPackage': 'com.android.calculator2',
    'appActivity': 'com.android.calculator2.Calculator',
    'appWaitActivity': 'com.android.calculator2.Calculator',
    'deviceName': 'Android GoogleApi Emulator',
    'platformName': 'Android',
    'platformVersion': '9'
}

describe('Android Workshop calculator tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
        console.log(`Session ID ${res[0]}`);
    });
    after(async () => {
        await driver.quit()
    });
    it('Test calculator can multiply', async () => {
        console.log(await driver.source())
        let el = await driver.elementById('com.android.calculator2:id/digit_2');
        await el.click();
        el = await driver.elementById('com.android.calculator2:id/op_mul');
        await el.click();
        el = await driver.elementById('com.android.calculator2:id/digit_3');
        await el.click();
        el = await driver.elementById('com.android.calculator2:id/eq');
        await el.click()
        el = await driver.elementById('com.android.calculator2:id/result');
        expect(await el.text()).to.equal('6');
    });
});