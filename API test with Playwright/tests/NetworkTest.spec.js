const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
const { TIMEOUT } = require('dns');
let apiUtils;
let responseObj;

const loginPayLoad = { userEmail: "samgreen@qa.com", userPassword: "Qa_Password1" };
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45" }] };
const fakeEmtyOrdersPayload = { "data": [], "message": "No Orders" };

test.beforeAll(async () => {

    const apiContext = await request.newContext();
    apiUtils = new APIUtils(apiContext, loginPayLoad);
    responseObj = await apiUtils.createOrder(orderPayLoad);
});

test.beforeEach(async () => {

});

test.afterEach(async () => {

})

test('Test that CreateOrder API creates an Order Fake Response', async ({ browser }) => {

    let context = await browser.newContext();
    let page = await context.newPage();

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, responseObj.token);

    let ordersEndpoint = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*';

    await page.goto('https://rahulshettyacademy.com/client');

    // convert the payload to JSON 
    let body = JSON.stringify(fakeEmtyOrdersPayload);
    // route to mocked empty orders page
    await page.route(ordersEndpoint,
        async route => {
            //intercept the server response and send mocked response to the browser to render
            let ordersPageResponse = await page.request.fetch(route.request());
            route.fulfill({
                ordersPageResponse,
                body
            })
        }
    )

    await page.locator('button.btn.btn-custom').nth(1).click();
    await page.waitForResponse(ordersEndpoint);
    let text = await page.locator('.mt-4');
    await expect(text).toContainText(' You have No Orders to show at this time.');
    //const rows = await page.locator("tbody tr");  

});

test('Security test request intercept', async ({ browser }) => {

    let context = await browser.newContext();
    let page = await context.newPage();

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, responseObj.token);

    let ordersEndpoint = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*';

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('button:has-text("ORDERS")').click();
    let requestUrl = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*';

    await page.route(requestUrl,
        async route => {
            route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=668f9837ae2afd4c0b204566' })
        }
    )
    await page.locator('button:has-text("View")').first().click();
    let warningMsg = await page.locator('p.blink_me').textContent();
    console.log(warningMsg);
    await expect(warningMsg.includes('You are not authorize to view this order')).toBeTruthy();

});

test.only('Abort network call', async({browser}) => {
    let context = await browser.newContext();
    let page = await context.newPage();

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, responseObj.token);

   

   await page.route('**/*.{jpg, png, jpeg}', route => route.abort());
    await page.goto('https://rahulshettyacademy.com/client');

    page.pause();   

})