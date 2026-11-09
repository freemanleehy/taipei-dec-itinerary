const panels = [...document.querySelectorAll('main section[id]')];
function showPanel() {
  const id = location.hash.slice(1);
  const active = panels.some(panel => panel.id === id) ? id : 'overview';
  for (const panel of panels) panel.hidden = panel.id !== active;
  for (const item of document.querySelectorAll('nav a')) {
    if (item.hash === '#' + active) item.setAttribute('aria-current','page');
    else item.removeAttribute('aria-current');
  }
  if (id) document.getElementById(active).scrollIntoView();
}
window.addEventListener('hashchange', showPanel);
showPanel();
