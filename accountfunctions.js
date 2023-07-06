function deletePuzzle(id) {
	if (confirm("Delete puzzle? This is irreversable!")) {
		var xmlhttp;
		if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var parray = xmlhttp.responseText;
				alert(parray);
				window.location.reload();
			}
		}
		xmlhttp.open("GET","deletePuzzle.php?id="+id,true);
		xmlhttp.send();	
	} else return;
}

function changePrivacy(id) {
	var xmlhttp;
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			window.location.reload();
		}
	}
	xmlhttp.open("GET","changePrivacy.php?id="+id,true);
	xmlhttp.send();	
}

function sharePuzzle(hash,isComp,pname) {
	var homedir = document.location.hostname;
	if (isComp=="1") {
		var divcontent = "<br>Share the puzzle " + pname + " with these links: <br><br><b>Builder link:</b> http://" + homedir + "/builder.php?puzzle=" + hash + "<br><br><b>Player link:</b> http://" + homedir + "/player.php?puzzle=" + hash + "<br><br>";
	} else {
		var divcontent = "<br>Share the puzzle " + pname + " with these links: <br><br><b>Builder link:</b> http://" + homedir + "/builder.php?puzzle=" + hash + "<br><br>";
	}
	document.getElementById("sharelinks").innerHTML = divcontent;
	document.getElementById("sharelinks").style.border="1px solid #0000FF";	
}