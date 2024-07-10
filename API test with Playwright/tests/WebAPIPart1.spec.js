const  {test, expect, request} = require('@playwright/test');

const host = 'https://rahulshettyacademy.com/api';
const loginPayload = {userEmail: "samgreen@qa.com", userPassword: "Qa_Password1"}
let token;

const email = 'samgreen@qa.com';
const password = 'Qa_Password1';
const expectedProductsTitles = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
const expectedProduct = 'ZARA COAT 3';
const text = " Thankyou for the order. "

test.beforeAll( async() => {
    const loginEndpoint = host + "/ecom/auth/login"
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post(loginEndpoint, 
        {data: loginPayload}
    );

    await expect(loginResponse.ok).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
   
    token = loginResponseJson.token;

    console.log(token);
});

test.beforeEach( async() => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);
});

test('Test that CreateOrder API creates an Order', async({page}) => {
 const createOrderEndpoint = host + '/ecom/order/create-order';
 const createOrderPayload = {orders: [{country: "Cuba", productOrderedId: "6581ca399fd99c85e8ee7f45"}]};

    const apiContext = await request.newContext();
    const createOrderResponse = apiContext.post(createOrderEndpoint,
        {
        data: createOrderPayload,
        headers: {
            'Authorization' : token,
            'Content-Type': 'application/json'
        }
    })
  

    //add product to shoping cart
await page.goto('https://rahulshettyacademy.com/client/');
    
});