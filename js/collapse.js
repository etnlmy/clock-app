function collapse({
  button,
  main,
  aside
}) {

  const LESS = "less";
  const MORE = "more";

  const span = button.querySelector("span");
  let collapsed = true;
  
  button.addEventListener("click", () => {
    collapsed = !collapsed;
    span.innerText = collapsed ? MORE : LESS;
    button.classList.toggle(LESS);
    
    if (!collapsed) {
      aside.style.display = "flex";
      const asideHeight = aside.clientHeight;
      main.style.marginTop = `-${asideHeight}px`;
    }
    else {
      main.style.marginTop = "0";
      setTimeout(() => aside.style.display = "none", 300)
    }
  });
}

collapse({
  button: document.getElementById("collapse"),
  main: document.getElementsByTagName("main")[0],
  aside: document.getElementsByTagName("aside")[0],
});