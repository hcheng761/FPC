document.getElementById("numResults").addEventListener("change", mySelectFunction);
function mySelectFunction() {
	console.log("select function works");
	var x = document.getElementById("numResults").value;
	document.getElementById("miscOptions").innerHTML = "select function works: " + x;
}
