<?php
require_once("../inc/config.inc.php");
require_once("../classes/DiceGame.php");

$connection = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($connection->connect_errno) {
    echo "Failed to connect to MySQL: (" . $connection>connect_errno . ") " . $connection->connect_error;
    die();
}

$Game = new DiceGame($connection);

if(isset($_POST["action"]) && $_POST["action"] == "dice_start")
{
    if (!$Game->isRunning() && isset($_POST["stake"]) && $_POST["stake"] > 0)
    {
        echo json_encode($Game->newGame($_POST["stake"]));
    } else if($Game->isRunning())
    {
        echo json_encode(["message" => "Es läuft bereits ein Spiel mit dir.<br /><br />
                                        Du kannst dein Spiel fortsetzen, indem du einfach die Würfel fliegen lässt ;)"]);
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "dice_roll")
{
    if ($Game->isRunning())
    {
        echo json_encode($Game->roll());
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "dice_end")
{
    if ($Game->isRunning())
    {
        echo json_encode($Game->onFinished());
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "get_player_money")
{
    echo json_encode($Game->getPlayerMoney());
}
?>