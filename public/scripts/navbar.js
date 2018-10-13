var navbtn = document.querySelector(".navbtn");
var navbar = document.querySelector(".navbar");
var navarrow = document.querySelector(".nav-arrow");
var navsubmenu = document.querySelector(".nav-submenu");
var navdropdown = document.querySelector(".nav-dropdown");
console.log(navbar);

navbtn.addEventListener("click", function(e) {
  let bars = [...e.target.children];

  bars[0].classList.contains("navopen1")
    ? bars[0].classList.remove("navopen1")
    : bars[0].classList.add("navopen1");
  bars[1].classList.contains("navopen2")
    ? bars[1].classList.remove("navopen2")
    : bars[1].classList.add("navopen2");
  bars[2].classList.contains("navopen3")
    ? bars[2].classList.remove("navopen3")
    : bars[2].classList.add("navopen3");
  navbar.classList.contains("navmenuopen")
    ? navbar.classList.remove("navmenuopen")
    : navbar.classList.add("navmenuopen");
});

navdropdown.addEventListener("click", function(e) {
  navarrow.classList.contains("nav-arrow-turn")
    ? navarrow.classList.remove("nav-arrow-turn")
    : navarrow.classList.add("nav-arrow-turn");

  navsubmenu.classList.contains("nav-submenu-open")
    ? navsubmenu.classList.remove("nav-submenu-open")
    : navsubmenu.classList.add("nav-submenu-open");
});
