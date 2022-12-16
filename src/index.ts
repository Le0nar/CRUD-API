import { createServer } from "http";
import { config } from "dotenv";

config()
const PORT = process.env.PORT || 5000

// Tempprarly variable
const users: any[] = [1, 23, 2]

const server = createServer(async (req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(users));

        res.end();
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }


})

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})
