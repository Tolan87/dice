<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico">
    <link rel="stylesheet" type="text/css" href="./css/style.css">
    <title>Dice - Game</title>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <span style="font-weight: bold">DICE GAME</span>
            </div>
            <div class="card-body">
                <label style="display: block; border-bottom: 1px solid rgb(122, 98, 62);">Spieler</label>
                <ul id="player-result">
                </ul>

                <div class="clear"></div>

                <label style="display: block; border-bottom: 1px solid rgb(122, 98, 62);">Taverne</label>
                <ul id="tavern-result">
                </ul>

                <div class="controls">
                    <label class="dice-label">Guthaben:</label>
                    <label id="money" class="dice-label"></label>
                    <fieldset>
                        <label for="stake" class="dice-label block">Einsatz</label>
                        <input type="number" id="stake" class="dice-control" name="stake" />
                        <input type="submit" id="btn-stake" class="btn" name="dice_stake" value="Setzen" disabled />
                        <input type="submit" id="btn-start" class="btn" name="dice_start" value="Würfeln" disabled />
                        <input type="submit" id="btn-end" class="btn" name="dice_end" value="Auflösen" disabled />
                    </fieldset>
                    <input type="submit" id="btn-new" class="btn" name="dice_new" style="display: none" value="Neues Spiel starten" />
                </div>
            </div>
        </div>

        <footer>
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
        </footer>

        <div id="notifications" class="notifications">
        </div>
    </div>

    <audio id="sound" src="" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>

    <script src="./js/app.bundle.js"></script>
</body>

</html>
