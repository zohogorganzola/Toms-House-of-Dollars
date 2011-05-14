/* Author: 

*/

function nextJoke() {
	this.jokeNum = this.jokeNum ? this.jokeNum+1 : 1;
	this.jokeMod = this.jokeMod ? this.jokeMod : $("#disclaimer").children().size();
	$("#joke" + (this.jokeNum - 1) % this.jokeMod).hide();
	$("#joke" + this.jokeNum % this.jokeMod).show();
}

function showDDate() {
	$("#ddate").html((new DDate).toString());
}

$(document).ready(function() {
		showDDate();
	});
