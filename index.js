let express = require("express");
let socketIO = require("socket.io");
let bp = require("body-parser");
let cookie = require("cookie-parser");
let fs = require("fs")
let http = require("http")

let app = express();
let server = new http.createServer(app)
let io = new socketIO.Server( {
    serveClient:true
})

io.listen(server)

let open = (p) => {
    let me = {
        read:() => fs.readFileSync(p, "utf-8"),
        write:(data) => fs.writeFileSync(p, data),
        json:{
            read:() => JSON.parse(fs.readFileSync(p, "utf-8")),
            write:(data) => fs.writeFileSync(p, JSON.stringify(data)),
        },
        react:(url) => fs.readFileSync(p, "utf-8").replace(
            "{script}", 
            `<script src="${url}" type="text/babel"></script>`
        )
    };
    return me
};


let template = open("./public/index.html")



app.use(bp.json());
app.use(cookie(["frask", "galletas", "ohh", "cool", ":v"], {}));


io.on("connection", (socket) => {
    
    socket.emit("state", {
        connect:true
    })



})


app.get("/", (req, res, next) => {
    res.send(
        template.react("/src/app/main.jsx")
    )
})


app.use("/src", express.static("./src"));
//app.use("/app", express.static("./public"));



server.listen(9080, () => {
    console.log("open in the port 9080")
})