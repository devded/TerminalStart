// Apply saved theme before render (also called inline in <head>, this handles toggle)
(function () {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function update() {
    const isLight = document.documentElement.classList.contains('light');
    toggle.textContent = isLight ? '[dark]' : '[light]';
  }

  update();

  toggle.addEventListener('click', function () {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    update();
  });
});
