<?php
include "conexion.php";
$conexion_bd = conectar_bd();

$ANCHO = $_GET["ANCHO"];
$ALTO = $_GET["ALTO"];

$X1 = $_GET["X1"];
$Y1 = $_GET["Y1"];

$X2 = $_GET["X2"];
$Y2 = $_GET["Y2"];

if (!$conexion_bd) {
    $m = oci_error();
    echo 'Error en la conexión con Oracle: ' . $m['message'];
}

$query = "select paquete_laberinto.laberinto($ANCHO, $ALTO, $X1, $Y1, $X2, $Y2) as RESULTADO from dual";
$statement = oci_parse($conexion_bd, $query);

if (!$statement) {
    $m = oci_error($conexion_bd);
    echo 'Error al generar la consulta: ' . $m['message'];
}

oci_define_by_name($statement, 'RESULTADO', $resultado);

$run = oci_execute($statement);

if (!$run) {
    $m = oci_error($statement);
    echo 'Error al ejecutar la consulta: ' . $m['message'];
}

while (oci_fetch($statement)) {
    echo $resultado;
}

oci_free_statement($statement);
oci_close($conexion_bd);
