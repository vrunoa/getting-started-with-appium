const wd = require('wd');
const sleep = require('asyncbox').sleep
const chai = require('chai');

const expect = chai.expect
let driver, res;
let endpoint = 'http://localhost:4723/wd/hub'

let caps = {
    'browserName': 'chrome',
    'deviceName': 'Android GoogleApi Emulator',
    'platformName': 'Android',
    'platformVersion': '8.0'
}

if (process.env.CLOUD_PROVIDER) {
    endpoint = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:80/wd/hub`
    caps['name'] = "Getting Started with Appium - Android Web test"
}


describe('Android browser tests', async () => {
    before(async () => {
        driver = await wd.promiseChainRemote(endpoint)
        res = await driver.init(caps)
        console.log(`Session ID ${res[0]}`);
    });
    after(async () => {
        await driver.quit()
    });
    it('Test can open URL and title is correct', async () => {
        await driver.get("https://saucelabs.github.io/training-test-page/");
        await sleep(500);
        let title = await driver.title();
        expect(title).to.equal("I am a page title - Sauce Labs");
    });
    it('Test heading is display as has the right text', async () => {
        let els = await driver.elementsByTagName('h1');
        expect(await els[0].text()).to.equal("This page is a Selenium sandbox");
        expect(await els[0].isDisplayed()).to.equal(true);
    });
    it('Test div can be found by ID and by className', async() => {
        let el = await driver.elementById("i_am_an_id")
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal("I am a div");
        el = await driver.elementByClassName("i_am_a_class");
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal("I am a div");
    });
    it("Test link is displayed and has the correct redirection", async() => {
        let els = await driver.elementsByTagName("a");
        expect(await els[0].text()).to.equal("i am a link");
        expect(await els[0].isDisplayed()).to.equal(true);
        expect(await els[0].getAttribute("href")).to.contain("test-page2/");
    });
    it("Test input has default text and can be changed", async () => {
        let el = await driver.elementById("i_am_a_textbox ");
        expect(await el.getValue()).to.equal("i has no focus");
        expect(await el.isDisplayed()).to.equal(true);
        await el.clear();
        expect(await el.getValue()).to.equal("");
        await el.sendKeys("i am changed");
        expect(await el.getValue()).to.equal("i am changed");
    });
    it("Test checkbox have default values and we change their values", async () => {
        let cbox1 = await driver.elementById("unchecked_checkbox");
        expect(await cbox1.isDisplayed()).to.equal(true);
        expect(Boolean(await cbox1.getAttribute("checked"))).to.equal(false);
        let cbox2 = await driver.elementById("checked_checkbox");
        expect(await cbox2.isDisplayed()).to.equal(true);
        expect(Boolean(await cbox2.getAttribute("checked"))).to.equal(true);
        await cbox1.click();
        expect(Boolean(await cbox1.getAttribute("checked"))).to.equal(true);
        await cbox2.click();
        expect(Boolean(await cbox2.getAttribute("checked"))).to.equal(false);
    });
    it("Test label for email set focus on email input", async () => {
        async function findLabelFor(id) {
            let els = await driver.elementsByTagName("label");
            for (let el of els) {
                let attr = await el.getAttribute("for");
                if(attr === id) {
                    return el;
                }
            }
        }
        let el = await findLabelFor("fbemail");
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.text()).to.equal("Email:");
        await el.click();
        // get focused element
        el = await driver.active();
        let elid = await el.getAttribute("id");
        expect(elid).to.equal("fbemail");
    });
    it("Test email input is disaplyed and has all the proper attributes", async () => {
        let el = await driver.elementById("fbemail");
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.getAttribute("name")).to.equal("fbemail");
        expect(await el.getAttribute("placeholder")).to.equal("We would really like to follow up!");
        expect(await el.getAttribute("size")).to.equal("50");
    });
    it("Test textarea has the proper attributes and data is submited", async () => {
        let el = await driver.elementById("comments");
        expect(await el.isDisplayed()).to.equal(true);
        expect(await el.getAttribute("placeholder")).to.equal("Thanks in advance, this is really helpful.");
        await el.sendKeys("This is a comment made by automation");
        await driver.hideKeyboard();
        let btt = await driver.elementById("submit");
        expect(await btt.isDisplayed()).to.equal(true);
        expect(await btt.isEnabled()).to.equal(true);
        expect(await btt.getValue()).to.equal("send");
        await btt.click();
        // this page is not mobile friendly so the button cant be clicked
        // but we can trigger the form submition by calling javascript code thru appium
        await driver.execute("formsubmit()");
        el = await driver.elementById("your_comments");
        expect(await el.isDisplayed()).to.equal(true)
        expect(await el.text()).to.equal("Your comments: This is a comment made by automation");
    });
    it("Test we can execute javascript in the browser as example", async () => {
        await driver.execute("document.location.reload()");
        await driver.execute("document.getElementById('i_am_an_id').innerText = navigator.language");
        let el = await driver.elementById("i_am_an_id");
        expect(await el.text()).to.equal("en-US");
    });
});