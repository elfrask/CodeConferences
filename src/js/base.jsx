let go = (a) => document.getElementById(a);
let asi = (a, b) => Object.assign(a,b);

let verticalOrientation = false;


function getOrientation() {
    verticalOrientation = screen.width < screen.height;

    return verticalOrientation;
}


getOrientation()

screen.orientation.addEventListener("change", () => {
    getOrientation()
})

class bta extends React.Component {

    render() {

        let ori_V = getOrientation();
        let ori_V_img = this.props.portrait.img||""
        let content = this.props.children

        let ori_V_style = {
            width:this.props.portrait.width||"50px",
            height:this.props.portrait.height||"50px",
        };

        let ori_H_style = {
            width:this.props.landscape.width||"max-content",
            height:this.props.landscape.height||"max-content",
        };

        

        return (
            <div className={`bta ${this.props.className||""}`} style={
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