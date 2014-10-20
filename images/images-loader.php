<?php

 $directory = getcwd();

 if ( ! is_dir($directory)) {
 exit('Invalid directory path');
 }

 $files = array();

 foreach (scandir($directory) as $file) {
  	if ('.' === $file || '..' === $file || 'images-loader.js' === $file || 'images-loader.php' === $file) continue;

 	$files[] = $file;
 }

 echo json_encode($files);
 
?>