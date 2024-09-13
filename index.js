let express = require("express");
let socketIO = require("socket.io");
let bp = require("body-parser");
let cookie = require("cookie-session");
let fs = require("fs");
let http = require("http");
let PATH = require("path");
let keys = [
    "frask", "Vinestar Studio", "Byte",
    "31947912412361827638123618263191",
    "Coding", "live", "c52sD1Q"
];

let j = PATH.join;
let app = express();
let server = new http.Server(app)
let io = new socketIO.Server(server);

let _dr = __dirname;

io.listen(server);



app.use(cookie({
    "keys": keys,
    "maxAge":(1000*3600*24*1),
    "name":"CodingLive"
}));
app.use(bp.json());


let open = (p) => {
    let me = {
        read:() => fs.readFileSync(PATH.normalize(p), "utf-8"),
        write:(data) => fs.writeFileSync(PATH.normalize(p), data),
        json:{
            read:() => JSON.parse(fs.readFileSync(PATH.normalize(p), "utf-8")),
            write:(data) => fs.writeFileSync(PATH.normalize(p), JSON.stringify(data)),
        },
        react:(url) => fs.readFileSync(PATH.normalize(p), "utf-8").replace(
            "{script}", 
            `<script src="${url}" type="text/babel"></script>`
        )
    };
    return me
};


let template = open(__dirname + "/public/index.html")

function Create_Room(username) {
    
    let code = 0; 
    
    do {

        code = "C" + (Math.random() + "").slice(2, 8)

    } while (rooms[code])

    

    if(process.argv[2] == "//debug") code = "C000000";


    let room = {
        master:username,
        users:[
            username
        ],
        code:code,
        live:{}
    }

    rooms[code] = room
    rooms.push(room)

    return code
}


let rooms = []


function getRoom(code, call) {
    let room = rooms[code]

    if (room) {
        if (call) call(room, false)
    } else call(undefined, true)
}


function for_obj(obj, call) {
    let o_a = Object.keys(obj);

    o_a.forEach(x=>{
        call(obj[x], x)
    })
}


io.on("connection", (socket) => {
    let user = "";
    let code = "";

    console.log("a new user is conected")

    function distribuir(event) {
        socket.on(event, (data) => {
            //socket.emit("chat", data)
            //console.log("a event socket is reader:", event)
    
            let x = JSON.parse(data);
    
            
            getRoom(x.code, (room, err) => {
                if (err) {
                    
                } else {

                    for_obj(room.live, (x, name) => {
                        x.emit(event, data)
                    })

                
                }
            })
    
        });
    }

    distribuir("chat");
    distribuir("set");
    distribuir("run");
    distribuir("update");
    distribuir("getState");
    distribuir("refresh_tree");
    
    

    socket.on("login", (data) => {
        let x = JSON.parse(data);

        //console.log("a user is login")

        getRoom(x.code, (room, err) => {
            if (err) {
                
                console.log("user can't login in the server socket live")
                socket.emit("islogin", "false");
            } else {
                
                room.live[x.user] = socket;
                //room.live.push(socket)

                user = x.user;
                code = x.code;
                
                socket.emit("islogin", "true");

                console.log("user is login in the server socket live")
            }
        });

    });

    socket.on("relogin", (data) => {
        let x = JSON.parse(data);

        let room = rooms[x.code];

        if (room !== undefined) {

            room.live[x.user] = socket;
            
            socket.emit("relogin", "true");
        } else {
            
            //socket.emit("islogin", "false");
        }

    });
    
    socket.on("voice", function (dat) {

        //console.log("Voice distribuit")
        
        let data = JSON.parse(dat)
        let newData = data.body.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];
    
        getRoom(data.code, (room, err) => {
            if (!err) {

                for_obj(room.live, (x, name) => {
                    x.emit("voice", JSON.stringify({data: newData, user:data.user}))
                })

                /*room.live.forEach(x=> {
                    x.emit("voice", JSON.stringify({data: newData, user:data.user}))
                })*/
            }
        })

    });


    

})


app.get("/clear", (req, res, next) => {

    fs.readdirSync(PATH.normalize("./coding"), "utf8").forEach(x=>{
        fs.rmdirSync(PATH.normalize(`./coding/${x}`), {"recursive":true})
    })
    rooms = [];
    
    req.session.code = undefined
    req.session.user = undefined
    
    res.redirect("/")
});

