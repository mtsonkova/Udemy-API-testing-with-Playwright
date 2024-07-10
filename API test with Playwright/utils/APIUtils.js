const host = 'https://rahulshettyacademy.com/api';



class APIUtils {
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {

        const loginEndpoint = host + "/ecom/auth/login"
        const loginResponse = await this.apiContext.post(loginEndpoint,
            { data: this.loginPayLoad }
        );      
        const loginResponseJson = await loginResponse.json();
        let token = loginResponseJson.token;
        return token;
    }

    async createOrder(orderPayLoad) {
        const createOrderEndpoint = host + '/ecom/order/create-order';

        let responseObj = {};
        responseObj.token = await this.getToken();
        const orderResponse = await this.apiContext.post(createOrderEndpoint,
            {
                data: orderPayLoad,
                headers: {
                    'Authorization': responseObj.token,
                    'Content-Type': 'application/json'
                }
            })
            const orderResponseJson = await orderResponse.json();
           
            const orderId = orderResponseJson.orders[0];
            responseObj.orderId = orderId;
        return responseObj;
    }
}

module.exports = {APIUtils};

