<?php
error_reporting(0);
header('Content-type:text/html;charset=utf-8');
 //读取scenes
session_start();
$scene=$_SESSION['scenes'];
$url = "https://cloud.huaxio.cn/php/smdl/server/getstatus.php?scene=".$scene;
$response = file_get_contents($url);
echo $response;

?>