function find_forcode(c) {
    
    for (let i = 0; i < rooms.length; i++) {
        const element = rooms[i];
        
        if (element.code == c) {
            return element
        }
    }

    return undefined
}

app.post("/islogin", (req, res) => {

    let master = false

    if (rooms[req.session.code]) {
        let room = rooms[req.session.code];

        master = room.master == req.session.user;
    };

    res.json({
        user:req.session.user,
        code:req.session.code,
        master:master,
        login:Boolean(req.session.code)
    })
})

app.post("/exit", (req, res) => {

    let master = false
    let user = req.session.user,
        code = req.session.code;

    if (rooms[req.session.code]) {
        let room = rooms[req.session.code];

        master = room.master == req.session.user;
    };

    if (master) {
        fs.rmdirSync(__dirname + `/coding/${code}`, {recursive:true});
        rooms[req.session.code] = undefined;
    } else {
        let room = rooms[req.session.code];
        room.users = room.users.filter(x=>!(req.session.user == x));
    }

    req.session.code = undefined
    req.session.user = undefined

    res.json({done:true})
})

app.post("/getroom", (req, res) => {
    let salida = rooms[req.body.code||req.session.code]||{};

    salida = Object.assign(salida, {});
    salida.live = []
    res.json(
        salida
    )
})

app.post("/join", (req, res) => {
    let data = {
        user:req.body.user,
        code:req.body.code,
    };

    let code = false
    let user = false
    let joined = false


    if (rooms[data.code]) {
        code = true;
        let room = rooms[data.code];

        if (!room.users.includes(data.user)) {
            user = true
            joined = true
            room.users.push(data.user)
        }


    }

    req.session.user = data.user;
    req.session.code = data.code;


    res.json({
        code:code,
        user:user,
        joined:joined
    })
})

app.get("/", (req, res, next) => {

    let code = req.session.code;
    console.log(req.session)


    if (typeof(rooms[code]) == "undefined") {
        req.session.code = undefined
        req.session.user = undefined
        console.log("restart cookies")
    }

    res.send(
        template.react("/src/app/main.jsx")
    )
});

function replace(t, o, n) {
    if (o === n) return t;
    
    while (t.includes(o)) {
        t = t.replace(o, n)
    }
    return t
}

app.use("/app", (req, res, next) => {

    let path = req.url;
    let code = req.session.code;
    //\\

    // Path siempre sera una dereccion absoluta 

    // let path_file = PATH.normalize(`${__dirname}/coding/${code}`);
    let path_file = __dirname + replace(`/coding/${code}` + path, "/", PATH.sep);
    console.log(path_file)



    // if (fs.existsSync(path_file)) {


    //     if (fs.lstatSync(path_file).isDirectory()) {
    //         //path_file = path_file + "/index.html";
    //         // res.redirect( clear_path("/app" + path + "/index.html"));
    //         console.log("/app", `'${path}' - to index file`)
    //         let end_path = PATH.normalize(path_file + "/index.html")
    //         console.log("end_path is:", end_path)
            
    //         if (fs.existsSync(end_path)) {
    
    //             if (fs.lstatSync(end_path).isFile()) {
    //                 // res.sendFile(end_path)
    //                 res.send(open(PATH.normalize(end_path)).read())
    //                 // res.send("")
    //             } else {
    
    //                 res.send(open(PATH.normalize("./public/404.html")).read())
    //             }
    
    //         } else {
    //             // res.sendFile(PATH.normalize(__dirname + "/public/404.html"))
    //             res.send(open(PATH.normalize("./public/404.html")).read())
    
    //         };
    //     }
    // }

    if (fs.existsSync(path_file)) {


        if (fs.lstatSync(path_file).isDirectory()) {
            //path_file = path_file + "/index.html";
            res.redirect( clear_path("/app" + path + "/index.html"));
            
        }
    }
    

    


    

    if (!fs.existsSync(path_file)) {
        
        // res.send(`
        
        // the page '${req.url}' not found
        
        // `)

        res.send(open(PATH.normalize("./public/404.html")).read())
    
    } else {

        res.sendFile(path_file)
    }





});
app.post("/read", (req, res, next) => {

    let code = req.session.code;
    let user = req.session.user;

    let path = req.body.path
    let complet_path = PATH.normalize(`${__dirname}/coding/${code}/${path}`);
    let data = ""
    let error = true

    if (fs.existsSync(complet_path)) {
        error = false
        data = fs.readFileSync(complet_path, "utf8")

    }

    res.send({
        error:error,
        data:data,
    })


})
app.post("/delete", (req, res, next) => {

    let code = req.session.code;
    let user = req.session.user;

    let isrmdir = req.body.rmdir;

    let path = req.body.path;

    let complet_path = PATH.normalize(`${__dirname}/coding/${code}/${path}`);
    let dir_path =  PATH.normalize(`${__dirname}/coding/${code}/${PATH.dirname(path)}`) ;
    let error = true

    if (rooms[code].master != user) {
        res.json({error:true, notmaster:true});
        return null
    }

    if (fs.existsSync(complet_path)) {
        error = false
        if (fs.lstatSync(complet_path).isDirectory()) {
            fs.rmdirSync(PATH.normalize(clear_path(complet_path)), {recursive:true})
        } else {
            fs.unlinkSync(PATH.normalize(clear_path(complet_path)))
        }

        console.log("delete file or folder:", complet_path)
    }


    res.json({error:error})

});

