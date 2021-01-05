<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico">
    <link rel="stylesheet" type="text/css" href="./css/style.css">
    <title>Dice - Test</title>
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
                    <!-- <li><img height="30" width="30" src="./img/dice_1"></li>
                    <li><img height="30" width="30" src="./img/dice_2"></li>
                    <li><img height="30" width="30" src="./img/dice_3"></li>
                    <li><img height="30" width="30" src="./img/dice_4"></li>
                    <li><img height="30" width="30" src="./img/dice_5"></li> -->
                </ul>

                <div class="clear"></div>

                <label style="display: block; border-bottom: 1px solid rgb(122, 98, 62);">Taverne</label>
                <ul id="tavern-result">
                    <!-- <li><img height="30" width="30" src="./img/dice_5"></li>
                    <li><img height="30" width="30" src="./img/dice_4"></li>
                    <li><img height="30" width="30" src="./img/dice_3"></li>
                    <li><img height="30" width="30" src="./img/dice_2"></li>
                    <li><img height="30" width="30" src="./img/dice_1"></li> -->
                </ul>

                <div class="controls">
                    <label class="dice-label">Guthaben:</label>
                    <label id="money" class="dice-label"></label>
                    <label for="stake" class="dice-label block">Einsatz</label>
                    <input type="number" id="stake" class="dice-control" name="stake" />
                    <input type="submit" id="btn-stake" class="btn" name="dice_stake" value="Setzen" disabled />
                    <input type="submit" id="btn-start" class="btn" name="dice_start" value="Würfeln" disabled />
                    <input type="submit" id="btn-end" class="btn" name="dice_end" value="Auflösen" disabled />
                </div>
            </div>
        </div>
    </div>

    <div id="notifications" class="notifications">
        
    </div>

    <script src="./js/core.js"></script>
</body>

</html>