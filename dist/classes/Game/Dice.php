<?php
namespace Game;

use \PDO;

class Dice {

    private $db;

    public function __construct($db_connection)
    {
        $this->db = $db_connection;
    }

    public function newGame($stake)
    {
        // Hole das aktuelle geld aus der Datenbank und starte nur wenn genug Geld vorhanden
        $player_current_money = self::getPlayerMoney()["money"];
        $player_new_money = $player_current_money - $stake;

        if ($player_new_money < 0) {
            http_response_code(400);
            return [
                "money" => $player_current_money,
                "message" => "Dein Einsatz ist " . $stake . ", dass übersteigt dein aktuelles Guthaben von " . $player_current_money
            ];
        }

        // Wenn genug Geld vorhanden, trage ein neues Spiel in die Datenbank ein
        $stmt = $this->db->prepare("INSERT INTO tavern (player_id, player_values, tavern_values, stake) VALUES (?, ?, ?, ?)");
        $stmt->bindParam(1, $player_id); // Hier sollte später die richtige id des nutzers benutzt werden z.B. $_SESSION["player_id"]
        $stmt->bindParam(2, $player_values);
        $stmt->bindParam(3, $tavern_values);
        $stmt->bindParam(4, $stake);
        $player_id = 1; 
        $player_values = "";
        $tavern_values = "";

        $stmt->execute();

        self::_setPlayerMoney($player_new_money);

        return [
            "money" => $player_new_money,
            "message" => "Du hast " . $stake . " als Einsatz gesetzt.<br /><br /> Das Spiel hat begonnen, du kannst jetzt würfeln."
        ];
    }

    public function roll()
    {
        // Hole hier die aktuellen Werte aus der Datenbank um den Spielefortschritt zu bekommen
        $current_state = self::_getCurrentState();

        // Simuliere hier das würfeln
        array_push($current_state["player_values"], strval(random_int(1, 6)));
        array_push($current_state["tavern_values"], strval(random_int(1, 6)));

        // Schreibe neue Werte nachdem würfeln wieder zurück in die Datenbank
        self::_setState($current_state);

        $player_values_count = count($current_state["player_values"]);
        $tavern_values_count = count($current_state["tavern_values"]);

        // Check hier ob 5 Runden gespielt wurden, wenn ja ist das Spiel vorbei und nicht mehr aktiv
        if ($player_values_count >= DICE_MAX_TURNS_BEFORE_END || $tavern_values_count >= DICE_MAX_TURNS_BEFORE_END)
        {
            /* Fall ein spieler versucht dies zu umgehen, entferne immer
             * den letzten wert im array um immer nur so viele Werte
             * wie in DICE_MAX_TURNS_BEFORE_END definiert zu haben
            */
            if ($player_values_count > DICE_MAX_TURNS_BEFORE_END || $tavern_values_count > DICE_MAX_TURNS_BEFORE_END)
            {
                array_pop($current_state["player_values"]);
                array_pop($current_state["tavern_values"]);

                // Setze Werte in der DB zurück
                self::_setState($current_state);
            }

            http_response_code(400);
            return;
        }

        /* Sende nachdem würfeln nur die Werte des Spielers zurück, 
         * da sonst über externe Programme die Response ausgelesen 
         * werden kann und man weiß welche Zahlen die Taverne gewürfelt hat
         */
        return ["player_values" => $current_state["player_values"]];
    }

