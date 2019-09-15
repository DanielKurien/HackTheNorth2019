function setupWelcome() {
    serverInterface.customerTest(welcomeCallback);
}
function welcomeCallback(name) {
    document.getElementById('welcome').innerHTML = 'Welcome ' + name;
}
