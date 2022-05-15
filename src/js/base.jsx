let go = (a) => document.getElementById(a);
let asi = (a, b) => Object.assign(a,b);
let send = (url, body) => (new Promise((res, err) => {
    fetch(url, {
        "body":JSON.stringify(body||{}),
        "method":"POST",
        "mode":"no-cors",
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
function genlink(link) {
    
    switch (typeof(link)) {
        case "string":
            
            return () => {document.location.assign(link)};
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
        console.log(x)

    })

    console.log("done")
})

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