let go = (a) => document.getElementById(a);
let asi = (a, b) => Object.assign(a,b);
let send = (url, body) => (new Promise((res, err) => {

    //console.log("sending:", body)

    fetch(url, {
        "body":JSON.stringify(body||{}),
        "method":"POST",
        "headers":{
            'Content-Type': 'application/json',
        }
    }).then(x=>x.json().then(e=>res(e))).catch(x=>err(x));
}))
function range(i, f) {
    let salida = [];
    for (let x = i; x < f; x++) {
        salida.push(x)
        
    }
    return salida
}


let ExcludedIntelliSenseTriggerKeys =
{
    "8": "backspace",
    "9": "tab",
    "13": "enter",
    "16": "shift",
    "17": "ctrl",
    "18": "alt",
    "19": "pause",
    "20": "capslock",
    "27": "escape",
    "33": "pageup",
    "34": "pagedown",
    "35": "end",
    "36": "home",
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down",
    "45": "insert",
    "46": "delete",
    "91": "left window key",
    "92": "right window key",
    "93": "select",
    "107": "add",
    "109": "subtract",
    "110": "decimal point",
    "111": "divide",
    "112": "f1",
    "113": "f2",
    "114": "f3",
    "115": "f4",
    "116": "f5",
    "117": "f6",
    "118": "f7",
    "119": "f8",
    "120": "f9",
    "121": "f10",
    "122": "f11",
    "123": "f12",
    "144": "numlock",
    "145": "scrolllock",
    "186": "semicolon",
    "187": "equalsign",
    "188": "comma",
    "189": "dash",
    "190": "period",
    "191": "slash",
    "192": "graveaccent",
    "220": "backslash",
    "222": "quote"
}



let fs = {
    read:(path, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");

        

        send("/read", {path:path||"/"}).then(x=>{
            genlink(call)(x.data, x.error)
        })
        .catch(x=>{
            genlink(call)("", true)
        })
    },
    write:(path, data, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");


        send("/write", {path:path, data:data||"", mkdir:false}).then(x=>{
            genlink(call)(x.error)
        })
        .catch(x=>{
            genlink(call)(true)
        })
    },
    mkdir:(path, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");


        send("/write", {path:path, data:"", mkdir:true}).then(x=>{
            genlink(call)(x.error)
        })
        .catch(x=>{
            genlink(call)(true)
        })
    },
    rmdir:(path, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");


        send("/delete", {path:path||"/", rmdir:true}).then(x=>{
            genlink(call)(x.error)
        })
        .catch(x=>{
            genlink(call)(true)
        })
    },
    remove:(path, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");


        send("/delete", {path:path||"/", rmdir:false}).then(x=>{
            genlink(call)(x.error)
        })
        .catch(x=>{
            genlink(call)(true)
        })
    },
    rename:(path, new_path, call) => {

        if (typeof(call) !== "function") console.log("call must be a function");

        send("/rename", {path:path, new_path:new_path}).then(x=>{
            genlink(call)(x.error)
        })
        .catch(x=>{
            genlink(call)(true)
        })
    },
    get_tree:(call) => {

        if (typeof(call) !== "function") console.log("call must be a function");

        send("/get_tree", {path:path||"/", rmdir:false}).then(x=>{
            genlink(call)(x, false)
        })
        .catch(x=>{
            genlink(call)({}, true)
        })
    }
}

let programs = {
    
}

function run(command, ...arg) {
    let cmd = (command+"").split(":");
    let program = cmd[0]
    let type = cmd[1]

    genlink(programs[program])(type, ...arg)
}

let ext = {
    "js":"editor:javascript",
    "json":"editor:json",
    "css":"editor:css",
    "html":"editor:htmlmixed",
    "xml":"editor:xml",
    "txt":"editor:textile",
    "py":"editor:python",
}

function get_ext(path) {
    return (path+"").split(".").pop()
}
function get_dirname(path) {
    let salida = (path+"").split("/")
    salida.pop()
    let out = salida.join("/");
    //if (out=="") out="/"
    return out + "/"
}
function get_namefile(path) {
    let salida = (path+"").split("/")
    let out = salida.pop()
    //if (out=="") out="/"
    return out 
}



function copy(text) {
    let textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.id = "_tmp_copy";
    textarea.style.position = "fixed";
    textarea.style.left = "102%";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    textarea = null
}

function genlink(link) {


    switch (typeof(link)) {
        case "string":
            
            return () => {console.log(link)};
        case "function":

            return link
    
        default:
            return () => {};
            
    }

    
}

let verticalOrientation = false;


function getOrientation() {
    verticalOrientation = screen.width < screen.height;

    return verticalOrientation;
}


getOrientation()

let list_Element_refresh = [];
function auto_refresh(e) {
    list_Element_refresh.push(e)
}

