customerID = '21821034-8ad8-4c00-bfd4-b74e694066ba';
serverInterface.loggedIn(customerID, main);

const updateInterval = 1000;

var condition = {
    tag : [''],
    triggerValue: 0,
    merchant : '',
    saveValue : ''
}

async function main() {
    setInterval(function () {
        if(!serverInterface.running) {
            serverInterface.getTransactions(customerID, mostRecentTransaction);
        }
    }, updateInterval)
}

function mostRecentTransaction() {
    console.log("calledback");
    var date = new Date(serverInterface.lastData.result[0].originationDateTime);
    var transaction = serverInterface.lastData.result[0];
    serverInterface.lastData.result.forEach(function(element) {
        if(new Date(element.originationDateTime) - date > 0 && new Date(element.originationDateTime) - new Date() < 0) {
            date = new Date(element.originationDateTime);
            transaction = element;
        }
    });

    if(transaction.type == "CustomerToCustomerTransaction") {
        return;
    }

    //Pull conditions from the firebase database

    var placeholder = [Object.assign({}, condition)];
    placeholder[0].tag = ["Food and Dining"];
    placeholder[0].triggerValue = 10;
    placeholder[0].saveValue = 12;
    placeholder.forEach(function(element) {
        if(element.triggerValue == 0 && transaction.categoryTags.equals(element.tag)) {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED " + element.saveValue);
        }
        else if(-transaction.currencyAmount > element.triggerValue && element.tag[0] == '') {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED " + element.saveValue);
        }
        else if(transaction.categoryTags.equals(element.tag) && -transaction.currencyAmount > element.triggerValue) {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED " + element.saveValue);
        }
    })
}

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            return false;   
        }           
    }       
    return true;
}
Object.defineProperty(Array.prototype, "equals", {enumerable: false});