// Xword Builder 1.0
// Lucy Lu Wang 2012
// lucylw@uw.edu

// ---------------------------- Puzzle related functions ------------------------------

// Square data structure
function Sqr(xloc,yloc) {										
	this.x = xloc;
	this.y = yloc;
	this.w = e-2;
	this.h = e-2;
	this.content = ""; 		
	this.number = "";		
	this.fill = white;
}

function addSqr(xloc,yloc) {sqrs.push(new Sqr(xloc,yloc));}		// Creates new element for squares array

function drawSqr(sq) {											// Draws individual square defines by square array
	pctx.fillStyle = sq.fill;
	pctx.fillRect(sq.x,sq.y,sq.w,sq.h);
	pctx.fillStyle = "#222222";
	pctx.font = "16px sans-serif";
	pctx.fillText(sq.content,sq.x+e/4,sq.y+3*e/4);
	pctx.fillStyle = "#777777";
	pctx.font = "8px sans-serif";
	pctx.fillText(sq.number,sq.x,sq.y+8);
}

function drawSqrs() { 											// Draws squares specified in squares array
	clrPuzzle();
	var pnastr = "";
	if (pname) pnastr += pname;
	if (pauthor) pnastr += " by " + pauthor;
	pctx.fillStyle = "#222222";
	pctx.font = "16px sans-serif";
	pctx.fillText(pnastr,dist,dist);
	for (var i in sqrs) drawSqr(sqrs[i]); 
}

function initDraw() {											// Creates squares and draws them
	for (var i=1;i<=s;i++) for (var j=1;j<=s;j++) addSqr(2+e*i,2+e*j);
	drawSqrs();
}

// ------------------------------ Clue related functions -------------------------------

function Clue(num,dir,loc,nloc) {								// Clue data structure
	this.n = num;	//num is number of clue, can be duplicate
	this.d = dir;	//dir is direction; "a" for across, "d" for down
	this.l = loc;	//loc is index of sqrs where the clue starts, used to calculate p-coordinates
	this.nl = nloc;	//nloc is y location in a/d column
	this.x = 0;	// x,y are coordinates of clue location
	this.y = 0;
	this.content = "";
	this.fill = white;
}

function addClue(num,dir,loc,nloc) {cls.push(new Clue(num,dir,loc,nloc));}	// Creates new element for clues array

function generateClues() {										// Creates matrix of all clues from ptxt
	
	var changecount = false;
	var addacross = false;
	var adddown = false;
	var count = 1;
	var acount = 1;
	var dcount = 1;
	var pos,ind,line,lastline,nextline,nnextline;
	
	var lines = ptxt.split("/");
	
	var oldcls = cls;
	cls = [];
	
	for (var i=0;i<(lines.length-1);i++) {
		line = lines[i];
		for (var j=0;j<line.length;j++) {
			pos = calcSqrIndex(j+1,i+1);
			sqrs[pos].number = "";
			
			if (line[j] != "*") {
				// --------------- across ------------------
				// first column + at least 3 letters or left is blank + at least 3 letters
				if ((j==0 && line[j+1]!="*" && line[j+2]!="*") || (j>0 && j<(s-2) && line[j-1]=="*" && line[j+1]!="*" && line[j+2]!="*")) {
					sqrs[pos].number = count;
					changecount = true;
					addacross = true;
				}
				// --------------- down --------------------
				//first row + at least 3 letters
				if (i>0) lastline = lines[i-1];
				if (i<(s-2)) {
					nextline = lines[i+1];
					nnextline = lines[i+2];
				}
				
				if ((i==0 && nextline[j]!="*" && nnextline[j]!="*") || (i>0 && i<(s-2) && lastline[j]=="*" && nextline[j]!="*" && nnextline[j]!="*")) {
					sqrs[pos].number = count;
					changecount = true;
					adddown = true;
				}
			}
			
			// adds clues if either across or down detected
			if (changecount) {
				if (addacross) {
					addClue(count,"a",pos,acount);
					acount++;
				}
				if (adddown) {
					addClue(count,"d",pos,dcount);
					dcount++;
				}
				count++;
				changecount = false;
				addacross = false;
				adddown = false;
			}
		}
	}
	
	//append content information from old clue matrix to new when puzzle format changes
	if (oldcls != []) {
		for (i in cls) {
			ind = findIndClues(oldcls,cls[i].l,cls[i].d)
			if (ind != 999) cls[i].content = oldcls[ind].content;
		}
	}

}

