const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
let apiUtils = null;
let responseObj = null;
const host = 'https://rahulshettyacademy.com/api';
const loginPayLoad = { userEmail: "samgreen@qa.com", userPassword: "Qa_Password1" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45" }] };


test.beforeAll(async () => {

    const apiContext = await request.newContext();
    apiUtils = new APIUtils(apiContext, loginPayLoad);
    responseObj = await apiUtils.createOrder(orderPayLoad);
});

test.beforeEach(async () => {


});

test('Test that CreateOrder API creates an Order', async ({ page }) => {

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, responseObj.token);



    await page.goto('https://rahulshettyacademy.com/client/');
    await page.locator('button').nth(2).click();
    await page.locator('tbody').waitFor();

    const rows = await page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator('button').first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator('.col-text').textContent();
    await page.pause();
    await expect(orderId.includes(orderIdDetails)).toBeTruthy();

});