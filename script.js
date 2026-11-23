const photos = JSON.parse(document.getElementById('photo-data').textContent);
const grid = document.querySelector('#gallery');
const buttons = [...document.querySelectorAll('[data-filter]')];
const counter = document.querySelector('#count');
const dialog = document.querySelector('#lightbox');
const big = document.querySelector('#lightbox-img');
const label = document.querySelector('#lightbox-label');
const ordinal = document.querySelector('#lightbox-ordinal');
const nav = document.querySelector('#navlinks');
const menu = document.querySelector('#menu-toggle');
let active = 'all'; let visible = [...photos]; let selected = -1; let returnFocus = null;
function categoryName(category) {return category === 'uo' ? 'Weitere Arbeiten' : 'Porträt';}
function render() {
  visible = photos.filter(p => active === 'all' || p.category === active);
  const nodes = document.createDocumentFragment();
  visible.forEach((photo, index) => {
    const item = document.createElement('button'); item.type='button';item.className='tile';
    item.setAttribute('aria-label', `Foto ${index+1} von ${visible.length} öffnen: ${categoryName(photo.category)}`);
    const figure = document.createElement('figure');
    const img=document.createElement('img');img.src=encodeURI(photo.src);img.alt=`${categoryName(photo.category)} – Fotografie ${index+1}`;
    img.loading=index<6?'eager':'lazy';img.decoding='async'; img.width=photo.width||900;img.height=photo.height||600;
    figure.append(img);item.append(figure);
    const cap=document.createElement('span');cap.className='tile-caption';
    const name=document.createElement('span');name.textContent=categoryName(photo.category);
    const symbol=document.createElement('span');symbol.textContent='↗';cap.append(name,symbol);item.append(cap);
    item.addEventListener('click',()=>open(index,item));nodes.append(item);
  });
  grid.replaceChildren(nodes);counter.textContent=visible.length+' Fotografien';
  for(const b of buttons)b.setAttribute('aria-pressed',String(active===b.dataset.filter));
}
function show(index){if(!visible.length)return;selected=(index+visible.length)%visible.length;const p=visible[selected];big.src=encodeURI(p.src);big.alt=`Originalfotografie aus der Galerie ${categoryName(p.category)}`;label.textContent=p.filename;ordinal.textContent=`${selected+1} / ${visible.length}`;}
function open(index,element){returnFocus=element;show(index);dialog.setAttribute('open','');document.body.classList.add('no-scroll');document.querySelector('#close-lightbox').focus();}
function close(){dialog.removeAttribute('open');big.removeAttribute('src');document.body.classList.remove('no-scroll');returnFocus?.focus();}
buttons.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;render();}));
document.querySelector('#close-lightbox').addEventListener('click',close);
document.querySelector('#prev-lightbox').addEventListener('click',()=>show(selected-1));
document.querySelector('#next-lightbox').addEventListener('click',()=>show(selected+1));
const focusables=()=>[...dialog.querySelectorAll('button')].filter(x=>!x.disabled);
document.addEventListener('keydown',e=>{if(!dialog.hasAttribute('open'))return;if(e.key==='Escape'){close();return;}if(e.key==='ArrowLeft')show(selected-1);if(e.key==='ArrowRight')show(selected+1);if(e.key==='Tab'){const a=focusables(),first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.dataset.open=String(!expanded);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.dataset.open='false';menu.setAttribute('aria-expanded','false');}));
render();
