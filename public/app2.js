var customerID = 'd7b518ac-b11d-4e18-9ace-6c24342a7c6b';
serverInterface.loggedIn(customerID, main);

const updateInterval = 1000;

var condition = {
    tag : [''],
    triggerValue: 0,
    merchant : '',
    saveValue : ''
}

var allConditions = [];

async function main() {
    console.log('init')
    setupWelcome();
    setInterval(function () {
        if(!serverInterface.running) {
            console.log("123")
            serverInterface.getTransactions(customerID, mostRecentTransaction);
        }
    }, updateInterval)
}

const tableHeader = ['Tag', 'Trigger Value', 'Save Value']

function hideAdd() {
    let main = document.getElementById("main");
    let add = document.getElementById("add");
    add.style.display = "none";
    main.style.display = "block";
}

function hideForm() {
    event.preventDefault()
    //assets.cash += salary;
}

function hideMain() {
    let main = document.getElementById("main");
    let add = document.getElementById("add");
    add.style.display = "block";
    main.style.display = "none";
}

function saveNewCondition(data) {
    let x = Object.assign({}, condition);
    x.tag = [data.tag.value];
    x.triggerValue = data.triggerValue.value;
    x.saveValue = data.saveValue.value;
    allConditions.push(x);
    hideAdd();
    allConditions.forEach(function(element) {
        console.log(element);
    })
    generateConditionTableHead(tableHeader);
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

    console.log(transaction)

    allConditions.forEach(function(element) {
        if(element.triggerValue == 0 && transaction.categoryTags.equals(element.tag)) {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED 1 " + element.saveValue);
        }
        else if(Math.abs(transaction.currencyAmount) > element.triggerValue && element.tag[0] == '') {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED 2 " + element.saveValue);
        }
        else if(transaction.categoryTags.equals(element.tag) && Math.abs(transaction.currencyAmount) > element.triggerValue) {
            serverInterface.autoSave(element.saveValue);
            console.log("SAVED 3 " + element.saveValue);
        }
    })
}

function generateConditionTableHead(data) {
    var table = document.getElementById('table');
    table.innerHTML = '';
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
    generateTable(table, allConditions)
  }

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        //tag
        let cell = row.insertCell();
        let text = document.createTextNode(element.tag[0]);
        cell.appendChild(text);
        //triggerValue
        cell = row.insertCell();
        text = document.createTextNode(element.triggerValue);
        cell.appendChild(text);
        //saveValue
        cell = row.insertCell();
        text = document.createTextNode(element.saveValue);
        cell.appendChild(text);
    }
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