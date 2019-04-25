<?php
function conectar_bd()
{
    $user = "bases2";
    $pass = "bases2";
    $server = "localhost/xe";

    return oci_connect($user, $pass, $server);
}
