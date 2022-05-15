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

function Create_Room(username) {
    
    let code = 0; 
    
    do {

        code = "C" + (Math.random() + "").slice(2, 8)

    } while (rooms[code])


    let room = {
        master:username,
        users:[
            username
        ],
        code:code
    }

    rooms[code] = code
    rooms.push(room)

    return code
}


let rooms = []



app.use(bp.json());
app.use(cookie(["frask", "galletas", "ohh", "cool", ":v"], {}));


io.on("connection", (socket) => {
    
    socket.emit("state", {
        connect:true
    })



})


app.get("/clear", (req, res, next) => {

    fs.readdirSync("./coding", "utf8").forEach(x=>{
        fs.rmdirSync(`./coding/${x}`, {"recursive":true})
    })
    rooms = [];

    req.cookies.code = undefined
    req.cookies.user = undefined
    
    res.redirect("/")
});


app.post("/islogin", (req, res) => {

    res.json({
        user:req.cookies.user,
        code:req.cookies.code,
        master:(rooms[req.cookies.code]||{}).master == req.cookies.user,
        login:Boolean(req.cookies.code)
    })
})

app.get("/", (req, res, next) => {

    let code = req.cookies.code;

    if (!rooms[code]) {
        req.cookies.code = undefined
        req.cookies.user = undefined
    }

    res.send(
        template.react("/src/app/main.jsx")
    )
});

app.use("/app", (req, res, next) => {

    let path = req.url;
    let code = req.cookies.code;

    res.sendFile(__dirname + `/coding/${code}` + path)

    next()
});

app.post("/write", (req, res, next) => {

    let code = req.cookies.code;
    let user = req.cookies.user;

    let ismkdir = req.cookies.mkdir;

    let path = req.body.path;

    let data = req.body.data;

    let complet_path = `${__dirname}/coding/${code}/${path}`;
    let dir_path = `${__dirname}/coding/${code}/${path}`;

    let error = true

    if (fs.existsSync(dir_path)) {
        error = false;
        if (ismkdir) {
            fs.mkdirSync(complet_path)
        } else {
            open(complet_path).write(data)
        }
    }
    
    res.json({
        error:error
    })

})

app.post("/get_tree", (req, res) => {

    let code = req.cookies.code;
    let path_work = `${__dirname}/coding/${code}/`;

    function getTree(dir) {
        let dire = fs.readdirSync(dir, "utf8");
        let salida = {}

        dire.forEach(x=>{
            
            let dd = dire + "/" + x;

            if (fs.lstatSync(dd).isFile) {
                salida[x] = dd;
            } else {
                salida[x] = getTree(dd);
            }
        });

        return salida
    };

    let ap = getTree(path_work);
    
    res.json({
        app:ap
    })
})

app.post("/create_room", (req, res) => {
    let user_master = req.body.user;

    let code = Create_Room(user_master)

    req.cookies.user = user_master;
    req.cookies.code = code;

    fs.mkdirSync("./coding/" + code)

    console.log("new token: ", code)

    res.json({
        done:true,
        user:user_master,
        code:code
    })
});

app.post("/join_room", (req, res) => {
    let user = req.body.user;
    let code = req.body.code;
    let joined = false
    if(rooms[code]) {
        req.cookies.user = user;
        req.cookies.code = code;
        joined = true;

    };
    res.json({
        joined:joined,
        user:user_master,
        code:code,
        room:rooms[code]
    })
})



app.use("/src", express.static("./src"));
//app.use("/app", express.static("./public"));



server.listen(9080, () => {
    console.log("open in the port 9080")
})