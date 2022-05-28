

let socket = io();


function emit(eve, data) {
    data.user = app_instanced.state.user; 
    data.code = app_instanced.state.code;

    let d = JSON.stringify(data);

    socket.emit(eve, d);
}




let users = [];


function render_users() {

    let yo_soy_master = app_instanced.state.master

    send("/getroom", {code:app_instanced.state.code}).then(x=>{
        let users = x.users;




        show(
            <div>
                {
                    users.map(y=>{

                        
                        let yo = y == app_instanced.state.user;
                        let master = y == x.master;

                        return(
                            <div style={{
                                "padding":"10px"
                            }}>
                                {`${y} ${yo?"(Yo)":""} ${master?"(Maestro)":""}`}
                            </div>
                        )
                    })
                }
            </div>
        )
    })
}

screen.orientation.addEventListener("change", () => {
    app_instanced.setState({
        ori_v: getOrientation()
    })
})

class App extends React.Component {

    state = {
        code:"",
        user:"",
        master:false,
        join:false,
        login:true,
        edit:true,
        preview:false,
        ori_v:false,
        mic:true,
        chat:false,
    };

    render() {
        app_instanced = this;

        let preview = {
            editor: !this.state.preview,
            preview: this.state.preview,
        }

        let ori_v = getOrientation()

        if (!ori_v) {
            preview = {
                editor:true,
                preview:true
            }
        }

        return (
            <div className="app">
                <div className="head">

                    
                    
                    
                    {(
                        this.state.join?(
                            // Solo si esta unido
                            this.state.master?(
                                // Modo maestro
                                <div>
                                    {
                                        [
                                            ["Invitar", "/src/img/icons/guest.png", () => {
                                                show(
                                                    <div>
                                                        <center>
                                                            Codigo de la sala:
                                                            <br />
                                                            <br />
                                                            <br />
                                                            <div style={{
                                                                "color":"gold", 
                                                                "cursor":"pointer",
                                                                "fontSize":"20px"
                                                            }} onClick={() => {
                                                                copy(this.state.room_code);
                                                                show(
                                                                    <div className="fill medio">
                                                                        <h3 style={{"color":"greenyellow"}}>
                                                                            ¡Codigo copiado!
                                                                        </h3>
                                                                    </div>
                                                                )
                                                            }}>
                                                                {this.state.room_code}
                                                            </div> 
                                                            
                                                        </center>
                                                    </div>
                                                )
                                            }],
                                            ["Cerrar la sala", "/src/img/icons/exit.png", () => {
                                                send("/exit").then(x=> {
                                                    document.location.reload()
                                                })
                                            }],
                                            ["Miembros", "/src/img/icons/group.png", render_users]
                                        ].map(x=>{
                                            return(

                                                <Bta portrait={{
                                                    img:x[1]
                                                }} landscape={{height:"50px"}} className="l" click={genlink(x[2])}>
                                                    {x[0]}
                                                </Bta>
                                            )
                                        })
                                    }
                                </div>
                            ):(
                                // Modo invitado
                                <div>
                                    {
                                        [
                                            ["Salir de la sala", "/src/img/icons/exit.png", () => {
                                                send("/exit").then(x=> {
                                                    document.location.reload()
                                                })
                                            }],
                                            ["Miembros", "/src/img/icons/group.png", render_users]
                                        ].map(x=>{
                                            return(

                                                <Bta portrait={{
                                                    img:x[1]
                                                }} landscape={{height:"50px"}} className="l" click={genlink(x[2])}>
                                                    {x[0]}
                                                </Bta>
                                            )
                                        })
                                    }
                                </div>
                            )

                        ):[
                            // de lo contrario nada
                        ]
                    )}

                    <div className="r img" style={{
                        "width":"50px",
                        "height":"50px",
                        "backgroundImage":`url("/src/img/icons/info.png")`
                    }} onClick={() => {
                        show(
                            <div>
                                {
                                    range(0, 20).map(x => {
                                        return (
                                            <h1>
                                                Hola mundo
                                            </h1>
                                        )
                                    }) 
                                }
                            </div>,
                            () => {

                            }
                        )
                    }}>

                    </div>

                </div>
                <div className="body">

                    {(
                        this.state.join?(
                               //   this.state.master?(
                               //       []                        
                               //   ):(
                               //       []
                               //   ) 
                            <div className="fill">

                                <div className="head_mobile">
                                    <div className="bthead_mobile medio l" onClick={() => {
                                        this.setState({
                                            preview:false
                                        })
                                    }}>
                                        Editor
                                    </div>
                                    <div className="bthead_mobile medio l" onClick={() => {
                                        this.setState({
                                            preview:true
                                        })
                                    }}>
                                        Vista previa
                                    </div>
                                </div>
                                <div className="body_mobile">

                                    <div
                                        // Editor

                                        className="editor l"
                                        id="editor_gui"
                                        style={{
                                            "display":((preview.editor)?"block":"none")
                                        }}
                                    >

                                        <div
                                            className="header_control"
                                        >
                                            <Img className="l img_bt img60" img="/src/img/icons/edit.png" size="50px" click={() => {
                                                // Editor
                                                
                                                this.setState({edit:true})

                                            }} />
                                            <Img className="l img_bt img60" img="/src/img/icons/files.png" size="50px" click={() => {
                                                // Sistema de archivos
                                                
                                                this.setState({edit:false})

                                            }} />
                                        
                                        </div>
                                        <div
                                            className="body_control"
                                        > 
                                            <div
                                                //editor
                                                id="edit1"
                                                className="fill"
                                                style={{
                                                    "display":(this.state.edit?"block":"none")
                                                }}

                                            >
                                                
                                                

                                            </div>
                                            <div
                                                //Sistema de archivos
                                                id="edit2"
                                                className="fill"
                                                style={{
                                                    "display":((!this.state.edit)?"block":"none")
                                                }}
                                                
                                            >

                                            </div>
                                        
                                        </div>
                                        
                                    </div>

                                    <div
                                        // Preview

                                        className="preview l"
                                        id="preview_gui"
                                        style={{
                                            "display":((preview.preview)?"block":"none")
                                        }}
                                    >

                                        <div
                                            className="header_control"
                                        >
                                            <Img className="l img_bt img60" img="/src/img/icons/refresh.png" size="50px" click={() => {
                                                // actualizar el archivo
                                                let iframe = go("iframe");

                                                saveFile(() => {

                                                    iframe.contentWindow.location.reload()
                                                })



                                            }} />

                                            <Img className="r img_bt img60" img="/src/img/icons/open.png" size="50px" click={() => {
                                                // Abrir en una pagina
                                                let iframe = go("iframe");

                                                saveFile(() => {
                                                    let url = iframe.contentWindow.location.href
                                                    //.contentWindow.history.back()
                                                    document.createElement("iframe")
                                                    open(url)
                                                })

                                            }} />

                                            <Img className="r img_bt img60" img="/src/img/icons/find.png" size="50px" click={() => {
                                                // Abrir en una pagina

                                                saveFile(() => {

                                                    let iframe = go("iframe");
                                                    let url = go("url_pre");
                                                    iframe.contentWindow.location.href = url.value;
                                                
                                                })

                                                //.contentWindow.history.back()
                                                
                                            }} />

                                            
                                            <Img className="l img_bt img60" img="/src/img/icons/back.png" size="50px" click={() => {
                                                // ir hacia atras
                                                let iframe = go("iframe");

                                                saveFile(() => {
                                                    iframe.contentWindow.history.back()

                                                })


                                            }} />

                                            <input id="url_pre" type="text" className="l" style={{
                                                "width":"calc(100% - 200px)",
                                                "height":"50px",
                                                "fontSize":"18px",
                                                "backgroundColor":"white",
                                                "color":"black"
                                            }} />

                                            
                                        </div>
                                        <div
                                            className="body_control"
                                        >
                                            <iframe id="iframe" src="/app" className="fill iframe_preview" style={{
                                                "backgroundColor":"white"
                                            }} onLoad={() => {
                                                go("url_pre").value = go("iframe").contentWindow.location.href
                                            }}>

                                            </iframe>

                                        </div>

                                    </div>

                                </div>

                            </div>   
                        ):(
                            <div className="medio fill">
                                <div className="boxjoin">
                                    <div className="headbox">
                                        <div className="bthead_join medio" onClick={() => {this.setState({login:true})}}>
                                            Unirme
                                        </div>
                                        <div className="bthead_join medio" onClick={() => {this.setState({login:false})}}>
                                            Crear sala
                                        </div>
                                    </div>
                                    <div className="boxbody medio">
                                        {
                                            this.state.login?(
                                                // Unirme
                                                <div>
                                                    <center className="join_come">
                                                        <div className="content_box_join_sep1">
                                                            <input placeholder="Nombre" id="nombre" type="text" className="form_input_join" />
                                                            <input placeholder="Codigo de invitacion" id="codigo" type="text" className="form_input_join" />

                                                        </div>
                                                        <div className="content_box_join_sep2">

                                                        </div>
                                                        <div className="content_box_join_sep3 medio">

                                                            <div className="sumit" onClick={() => {
                                                                let nombre = go("nombre").value;
                                                                let codigo = go("codigo").value;

                                                                if ((nombre+"").length < 5) {
                                                                    alert("tu nombre debe de tener por lo menos 5 caracteres")
                                                                    return null
                                                                }

                                                                send("/join", {user:nombre, code:codigo}).then(x=>{

                                                                    if (!x.user) {
                                                                        show(
                                                                            <div className="fill medio">
                                                                                <h3 style={{"color":"crimson"}}>
                                                                                    Nombre de usuario ya usado en esta sala
                                                                                </h3>
                                                                            </div>
                                                                        )
                                                                        return null
                                                                    };
                                                                    if (!x.code) {
                                                                        show(
                                                                            <div className="fill medio">
                                                                                <h3 style={{"color":"crimson"}}>
                                                                                    Codigo de sala invalido
                                                                                </h3>
                                                                            </div>
                                                                        )
                                                                        return null;
                                                                    };
                                                                    

                                                                    if (x.joined) {
                                                                        this.setState({
                                                                            code:codigo,
                                                                            user:nombre,
                                                                            join:true,
                                                                            master:false
                                                                        }, () => {
                                                                            main()
                                                                        })

                                                                    } else {
                                                                        alert("Codigo o nombre invalido")
                                                                    }

                                                                })
                                                            }}>
                                                                Unirme
                                                            </div>
                                                        </div>
                                                    </center>
                                                </div>
                                            ):(
                                                // Crear
                                                <div>
                                                    <center className="join_come">
                                                        <div className="content_box_join_sep1">
                                                            <input placeholder="Nombre" id="nombre" type="text" className="form_input_join" />

                                                        </div>
                                                        <div className="content_box_join_sep2">

                                                        </div>
                                                        <div className="content_box_join_sep3 medio">

                                                            <div className="sumit" onClick={() => {
                                                                let nombre = go("nombre").value;

                                                                if ((nombre+"").length < 5) {
                                                                    alert("tu nombre debe de tener por lo menos 5 caracteres")
                                                                    return null
                                                                }

                                                                send("/create_room", {user:nombre}).then(x=>{

                                                                    this.setState({
                                                                        code:x.code,
                                                                        user:nombre,
                                                                        master:true,
                                                                        join:true
                                                                    }, () => {
                                                                        main()
                                                                    });

                                                                    console.log(x)
                                                                })
                                                            }}>
                                                                Crear sala
                                                            </div>
                                                        </div>
                                                    </center>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                
                            </div>
                        )
                    )}

                </div>
                <div className="over" id="over">

                    <div className="over_windows">
                        <div className="head">
                            <div className="r img" style={{
                                "width":"50px",
                                "height":"50px",
                                "backgroundImage":`url("/src/img/icons/close.png")`
                            }} onClick={() => {

                                let over = go("over");
                                over.style.display = "none";

                            }}>

                            </div>
                        </div>
                        <div className="body over_content" id="over_content" style={{
                            "padding":"20px",
                            "width":"calc(100% - 40px)",
                            "height":"calc(100% - 40px - 76px)",
                        }}>

                        </div>
                    </div>

                </div>
                {
                    this.state.join?(
                        <div className="chat-box"

                            style={{
                                "top":this.state.chat?"calc(100% - 500px)":"calc(100% - 50px)"
                            }}

                        >
                            <div className="head-chat">

                                <div style={{
                                    "width":"calc(100% - 70px)",
                                    "paddingLeft":"20px",
                                    "display":"flex",
                                    "alignItems":"center",
                                    "float":"left",
                                    "height":"50px",
                                    "fontWeight":"bold",
                                    "fontSize":"16px"
                                }} onClick={() => {

                                    // Mostrar y ocultar chat

                                    this.setState({chat:!this.state.chat})


                                }}>

                                    Chat

                                </div>
                                <Img className="l img_bt img60" img="/src/img/icons/mic.png" size="50px" click={() => {
                                    // Alternar actividad del microfono
                                    
                                    this.setState({mic:!this.state.mic})

                                }} style={{
                                    "opacity":this.state.mic?"1":"0.5"
                                }} />
                                
                            </div>

                            <div className="body-chat">
                                <div className="chat" id="chat">



                                </div>
                                <div className="chat-camp">
                                    <input contentEditable="true" style={{
                                        "display":"flex",
                                        "alignItems":"center",
                                        "fontSize":"16px",
                                        "width":"calc(100% - 50px)",
                                        "height":"50px",
                                        "float":"left",
                                        "backgroundColor":"transparent",
                                        "padding":"10px"
                                    }} placeholder="Mensaje" id="chat-text" />
                                    <Img className="l img_bt img60" img="/src/img/icons/send.png" size="50px" click={() => {
                                        // Enviar

                                        let text = go("chat-text").value;

                                        if (text !== "") {
                                            go("chat-text").value = ""
                                            //pushMsg(this.state.user, text)

                                            emit("chat", {
                                                name:this.state.user,
                                                text:text,
                                            })
                                        }

                                        

                                    }} />

                                </div>
                            </div>
                        </div>
                    ):[]
                }
            </div>
        );
    }
}

let chat_elements = [];
let limit_chat = 100;
let chatColors = ["red", "crimson", "dodgerblue", "green", "yellowgreen", "orange", "gold"]
let NamesColors = {}

function getcolor_name_chat(username) {

    NamesColors[username] = NamesColors[username]||(() => {
        let n = parseInt((Math.random()+"").slice(2, 8));
        let longs = n % chatColors.length;

        return longs
    })()

    let NC = NamesColors[username];

    return chatColors[NC]
}

function refresh_chat(call) {
    let callback = genlink(call);

    while (chat_elements.length > limit_chat) {
        chat_elements = chat_elements.slice(1)
    }




    ReactDOM.render(
        chat_elements.map(x=> {
            return(
                <div className="content-msg">

                    <span
                    style={{
                        "color":getcolor_name_chat(x.name)
                    }}
                    >{x.name}</span>:
                    <span>
                        {x.text}
                    </span>

                </div>
            )
        }),
        go("chat"),
        () => {
            callback();

            let todown = go("chat").scrollTop > (go("chat").scrollHeight - go("chat").offsetHeight - 100)


            //console.log(todown)


            if (todown) {
                go("chat").scrollTop = go("chat").scrollHeight
            }

        }
    )
}

function pushMsg(nombre, text) {
    chat_elements.push({
        name:nombre,
        text:text
    });

    refresh_chat()
}


let app_instanced = (new App())


function close_win() {
    let over = go("over");
    over.style.display = "none";
}

let path_file_curret = "";

let CodeEditor = CodeMirror()

programs["editor"] = (type, path, data) => {

    let json = type == "json"
    if (json) type = "javascript";

    /*console.log(`
    opening editor:

    typeFile: ${type}
    pathfile: ${path}

    data: ${data}
    
    `)*/

    CodeEditor.setOption("mode", {
        "name":type,
        "json":json
    });

    CodeEditor.setValue(data);
    path_file_curret = path;
    
    setTimeout(() => {

        CodeEditor.refresh();
    }, 100)


}


let eventos_editor = {
    FileSystem:{
        folder:{
            delete:(path) => {

                fs.rmdir(path, (err) => {
                    if (err) {
                        show(
                            <div className="medio fill">
                                <div style={{color:"crimson"}}>
                                    No se a podido eliminar el directorio '{path}'
                                    <br /><br />
                                    {err.notmaster?"No tienes permisos para hacer esto":""}

                                </div>
                            </div>
                        )
                    } else {
                        refresh_fs_tree()

                    }
                })
            },
            rename:(path) => {
                eventos_editor.FileSystem.file.rename(path)
            },
            add:(path) => {

                let isdir = false

                function callback(err) {
                    

                    if (err) {
                        show(
                            <div className="medio fill">
                                <div style={{color:"crimson"}}>
                                    No se a podido crear el {isdir?"directorio":"archivo"} '{path}'
                                    <br /><br />
                                    {err.notmaster?"No tienes permisos para hacer esto":""}

                                </div>
                            </div>
                        )
                    }

                    refresh_fs_tree()
                }
                

                show(
                    <div className="medio fill">
                        <div>
                            <input 
                            type="text" 
                            placeholder="nuevo archivo"
                            id="namefile"
                            className="form_input"
                            />


                            <br />

                            <div
                            className="sumit"
                            onClick={() => {
                                isdir = true

                                let namefile = go("namefile").value

                                if (namefile == "") {
                                    console.error("you must write a name")
                                    callback(true)
                                    return null
                                }

                                fs.mkdir(path + "/" + namefile, callback)

                                close_win()
                            }}
                            >
                                Crear carpeta
                            </div>
                            <br />

                            <div
                            className="sumit"
                            onClick={() => {

                                let namefile = go("namefile").value

                                if (namefile == "") {
                                    console.error("you must write a name")
                                    callback(true)
                                    return null
                                }

                                fs.write(path + "/" + namefile, "", callback)

                                close_win()
                            }}
                            >
                                Crear archivo
                            </div>
                            
                            
                        </div>
                        
                    </div>,
                    () => {
                        let ren = go("namefile");
                        ren.value = ""
                    }
                )

                
            }
        },
        file:{
            delete:(path) => {

                fs.rmdir(path, (err) => {
                    if (err) {
                        show(
                            <div className="medio fill">
                                <div style={{color:"crimson"}}>
                                    No se a podido eliminar el archivo '{path}'
                                    <br /><br />
                                    {err.notmaster?"No tienes permisos para hacer esto":""}
                                    
                                </div>
                            </div>
                        )
                    }
                    refresh_fs_tree()

                })
            },
            rename:(path) => {
                let dir_path = get_dirname(path);
                let name_file = get_namefile(path);

                show(
                    <div className="medio fill">
                        <div>
                            <input 
                            type="text" 
                            placeholder="Nuevo nombre"
                            id="rename_camp"
                            className="form_input"
                            />


                            <br />

                            <div
                            className="sumit"
                            onClick={() => {

                                let callback = (err) => {


                                    if (err) {
                                        show(
                                            <div className="medio fill">
                                                <div style={{color:"crimson"}}>
                                                    No se a podido renombrar el archivo '{path}'
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        close_win()
                                    }
                                    refresh_fs_tree()

                                }

                                if (go("rename_camp").value == "") {
                                    console.error("you must write a name for rename")
                                    callback(true)
                                    return null
                                }

                                fs.rename(path, dir_path + go("rename_camp").value, callback)

                            }}
                            >
                                Renombrar
                            </div>
                            
                        </div>
                        
                    </div>,

                    () => {
                        let ren = go("rename_camp");
                        ren.value = name_file;
                    }
                
                )

                
            },
            open:(path) => {
                fs.read(path, (data, err) => {

                    //console.log(path, err)

                    if (err) {
                        show(
                            <div className="medio fill">
                                <div style={{color:"crimson"}}>
                                    No se a podido leer el archivo '{path}'
                                </div>
                            </div>
                        )
                    } else {

                        saveFile(() => {
                            
                            //console.log("data file:", data);
    
                            let extencion = get_ext(path)
    
                            run(ext[extencion], path, data)
    
                            app_instanced.setState({edit:true})
                        
                        })


                    }
                    refresh_fs_tree()

                })
            }
        }
    }
}



function render_tree(obj, list, nombre, eventos, call) {
    ReactDOM.render(
        <Folder 
        path="/"
        name={nombre}
        list={list}
        events={eventos}

        />,
        obj,
        () => {
            
            genlink(call)();

        }
    )
}

function refresh_fs_tree() {
    send("/get_tree").then(x=>{
        //console.log("tree:", x)
        render_tree(go("edit2"), x.app, "app", eventos_editor.FileSystem, () => {
            console.warn("Files system tree is loadend")
        })
    })
}


function show(page, call) {
    ReactDOM.render(
        page,
        go("over_content"),
        () => {
            
            let over = go("over");
                                
            over.style.display = "flex";

            genlink(call)();

        }
    )
}

function saveFile(call) {
    if (path_file_curret === "") {
        console.error("no se pudo guardar el archivo");
        genlink(call)(true)
        return null
    };


    let path = path_file_curret;
    let data = CodeEditor.getValue();
    let callback = genlink(call);
    //console.log("saving file:", path);
    //console.log("data: \n\n", data);
    fs.write(path, data, callback);
}

let stream;
let media

function MainAudio() {
    
    
    let nav = navigator.mediaDevices.getUserMedia({
        "audio":true
    }).then(x=>{
        stream = x;
        
        let AudioPack = [];
        media = new MediaStream(stream);
        
        media.start();
    
        media.addEventListener("dataavailable", function (event) {
            AudioPack.push(event.data);
        });
    
        media.addEventListener("stop", function () {
            let audioBlob = new Blob(AudioPack);
      
            AudioPack = [];
      
            let fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = function () {
                if (!app_instanced.state.mic) return;
      
                let result = fileReader.result;
                emit("voice", {body:result})
      
            };
      
            media.start();
      
      
            setTimeout(function () {
              media.stop();
            }, 1000);
          });
    
    })


    socket.on("voice", (data) => {
        let Au = new Audio(data);
        Au.play();

        Au.addEventListener("ended", () => {
            Au = null
        })
    })
}




function setSockets() {
    socket.on("chat", (d) => {
        let data = JSON.parse(d);
    
        pushMsg(data.name, data.text)
    });



}
setSockets()

function main() {
    console.log("App is load end")

    send("/islogin").then(x=>{
        console.log(x)
        if (x.login) {
            app_instanced.setState({
                user:x.user,
                code:x.code,
                master:x.master,
                join:true,
                login:true
            }, () => {

                socket.emit("login", JSON.stringify({
                    user:x.user,
                    code:x.code
                }))

                
                refresh_fs_tree()
                CodeEditor = CodeMirror(go("edit1"), {
                    "mode":"javascript",
                    "theme":"tomorrow-night-bright",
                    "value":"",
                    "lineNumbers":true,
                    "tabindex":4,
                    "matchBrackets":true,
                    "autoCloseBrackets":true,
                    "matchInMiddle":true,
                    "hintOptions":true,
                    "foldOptions":true,
                    "readOnly":false
                    
                    
                });

                let lee = CodeEditor.getWrapperElement()
                lee.style.width = "100%";
                lee.style.height = "100%";

                let auto_token = 0

                CodeEditor.on("change", (target, conf) => {

                    

                    if (auto_token != 0) {
                        clearTimeout(auto_token)
                    }

                    auto_token = setTimeout(() => {
                        auto_token = 0
                        saveFile(() => {
                            console.log("auto save.")
                        })                        
                    }, 3000)
                });

                let keysoff = [
                    13, 27, 39, 38, 37, 40, 188, 32, 
                    ...range(0, 9).map(x=>x+48),
                    
                    40, 41, 123, 125, 91, 93,

                    17, 18, 16, 8, 226,

                    191, 222, 56, 57, 186, 187, 9
                ]
                let keys_on = [190]

                CodeEditor.on("keyup", function (cm, event) {
                    //console.log("key:", event.keyCode)

                    if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
                        !keysoff.includes(event.keyCode) &&
                        !event.ctrlKey
                        ) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
                        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                    }

                    switch (CodeEditor.options.mode.name) {
                        case "css":
                            if (event.keyCode === 32) {
                                CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                                
                            }
                            break;
                    
                        default:
                            break;
                    }

                    
                    if (event.ctrlKey) {
                        switch (event.keyCode) {
                            case 32:
                                CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                                break;
                        
                            default:
                                break;
                        }
                    }
                });

                setTimeout(() => {

                    MainAudio()

                }, 1000)



                
            })
        }
    })
}

let show_keycodes_debug = false

function KeyDebug() {
    show_keycodes_debug=!show_keycodes_debug
}
window.addEventListener("keydown", (e) => {

    if (show_keycodes_debug) {
        console.log("Keycode:", e.key, e.keyCode)
    }

    if (e.ctrlKey) {
        switch (e.key) {
            case "s":
                
                e.preventDefault();
                
                saveFile(() => {
                    //console.log("manual save is done")
                })

                break;
        
            default:
                break;
        }
    }

})


ReactDOM.render(
    <App></App>,
    go("_app"),
    () => {
        main()
    }
)