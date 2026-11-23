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
const gallerySizes = new ResizeObserver(entries=>{
  for (const {target, contentRect} of entries) {
    const img=target.querySelector('img');
    const sizes=`${Math.ceil(contentRect.width)}px`;
    if (contentRect.width>0 && img.sizes!==sizes) img.sizes=sizes;
  }
});
let active = 'all'; let visible = [...photos]; let selected = -1; let returnFocus = null;
function categoryName(category) {return category === 'uo' ? 'Weitere Arbeiten' : 'Porträt';}
function render() {
  gallerySizes.disconnect();
  visible = [...photos];
  const nodes = document.createDocumentFragment();
  visible.forEach((photo, index) => {
    const item = document.createElement('button'); item.type='button';item.className='tile';
    item.style.setProperty('--photo-ratio',String(photo.width/photo.height));
    item.setAttribute('aria-label', `Foto ${index+1} von ${visible.length} öffnen: ${categoryName(photo.category)}`);
    const figure = document.createElement('figure');
    const img=document.createElement('img');img.alt=`Fotografie ${index+1}`;
    if (photo.previews?.length) {
      img.srcset=photo.previews.map(p=>`${encodeURI(p.src)} ${p.width}w`).join(', ');
      img.sizes='(max-width: 700px) 50vw, (max-width: 1050px) 33vw, 25vw';
    }
    img.loading='lazy';img.decoding='async';
    img.addEventListener('error',()=>{
      img.removeAttribute('srcset');
      img.src=encodeURI(photo.src);
    },{once:true});
    img.src=encodeURI(photo.previews?.[0]?.src || photo.src); img.width=photo.width||900;img.height=photo.height||600;
    figure.append(img);item.append(figure);
    const cap=document.createElement('span');cap.className='tile-caption';
    const name=document.createElement('span');name.textContent='Fotografie';
    const symbol=document.createElement('span');symbol.textContent='↗';cap.append(name,symbol);item.append(cap);
    item.addEventListener('click',()=>open(index,item));nodes.append(item);
  });
  grid.replaceChildren(nodes);
  for (const tile of grid.children) gallerySizes.observe(tile);
  counter.textContent=visible.length+' Fotografien';
  for(const b of buttons)b.setAttribute('aria-pressed',String(active===b.dataset.filter));
}
function show(index){if(!visible.length)return;selected=(index+visible.length)%visible.length;const p=visible[selected];big.src=encodeURI(p.original?.src || p.src);big.alt='Originalfotografie aus der SHOOTS-Galerie';label.textContent=p.filename;ordinal.textContent=`${selected+1} / ${visible.length}`;}
big.addEventListener('error',()=>{label.textContent='Bild konnte nicht geladen werden. Bitte erneut öffnen.';});
function open(index,element){returnFocus=element;show(index);dialog.setAttribute('open','');document.body.classList.add('no-scroll');document.querySelector('#close-lightbox').focus();}
function close(){dialog.removeAttribute('open');big.removeAttribute('src');document.body.classList.remove('no-scroll');returnFocus?.focus();}

document.querySelector('#close-lightbox').addEventListener('click',close);
document.querySelector('#prev-lightbox').addEventListener('click',()=>show(selected-1));
document.querySelector('#next-lightbox').addEventListener('click',()=>show(selected+1));
const focusables=()=>[...dialog.querySelectorAll('button')].filter(x=>!x.disabled);
document.addEventListener('keydown',e=>{if(!dialog.hasAttribute('open'))return;if(e.key==='Escape'){close();return;}if(e.key==='ArrowLeft')show(selected-1);if(e.key==='ArrowRight')show(selected+1);if(e.key==='Tab'){const a=focusables(),first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.dataset.open=String(!expanded);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.dataset.open='false';menu.setAttribute('aria-expanded','false');}));
render();
