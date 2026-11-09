const panels = [...document.querySelectorAll('main section[id]')];
function showPanel() {
  const id = location.hash.slice(1);
  const active = panels.some(panel => panel.id === id) ? id : 'overview';
  for (const panel of panels) panel.hidden = panel.id !== active;
  for (const item of document.querySelectorAll('nav a')) {
    if (item.hash === '#' + active) item.setAttribute('aria-current','page');
    else item.removeAttribute('aria-current');
  }
  if (/^d[1-5]$/.test(active)) lastItineraryDay = Number(active.slice(1)) - 1;
  if (active === "map") drawRoute(lastItineraryDay);
  if (id) document.getElementById(active).scrollIntoView();
}
window.addEventListener('hashchange', showPanel);
showPanel();