    public function onFinished()
    {
        $stmt = $this->db->prepare("SELECT player_values, tavern_values, stake FROM tavern WHERE player_id = ?");

        $stmt->execute(array(1)); // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $player_values = explode(" ", $result["player_values"]);
        $tavern_values = explode(" ", $result["tavern_values"]);
        $stake = $result["stake"];

        // Prüfen ob der Spieler versucht das spiel aufzulösen, obwohl die mindest anzahl an Runden nicht erfüllt ist
        if (count($player_values) < DICE_TURNS_BEFORE_END || count($tavern_values) < DICE_TURNS_BEFORE_END)
        {
            http_response_code(400);
            return [
                "message" => "Das Spiel aufzulösen ist noch nicht möglich. <br /><br /> Du musst mindestens " . DICE_TURNS_BEFORE_END . " Runden spielen."
            ];
        }

        // Werte aus dem array zusammen rechnen
        $player_sum = array_sum($player_values);
        $tavern_sum = array_sum($tavern_values);

        // Subtrahiere 17 von der Summe und bekomme mit abs() nur positive Werte um dann zu prüfen wer näher an der 17 ist
        $player_sum = abs($player_sum - 17);
        $tavern_sum = abs($tavern_sum - 17);

        $player_current_money = self::getPlayerMoney()["money"];

        if ($player_sum > $tavern_sum) 
        {
            self::_deleteGameOnFinished();

            return ["player_values" => $player_values,
                    "tavern_values" => $tavern_values,
                    "won" => 0,
                    "money" => $player_current_money];
        }
        else if($player_sum < $tavern_sum)
        {
            $player_new_money = $player_current_money + (2 * $stake);

            self::_setPlayerMoney($player_new_money);

            self::_deleteGameOnFinished();

            return ["player_values" => $player_values,
                    "tavern_values" => $tavern_values,
                    "won" => 1,
                    "money" => $player_new_money];
        } 

        // Wenn nicht verloren und nicht gewonnen ist es unentschieden, spieler bekommt sein Einsatz zurück
        $player_new_money = $player_current_money + $stake;

        self::_setPlayerMoney($player_new_money);

        self::_deleteGameOnFinished();

        return ["player_values" => $player_values,
                "tavern_values" => $tavern_values,
                "won" => 2,
                "money" => $player_new_money];
    }

    public function isRunning()
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) AS count FROM tavern WHERE player_id = ?");

        $stmt->execute(array(1));// Hier sollte später die richtige id des nutzers benutzt werden z.B. $_SESSION["player_id"]
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($result["count"]))
            return false;

        return true;
    }

    public function getPlayerMoney()
    {
        $stmt = $this->db->prepare("SELECT money FROM players WHERE id = ?");
         
        $stmt->execute(array(1)); // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    private function _getCurrentState() 
    {
        $stmt = $this->db->prepare("SELECT player_values, tavern_values FROM tavern WHERE player_id = ?");

        $stmt->execute(array(1)); // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $player_values = array();
        $tavern_values = array();

        if (!empty($result["player_values"]))
        {
            $player_values = explode(" ", $result["player_values"]);
            $tavern_values = explode(" ", $result["tavern_values"]);
        }

        return ["player_values" => $player_values, 
                "tavern_values" => $tavern_values];
    }

    private function _setState($new_state)
    {
        $stmt = $this->db->prepare("UPDATE tavern SET player_values = ?, tavern_values = ? WHERE player_id = ?");
        $stmt->bindParam(1, $player_arr);
        $stmt->bindParam(2, $tavern_arr);
        $stmt->bindParam(3, $player_id);

        $player_arr = implode(" ", $new_state["player_values"]); // Die Funktion implode macht aus dem array ein string mit Leerzeichen als Trennzeichen
        $tavern_arr = implode(" ", $new_state["tavern_values"]); // Die Funktion implode macht aus dem array ein string mit Leerzeichen als Trennzeichen
        $player_id = 1; // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]

        $stmt->execute();
    }

    private function _deleteGameOnFinished()
    {
        $stmt = $this->db->prepare("DELETE FROM tavern WHERE player_id = ?");
        $stmt->bindParam(1, $player_id);

        $player_id = 1; // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]

        $stmt->execute();
    }

    private function _setPlayerMoney($money)
    {
        $stmt = $this->db->prepare("UPDATE players SET money = ? WHERE id = ?");
        $stmt->bindParam(1, $money);
        $stmt->bindParam(2, $player_id);

        $player_id = 1; // Hier sollte später die richtige id des spielers benutzt werden z.B. $_SESSION["player_id"]

        $stmt->execute();
    }
}
?>