var savingsAccount;
var chequingAccount;

let getData = {
    method: 'GET',
    headers: {
        'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiMDllNzI2NDQtNzU3OC0zOWY2LTkyNDAtOTA2NDVkMDU4NDk3IiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiI1MjZjYzFkOC02ZDBiLTRkNDMtOThjMS0xNTY3OGE0ZTM5NWQifQ.5I2chN-M70VNsLsm70CFgKCDHMfgqlAnwupqB6o3KnU'
    }
}

let pushData = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiMDllNzI2NDQtNzU3OC0zOWY2LTkyNDAtOTA2NDVkMDU4NDk3IiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiI1MjZjYzFkOC02ZDBiLTRkNDMtOThjMS0xNTY3OGE0ZTM5NWQifQ.5I2chN-M70VNsLsm70CFgKCDHMfgqlAnwupqB6o3KnU'
    }
}

var first = true;

const serverInterface = {
    running : false,
    lastData : 0,
    customerTest(callback) {
        var myRequest = new Request('https://api.td-davinci.com/api/customers/d7b518ac-b11d-4e18-9ace-6c24342a7c6b', getData);
        
        fetch(myRequest)
        .then(response => response.json())
        .then(json => {
            console.log(json.result.givenName)
            callback(json.result.givenName)
        })
    },
    loggedIn(customerID = '', callback = {}) {
        let request = new Request('https://api.td-davinci.com/api/customers/' + customerID + '/accounts', getData);
        fetch(request)
        .then(response => response.json())
        .then(json => {
            let bankAccounts = json.result.bankAccounts;
            bankAccounts.forEach(function(element) {
                if(element.type == "DDA") {chequingAccount = element.id;}
                if(element.type == "SDA") {savingsAccount = element.id;}
            })
            callback();
        });
    },
    getTransactions(customerID, callback) {
        this.running = true;
        let request = new Request('https://api.td-davinci.com/api/customers/' + customerID + '/transactions', getData);
        fetch(request)
        .then(response => response.json())
        .then(json => {
            if(first) {
                first = false;
                this.lastData = json;
                this.running = false;
            }
            else{
                if(this.lastData.result.length != json.result.length) {
                    this.lastData = json;
                    callback();
                }
                else{
                    this.running = false;
                }
            }
        });
    },
    autoSave(amount) {
        let xfer = {
            "amount": amount,
            "currency": "CAD",
            "fromAccountId": chequingAccount,
            "toAccountId": savingsAccount,
            "receipt": "{ \"Note\": \"AutoSave automatically saved you $" + amount + "\" }",
        }
            fetch('https://api.td-davinci.com/api/transfers', {method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiMDllNzI2NDQtNzU3OC0zOWY2LTkyNDAtOTA2NDVkMDU4NDk3IiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiI1MjZjYzFkOC02ZDBiLTRkNDMtOThjMS0xNTY3OGE0ZTM5NWQifQ.5I2chN-M70VNsLsm70CFgKCDHMfgqlAnwupqB6o3KnU'
            }, 
            body: JSON.stringify(xfer)})
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(error => console.error('Error:', error));
    }
};

