let go = (e) => document.getElementById(e);


go("hola").addEventListener("click", () => {
  let text = prompt("nota:");
  
  alert("tu nota es: " + text);
});