screen.orientation.addEventListener("change", () => {
    getOrientation()

    list_Element_refresh.forEach(x=>{

        x.setState({ori_v:getOrientation()})
        //console.log(x)

    })

    //console.log("done")
})


function testing(a) {
    send("/test", a||{}).then(x=>{
        console.log(x)
    })
}

class Folder extends React.Component {
    state = {

    }
    render() {

        let path = this.props.path;
        let nombre = this.props.name;
        let subfile = this.props.list;

        let root = path == "/";
        let events = this.props.events||{};

        //console.log(events)
        

        return(
            <div className="folder_box">
                <div className="folder_title">
                    <Img img="/src/img/icons/folder.png" size="40px" className="l img60" />

                    <div className="folder_name l" style={{
                        "width":root?"calc(100% - 80px)":""
                    }}>
                        {nombre}
                    </div>
                    {
                        (!root)?(

                            <div>

                                <Img img="/src/img/icons/pencil.png" size="40px" className="l img60 img_bt" 
                                
                                // Renombrar directorio
    
                                click={
                                    () => {
                                        genlink((events.folder||{}).rename)(path)
                                    }
                                }
                                
                                
                                />
                                
                                <Img img="/src/img/icons/minus.png" size="40px" className="l img60 img_bt" 
                                
                                // Eliminar directorio
    
                                click={
                                    () => {
                                        genlink((events.folder||{}).delete)(path)
                                    }
                                }
                                
                                
                                />
                            </div>
                            
                        ):[]
                    }
                    <Img img="/src/img/icons/plus.png" size="40px" className="l img60 img_bt" 
                    
                        // Agregar archivos o directorio

                        click={
                            () => {
                                genlink((events.folder||{}).add)(path)
                            }
                        }
                        
                    />
                </div>
                <div className="folder_nodes">
                    {
                        Object.keys(subfile).map(x=> {
                            let node = subfile[x];

                            switch (typeof(node)) {
                                case "object":
                                    
                                    return(
                                        <Folder 
                                        name={x}
                                        path={path + "/" + x}
                                        list={node}
                                        events={events}
                                        />
                                    )
                            
                                case "string":

                                    return(
                                        <File 
                                        name={x}
                                        //path={path + "/" + x}
                                        path={node}
                                        events={events.file}
                                        
                                        />
                                    )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

class File extends React.Component {
    state={

    };
    render() {
        let path = this.props.path;
        let nombre = this.props.name;
        let events = this.props.events||{}



        return(
            <div className="file_box">
                <Img className="l img60" size="40px" img={"/src/img/icons/ext/" + get_ext(nombre) + ".png"} />
                <div className="file_name l" onClick={
                    // Abrir archivo
                    () => {
                        console.log(path)
                        genlink(events.open)(path)
                    }
                }>
                    {nombre}
                </div>
                <Img img="/src/img/icons/pencil.png" size="40px" className="l img60 img_bt" 
                                
                // Renombrar archivo
    
                click={
                    () => {
                        genlink(events.rename)(path)
                    }
                }
                
                
                />
                <Img className="l img_bt img60" size="40px" img="/src/img/icons/minus.png" 
                // Eliminar archivo
                click={
                    () => {
                        genlink(events.delete)(path)
                    }
                }

                />
            </div>
        )
    }
}


class Bta extends React.Component {

    state= {
        ori_v:getOrientation()
    }

    render() {

        //this.setState

        auto_refresh(this)

        let ori_V = this.state.ori_v;
        let ori_V_img = this.props.portrait.img||"";
        let content = this.props.children;

        if (ori_V) content = [];

        this.props.portrait = this.props.portrait||{};
        this.props.landscape = this.props.landscape||{};

        let ori_V_style = {
            width:this.props.portrait.width||"50px",
            height:this.props.portrait.height||"50px",
        };

        let ori_H_style = {
            width:this.props.landscape.width||"max-content",
            height:this.props.landscape.height||"max-content",
        };

        

        return (
            <div className={`bta img ${this.props.className||""}`} onClick={genlink(this.props.click)} style={
                (
                    ori_V?(
                        asi(ori_V_style, {
                            backgroundImage:`url("${ori_V_img}")`
                        })
                    ):(
                        ori_H_style
                    )
                )||{}
            }>
                {content}
            </div>
        )

    }

}



class Img extends React.Component { // style, className, img, size, (x, y)
    render() {
        return (
            <div
                className={"img " + (this.props.className||"")}
                style={asi({
                    backgroundImage:`url('${this.props.img}')`,
                    width:this.props.size||this.props.x||"",
                    height:this.props.size||this.props.y||"",
                }, this.props.style)}
                onClick={genlink(this.props.click)}
            >
                {this.props.children}
            </div>
        )
    }
}