app.post("/rename", (req, res) => {
    
    let code = req.session.code;
    let user = req.session.user;

    let ismkdir = req.body.mkdir;

    let path = req.body.path;
    let new_path = req.body.new_path;

    let data = req.body.data;

    let complet_path =  PATH.normalize(`${__dirname}/coding/${code}/${path}`);
    let complet_new_path = PATH.normalize(`${__dirname}/coding/${code}/${new_path}`);
    let dir_new_path = PATH.dirname(complet_new_path);
    let dir_path = PATH.dirname(complet_path);
    let error = true

    if (rooms[code].master != user) {
        res.json({error:true, notmaster:true});
        return null
    }

    if ((fs.existsSync(complet_path)) & (fs.existsSync(dir_new_path))) {

        if (fs.lstatSync(dir_new_path).isDirectory()) {
            
            error = false;
        
            fs.renameSync(clear_path(complet_path), clear_path(complet_new_path));
        }

    }

    res.json({
        error:error
    })

})

function clear_path(path) {
    path = replace(path, "//", "/")
    path = replace(path, "\\\\", "\\")
    return path
}


app.post("/write", (req, res, next) => {

    let code = req.session.code;
    let user = req.session.user;

    let ismkdir = req.body.mkdir;

    let path = req.body.path;

    let data = req.body.data;

    let complet_path = PATH.normalize(`${__dirname}/coding/${code}/${path}`);
    let dir_path = PATH.dirname(complet_path);
    let error = true


    if (rooms[code].master != user) {
        res.json({error:true, notmaster:true});
        return null
    }

    console.log(dir_path, ":::" , complet_path)

    if (fs.existsSync(dir_path)) {
        error = false
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

    let code = req.session.code;
    let path_work = PATH.normalize(`${__dirname}/coding/${code}/`);

    function getTree(dir) {
        let dire = fs.readdirSync(dir, "utf8");
        let salida = {}

        console.log("get tree:", dire)

        dire.forEach(x=>{
            
            let dd = PATH.normalize(dir + "/" + x);

            if (fs.lstatSync(dd).isFile()) {
                salida[x] = dd.slice(path_work.length);
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

app.post("/test", (req, res) => {

    console.log("input:", req.body);

    res.json({
        rooms:rooms,
        cookies:{
            user:req.session.user,
            code:req.session.code
        }
    })
})

app.post("/create_room", (req, res) => {
    let user_master = req.body.user;

    let code = Create_Room(user_master)

    req.session.user = user_master;
    req.session.code = code;

    

    console.log("generate:", req.session)

    if(!fs.existsSync("./coding/" + code)) fs.mkdirSync("./coding/" + code)

    console.log("new token: ", code)

    res.json({
        done:true,
        user:user_master,
        code:code
    })
});




app.use("/src", express.static(PATH.normalize(__dirname + "/src")));
app.use("/codemirror", express.static( PATH.normalize(__dirname + "/codemirror")));
//app.use("/app", express.static("./public"));

let PORT = process.env.PORT || 9080 

server.listen(PORT, () => {
    console.log(`open in the port ${PORT}`)
})