window.addEventListener('DOMContentLoaded', () => {
  const splash = document.querySelector('.splash');
  const main = document.querySelector('main');
  const menu = document.querySelector('#menu');
  const links = document.querySelectorAll('.link');
  const btnMenu = document.querySelector('.btnMenu');

  const toggleSplash = () => {
    if (splash.classList.contains("esconder")) {
      splash.classList.remove("desaparecer", "esconder");
    } else {
      splash.classList.toggle("desaparecer");
      setTimeout(() => splash.classList.toggle("esconder"), 500);
      if (!main.classList.contains("ativo")) {
        main.classList.add('ativo');
        menu.classList.add('ativo');
        btnMenu.classList.add('ativo');
      }
    }
  };

  const ativarLink = (link) => {
    links.forEach(l => l.classList.remove('clicado'));
    link.classList.add('clicado');
  };

  const ajustarMenu = () => {
    if (window.innerWidth <= 1300) {
      menu.classList.add('fechado');
    } else {
      menu.classList.remove('fechado');
    }
  };

  const toggleMenu = () => {
    menu.classList.toggle('fechado');
  };

  let timer;

  function resetarTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => toggleSplash(), 5000);
  }
  

  setTimeout(() => toggleSplash(), 3000);

  links.forEach(link => {
    link.addEventListener('click', () => ativarLink(link));
  });

  window.addEventListener('resize', ajustarMenu);
  ajustarMenu();

  btnMenu.addEventListener('click', toggleMenu);

  window.addEventListener("mousemove", resetarTimer);
  window.addEventListener("keydown", resetarTimer);
  window.addEventListener("click", resetarTimer);
  window.addEventListener("scroll", resetarTimer);
  splash.addEventListener("click", () => toggleSplash());

  resetarTimer();

});