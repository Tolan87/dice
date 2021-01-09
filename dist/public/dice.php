<?php
require_once("../inc/config.inc.php");
require_once("../classes/Game/Dice.php");

try {
    $pdo = new PDO("mysql:host=". DB_HOST . ";dbname=" .DB_NAME, DB_USER, DB_PASSWORD);
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
 }

$Game = new Game\Dice($pdo);

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