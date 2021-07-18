function collapse({
  button,
  main,
  aside
}) {

  const LESS = "less";
  const MORE = "more";

  const span = button.querySelector("span");
  const asideHeight = aside.clientHeight;
  let collapsed = false;

  button.addEventListener("click", () => {
    collapsed = !collapsed;
    span.innerText = collapsed ? LESS : MORE;
    main.style.marginTop = collapsed ? `-${asideHeight}px` : "0";
    button.classList.toggle(LESS);
  });
}

collapse({
  button: document.getElementById("collapse"),
  main: document.getElementsByTagName("main")[0],
  aside: document.getElementsByTagName("aside")[0],
});