

let socket = io();



class App extends React.Component {

    state = {
        room_code:"",
        user:"",
        master:false,
        join:false,
        login:true,
    };

    render() {
        app_instanced = this;

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
                                            ["Invitar", "/src/img/icons/guest.png"],
                                            ["Cerrar la sala", "/src/img/icons/exit.png"],
                                            ["Miembros", "/src/img/icons/group.png"]
                                        ].map(x=>{
                                            return(

                                                <Bta portrait={{
                                                    img:x[1]
                                                }} landscape={{height:"50px"}} className="l" click={() => {console.log("Hola mundo uwu")}}>
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
                                            ["Salir de la sala", "/src/img/icons/exit.png"],
                                            ["Miembros", "/src/img/icons/group.png"]
                                        ].map(x=>{
                                            return(

                                                <Bta portrait={{
                                                    img:x[1]
                                                }} landscape={{height:"50px"}} className="l" click={() => {console.log("Hola mundo uwu")}}>
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
                                    <div className="bthead_mobile medio">
                                        Editor
                                    </div>
                                    <div className="bthead_mobile medio">
                                        Vista previa
                                    </div>
                                </div>
                                <div className="body_mobile">

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

                                                                send("/join_room", {user:nombre, code:codigo}).then(x=>{

                                                                    if (!x.error) {
                                                                        this.setState({
                                                                            code:x.code,
                                                                            user:nombre,
                                                                            join:true
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
            </div>
        );
    }
}


let app_instanced = (new App())


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



ReactDOM.render(
    <App></App>,
    document.body,
    () => {
        console.log("App is load end")

        send("/islogin").then(x=>{
            if (x.login) {
                app_instanced.setState({
                    user:x.user,
                    code:x.code,
                    master:x.master,
                    join:true,
                    login:true
                })
            }
        })
    }
)