// Each stop references its itinerary block and the approximate map position.
const routeDays = [
  [
    [0,'桃園機場',25.078,121.233],[0,'西門町意舍',25.0451,121.5058],
    [1,'富善雞湯麵',25.0448,121.5048],[2,'雪王冰淇淋',25.0448,121.5111],
    [3,'大聯盟棒壘球打擊場',25.0437,121.5058],[4,'回意舍休息',25.0451,121.5058]
  ],
  [
    [0,'山豬蛋餅',25.065,121.524],[1,'赤峰街／心中山',25.0551,121.5204],
    [2,'鼎泰豐南西店',25.0524,121.521],[3,'四平街',25.0534,121.533],
    [4,'辛殿松江南京',25.0525,121.5332]
  ],
  [
    [0,'台北天后宮',25.0429,121.5057],[1,'台北大巨蛋',25.043,121.5597],
    [2,'地一牛肉麵',25.0405,121.5548],[3,'松山文創園區',25.0444,121.5604],
    [3,'遠東 Garden City',25.0422,121.561,1],[4,'本願豆花',25.0441,121.5052],
    [5,'詹記西門大世界',25.0391,121.5046],[6,'皇家巴黎成都會館',25.0428,121.5049]
  ],
  [
    [0,'味鼎西門',25.0458,121.5089],[1,'阿城鵝肉',25.0588,121.5303],
    [2,'0km 山物所',25.0259,121.5269],[3,'香堤大道',25.0358,121.5667],
    [4,'饗 A Joy',25.0334,121.5648]
  ],
  [
    [0,'西門徒步區',25.044,121.506],[1,'阿義魯肉飯',25.0385,121.4981],[2,'西門町意舍取行李',25.0451,121.5058],
    [2,'台北車站高鐵',25.0478,121.517],[3,'華泰名品城',25.0151,121.2138],
    [4,'機捷 A18',25.0135,121.2147],[5,'桃園機場',25.078,121.233]
  ]
];
let routeMap;
let routeLayer;
let mapDay = 0;
let lastItineraryDay = 0;
function mapButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', action);
  return button;
}
function drawRoute(day) {
  mapDay = day;
  if (!routeMap) {
    routeMap = L.map('route-map', {scrollWheelZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(routeMap);
    routeLayer = L.layerGroup().addTo(routeMap);
  }
  routeMap.invalidateSize();
  routeLayer.clearLayers();
  const stops = routeDays[day];
  const points = stops.map(stop => [stop[2],stop[3]]);
  const days = document.querySelector('#map-days');
  const list = document.querySelector('#map-stops');
  const detail = document.querySelector('#map-detail');
  days.replaceChildren();
  list.replaceChildren();
  routeDays.forEach((_,i) => {
    const button = mapButton('12/' + (19+i), () => drawRoute(i));
    button.setAttribute('aria-pressed', String(i === day));
    days.append(button);
  });
  L.polyline(points,{color:'#ad4c19',dashArray:'6 8',weight:3}).addTo(routeLayer);
  const blocks = document.querySelectorAll('#d' + (day+1) + ' .stop');
  const markers = [];
  function selectStop(i, zoom) {
    const [block,name,,,linkIndex=0] = stops[i];
    const content = blocks[block];
    const link = document.createElement('a');
    link.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name+' 台灣');
    const original = content.querySelectorAll('.maps a')[linkIndex];
    if (original && !['桃園機場','回意舍休息','西門徒步區','西門町意舍取行李'].includes(name)) link.href = original.href;
    link.textContent = '在 Google Maps 開啟';
    const heading = document.createElement('h3');
    heading.textContent = (i+1) + ' · ' + name;
    detail.replaceChildren(heading,content.querySelector('.transit').cloneNode(true),link);
    [...list.children].forEach((button,j) => button.setAttribute('aria-pressed',String(j===i)));
    markers.forEach((marker,j) => {
      marker.getElement().classList.toggle('selected-pin',j===i);
      marker.setZIndexOffset(j===i ? 1000 : 0);
    });
    if (zoom) routeMap.setView(points[i],15);
  }
  stops.forEach((stop,i) => {
    const marker = L.marker(points[i],{title:stop[1],alt:stop[1],icon:L.divIcon({
      className:'number-pin',html:String(i+1),iconSize:[30,30],iconAnchor:[15,15]
    })}).addTo(routeLayer);
    marker.on('click',() => selectStop(i,true));
    markers.push(marker);
    list.append(mapButton((i+1)+' · '+stop[1],() => selectStop(i,true)));
  });
  function fitRoute() {routeMap.fitBounds(points,{padding:[28,28],maxZoom:15});}
  days.append(mapButton('顯示全日路線',fitRoute));
  fitRoute();
  selectStop(0,false);
}