function drawClue(cl) {											// Draws specific clue
	if (cl.y>=0) {
		cctx.clearRect(cl.x-20,cl.y,cluew+20,clueh);
		cctx.fillStyle = cl.fill;
		cctx.fillRect(cl.x,cl.y,cluew,clueh);
		cctx.fillStyle = black;
		cctx.font = "12px sans-serif";
		cctx.fillText(cl.n,cl.x-20,cl.y+20);
		if (cl.content.length<24) cctx.fillText(cl.content,cl.x+5,cl.y+20);
		else {	// overflow to second line
			cctx.font = "11px sans-serif";
			var cstr = cl.content;
			var cstrings = divide(cstr);
			cctx.fillText(cstrings.str1,cl.x+5,cl.y+12);
			cctx.fillText(cstrings.str2,cl.x+5,cl.y+maxdim);
		}
	}
}

function drawClues() {											// Draws all clues on right hand side of screen
	
	var x = dist;
	var y = ystart + dist;
	
	clrClues();								// clear old clues from canvas
	
	for (var i in cls) {					//draw all across clues
		if (cls[i].d == "a") {
			cls[i].x = x+20;
			cls[i].y = y-12;
			drawClue(cls[i]);
			y += clueh + 5;
		}
	}
	
	x += 2*dist + cluew;	
	y = ystart + dist;
	
	for (var i in cls) {					//draw all down clues
		if (cls[i].d == "d") {
			cls[i].x = x+20;
			cls[i].y = y-12;
			drawClue(cls[i]);
			y += clueh + 5;
		}	
	}
	
	y = dist;								//draw "Across" and "Down"
	cctx.clearRect(0,0,ccanvw,clueh+15);
	cctx.fillStyle = black;
	cctx.font = "16px sans-serif";
	cctx.fillText("Across",dist,y);
	cctx.fillText("Down",3*dist+cluew,y);
	
}

// -------------------------- Clue/Puzzle interactive functions ------------------------

function changeColor(xmouse,ymouse) {							// Change square color between black/white
	
	var x = Math.floor(xmouse/e);
	var y = Math.floor(ymouse/e);
	var pos = calcSqrIndex(x,y);			// changes mouseclick square
	
	if (pos!=999) {
		if (sqrs[pos].fill != black) {
			sqrs[pos].fill = black;
			sqrs[pos].content = "";
			sqrs[pos].number = "";
			} else sqrs[pos].fill = white;
		if (editSym) {							// changes opposite square
			var opppos = (s-x)*s + s - y;
			if (opppos!=pos && sqrs[opppos].fill!=sqrs[pos].fill) {
				if (sqrs[opppos].fill != black) {
					sqrs[opppos].fill = black;
					sqrs[opppos].content = "";							
					sqrs[opppos].number = "";
				} else sqrs[opppos].fill = white;
			}
		}
	}
	
	for (var i in sqrs) if (sqrs[i].fill!=black) sqrs[i].fill=white;
}

function colorLine(x,y,xdelta,ydelta,color) {					// Colors line in (xM,yM) direction starting at (x,y) with color
	var pos;
	var cont = true;
	var xactive = x;
	var yactive = y;
	
	while (cont) {									// adding xdelta and ydelta
		pos = calcSqrIndex(xactive,yactive);
		if (sqrs[pos].fill != black) {
			sqrs[pos].fill = color;
			drawSqr(sqrs[pos]);
		} else cont = false;
		xactive += xdelta;
		yactive += ydelta;
		if (xactive>s || yactive>s) cont = false;
	}
	
	xactive = x;
	yactive = y;
	cont = true;
	
	while (cont) {									// subtracting xdelta and ydelta
		pos = calcSqrIndex(xactive,yactive);
		if (sqrs[pos].fill != black) {
			sqrs[pos].fill = color;
			drawSqr(sqrs[pos]);
		} else cont = false;
		xactive -= xdelta;
		yactive -= ydelta;
		if (xactive<1 || yactive<1) cont = false;
	}
	
}

function changePFocus(xmouse,ymouse) {							// Change focus of editing cursor on pcanv
	
	var x = Math.floor(xmouse/e);
	var y = Math.floor(ymouse/e);
	var totalpos = calcSqrIndex(x,y);
	
	if (totalpos!=999 && sqrs[totalpos].fill!=black) {
		cfocus = false;
		pfocus = true;
		var oldpos = calcSqrIndex(xF,yF);

		colorLine(xF,yF,1,0,white);			// removes color from old selected squares
		colorLine(xF,yF,0,1,white);
		colorLine(x,y,xM,yM,select);		// colors new squares
	
		sqrs[totalpos].fill = highlight;
		drawSqr(sqrs[totalpos]);
	
		xF = x;
		yF = y;
	
		colorClue(select); 					//colors corresponding clue
	}
	
}

