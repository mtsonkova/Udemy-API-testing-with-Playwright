const  {test, expect, request} = require('@playwright/test');

const host = 'https://rahulshettyacademy.com/client';
const loginPayload = {userEmail: "samgreen@qa.com", userPassword: "Qa_Password1"}
let token;

const email = 'samgreen@qa.com';
const password = 'Qa_Password1';
const expectedProductsTitles = ['ZARA COAT 3', 'ADIDAS ORIGINAL', 'IPHONE 13 PRO'];
const expectedProduct = 'ZARA COAT 3';
const text = " Thankyou for the order. "

test.beforeAll( async() => {
    const apiContext = await request.newContest();
    const loginResponse = await apiContext.post(host, 
        {data: loginPayload}
    );

    await expect(loginResponse.ok).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
});

test.beforeEach( async() => {

});

test('Client App login', async({page}) => {
    await page.goto(host);

    //Login page form
    //await page.locator('#userEmail').fill(email);
    //await page.locator('#userPassword').fill(password);
    //await page.click('#login');
    //await page.waitForLoadState('networkidle');

    //add product to shoping cart

    const products = await page.locator('.card-body');

    const titles = await page.locator('.card-body b').allTextContents();
    let size = await products.count();

    for (let i = 0; i < size; ++i) {
        if (await products.nth(i).locator('b').textContent() === expectedProduct) {
            await products.nth(i).locator('text=Add To Cart').click();
            break;
        }
    }

    await page.locator('[routerlink*="cart"]').click();

   await page.locator('div li').first().waitFor();
    const isElementPresentInCart = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
   
    await expect(isElementPresentInCart).toBeTruthy();

    await page.locator('text = Checkout').click();

    //ToDo
    //select payment method and fill credit card details

    //Personal info
    let personalInfo = await page.locator('.form__cc');

    await personalInfo.locator('.text-validated').fill('5555 5555 5555 5555');

    await personalInfo.locator('select.ddl').first().selectOption('05');
   await personalInfo.locator('select.ddl').last().selectOption('15');

    //CVV CODE
    await personalInfo.locator('[type="text"]').nth(1).fill('123');

    //Name on card
    await personalInfo.locator('[type="text"]').nth(2).fill('Samantha Green');

    //Coupon
   // await personalInfo.locator('[type="text"]').nth(3).fill('RahulShettyAcademy');
    //Apply Coupon btn
    //await personalInfo.getByRole('button', {name : 'Apply Coupon'}).click();


    //Shipping information
    let userInfo = await page.locator('.user__name');
    let userMail = await userInfo.locator('input').first().inputValue();

    
//email
await expect(userMail).toEqual(email);
    

    await page.locator('[placeholder*="Country"]').pressSequentially('ind');
    let dropdown = await page.locator('.ta-results');
    await dropdown.waitFor();
      

    const numOfButtons = await dropdown.locator('button').count();

    for (let i = 0; i < numOfButtons; i++) {
        if (await dropdown.locator('button').nth(i).textContent() === ' Indonesia') {
            await dropdown.locator('button').nth(i).click();
            break;
        }
    }

    // click on place order btn
await page.click('text =Place Order');

//get h1 text
let msg = await page.locator('h1').first().textContent();

await expect(msg).toEqual(text);

let finalPageTitle = await page.locator('.box').first();
let orderIdRow = await finalPageTitle.locator('tr').last();
let orderText = await orderIdRow.locator('td').textContent();
let orderId = orderText?.split('|').filter(element => element.length > 1).toString().trim();

//click on orders btn
let navButtons = await page.locator('button.btn-custom');
await navButtons.nth(1).click();
let hasOrderId = false;

let th = await page.locator('tbody tr th');
let tr = await page.locator('tbody tr');
let currentIndex = 0;
await th.first().waitFor();
let thCount = await th.count();

for(let i = 0; i < thCount; i++) {
    let currentOrderId = await th.nth(i).textContent();
    if(currentOrderId === orderId) {
        hasOrderId = true;
        currentIndex = i;
        break;
    }
}

await expect(hasOrderId).toBeTruthy();
// click on view button
await tr.nth(currentIndex).getByRole('button').first().click();

//TODO Check if OrderID on this row equals

let title = await page.locator('div.email-title').textContent();
await expect(title).toEqual(' order summary ');

let orderIdOrderSummary = await page.locator('div.col-text').first().textContent();

await expect(orderIdOrderSummary).toEqual(orderId);

});