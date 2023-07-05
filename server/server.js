const http = require('http');
const cors = require("cors");
const {Pool} = require("pg");
const port = 3000;

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "test_api",
	password: "root",
	port: 5432,
})

const server = http.createServer((req, res) => {
	cors()(req, res, () => {
		let data = "";
		req.on("data", chunk => {
			data += chunk;
		});
		req.on("end", async () => {
			console.log(data);

			try {
				const client = await pool.connect();
				const parsedData = JSON.parse(data);
				const {name, email, text} = parsedData;

				const query = 'INSERT INTO clients (name, email, question) VALUES ($1, $2, $3)';
				const values = [name, email.toLowerCase(), text];
				await client.query(query, values);

				client.release();

				res.end('Данные успешно получены');
			}catch (error){
				console.error('Ошибка при выполнении запроса к базе данных:', error);
				res.end('Произошла ошибка при выполнении запроса к базе данных');
			}
		});
	})
});

server.listen(port, () => {
	console.log(`Server running at localhost:${port}`);
});