function changeCFocus(xmouse,ymouse) {							// Change focus of editing cursor on ccanv
	
	var xmin,ymin,xmax,ymax;			
	cfocus = true;
	pfocus = false;
	
    cls[cF].fill = white;
    drawClue(cls[cF]);
	
	for (var i in cls) {
		xmin = cls[i].x;
		ymin = cls[i].y;
		xmax = xmin + cluew;
		ymax = ymin + clueh;
		if ((xmouse>=xmin) && (xmouse<=xmax) && (ymouse>=ymin) && (ymouse<=ymax)) {
			cls[i].fill = highlight;
			cF = i;
			break;
		}
	}
	
	(cls[cF].d=="a") ? (xM=1, yM=0) : (xM=0, yM=1);					// change mvmt to match				
	
	colorPuzzle(select); 					// colors corresponding puzzle entry
	// pctx.fillStyle = "#222222";				// display focused clue under puzzle
	// pctx.font = "14px sans-serif";
	// pctx.fillText(cls[cF].content,e,(s+2)*e);
	
	drawClue(cls[cF]);
	
	document.getElementById("wordToSuggest").value=genCPuzz(cls[cF]);
	
}

function toNextSpace(xShift,yShift) {							// Shifts puzzle focus by (xShift,yShift)
	var cont = true;
	var xNew, yNew, pos;	
	var xcoord, ycoord;		
	
	xNew = xF;
	yNew = yF;
	
	while (cont) {
		if ((xNew==s && xShift==1) || (yNew==s && yShift==1) || (xNew==1 && xShift==-1) || (yNew==1 && yShift==-1)) cont = false;
		else {	
			xNew += xShift;
			yNew += yShift;
			xcoord = xNew*e+1;
			ycoord = yNew*e+1;
			pos = calcSqrIndex(xNew,yNew);;
			if (sqrs[pos].fill != black) {
				changePFocus(xcoord,ycoord);
				cont = false;
			}
		}
	}
}

function toNextClue(cShift) {									// Shifts clue focus by cShift
	var dir = cls[cF].d;
	var cNew = parseInt(cF);
	var cont = true;
	var newystart;
	
	while (cont) {
		if (cNew<=0 && cShift==-1) {			// if last or first across or down clue, jump
			cNew = cls.length;
			dir = (dir=="a") ? "d" : "a";
		}
		if (cNew>=cls.length-1 && cShift==1) {
			cNew = -1;
			dir = (dir=="a") ? "d" : "a";
		}
		cNew += cShift;
		if (cls[cNew].d==dir) {					// movements within across or down columns
			cls[cF].fill = white;
			cls[cNew].fill = highlight;
			
			var perpage = Math.floor(ccanvh/(clueh+5))-3;
			var count = 1;
			var contpage = true;
			while (contpage) {
				if (cls[cNew].nl>((count-1)*perpage) && cls[cNew].nl<=(count*perpage)) {
					newystart = -(clueh+5)*((count-1)*perpage-1);
					contpage = false;
				}
				count++;
			}
			
			if (newystart!=ystart) {
				ystart = newystart;
				drawClues();
			} else {
				drawClue(cls[cF]);
				drawClue(cls[cNew]);
			}
			cF = cNew;
			cont = false;
		} 	
	}
	
	document.getElementById("wordToSuggest").value=genCPuzz(cls[cF]);
}

function colorClue(color) {										// Colors corresponding clue to puzzle focus
	var cont = true;
	var x = xF;
	var y = yF;
	var dir, ind;
	var newystart;
	
    cls[cF].fill = white;               // clear old clue
	
	dir = (xM==1) ? "a" : "d";			// determine direction
	
	while (cont) {
		if ((x<=1 && xM==1) || (y<=1 && yM==1) || (sqrs[calcSqrIndex(x-xM,y-yM)].fill == black)) {
			ind = findIndClues(cls,calcSqrIndex(x,y),dir);
			cont = false;
		}
		x -= xM;
		y -= yM;
	}
		
	for (var i in cls) cls[i].fill = white;
	cls[ind].fill = color;
	
	var perpage = Math.floor(ccanvh/(clueh+5))-3;
	var count = 1;
	var contpage = true;
	while (contpage) {
		if (cls[ind].nl>((count-1)*perpage) && cls[ind].nl<=(count*perpage)) {
			newystart = -(clueh+5)*((count-1)*perpage-1);
			contpage = false;
		}
		count++;
	}
	if (newystart!=ystart) {
		ystart = newystart;
		drawClues();
	} else {
		drawClue(cls[cF]);
		drawClue(cls[ind]);
	}
	cF = ind;
	
	document.getElementById("wordToSuggest").value=genCPuzz(cls[cF]);
}

