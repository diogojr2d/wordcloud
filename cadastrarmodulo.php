<?php
// Le arquivo original
$filename = "js/wordcloud.json";
$originalFile = file_get_contents($filename);
$originalJSON = json_decode($originalFile);

$obj->parent = $_POST['fparent'];
$obj->title = $_POST['ftitle'];
$obj->info = $_POST['finfo'];

$myJSON = json_encode($obj);

echo $myJSON;
?>