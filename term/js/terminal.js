$(function() {
	var prompt = "[[b;#87cefa;]ai][[b;#FFFF00;]@aios] ~$ ";
	let url = new URL(window.location.href);
	let user = url.searchParams.get('user');
 let id = url.searchParams.get('id');
 if (id == null) { id = 2 };
 let did = url.searchParams.get('did');
 if (did == null) { did = "did:plc:4hqjfn7m6n5hno3doamuhgef" };
	if (user) { prompt = "[[b;#87cefa;]" + user + "][[b;#FFFF00;]@aios] ~$ " };
	var tab = "[[b;#87cefa;]<tab>]";
	var command_all = ["ai","ls","ai.json", "hugo", "pico", "nyancat"];
	var handle = "yui.syui.ai";
	var file_all = "ai.json";

	var ai_help = axios.get('https://term.syui.ai/term/ascii/help.txt')
		.then(function (response) {
			return response.data;
		});
	var ascii_ai = axios.get('https://term.syui.ai/term/ascii/ai.txt')
		.then(function (response) {
			return response.data;
		});
	var ascii_avatar = axios.get('https://term.syui.ai/term/ascii/avatar.txt')
		.then(function (response) {
			return response.data;
		});

	let list = 'https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=';
	function bsky_record() {
		var u;
		u = axios.get(list + did + '&collection=app.bsky.feed.post&limit=1')
			.then(function (response) {
				return JSON.stringify(response.data.records[0].value,null,"\t");
			})
		return u;
	}

	function bsky_ver() {
		var u;
		u = axios.get('https://bsky.social/xrpc/_health')
			.then(function (response) {
				return JSON.stringify(response.data,null,"\t");
			})
		return u;
	}

	let plc_server = "https://plc.directory/"
	function bsky_plc() {
		var u;
		u = axios.get(plc_server + did + '/log')
			.then(function (response) {
				return JSON.stringify(response.data,null,"\t");
			})
		return u;
	}

	let desc = 'https://bsky.social/xrpc/com.atproto.repo.describeRepo?repo=';
	function bsky_desc() {
		var u;
		u = axios.get(desc + did + '&collection=app.bsky.actor.profile')
			.then(function (response) {
				return JSON.stringify(response.data,null,"\t");
			})
		return u;
	}

	function bsky_did() {
		var u;
		u = axios.get(desc + handle + '&collection=app.bsky.actor.profile')
			.then(function (response) {
				return JSON.stringify(response.data.did,null,"\t").replaceAll('"', '');
			})
		return u;
	}

	function test_json() {
		var u;
		u = axios.get('https://term.syui.ai/term/json/ai.json')
			.then(function (response) {
				return JSON.stringify(response.data,null,"\t");
			})
		return u;
	}

	function print_slowly(term, paragraph, callback) {
		var foo, i, lines;
		lines = paragraph.split("\n");
		term.pause();
		i = 0;
		foo = function(lines) {
			return setTimeout((function() {
				if (i < lines.length - 1) {
					term.echo(lines[i]);
					i++;
					return foo(lines);
				} else {
					term.resume();
					return callback();
				}
			}), 100);
		};
		return foo(lines);
	}

	function require_command(command_regex, terminal_history) {
		var executed = true;
		$.each(terminal_history, function(index, value) {
			if (command_regex.test(value)) {
				executed = true
			}
		});
		return executed;
	}

	function interpreter(input, term) {
		var command, inputs;
		inputs = input.split(/ +/)
		command = inputs[0];
		option = inputs[1];
		if (did == null) { did = "did:plc:4hqjfn7m6n5hno3doamuhgef" };
		if (handle == null) { handle = "did:plc:4hqjfn7m6n5hno3doamuhgef" };
		if (command === 'ai' && inputs[1] === undefined) {
			term.echo(ai_help);
		} else if (command === 'ls') {
			term.echo(file_all);
		} else if (command === 'cat') {
			if (option === 'ai.json') {
				term.echo(test_json());
			} else {
				term.echo(file_all);
			}
		} else if (command === 'ai' && option === 'a') {
			term.echo(ascii_ai);
			//print_slowly(term, ascii_ai);
		} else if (command === 'ai' && option === 'p') {
			term.echo(test_json());
			term.echo(ascii_avatar);
		} else if (command === 'ai' && option === 'plc') {
			if (inputs[2] != undefined) { did = inputs[2]; }
			url = desc + did + '&collection=app.bsky.actor.profile';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				did = JSON.stringify(data.did,null,"\t").replaceAll('"', '')
				url = plc_server + did + '/log';
				$.ajaxSetup({async: false});
				$.getJSON(url, function(data) {		
					term.echo(JSON.stringify(data,null,"\t"));
				});$.ajaxSetup({async: true});
			});$.ajaxSetup({async: true});
		} else if (command === 'ai' && option === 'record') {
			if (inputs[2] != undefined) { did = inputs[2]; }
			url = list + did + '&collection=app.bsky.feed.post&limit=1';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				term.echo(JSON.stringify(data,null,"\t"));
			});$.ajaxSetup({async: true});		
		} else if (command === 'ai' && option === 'did') {
			if (inputs[2] != undefined) { handle = inputs[2]; }
			url = desc + handle + '&collection=app.bsky.actor.profile';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				term.echo(JSON.stringify(data.did,null,"\t").replaceAll('"', ''));
			});$.ajaxSetup({async: true});		
		} else if (command === 'ai' && option === 'handle') {
			if (inputs[2] != undefined) { did = inputs[2]; }
			url = desc + did + '&collection=app.bsky.actor.profile';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				term.echo(JSON.stringify(data,null,"\t"));
			});$.ajaxSetup({async: true});		
		} else if (command === 'ai' && option === 'v') {
			url = 'https://bsky.social/xrpc/_health';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				term.echo(JSON.stringify(data,null,"\t"));
			});$.ajaxSetup({async: true});		

		} else if (inputs[0] === 'hugo') {
			hugo_domain = 'yui.syui.ai';
			if (inputs[1] != undefined) { hugo_domain = inputs[1]; }
			url = 'https://' + hugo_domain + '/index.json';
			$.ajaxSetup({async: false});
			$.getJSON(url, function(data) {
				index_json = JSON.stringify(data,null,"\t");
				origin_index_json = JSON.parse(index_json);
				origin_index_json.forEach(function(v,index) {
					s = v.title + " "  + v.href;
					term.echo(s);
				});
			});$.ajaxSetup({async: true});		
			term.echo("-----");
			term.echo("$ hugo " + hugo_domain);
		} else if (/nyancat/.test(input)) {
			term.read("jump page?[y] : ", function(s) {
				if (s === "y") {
					window.location.href = 'https://syui.ai/nyancat';
				}
			}).then(function(s) {
				s.charCodeAt(0);
			});
		} else if (/pico/.test(input)) {
			window.location.href = 'https://syui.ai/pico';

		} else {
			term.echo(ai_help);
		}
	}

	function bash(inputs, term) {
		var argument, echo, insert;
		echo = term.echo;
		insert = term.insert;
		if (!inputs[1]) {
			//return console.log("none");
		} else {
			argument = inputs[1];
			if (/^\.\./.test(argument)) {
				return echo("-bash: cd: " + argument + ": Permission denied");
			} else {
				return echo("-bash: cd: " + argument + ": No such file or directory");
			}
		}
	}

	$('#terminal').terminal(interpreter, {
		prompt: prompt,
		name: 'test',
		greetings: "",
		exit: false,
		height: 360,
		onInit: function(term) {
			//term.insert("ai");
			//print_slowly(term, ascii_ai);
		},
		completion: function(term, string, callback) {
			var t = $(term[0]).text();
			if (t.match(/none/)) {
				term.clear();
			} else {
				callback(command_all);
				term.history().clear();
			}
		},
		tabcompletion: true
	});
});