function colorPuzzle(color) {									// Colors corresponding puzzle answer to clue focus
	var loc = cls[cF].l;
	var dir = cls[cF].d;
	
	if (dir=="a") {						// change mvmt to match
		xM = 1;
		yM = 0;
	} else {
		xM = 0;
		yM = 1;
	}
	
	var x = Math.floor((loc+1)/s)+1;
	var y = (loc+1)%s;
	
	if (y==0) {
		y = s;
		x--;
	}
	
	colorLine(xF,yF,1,0,white);
	colorLine(xF,yF,0,1,white);
	colorLine(x,y,xM,yM,select);
	
	xF = x;
	yF = y;
	
	sqrs[loc].fill = color;
	drawSqr(sqrs[loc]);
}

// -------------------------- General functions ----------------------------------------

function clrClues() { 											// Clears clue area from cctx
	cctx.setTransform(1, 0, 0, 1, 0, 0);
	cctx.clearRect(0,0,ccanvw,ccanvh); 
}

function clrPuzzle() { 											// Clears puzzle area from pctx
	pctx.setTransform(1, 0, 0, 1, 0, 0);
	pctx.clearRect(0,0,pcanvw,pcanvh); 
	document.getElementById("wordToSuggest").value="";
}

function clearAll() {											// Clears canvases
	clrPuzzle();
	clrClues();
	xF = 1			
	yF = 1;
	xM = 1;				
	yM = 0;
	cF = 0;
	sqrs = [];
	cls = [];
}

function clearContent() {										// Clears content of sqrs and cls
	for (var i in sqrs) sqrs[i].content = "";
	for (i in cls) cls[i].content = "";
	drawSqrs();
	drawClues();
}

function calcSqrIndex(x,y) { 									// Returns index of sqrs for puzzle coordinates (x,y)
	if (x>0 && y>0 && x<=s && y<=s) return (x-1)*s + y - 1;
	else return 999;
}	

function findIndClues(carr,loc,dir) {							// Returns index of clues in carr whose l=loc and d=dir
	var ind = 999;
	for (var i in carr) if ((carr[i].l == loc) && (carr[i].d == dir)) ind = i;
	return ind
}

function calcPtxtIndex(x,y) { return ind = (y%(s+1)-1)*s + x - 1 + y%s - 1; }		// Calculates index of ptxt for puzzle coordinates (x,y)

function divide(str) {											// Divides long string into two mini strings str1, str2
	var words = str.split(" ");
	var i = 0;
	str1 = "";
	str2 = "";
	
	while (str1.length<=20 && i<=words.length-1) {
		str1 += words[i] + " ";
		i++;
	}
	while (i<=words.length-1) {
		str2 += words[i] + " ";
		i++;
	}
	
	if (str2=="") {
		str2 = str1;
		str1 = "";
	}
	
	return {
		str1:str1,
		str2:str2
	};
}

function generatePuzzleTxt() {									// Converts puzzle to ptxt
	var pos;
	ptxt = "";
	for (var i=1;i<=s;i++) {
		for (var j=1;j<=s;j++) {
			pos = calcSqrIndex(j,i);
			if (sqrs[pos].fill != black) {
				var inner = sqrs[pos].content;
				ptxt += (inner=="") ? "_" : inner;
			} else ptxt += "*";
		}
		ptxt += "/";
	}
	document.getElementById("puzzleTxt").value=ptxt;
}

function genCPuzz(clue) {										// Returns puzzle contents for related clue
	
	var puzz = "";
	var pos; 								// location in ptxt
	var cont;
	var x,y; 								// (x,y) are coordinates in puzzle;
	
	x = Math.floor((clue.l+1)/s)+1;
	y = (clue.l+1)%s;
	if (y==0) pos = calcPtxtIndex(x--,s) + s - 1;
	else pos = calcPtxtIndex(x,y);
	cont = true;
	
	if (clue.d == "a") {
		while (cont && pos<=(s+1)*(s+1)) {
			if (ptxt[pos] != "*" && ptxt[pos] != "/") {
				puzz += ptxt[pos];
				pos++;
			} else cont = false;
		}
	}
	
	if (clue.d == "d") {
		while (cont && pos<=(s*(s+1)-1)) {
			if (ptxt[pos] != "*" && ptxt[pos] != "/") {
				puzz += ptxt[pos];
				pos += s + 1;
			} else cont = false;
		}
	}
	
	return puzz
}

