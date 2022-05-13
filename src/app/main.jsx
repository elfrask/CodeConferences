

let socket = io();




class App extends React.Component {

    state = {
        room_code:"",
        master:false,
        join:false,
        login:true,
    };

    render() {


        return (
            <div className="app">
                <div className="head">

                    {(
                        this.state.join?(
                            // Solo si esta unido
                            this.state.master?(
                                // Modo maestro
                                <div>

                                </div>
                            ):(
                                // Modo invitado
                                <div>

                                </div>
                            )

                        ):[
                            // de lo contrario nada
                        ]
                    )}

                    <div className="r img" style={{
                        "width":"50px",
                        "height":"50px",
                        "backgroundImage":`url("/src/info.png")`
                    }}>

                    </div>

                </div>
                <div className="body">

                </div>
            </div>
        );
    }
}



ReactDOM.render(
    <App></App>,
    document.body,
    () => {
        console.log("App is load end")
    }
)