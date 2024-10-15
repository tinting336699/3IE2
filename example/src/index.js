/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { parse } from "cookie";
export default {
	async fetch(request, env, ctx) {
		const datas = await auth(request, env)
		// The name of the cookie
		const COOKIE_NAME = "__uid";
		const cookie = parse(request.headers.get("Cookie") || "");
		console.log(cookie[COOKIE_NAME]);
		if (datas.result) {
			const { url } = request;
			if (url.includes("form")) {
				return rawHtmlResponse(someForm);
			}

			if (request.method === "POST") {
				const reqBody = await readRequestBody(request, env, datas);
				const newResponse = new Response(reqBody)
				newResponse.headers.append("Access-Control-Allow-Origin","*")
				newResponse.headers.append("Access-Control-Allow-Headers","X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept")
				// return new Response(reqBody);
				return newResponse
			} else if (request.method === "GET") {
				return new Response("<html><body><h1id='h1'></h1><script>document.getElementById('h1').innerHTML = document.cookie</script></body></html>");
			}
		} else if (request.method === "GET") {
			// return new Response("<html><body><h1id='h1'></h1><script>document.getElementById('h1').innerHTML = document.cookie</script></body></html>");
			const html = ``;

			return new Response(html, {
			headers: {
				"content-type": "text/html;charset=UTF-8",
			},
			});
		}else {
			return new Response("Not authorization")
		}
	},
};

function rawHtmlResponse(html) {
	return new Response(html, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});
}