function generateClueTxt() {									// Convert clues to ctxt
	ctxt = "";								// format = 1a.W-RD/Something that means something else//2a. etc.
	var puzztxt;
	
	for (var i in cls) {		// convert all clues
		clue = cls[i];
		ctxt += clue.n + clue.d + "+";
		ctxt += genCPuzz(clue) + "+" + clue.content + "//";
	}
	document.getElementById("clueTxt").value=ctxt;
}

function isComplete() {											// Checks if puzzle is complete
	var allfilled = true;
	for (var i in cls) {
		if (cls[i].content == "") { 
			allfilled = false; 
			break;
		}
	}
	if (ptxt.indexOf("_")==-1 && allfilled) document.getElementById("isComplete").value=1;
	else document.getElementById("isComplete").value=0;
}

function isVulgar() {											// Checks if puzzle contents are vulgar
	var each;
	for (var i=0;i<restricted.length;i++) {
		each = restricted[i];
		if (ctxt.toLowerCase().indexOf(each) != -1) return true
	}	
	return false
}

// ----------------------------- Buttons Functions -------------------------------------

function editDim(val) {											// Add or remove rows/cols
	var changeDim = false;
	if (pfocus || cfocus) {
		if (confirm("Changing puzzle dimensions will clear all content! Are you sure you want to proceed?")) {
			changeDim = true;
		} else return
	} else changeDim = true;
	
	if (changeDim) {
		if (s>2 && s<maxdim) s += val;
		else if (s==2 && val==1) s += val;
		else if (s==maxdim && val==-1) s += val;
		
		pfocus = false;
		cfocus = false;
		pcanv.width = (s+2)*e;
		pcanv.height = (s+3)*e;
		ccanv.height = (s+3)*e;
		pcanvw = pcanv.width;
		pcanvh = pcanv.height;
		ccanvh = ccanv.height;
		document.getElementById("container").style.height = (s+3)*e;
		
		clearAll();
		initDraw();
		generateAll();
	}
}

function changeSymSetting() {									// Option switch to turn on symmetry ability
	editSym = !(editSym);
	bcolor = document.getElementById("dsymmetry").style.color;
	if (bcolor=="black") document.getElementById("dsymmetry").style.color="red";
	else document.getElementById("dsymmetry").style.color="black";
}

function changeColorSetting() {									// Option switch to turn on block color editing ability
	editColor = !(editColor);
	bcolor = document.getElementById("dcolor").style.color;
	if (bcolor=="black") document.getElementById("dcolor").style.color="red";
	else document.getElementById("dcolor").style.color="black";
}

function generateAll() {										// Update all, including ptxt and ctxt values
	generatePuzzleTxt();
	generateClues();
	generateClueTxt();
	drawSqrs();
	drawClues();
	isComplete();
}

function reset() {												// Reset window to default
	if (confirm("Reset the puzzle? All changes will be lost!")) {
		init();
		clearAll();
		initDraw();
		generateAll();
	} else return
}

// -------------------------------- AJAX ----------------------------------------

function showWords() {											// Fetch suggested words

	generateAll();
	// var cword = genCPuzz(cls[cF]);
	// alert(cword);
	document.getElementById("wordToSuggest").value=genCPuzz(cls[cF]);
	
	//show the modal overlay and popup window
	function showPopUpMessage(msg) {
	  overlayElement = document.createElement("div");
	  overlayElement.className = 'modalOverlay';
	  modalWindowElement = document.createElement("div");
	  modalWindowElement.id = "suggestions";
	  modalWindowElement.className = 'modalWindow';
	  modalWindowElement.innerHTML = msg;
	  modalWindowElement.style.left = (window.innerWidth - 200) / 2 + "px";
	  document.body.appendChild(overlayElement);
	  document.body.appendChild(modalWindowElement);
	  setTimeout(function() {
		modalWindowElement.style.opacity = 1;
		overlayElement.style.opacity = 0.4;
		overlayElement.addEventListener("click", hidePopUpMessage, false);
	  }, 300);
	}
	
	//hide the modal overlay and popup window
	function hidePopUpMessage() {
	  modalWindowElement.style.opacity = 0;
	  overlayElement.style.opacity = 0;
	  overlayElement.removeEventListener("click", hidePopUpMessage, false);
	  setTimeout(function() {
		document.body.removeChild(overlayElement);
		document.body.removeChild(modalWindowElement);
	  }, 400);
	}	
	
	var overlayElement = null;
	var modalWindowElement = null;
	showPopUpMessage("");
	
	var word = document.getElementById("wordToSuggest").value;
	var xmlhttp;
	if (word.length==0) {
		document.getElementById("suggestions").innerHTML="";
		return;
	}
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) document.getElementById("suggestions").innerHTML = xmlhttp.responseText;
	}
	xmlhttp.open("GET","suggest.php?word="+escape(word),true);
	xmlhttp.send();	
	
}

