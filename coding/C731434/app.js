

let go = (e) => document.getElementById(e);

function main() {
  
  let saludo = go("saludo");
  

  saludo.onClick = () => {
    alert("Hola mundo!")
  }
  
};

main();

