// Xword Builder 1.0
// Lucy Lu Wang
// lwang@redballooning.com

// ---------------------------- Puzzle related functions ------------------------------

function Sqr(xloc,yloc) {										// Square data structure
	this.x = xloc;
	this.y = yloc;
	this.w = e-2;
	this.h = e-2;
	this.content = ""; 		
	this.number = "";		
	this.fill = white;
	this.textfill = black;
	this.guess = "";
}

function addSqr(xloc,yloc) {sqrs.push(new Sqr(xloc,yloc));}		// Creates new element for squares array

function drawSqr(sq) {											// Draws individual square defines by square array
	pctx.fillStyle = sq.fill;
	pctx.fillRect(sq.x,sq.y,sq.w,sq.h);
	pctx.fillStyle = sq.textfill;
	pctx.font = "16px sans-serif";
	pctx.fillText(sq.guess,sq.x+e/4,sq.y+3*e/4);
	pctx.fillStyle = "#777777";
	pctx.font = "8px sans-serif";
	pctx.fillText(sq.number,sq.x,sq.y+8);
}

function drawSqrs() { 											// Draws squares specified in squares array
	clrPuzzle();
	var pnastr = pname;
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
			cctx.fillText(cstrings.str2,cl.x+5,cl.y+23);
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
}

// -------------------------- General functions ----------------------------------------

function clrClues() { 											// Clears clue area from cctx
	cctx.setTransform(1, 0, 0, 1, 0, 0);
	cctx.clearRect(0,0,ccanvw,ccanvh); 
}

function clrPuzzle() { 											// Clears puzzle area from pctx
	pctx.setTransform(1, 0, 0, 1, 0, 0);
	pctx.clearRect(0,0,pcanvw,pcanvh); 
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

function isComplete() {											// Checks if puzzle is complete
	isComp = true;
	for (var i in sqrs) {
		if (sqrs[i].fill!=black && sqrs[i].guess == "") { 
			isComp = false; 
			break;
		}
	}
}

// --------------------------------- Save/Load -----------------------------------------

function drawFromTxt() {										// Draws puzzle from ptxt
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
			else if (charlist[pos]!="-") sqrs[puzzpos].content = charlist[pos];
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
			for (j=0;j<cls.length;j++) {
				if ((cls[j].n == num) && (cls[j].d == val.slice(-1))) {
					ind = j;
					j = cls.length;
				}
			}
			cls[ind].content = celements[2];
		}
	}

	drawSqrs();
	drawClues();
}

function fetchPuzzles() {										// Fetch puzzles for building
	var xmlhttp;
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var select = document.getElementById('puzzleToLoad');
			select.options.length = 0;
			var parray = xmlhttp.responseText.split("//");
			loadListLength = parray.length-1;
			select.options.add(new Option("",-1));
			for (var i=0; i<loadListLength; i++) {
				var d = parray[i];
				select.options.add(new Option(d,i));
			}
		}
	}
	
	xmlhttp.open("GET","fetchPuzzlesPlay.php?",true);
	xmlhttp.send();	
}

function loadPuzzle(hash) {										// Load puzzle from select
	if (hash!="") {
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
				pauthor = rarray[1];
				ptxt = rarray[2];
				ctxt = rarray[3];
				drawFromTxt();
				var divcontent = '<button onclick="checkAnswers()" id="checkAnswers"><div>Check Answers</div></button>&nbsp;<button onclick="revealLetter()" id="revealLetter"><div>Reveal Letter</div></button>&nbsp;<button onclick="revealClue()" id="revealClue"><div>Reveal Clue</div></button>&nbsp;<button onclick="revealAll()" id="revealAll"><div>Reveal All</div></button>';
				document.getElementById('control').innerHTML = divcontent;
				inittime = new Date();
			}
		}
	}
	
	xmlhttp.open("GET","loadPuzzle.php?name="+escape(toload)+"&hash="+escape(hash),true);
	xmlhttp.send();	
}

function loadRandom() {											// Load puzzle from select
	var index = Math.floor(Math.random()*loadListLength)+1;
	var toload = document.getElementById('puzzleToLoad').options[index].text;
	
	var xmlhttp;
	
	if (index==-1) return;
	
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var rarray = xmlhttp.responseText.split("||");
			pname = rarray[0];
			pauthor = rarray[1];
			ptxt = rarray[2];
			ctxt = rarray[3];
			drawFromTxt();
			var divcontent = '<button onclick="checkAnswers()" id="checkAnswers"><div>Check Answers</div></button><button onclick="revealLetter()" id="revealLetter"><div>Reveal Letter</div></button><button onclick="revealClue()" id="revealClue"><div>Reveal Clue</div></button><button onclick="revealAll()" id="revealAll"><div>Reveal All</div></button>';
			document.getElementById('control').innerHTML = divcontent;
			inittime = new Date();
		}
	}
	
	xmlhttp.open("GET","loadPuzzle.php?name="+escape(toload),true);
	xmlhttp.send();	
}

// --------------------------------- Player functions ----------------------------------

