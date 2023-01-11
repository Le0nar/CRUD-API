import { createServer } from "http";
import { config } from "dotenv";
import { usersController } from "./users/users.contreller";
import { usersUtils } from "./users/users.utils";
import { getRequestData } from "./utils/get-request-data";

config()
const PORT = process.env.PORT || 5000

export const server = createServer(async (req, res) => {
    // TODO: decompose it
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        const { users } = usersController
        res.end(JSON.stringify({ users }))
    } else if (req.url?.match(/\/api\/users\/(.|\s)*\S(.|\s)*/)) {
        const splittedReqUrl = req.url.split('/')
        const id = splittedReqUrl[splittedReqUrl.length - 1]

        const isUUID = usersUtils.checkIsUUID(id)

        if (!isUUID) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User id is invalid (not uuid)" }));
            return
        }

        const user = usersController.getUser(id)
        if (!user) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User with this id doesn't exist" }));
            return
        }

        if (req.method === "GET") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ user }));
            return
        }

        const updatedUserData = await getRequestData(req)
        if (req.method === "PUT") {
            const updatedUser = usersController.updateUser(updatedUserData, id)

            if (!updatedUser) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "User data is not valid (username, age or hobbies)" }));
                return
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedUser));
            return
        }

        if (req.method === "DELETE") {
            usersController.deleteUser(id)
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end();
        }
    } else if (req.url === "/api/users" && req.method === "POST") {
        const userData = await getRequestData(req)
        const user = usersController.createUser(userData)

        if (user) {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ user }))
            return
        }

        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: 'body does not contain required fields' }))
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
})

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
})