function fetchPuzzles() {										// Fetch puzzles for building
	var xmlhttp;
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var select = document.getElementById('puzzleToLoad');
			select.options.length = 0;
			var parray = xmlhttp.responseText.split("//");
			select.options.add(new Option("",-1));
			for (var i=0; i<parray.length-1; i++) {
				var d = parray[i];
				select.options.add(new Option(d,i));
			}
		}
	}
	
	xmlhttp.open("GET","fetchPuzzlesBuild.php?",true);
	xmlhttp.send();	
}

function loadPuzzle(user,hashcode) {							// Load puzzle from select
	if (hashcode!="") {
		var index = 1;
		var toload = "";
	} else {
		var index = document.getElementById('puzzleToLoad').selectedIndex;
		var toload = document.getElementById('puzzleToLoad').options[index].text;
	}

	var xmlhttp;
	
	if (index==0) return;
	
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var response = xmlhttp.responseText;
			if (response=="Failed") alert("Puzzle not found!");
			else {
				var rarray = response.split("||");
				pname = rarray[0];
				pauthor = rarray[5];
				ptxt = rarray[2];
				ctxt = rarray[3].replace("\\","");
				var priv = rarray[4];
				var owner = rarray[5];
				// update hidePuzzle to reflect privacy selection
				if (user!=null && user!="") {		// logged in
					if (priv==1) {
						document.getElementById("hidePuzzle1").checked=true;
						document.getElementById("hidePuzzle2").checked=false;
					} else {
						document.getElementById("hidePuzzle1").checked=false;
						document.getElementById("hidePuzzle2").checked=true;
					}
					
					if (user!=owner) {
						hash = "";
						drawFromTxt(false);
					} else {			// user = owner
						hash = rarray[6];
						drawFromTxt(true);
					}
					
				} else {
					hash = "";
					drawFromTxt(false);
				}
			}
		}
	}
	
	xmlhttp.open("GET","loadPuzzle.php?name="+escape(toload)+"&hash="+escape(hashcode),true);
	xmlhttp.send();	
}

function submitForSave(user) {									// Regen ptxt/ctxt before save
	generateAll();
	var vulgar = isVulgar();
	if (user!=null && user!="") var showPuzz = document.getElementById("hidePuzzle2").checked;
	else var showPuzz = true;
	if (vulgar) {
		document.getElementById("isVulgar").value=1;
		if (showPuzz) return
	} else {
		document.getElementById("isVulgar").value=0;
	}
	document.saveform.submit();
}

// --------------------------------- Save/Load -----------------------------------------

function drawFromTxt(isusers) {									// Draws puzzle from ptxt
	var i,j,pos,puzzpos,cline,celements,ind,val,num;
	var plines = ptxt.split("/");
	
	s = plines[0].length;
	pcanv.width = (s+2)*e;		
	pcanv.height = (s+3)*e;	
	pcanvh = pcanv.height;
	pcanvw = pcanv.width;
	ccanv.height = (s+3)*e;
	ccanvh = ccanv.height;
	document.getElementById("container").style.height = (s+3)*e;	
	
	clearAll();
	initDraw();
	var charlist = "";
	
	for (i in plines) charlist = charlist + plines[i];
	
	for (i=1;i<=s;i++) {
		for (j=1;j<=s;j++) {
			pos = calcSqrIndex(i,j);
			puzzpos = calcSqrIndex(j,i);
			if (charlist[pos]=="*") sqrs[puzzpos].fill = black;
			else if (charlist[pos]!="_") sqrs[puzzpos].content = charlist[pos];
		}
	}
	
	generateClues();
	
	var clines = ctxt.split("//");
	
	for (i in clines) {
		cline = clines[i];
		celements = cline.split("+");
		if (celements.length == 3) {
			val = celements[0];
			num = val.substring(0,val.length-1);
			for (j in cls) {
				if ((cls[j].n == num) && (cls[j].d == val.slice(-1))) {
					ind = j;
					break;
				}
			}
			cls[ind].content = celements[2];
		}
	}
	
	if (isusers) {
		document.getElementById("puzzleName").value=pname;
		document.getElementById("puzzleAuthor").value=pauthor;
	} else {
		document.getElementById("puzzleName").value="";
		document.getElementById("puzzleAuthor").value="";
	}
	
	document.getElementById("puzzleTxt").value=ptxt;
	document.getElementById("clueTxt").value=ctxt;
	document.getElementById("hashcode").value=hash;

	drawSqrs();
	drawClues();
}

