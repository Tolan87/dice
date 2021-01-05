let btnDice = document.getElementById('btn-start');
let btnStake = document.getElementById('btn-stake');
let btnEnd = document.getElementById('btn-end');
let money = document.getElementById("money");
let stake = document.getElementById("stake");

const TURNS_BEFORE_END = 3;
const MAX_TURNS_BEFORE_END = 5;

window.addEventListener("load", () => {
    getPlayerMoney();
});

stake.addEventListener("input", () => {
    if (!isNaN(stake.value) && stake.value > 0)
        btnStake.disabled = false;
    else {
        btnStake.disabled = true;
    }
});

btnStake.addEventListener("click", () => {
    startGame(stake.value);
});

btnDice.addEventListener("click", () => {
    roll();
});

btnEnd.addEventListener("click", () => {
    finishGame();

    stake.disabled = true;
    btnStake.disabled = true;
    btnDice.disabled = true;
    btnEnd.disabled = true;
});

function startGame(stake) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        let response = JSON.parse(xhttp.responseText);
        
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            if (response.message && response.message.length > 0)
            {
                showNotification(response.message);
            }

            if (!isNaN(response.money))
                money.innerHTML = response.money;
            
            btnStake.disabled = true;
            btnDice.disabled = false;
        }
        else if (xhttp.readyState == 4 && xhttp.status == 400) {
            if (response.message && response.message.length > 0)
            {
                showNotification(response.message);
            }

            btnStake.disabled = false;
            btnDice.disabled = true;
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_start&stake=" + stake);
}

function roll() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        let response = JSON.parse(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            console.log(response);

            if (response.player_values.length >= TURNS_BEFORE_END)
            {
                btnEnd.disabled = false;
            }

            addPlayerResult(response.player_values);

            // Solange wir würfeln erzeugen wir für die Taverne Würfel mit Fragezeichen
            let tavern_values = [];
            response.player_values.forEach((result) => {
                tavern_values.push("0");
            });

            addTavernResult(tavern_values);
        }
        else if (xhttp.readyState == 4 && xhttp.status == 400) 
        {
            if (response.message && response.message.length > 0)
            {
                showNotification(response.message);
            }

            finishGame();
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_roll");
}

function finishGame() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        let response = JSON.parse(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
                // console.log(response.player_values);
                // console.log(response.tavern_values);

                addPlayerResult(response.player_values);
                addTavernResult(response.tavern_values);

                switch (response.won)
                {
                    case 0:
                    {
                        showNotification("Es tut uns leid :-(<br /><br />Du hast leider verloren");
                        break;
                    }
                    case 1:
                    {
                        showNotification("Juppppiiiieee!!!<br /><br />Du hast gewonnen :-)");
                        break;
                    }
                    case 2:
                    {
                        showNotification("Sei nicht traurig...<br /><br />Bei einem unentschieden verliert man schließlich auch sein Einsatz nicht ;-)");
                        break;
                    }
                }

                money.innerHTML = response.money;

                resetGameControls();
        } 
        else if (xhttp.readyState == 4 && xhttp.status == 400) 
        {
            if (response.message && response.message.length > 0)
            {
                showNotification(response.message);
            }

            btnDice.disabled = false;
            btnEnd.disabled = true;
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_end");
}

function resetGameControls()
{
    stake.value = null;
    stake.disabled = false;
    btnStake.disabled = true;
    btnDice.disabled = true;
    btnEnd.disabled = true;

    let i = 10;
    let clearInt = setInterval(() => {
        showNotification("Spiel startet neu in " + i +" sekunden", 1000);
        i--;

        if (i == 0)
            clearInterval(clearInt);
    }, 1000);

    setTimeout(() => {
        document.getElementById("player-result").querySelectorAll("li").forEach((item, index) => {
            setTimeout(() => {
                item.remove();
            }, 250 + (index * 250));
        });

        document.getElementById("tavern-result").querySelectorAll("li").forEach((item, index) => {
            setTimeout(() => {
                item.remove();
            }, 250 + (index * 250));
        });
    }, 10000);
}

function addPlayerResult(result)
{
    let parent = document.getElementById("player-result");
    
    // remove li elements from unordered list
    parent.querySelectorAll("li").forEach((item) => {
        item.remove();
    });

    for (let i = 0;i < result.length; i++) {
        let liNode = document.createElement("li");

        let imgNode = document.createElement("img");
        imgNode.setAttribute("height", "30");
        imgNode.setAttribute("width", "30");
        imgNode.setAttribute("src", './img/dice_' + result[i] + '.png');
        
        liNode.appendChild(imgNode);
        parent.appendChild(liNode);
    }
}

function addTavernResult(result)
{
    let parent = document.getElementById("tavern-result");
    
    // remove li elements from unordered list
    parent.querySelectorAll("li").forEach((item) => {
        item.remove();
    });

    for (let i = 0;i < result.length; i++) {
        let liNode = document.createElement("li");
        let imgNode = document.createElement("img");
        imgNode.setAttribute("height", "30");
        imgNode.setAttribute("width", "30");
        
        imgNode.setAttribute("src", './img/dice_' + result[i] + '.png');

        liNode.appendChild(imgNode);
        parent.appendChild(liNode);
    }
}

function getPlayerMoney()
{
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            money.innerHTML = JSON.parse(xhttp.responseText).money;
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=get_player_money");
}

function showNotification(message, duration = 7500)
{
    let parent = document.getElementById("notifications");

    let notification = document.createElement("div");
    notification.style.opacity = 1;
    notification.setAttribute("class", "card notification");

    let notificationHeader = document.createElement("div");
    notificationHeader.setAttribute("class", "card-header notification-header");
    notificationHeader.innerHTML = "Meldung";

    let notificationBody = document.createElement("div");
    notificationBody.setAttribute("class", "card-body notification-body");
    notificationBody.innerHTML = message;

    notification.appendChild(notificationHeader);
    notification.appendChild(notificationBody);

    parent.appendChild(notification);

    let opacity = notification.style.opacity;

    setTimeout(() => {
        let clrIntervall = setInterval(() => { 
            opacity -= 0.075;
            notification.style.opacity = opacity;
    
            if (opacity <= 0)
            {
                notification.remove();
                clearInterval(clrIntervall);
            }
        }, 50);
    }, duration);
}