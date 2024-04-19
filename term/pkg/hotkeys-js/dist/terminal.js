hotkeys('ctrl+enter', function() {
	let e = document.querySelector('home-layout');
	e.style.display = "block";
	var ele = document.getElementById('aiterm');
	var win = document.getElementById('window');
	var svg = document.getElementById('aisvg');
	var term = document.getElementById('terminal');
	term.click();
	//var par = document.getElementById('particles-js');
	//par.style.display = 'block'; 
	if (ele.style.display == 'none') {
		ele.style.display = 'block'; 
		svg.style.display = 'none'; 
	} else {
		ele.style.display = 'none';
		svg.style.display = 'block'; 
	}
});
