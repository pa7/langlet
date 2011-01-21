<?php 
	$text = $_GET["text"];
	$from = $_GET["from"];
	$to = $_GET["to"];
	$url = "http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q=".urlencode($text)."&langpair=".$from."|".$to;
	if(strlen($url)<=5000){
	$ch = curl_init($url);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
	$content = curl_exec( $ch );
	$response = curl_getinfo( $ch );
	curl_close ( $ch );
?>
(function(){
		var response = <?php echo urldecode($content); ?>;
		if(response.responseStatus == 200)
			window.lL.translatedText(response.responseData.translatedText);
})();
<?php 
	}else{
?>		
(function(){
		window.lL.translatedText("Sorry, your text was too long");
})();
<?php		
	}
?>