function loadFromPHP(loadname,loadauthor,loadp,loadc,user,hide,hashcode) {			// Load puzzle from text
	pname = loadname;
	pauthor = loadauthor;
	ptxt = loadp;
	ctxt = loadc;
	hash = hashcode;
	if (hide==1) {
		document.getElementById("hidePuzzle1").checked=true;
		document.getElementById("hidePuzzle2").checked=false;
	} else if (user!="") {
		document.getElementById("hidePuzzle1").checked=false;
		document.getElementById("hidePuzzle2").checked=true;
	}
	drawFromTxt(true);
}	
		
// ---------------------------------- Canvas events ------------------------------------	
	
function getMousePos(canv,evt){									// Gets mouse position on canvas
	var obj = canv;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != "body") {		// get canvas position
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}
 
	var xmouse = evt.clientX - left + window.pageXOffset;
	var ymouse = evt.clientY - top + window.pageYOffset;
	return {									// return relative mouse position
		x: xmouse,
		y: ymouse
	};
}

function pcanvOnClick(evt) {									// Mouse click events pcanv
	pfocus = true;
	cfocus = false;
	var mousePos = getMousePos(pcanv,evt);
	if (editColor) {	
		changeColor(mousePos.x,mousePos.y);
		generateAll();
	} else changePFocus(mousePos.x,mousePos.y);	
	
}

function pcanvOnKeyDown(evt) {									// Non alpha keystrokes for pcanv
	if (pfocus) {
		var alpha = evt.keyCode;
		var color = select;
		var switchfocus = false;
		
		switch (alpha) {
		case 38: 				// up arrow
			if (yF>1) {
				xM = 0;
				yM = 1;
				toNextSpace(0,-1);
			}
			break;
		case 40: 				// down arrow
			if (yF<s) {
				xM = 0;
				yM = 1;
				toNextSpace(0,1);
			}
			break;
		case 37: 				// left arrow
			if (xF>1) {
				xM = 1;
				yM = 0;
				toNextSpace(-1,0);
			}
			break;
		case 39: 				// right arrow
			if (xF<s) {
				xM = 1;
				yM = 0;
				toNextSpace(1,0);
			}
			break;
		case 32: 				// space key
			drawSqr(sqrs[calcSqrIndex(xF,yF)]);
			toNextSpace(xM,yM);
			break;
		case 8: 				// backspace key
			var pos = calcSqrIndex(xF,yF);
			sqrs[pos].content = "";
			drawSqr(sqrs[pos]);
			toNextSpace(-xM,-yM);
			break;
		case 9: 				// tab key: switches focus between puzzle and clue
			color = highlight;
			switchfocus = true;
			var pos = calcSqrIndex(xF,yF);
			sqrs[pos].fill = select;
			drawSqr(sqrs[pos]);
			break;
		}
		
		colorClue(color);
		
		if (switchfocus) {
			pfocus = !pfocus;
			cfocus = !cfocus;
			document.getElementById("clues").focus();
		}
	}
}

function pcanvOnKeyPress(evt) {									// Alpha keystrokes for pcanv
	if (pfocus) {
		var alpha = evt.keyCode ? evt.keyCode : evt.charCode;
		var achar;
		if (alpha!=18 && alpha!=17 && evt.charCode!=0) {			// check that ctrl and/or alt are not depressed
			if ((alpha>64 && alpha<91) || (alpha>96 && alpha<123)) {	// only alphabetic, allcaps, for puzzle
				achar = String.fromCharCode(alpha).toUpperCase();
				var currentpos = calcSqrIndex(xF,yF);
				sqrs[currentpos].content = achar;
				drawSqr(sqrs[currentpos]);
				toNextSpace(xM,yM);
			}
		}
	}
}

function ccanvOnClick(evt) {									// Mouse click events ccanv
	cfocus = true;
	pfocus = false;
	var mousePos = getMousePos(ccanv,evt);
	changeCFocus(mousePos.x,mousePos.y);	
}

