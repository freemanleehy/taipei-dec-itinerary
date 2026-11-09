const panels = [...document.querySelectorAll('main section[id]')];
const select = document.querySelector('#place');
for (const day of panels.filter(panel => /^d[1-5]$/.test(panel.id))) {
  const group = document.createElement('optgroup');
  group.label = day.querySelector('small').textContent;
  for (const link of day.querySelectorAll('.maps a')) {
    const option = document.createElement('option');
    option.textContent = link.textContent.replace('↗ ', '');
    option.value = link.href;
    group.append(option);
  }
  select.append(group);
}
function showPlace() {
  const link = document.querySelector('#openmap');
  link.href = select.value;
  const query = new URL(select.value).searchParams.get('query') || select.selectedOptions[0].textContent;
  document.querySelector('iframe').src = 'https://maps.google.com/maps?output=embed&q=' + encodeURIComponent(query);
}
function showPanel() {
  const id = location.hash.slice(1);
  const active = panels.some(panel => panel.id === id) ? id : 'overview';
  for (const panel of panels) panel.hidden = panel.id !== active;
  for (const item of document.querySelectorAll('nav a')) {
    if (item.hash === '#' + active) item.setAttribute('aria-current','page');
    else item.removeAttribute('aria-current');
  }
  if (active === 'places') showPlace();
  if (id) document.getElementById(active).scrollIntoView();
}
select.addEventListener('change', showPlace);
window.addEventListener('hashchange', showPanel);
showPanel();
