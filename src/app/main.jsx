

let socket = io(document.location.origin, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
});


function emit(eve, data) {
    data.user = app_instanced.state.user; 
    data.code = app_instanced.state.code;

    let d = JSON.stringify(data);

    socket.emit(eve, d);
}


let INFO = (
    <div className="fill" style={{
        "overflow":"auto",
        "display":"flex",
        "justifyContent":"center"
    }}>

        <div style={{"width":"calc(100% - 20px)"}}>
            CodingLive es una app de conferencias en vivo cuyo objetivo
            es dar la facilidad a los programadores de desarrollar 
            un ambiente de trabajo en vivo donde otras personas podran
            presenciar en tiempo real el codigo y el comportamiento de este.
            ideal para las conferencias con tematica de programacion, entrevistas o
            dar clases a distancia.
            <br /><br />
            la app funciona con tecnologia de NodeJS y esta programado con 
            las librerias y frameworks de ReactJS, Express y SocketIO
            <br /><br />
            Esta app fue creado por su autor: 
            
            <a href="https://portafolio.frask.repl.co" style={{color:"gold"}}>
                Frask Dreemurr

            </a>
            <br />
            Version de la app: beta 0.8.0
            <div style={{width:"100%", "height":"90px"}}>

            </div>
        </div>
    </div>
)




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
        mode_explore:false
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

        let gui_explorer_mode = (this.state.master?"1":"0.5");
        if (this.state.mode_explore) {
            gui_explorer_mode = "1"
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
                                                                copy(this.state.code);
                                                                show(
                                                                    <div className="fill medio">
                                                                        <h3 style={{"color":"greenyellow"}}>
                                                                            ¡Codigo copiado!
                                                                        </h3>
                                                                    </div>
                                                                )
                                                            }}>
                                                                {this.state.code}
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
                            INFO,
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
                                            <Img
                                            title="Editor"
                                            style={{"opacity":gui_explorer_mode}}
                                            className="l img_bt img60" img="/src/img/icons/edit.png" size="50px" click={() => {
                                                // Editor

                                                if (!this.state.master) {

                                                    if (!this.state.mode_explore) {
                                                        return null
                                                    }
                                                    
                                                }
                                                
                                                this.setState({edit:true});
                                                if (this.state.master) emit("set", {state: {
                                                    edit: true
                                                }})
                                                

                                            }} />
                                            <Img
                                            title="Sistema de archivos"
                                            style={{"opacity":gui_explorer_mode}}
                                            className="l img_bt img60" img="/src/img/icons/files.png" size="50px" click={() => {
                                                // Sistema de archivos
                                                
                                                if (!this.state.master) {

                                                    if (!this.state.mode_explore) {
                                                        return null
                                                    }
                                                    
                                                }
                                                
                                                this.setState({edit:false});
                                                if (this.state.master) emit("set", {state: {
                                                    edit: false
                                                }})
                                                

                                            }} />

                                            <Img
                                            style={{
                                                "opacity":(!this.state.mode_explore?"1":"0.5"),
                                                "display":(this.state.master?"none":"block"),
                                            }}
                                            title="Modo explorador"
                                            className="r img_bt img60" img="/src/img/icons/view.png" size="50px" click={() => {
                                                // Modo explorador
                                                
                                                let nuevo_modo_explorador = !this.state.mode_explore
                                                




                                                this.setState({mode_explore: nuevo_modo_explorador}, () => {

                                                    if (!nuevo_modo_explorador) {
                                                        emit("getState", {})
                                                    }

                                                })
                                                
                                                

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
                                            <Img 
                                            title="Actualizar" 
                                            className="l img_bt img60" 
                                            img="/src/img/icons/refresh.png" 
                                            size="50px" click={() => {
                                                // actualizar el archivo
                                                let iframe = go("iframe");

                                                saveFile(() => {

                                                    iframe.contentWindow.location.reload()
                                                })



                                            }} />

                                            <Img 
                                            title="Abrir en una pagina"
                                            className="r img_bt img60" 
                                            img="/src/img/icons/open.png" 
                                            size="50px" click={() => {
                                                // Abrir en una pagina
                                                let iframe = go("iframe");

                                                saveFile(() => {
                                                    let url = iframe.contentWindow.location.href
                                                    //.contentWindow.history.back()
                                                    document.createElement("iframe")
                                                    open(url)
                                                })

                                            }} />

                                            <Img 
                                            title="Ir a ..."
                                            className="r img_bt img60" 
                                            img="/src/img/icons/find.png" 
                                            size="50px" click={() => {
                                                // Redirigir a una url

                                                saveFile(() => {

                                                    let iframe = go("iframe");
                                                    let url = go("url_pre");
                                                    iframe.contentWindow.location.href = url.value;
                                                
                                                })

                                                //.contentWindow.history.back()
                                                
                                            }} />

                                            
                                            <Img 
                                            title="Retroceder"
                                            className="l img_bt img60" 
                                            img="/src/img/icons/back.png" 
                                            size="50px" click={() => {
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
                {
                    this.state.join?(
                        // Mensaje fuera y dentro de linea

                        <div className="not-wifi" id="conet">
                           <div className="wife offline" id="to_off">Sin conexion</div>
                           <div className="wife online"  id="to_on">Devuelta en linea</div>
                        </div>
                    ):[]
                }
            </div>
        );
    }
}

let state_wife = true

function msgcon(bol) {

    if (state_wife === bol) return null

    state_wife = bol

    let wins = [go("to_off"), go("to_on")];
    let box = go("conet")

    
    wins.forEach(x=>{
        x.style.display = "none"
    })

    if (bol) {
        go("to_on").style.display = "block";

        setTimeout(() => {
            box.style.transform = "translate(0px, 0px)"
        }, 2000)
        
    } else {
        go("to_off").style.display = "block";
        box.style.transform = "translate(0px, -70px)"

    }
}


let chat_elements = [];
let limit_chat = 1000;
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

                if(!app_instanced.state.master) {
                    if (!app_instanced.state.mode_explore) {
                        return null
                    }
                };

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
                            
                            if(app_instanced.state.master) {
                                
                                emit("run", {
                                    arg: [ ext[extencion], path, data ]
                                })
                                emit("set", {state:{edit:true}})
                            };
                            
                        
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
            if (app_instanced.state.master) emit("refresh_tree", {})
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
let media;

let Audio_delay = 1000

function MainAudio() {

    

    socket.on("voice", (d) => {
        let data = JSON.parse(d);

        if(data.user === app_instanced.state.user) return null

        let Au = new Audio(data.data);

        Au.play();

        
        //console.log("sending voice")

        Au.addEventListener("ended", () => {
            Au = null
        })
    })
    

    setTimeout(() => {

        navigator.mediaDevices.getUserMedia({
            "audio":true
        }).then(x=>{
            stream = x;
            
            let AudioPack = [];
            media = new MediaRecorder(x);
    
            
            media.start();
        
            media.addEventListener("dataavailable", function (event) {
                AudioPack.push(event.data);
            });
        
            media.addEventListener("stop", function () {
                let audioBlob = new Blob(AudioPack);
          
                AudioPack = [];
          
                let fileReader = new FileReader();
                fileReader.onloadend = function () {
                    //console.log("send voice")
                    if (!app_instanced.state.mic) return;
                    
                    let result = fileReader.result;
                    //console.log(result);
                    
                    emit("voice", {body:result})
                    
                };
                
                media.start();
                
                fileReader.readAsDataURL(audioBlob);
          
                setTimeout(function () {
                  media.stop();
                }, Audio_delay);
            });
    
            setTimeout(function () {
                media.stop();
            }, Audio_delay);
        
        });

    }, 100)
    

    

}

function configUser() {
    

    socket.on("set", (d) => {

        if(app_instanced.state.mode_explore) return null

        let data = JSON.parse(d);

        app_instanced.setState(data.state)
    })

    socket.on("update", (d) => {

        if(app_instanced.state.mode_explore) return null

        let data = JSON.parse(d);

        CodeEditor.scrollTo(data.x, data.y);

        if (data.value !== undefined) {
            CodeEditor.setValue(data.value);
            setTimeout(() => {
                CodeEditor.refresh();
            }, 100)
        }
    })

    socket.on("refresh_tree", () => {

        if(app_instanced.state.mode_explore) return null

        refresh_fs_tree()
    })

    socket.on("run", (e) =>{

        if(app_instanced.state.mode_explore) return null

        let data = JSON.parse(e);

        run(...data.arg)

    })

}

function configMaster(params) {
    socket.on("getState", () => {

        console.log("Request State")

        fs.read(path_file_curret, (data, err) => {

            emit("set", {
                state:{
                    edit:app_instanced.state.edit,
                }
            });
    
            emit("refresh_tree", {})
            
    

            let extencion = get_ext(path_file_curret)

            if (err) {
                emit("run", {
                    arg: [ "javascript", path_file_curret, "" ]
                })
                
            } else {
                emit("run", {
                    arg: [ ext[extencion], path_file_curret, data ]
                })
                
            }


            setTimeout(() => {
                let scroll = CodeEditor.getScrollInfo();
                let data_Value = CodeEditor.getValue();
                

                emit("update", {
                    x:scroll.left,
                    y:scroll.top,
                    value:data_Value
                });
            }, 100)



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

let delay_update = 0



function relogin() {
    
    emit("relogin", {})

}


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

                

                if (!x.master) {
                    configUser()
                    emit("getState", {})
                } else {
                    configMaster()
                }

                socket.emit("login", JSON.stringify({
                    user:app_instanced.state.user,
                    code:app_instanced.state.code,
                }))


                // si se pierde la conexion

                socket.on("relogin", () => {
                    msgcon(true)
                })

                setInterval(() => {
                    // reconeccion forzada 

                    relogin();

                    // aveces no se reconecta por lo que debe
                    // de hacer coneccion forzada
                }, 5000)

                setInterval(() => {
                    if (socket.connected === false) {
                        msgcon(false)
                        setTimeout(() => {
                            relogin();
                            console.log("reconectando...")
                        }, 99)
                    }
                }, 100)


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
                    "hintOptions":x.master,
                    "foldOptions":true,
                    "readOnly":!x.master,
                    
                    
                    
                });

                let lee = CodeEditor.getWrapperElement()
                lee.style.width = "100%";
                lee.style.height = "100%";

                if (x.master) {

                    let auto_token = 0;
                    let pro_token_delay_update = 0;

                    delay_update = 100
    
                    CodeEditor.on("change", (target, conf) => {
    
    
                        // Auto update

                        if (pro_token_delay_update === 0) {
                            //clearTimeout(auto_token)
                        
                            setTimeout(() => {


                                let scroll = target.getScrollInfo();
                                let data_Value = target.getValue();
                                
            
                                emit("update", {
                                    x:scroll.left,
                                    y:scroll.top,
                                    value:data_Value
                                })

                                pro_token_delay_update = 0;

                            }, delay_update)
                        }
    
    
    
                        // Auto guardado
    
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
    
                    CodeEditor.on("scroll", (target) => {
                        
                        // Auto update
    
                        let scroll = target.getScrollInfo();
                        //let data_Value = target.getValue();
                        
    
                        emit("update", {
                            x:scroll.left,
                            y:scroll.top,
                        })
    
    
    
                    })
                }


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

                    if (x.master) {
                        
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
                if (app_instanced.state.master) {
                    saveFile(() => {
                        //console.log("manual save is done")
                    })
                    
                }

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