/**
* readRequestBody reads in the incoming request body
* Use await readRequestBody(..) in an async function to get the string
* @param {Request} request the incoming request to read from
*/
async function readRequestBody(request, env, datas) {
	const contentType = request.headers.get("content-type");
	if (contentType.includes("application/json")) {
		const data = await request.json()
		console.log(data)
		try {
			if(data.type != "login" && data.type != "signup" ){
				const user = await env.DB.prepare(
					`SELECT * FROM dbcontrole WHERE makedid = ?1 AND dbid = ?2`
				).bind(data.userid,data.id).all()
				console.log(user)
			}
			if (data.type == "select") {
				return worddb_selecter({ id: data.id }, env)
			} else if (data.type == "add") {
				// data.word = body.word
				// data.mean = body.mean
				return worddb_adder(data, env)
			} else if (data.type == "create") {
				// data.word = body.word
				if(data.name == "admin"){
					try {
						await env.DB.prepare(
							`CREATE TABLE worddb${data.id} AS SELECT * FROM worddb`
						).run();
					} catch (error) {
						return "the Number is used"
					}
					console.log(await env.DB.prepare(
						`INSERT INTO dbcontrole VALUES(?1,0,?2,?3)`
					).bind(data.id,data.userid,data.word).all());
					return "success"
				}
			}else if(data.type == "sql"){
				// data.word = body.word
				console.log(data.word)
				return JSON.stringify(await env.DB.prepare(
					data.word
				).run())
			}else if(data.type == "edit"){
				// data.word = body.word
				// data.mean = body.mean
				try {
					await env.DB.prepare(
						`UPDATE worddb${data.id} SET mean = ?2 WHERE word = ?1`
					).bind(data.word,data.mean).run()
				} catch (error) {
					console.log(error)
					return "error"
				}
				return "success"
			}else if(data.type == "delete"){
				// data.word = body.word
				// data.mean = body.mean
				if(data.name == "admin"){
					try {
						await env.DB.prepare(
							`DELETE FROM worddb${data.id} WHERE word = ?1`
						).bind(data.word).all()
					} catch (error) {
						console.log(error)
						return "error"
					}
					return "success"
				}
			}else if(data.type == "login"){
				const res = await env.DB.prepare(
					`SELECT pass FROM user WHERE id=?1`
				).bind(data.userid).all()
				console.log(data.word == res.results[0].pass)
				if(data.word == res.results[0].pass){
					return "aaa"
				}else{
					return false
				}	
			}else if(data.type == "signup"){
				console.log("===================")
				console.log(data)
				const res = await env.DB.prepare(
					`INSERT INTO user VALUES(0,?1,?2,0,0)`
				).bind(data.userid,data.word).all()
				return "aaa"
			}
		} catch (error) {
			console.log(error)
		}	
		return "error";
	} else if (contentType.includes("application/text")) {
		return request.text();
	} else if (contentType.includes("text/html")) {
		return request.text();
	} else if (contentType.includes("form")) {
		// const formData = await request.formData();
		const body = datas.body;
		// for (const entry of formData.entries()) {
		// 	body[entry[0]] = entry[1];
		// }
		var data = {
			type: "",
			id: "",
			userid: "",
			word: "",
			mean: ""
		}
		data.type = body.type
		data.id = body.id
		data.userid = body.userid
		try {
			if (data.type == "select") {
				return worddb_selecter({ id: data.id }, env)
			} else if (data.type == "add") {
				data.word = body.word
				data.mean = body.mean
				return worddb_adder(data, env)
			} else if (data.type == "create") {
				data.word = body.word
				try {
					await env.DB.prepare(
						`CREATE TABLE worddb${data.id} AS SELECT * FROM worddb`
					).run();
				} catch (error) {
					return "the Number is used"
				}
				console.log(await env.DB.prepare(
					`INSERT INTO dbcontrole VALUES(?1,0,?2,?3)`
				).bind(data.id,data.userid,data.word).all());
				return "success"
			}else if(data.type == "sql"){
				data.word = body.word
				console.log(data.word)
				return JSON.stringify(await env.DB.prepare(
					data.word
				).run())
			}else if(data.type == "edit"){
				data.word = body.word
				data.mean = body.mean
				try {
					await env.DB.prepare(
						`UPDATE worddb${body.id} SET mean = ?2 WHERE word = '?1'`
					).bind(data.word,data.mean).run()
				} catch (error) {
					console.log(error)
					return "error"
				}
				return "success"
			}else if(data.type == "delete"){
				data.word = body.word
				data.mean = body.mean
				try {
					await env.DB.prepare(
						`DELETE FROM worddb${data.id} WHERE word = ?1`
					).bind(data.word).all()
				} catch (error) {
					console.log(error)
					return "error"
				}
				return "success"
			}else if(data.type == "login"){
				const res = await env.DB.prepare(
					`SELECT pass FROM user WHERE id=?1`
				).bind(data.userid).all()
				console.log(body.word == res.results[0].pass)
				if(body.word == res.results[0].pass){
					return "aaa"
				}else{
					return ""
				}
			}else if(data.type == "signup"){
				console.log("--------------------")
				console.log(data)
				const res = await env.DB.prepare(
					`INSERT INTO user VALUES(0,?0,?1,0,0)`
				).bind(data.userid,data.word).all()
				return "aaa"
			}
		} catch (error) {
			console.log(error)
		}	
		return "error";
	} else {
		// Perhaps some other type of data was submitted in the form
		// like an image, or some other binary data.
		return "a file";
	}
}
/*
data = {
	id:int
}
*/
async function worddb_selecter(data, env) {
	var datas
	try {
		datas = await env.DB.prepare(
			`SELECT * FROM worddb${data.id}`
		).all()
	} catch (error) {
		console.log(`table is not exist? \n${error}`)
	}
	console.log(await env.DB.prepare(
		`SELECT * FROM worddb${data.id}`
	).all())
	console.log(data.id)
	return JSON.stringify(datas.results)
}
/*
data = {
	id:int,
	word:str,
	mean:str
}
*/
async function worddb_adder(data, env) {
	var datas
	try {
		datas = await env.DB.prepare(
			`INSERT INTO worddb${data.id} VALUES(?1,?2)`
		).bind(data.word, data.mean).all()
	} catch (error) {
		console.log(`table is not exist? \n${error}`)
	}
	console.log(await env.DB.prepare(
		`SELECT * FROM worddb${data.id}`
	).all())
	console.log(data.id)
	// return JSON.stringify(datas.results)
	return "success"
}

async function auth(request, env) {
	const contentType = request.headers.get("content-type");
	var result
	var data = {
		result: 0,
		body: ""
	}
	// if (contentType.includes("form") == true) {
	// 	const formData = await request.formData();
	// 	console.log(JSON.stringfy(formData))
	// 	const body = {};
	// 	for (const entry of formData.entries()) {
	// 		body[entry[0]] = entry[1];
	// 	}
	// 	console.log(body.indexOf("auth"))
	// 	data.body = body
	// 	result = body.indexOf("auth")
	// 	console.log(result)
	// 	console.log(JSON.stringify(body))
	// 	console.log(body.indexOf("auth"))
	// }
	if (request.headers.get("Authorization") == "aaa") {
		console.log("aaa")
		console.log(data)
		data.result = true
		return data
	} else{
		try {
			const formData = await request.formData();
			const body = {};
			for (const entry of formData.entries()) {
				body[entry[0]] = entry[1];
			}
			data.body = body
			result = body.token
		} catch (error) {
			console.log(error)
		}
		if (result == "aaa") {
			data.result = true
			return data
		}
	}
	data.result = false
	return data
}