function checkAnswers() {										// Show incorrect inputs in red
	var nomistakes = true;

	for (var i in sqrs) {
		if (sqrs[i].fill!=black) {
			if (sqrs[i].guess=="") {
				nomistakes = false;
			} else if (sqrs[i].guess != sqrs[i].content) {
				sqrs[i].textfill = red;
				drawSqr(sqrs[i]);
				nomistakes = false;
			}
		}
	}
	
	if (nomistakes) {
		var finaltime = new Date();
		var totaltime = new Date(finaltime - inittime);
		alert("Congrats! You have completed the puzzle in " + String(totaltime.getMinutes()) + " minutes!");
	}
	
}

function revealLetter() {										// Reveals letter of focus
	var ind = calcSqrIndex(xF,yF);
	if (sqrs[ind].fill!=black && sqrs[ind].guess!=sqrs[ind].content) {
		sqrs[ind].guess = sqrs[ind].content;
		sqrs[ind].textfill = darkred;
		drawSqr(sqrs[ind]);
	}
}

function revealClue() {											// Reveals clue of focus
	var pos;
	var cont = true;
	var xactive = xF;
	var yactive = yF;
	
	while (cont) {									// adding xdelta and ydelta
		pos = calcSqrIndex(xactive,yactive);
		
		if (sqrs[pos].fill != black && sqrs[pos].guess!=sqrs[pos].content) {
			sqrs[pos].guess = sqrs[pos].content;
			sqrs[pos].textfill = darkred;
			drawSqr(sqrs[pos]);
		} else cont = false;
		
		xactive += xM;
		yactive += yM;
		if (xactive>s || yactive>s) cont = false;
	}
	
	xactive = xF-xM;
	yactive = yF-yM;
	cont = true;
	
	while (cont) {									// subtracting xdelta and ydelta
		pos = calcSqrIndex(xactive,yactive);
		
		if (sqrs[pos].fill != black && sqrs[pos].guess!=sqrs[pos].content) {
			sqrs[pos].guess = sqrs[pos].content;
			sqrs[pos].textfill = darkred;
			drawSqr(sqrs[pos]);
		} else cont = false;
		
		xactive -= xM;
		yactive -= yM;
		if (xactive<1 || yactive<1) cont = false;
	}

}

function revealAll() {											// Reveals entire puzzle after warning
	if (confirm("Reveal the whole puzzle?!")) {
		for (var i in sqrs) {
			if (sqrs[i].fill!=black && sqrs[i].guess!=sqrs[i].content) {
				sqrs[i].guess=sqrs[i].content;
				sqrs[i].textfill = darkred;
			}
		}
		drawSqrs();
		checkAnswers();
	} else return
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
	document.getElementById("xword").focus();
	var mousePos = getMousePos(pcanv,evt);
	changePFocus(mousePos.x,mousePos.y);	
}

function pcanvOnKeyDown(evt) {									// Non alpha keystrokes for pcanv
	var alpha= evt.keyCode;

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
		sqrs[pos].guess = "";
		drawSqr(sqrs[pos]);
		toNextSpace(-xM,-yM);
		break;
	}

	colorClue(select);

}

function pcanvOnKeyPress(evt) {									// Alpha keystrokes for pcanv
	var alpha = evt.keyCode? evt.keyCode : evt.which? evt.which : null;
	var achar;
	if (alpha!=18 && alpha!=17) {			// check that ctrl and/or alt are not depressed
		if ((alpha>64 && alpha<91) || (alpha>96 && alpha<123)) {		// only alphabetic, allcaps, for puzzle
			achar = String.fromCharCode(alpha).toUpperCase();
			var currentpos = calcSqrIndex(xF,yF);
			sqrs[currentpos].guess = achar;
			sqrs[currentpos].textfill = black;
			drawSqr(sqrs[currentpos]);
			toNextSpace(xM,yM);
			isComplete();
			if (isComp) checkAnswers();
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
	red = "#FF1111";
	darkred = "#551111";

	// initial variables
	xF = 1				// (xF,yF) are coordinates of puzzle focus
	yF = 1;
	xM = 1;				// (xM,yM) are puzzle mvmt direction, initially "across"
	yM = 0;
	cF = 0;				// cF is index of clue focus

	// puzzle
	sqrs = [];			// array of puzzle squares
	s = 2;				// initial puzzle grid size
	e = 25;				// puzzle square edge size
	ystart = 30;		// start drawing clues from
	dist = 25;			// distance between puzzle and clues

	// clues
	cls = [];			// array of clues
	cluew = 150;		// width and height of clue box
	clueh = 25;

	// puzzle and clue interaction
	pname = "";
	pauthor = "";
	ptxt = "";
	ctxt = "";
	loadListLength = 0;
	isComp = false;
	inittime = new Date();
	
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
	ctranslate = -30;
	cctx.fillText("",0,0);
	
	document.getElementById("container").style.height = (s+3)*e;	//set container height to canvas height
}

function load() {												// Body onload for Builder
	init();
	fetchPuzzles();
	pcanv.addEventListener("click", pcanvOnClick, false);
	pcanv.addEventListener("keypress", pcanvOnKeyPress, true);
	pcanv.addEventListener("keydown", pcanvOnKeyDown, true);
}