function ccanvOnKeyDown(evt) {									// Non alpha keystrokes for ccanv
	if (cfocus) {
		var alpha = evt.keyCode;
		var color = select;
		var switchfocus = false;
		var ind = 999;
		
		switch (alpha) {
		case 38: 				// up arrow
			toNextClue(-1);
			break;
		case 40: 				// down arrow
			toNextClue(1);
			break;
		case 37: 				// left arrow
			if (cls[cF].d=="d") {
				for (var i in cls) if ((cls[i].nl == cls[cF].nl) && (cls[i].d == "a")) ind = i;
				cls[cF].fill=white;
				drawClue(cls[cF]);
				if (ind!=999) cF = ind;
				cls[cF].fill=highlight;
				drawClue(cls[cF]);
			}
			break;
		case 39: 				// right arrow
			if (cls[cF].d=="a") {
				for (var i in cls) if ((cls[i].nl == cls[cF].nl) && (cls[i].d == "d")) ind = i;
				cls[cF].fill=white;
				drawClue(cls[cF]);
				if (ind!=999) cF = ind;
				cls[cF].fill=highlight;
				drawClue(cls[cF]);
			}
			break;
		case 32: 				// space key
			var cstr = cls[cF].content;
			if (cstr.length > 0) cls[cF].content += " ";
			break;
		case 8: 				// backspace key
			var cstr = cls[cF].content;
			if (cstr.length > 0) cls[cF].content = cstr.substring(0,cstr.length-1);
			drawClue(cls[cF]);
			break;
		case 9: 				// tab key: switches focus between puzzle and clue
			color = highlight;
			switchfocus = true;
			cls[cF].fill = select;
			drawClue(cls[cF]);
			break;
		}
		
		colorPuzzle(color);
		
		if (switchfocus) {
			pfocus = !pfocus;
			cfocus = !cfocus;
			document.getElementById("xword").focus();
		}
	}
}

function ccanvOnKeyPress(evt) {									// Alpha keystrokes for ccanv
	if (cfocus) {
		var alpha = evt.keyCode ? evt.keyCode : evt.charCode;
		var achar;
		if (alpha!=18 && alpha!=17 && evt.charCode!=0) {		// check that ctrl and/or alt are not depressed
			if ((alpha>47 && alpha<91) || (alpha>96 && alpha<123) || alpha==33 || alpha==34 || alpha==39 || alpha==40 || alpha==41 || alpha==44 || alpha==45 || alpha==46 || alpha==95) {		// clues take alphanumeric and symbols
				achar = String.fromCharCode(alpha);
				if (cls[cF].content.length<50) cls[cF].content += achar;
				drawClue(cls[cF]);
			}
		}
	}
}

// ---------------------------------- Initialization -----------------------------------

function init() {												// Initialization
	// colors
	white = "#EDEDED";
	black = "#000000";
	select = "#BCBCBC";
	highlight = "#BB8888";
	error = "FF00000";

	// initial variables
	xF = 1				// (xF,yF) are coordinates of puzzle focus
	yF = 1;
	xM = 1;				// (xM,yM) are puzzle mvmt direction, initially "across"
	yM = 0;
	cF = 0;				// cF is index of clue focus

	// puzzle
	sqrs = [];			// array of puzzle squares
	s = 15;				// initial puzzle grid size
	e = 25;				// puzzle square edge size
	ystart = 30;		// start drawing clues from
	dist = 25;			// distance between puzzle and clues
	editColor = false;	// add blank setting
	editSym = true;		// blank symmetry setting
	document.getElementById("dcolor").style.color="black";
	document.getElementById("dsymmetry").style.color="red";
	maxdim = 32;		// maximum nxn crossword size

	// clues
	cls = [];			// array of clues
	cluew = 150;		// width and height of clue box
	clueh = 25;

	// puzzle and clue interaction
	pname = "";
	pauthor = "";
	ptxt = "";
	ctxt = "";
	pfocus = false;		// if focus is on puzzle
	cfocus = false;		// if focus is on clues	
	words = "";
	hash = "";
	
	// puzzle canvas
	pcanv = document.getElementById("xword");
	pcanv.width = (s+2)*e;		// set width and height of pcanv according to size of puzzle
	pcanv.height = (s+3)*e;	
	pctx = pcanv.getContext("2d");
	pcanvh = pcanv.height;
	pcanvw = pcanv.width;
	
	// clue canvas
	ccanv = document.getElementById("clues");
	ccanv.height = (s+3)*e;
	cctx = ccanv.getContext("2d");
	ccanvh = ccanv.height;
	ccanvw = ccanv.width;
	cctx.fillText("",0,0);
	
	document.getElementById("container").style.height = (s+3)*e;	//set container height to canvas height
	
	restricted = new Array("asdfg");
}

function load() {												// Body onload for Builder
	init();
	initDraw();
	generateAll();
	fetchPuzzles();
	pcanv.addEventListener("click", pcanvOnClick, false);
	pcanv.addEventListener("keydown", pcanvOnKeyDown, true);
	pcanv.addEventListener("keypress", pcanvOnKeyPress, true);
	ccanv.addEventListener("click", ccanvOnClick, false);
	ccanv.addEventListener("keydown", ccanvOnKeyDown, true);
	ccanv.addEventListener("keypress", ccanvOnKeyPress, true);
};