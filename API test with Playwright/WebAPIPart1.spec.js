const  {test, expect, request} = require('@playwright/test');

const host = 'https://rahulshettyacademy.com/client';
const loginPayload = {userEmail: "samgreen@qa.com", userPassword: "Qa_Password1"}

test.beforeAll( async() => {
    const apiContext = await request.newContest();
    const loginResponse = await apiContext.post(host, 
        {data: loginPayload}
    );

    await expect(loginResponse.ok).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    const token = await loginResponseJson.token;
});

test.beforeEach( async() => {

});

test('Client App login', async({page}) => {

});