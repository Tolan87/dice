<?php
require_once("../inc/config.inc.php");
require_once("../src/Games/Dice.php");

session_start();

if (!isset($_SESSION["player_id"]) || empty($_SESSION["player_id"]))
{
    http_response_code(401);
    echo json_encode(["message" => "Es wurde keine gültige Anmeldung gefunden"]);
    die();
}

try {
    $pdo = new PDO("mysql:host=". DB_HOST . ";dbname=" .DB_NAME, DB_USER, DB_PASSWORD);
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
 }

$Game = new Games\Dice($pdo);

if(isset($_POST["action"]) && $_POST["action"] == "dice_start")
{
    $is_game_active = $Game->isActive($_SESSION["player_id"]);

    if (!$is_game_active && isset($_POST["stake"]) && !empty($_POST["stake"]))
    {
        echo json_encode($Game->newGame($_POST["stake"], $_SESSION["player_id"]));
    } else if($is_game_active)
    {
        echo json_encode(["message" => "Es läuft bereits ein Spiel mit dir.<br /><br />
                                        Du kannst dein Spiel fortsetzen, indem du einfach die Würfel fliegen lässt ;)"]);
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "dice_roll")
{
    if ($Game->isActive($_SESSION["player_id"]))
    {
        echo json_encode($Game->roll($_SESSION["player_id"]));
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "dice_end")
{
    if ($Game->isActive($_SESSION["player_id"]))
    {
        echo json_encode($Game->onFinished($_SESSION["player_id"]));
    }
}

if(isset($_POST["action"]) && $_POST["action"] == "get_player_money")
{
    echo json_encode($Game->getPlayerMoney($_SESSION["player_id"]));
}
?>
