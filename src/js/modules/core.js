let btnDice = document.getElementById('btn-start');
let btnStake = document.getElementById('btn-stake');
let btnEnd = document.getElementById('btn-end');
let btnNew = document.getElementById("btn-new");
let cardNewGame = document.querySelector(".new-game");
let money = document.getElementById("money");
let stake = document.getElementById("stake");
let soundManager = document.getElementById("sound");

const TURNS_BEFORE_END = 3;
const MAX_TURNS_BEFORE_END = 5;

window.addEventListener("load", () => {
    getPlayerMoney();
});

stake.addEventListener("input", () => {
    if (!isNaN(stake.value) && stake.value > 0)
        btnStake.removeAttribute("disabled");
    else {
        btnStake.setAttribute("disabled", "");
        
    }
});

btnStake.addEventListener("click", () => {
    startGame(stake.value);
});

btnDice.addEventListener("click", () => {
    playSound("./audio/dice.mp3");
    roll();
});

btnDice.addEventListener("touchend", (evt) => {
    playSound("./audio/dice.mp3");
    roll();

    evt.preventDefault();
});

btnEnd.addEventListener("click", () => {
    finishGame();
});

btnNew.addEventListener("click", () => {
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

    cardNewGame.style.display = "none";
    stake.removeAttribute("disabled");
});

function startGame(stake) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let response = JSON.parse(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (response.message && response.message.length > 0) {
                showNotification(response.message);
            }

            if (!isNaN(response.money))
                money.innerHTML = response.money;

            btnStake.setAttribute("disabled", "");
            btnDice.removeAttribute("disabled");
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            if (response.message && response.message.length > 0) {
                showNotification(response.message);
            }

            btnStake.removeAttribute("disabled");
            btnDice.setAttribute("disabled", "");
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_start&stake=" + stake);
}

function roll() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let response = JSON.parse(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(response);

            if (response.player_values.length >= TURNS_BEFORE_END) {
                btnEnd.removeAttribute("disabled");
            }

            addResult("player-result", response.player_values);

            // Solange wir würfeln erzeugen wir für die Taverne Würfel mit Fragezeichen
            let tavern_values = [];
            response.player_values.forEach((result) => {
                tavern_values.push("0");
            });
            addResult("tavern-result", tavern_values, 500);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            finishGame();
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_roll");
}

function finishGame() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let response = JSON.parse(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // console.log(response.player_values);
            // console.log(response.tavern_values);

            addResult("player-result", response.player_values);
            addResult("tavern-result", response.tavern_values);

            switch (response.won) {
                case 0: {
                    playSound("./audio/game_over.mp3");
                    showNotification("Es tut uns leid :-(<br /><br />Du hast leider verloren");

                    break;
                }
                case 1: {
                    playSound("./audio/won.mp3");
                    showNotification("Juppppiiiieee!!!<br /><br />Du hast gewonnen :-)");

                    break;
                }
                case 2: {
                    playSound("./audio/game_over.mp3");
                    showNotification("Sei nicht traurig...<br /><br />Bei einem unentschieden verliert man schließlich auch sein Einsatz nicht ;-)");
                    break;
                }
            }

            money.innerHTML = response.money;

            onGameFinished();
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            if (response.message && response.message.length > 0) {
                showNotification(response.message);
            }

            btnDice.removeAttribute("disabled");
            btnEnd.setAttribute("disabled", "");
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=dice_end");
}

function onGameFinished() {
    stake.value = null;
    stake.setAttribute("disabled", "");
    btnStake.setAttribute("disabled", "");
    btnDice.setAttribute("disabled", "");
    btnEnd.setAttribute("disabled", "");

    cardNewGame.style.display = "block";
}

function addResult(element, result, delay = 0) {
    let parent = document.getElementById(element);

    setTimeout(() => {
        // remove li elements from unordered list
        parent.querySelectorAll("li").forEach((item) => {
            item.remove();
        });

        for (let i = 0; i < result.length; i++) {
            let liNode = document.createElement("li");

            let imgNode = document.createElement("img");
            imgNode.setAttribute("height", "30");
            imgNode.setAttribute("width", "30");
            imgNode.setAttribute("src", './img/dice_' + result[i] + '.png');

            liNode.appendChild(imgNode);
            parent.appendChild(liNode);
        }
    }, delay);
}

function getPlayerMoney() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            money.innerHTML = JSON.parse(xhttp.responseText).money;
        }
    }

    xhttp.open("POST", "dice.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=get_player_money");
}

function showNotification(message, duration = 5000) {
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

            if (opacity <= 0) {
                notification.remove();
                clearInterval(clrIntervall);
            }
        }, 50);
    }, duration);
}

function playSound(sound) {
    soundManager.setAttribute("src", sound);

    soundManager.play();
}
