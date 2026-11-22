"use client";

import { useEffect, useState } from 'react';

const gaya = `
[data-rak-showcase]{position:relative;overflow:hidden;isolation:isolate;min-width:0;container-type:inline-size}
[data-rak-showcase] .rak-stage{position:absolute;inset:10% 0 15%;container-type:size;pointer-events:none}
[data-rak-showcase] .rak-book{position:absolute;left:50%;top:50%;width:min(45cqw,54cqh);aspect-ratio:.69;border-radius:2px 3px 2px 2px;box-shadow:2px 2px 0 #f2ebd9,3px 3px 0 #c3bba5,4px 4px 0 #eee6d2,5px 5px 0 #766d5c,9px 13px 14px #30372640;overflow:hidden}
[data-rak-showcase] .rak-rear{background:#985338;transform:translate(-22%,-51%) rotate(14deg)}
[data-rak-showcase] .rak-front{background:#244b3d;transform:translate(-76%,-45%) rotate(-10deg)}
[data-rak-showcase] .rak-book img{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;padding:0;border:0;margin:0;object-fit:cover}
[data-rak-showcase] .rak-book::after{content:'';position:absolute;inset:0;pointer-events:none;border-radius:inherit;box-shadow:inset 0 0 0 1px #20211924;background:linear-gradient(90deg,#15161055, #ffffff33 1.6%, #17180f38 4%, #ffffff17 5.6%,transparent 8%)}
[data-rak-showcase] .rak-inscription{position:absolute;inset:0;display:grid;align-content:center;padding:12%;font:italic clamp(19px,7cqw,40px)/1.05 Georgia,serif;color:#f8e9c1}
[data-rak-showcase] .rak-enter{animation:rakCoverEnter .64s cubic-bezier(.4,0,.16,1) both}
[data-rak-showcase] .rak-exit{animation:rakCoverExit .64s cubic-bezier(.4,0,.16,1) both}
@keyframes rakCoverEnter{from{transform:translateX(calc(var(--dir)*100%))}to{transform:translateX(0)}}
@keyframes rakCoverExit{from{transform:translateX(0)}to{transform:translateX(calc(var(--dir)*-100%))}}
[data-rak-showcase] .rak-foot{position:absolute;bottom:12px;left:5%;right:5%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}
[data-rak-showcase] .rak-foot>span:last-child{text-align:right}
[data-rak-showcase] .rak-controls{display:flex;align-items:center}
[data-rak-showcase] .rak-controls button{appearance:none;display:grid;place-items:center;background:transparent;padding:0;margin:0;border:0;border-radius:50%;width:24px;height:26px;min-width:0;box-shadow:none;color:#214b39}
[data-rak-showcase] .rak-dot::after{content:'';width:7px;height:7px;box-sizing:border-box;border-radius:50%;border:1px solid #556e57;background:transparent}
[data-rak-showcase] .rak-dot[aria-current]::after{width:9px;height:9px;background:#244c3d;border-color:#244c3d}
[data-rak-showcase] button:focus-visible{outline:2px solid #244c3d}
@container(max-width:380px){[data-rak-showcase] .rak-foot{grid-template-columns:1fr;justify-items:center;bottom:5px}[data-rak-showcase] .rak-foot>span{display:none}}
@media(prefers-reduced-motion:reduce){[data-rak-showcase] .rak-enter{animation:none}[data-rak-showcase] .rak-exit{display:none}}
`;

function Jilid({ depan, buku, lama, arah }) {
  const bergerak = lama && buku && lama.src !== buku.src;
  return <div className={`rak-book ${depan ? 'rak-front' : 'rak-rear'}`} style={{'--dir':arah}} aria-hidden="true">
    {!buku && <span className="rak-inscription">{depan ? 'Seni Membaca' : 'Ruang Ilmu'}</span>}
    {bergerak && <img className="rak-exit" alt="" src={lama.src} draggable={false} />}
    {buku && <img className={bergerak ? 'rak-enter' : ''} alt="" src={buku.src} draggable={false} />}
  </div>;
}

export default function SampulBergilir({ buku }) {
  const [urls,setUrls] = useState([]);
  const [slide,setSlide] = useState({i:0,lama:null,arah:1});
  const [jeda,setJeda] = useState(false);
  const [otomatis,setOtomatis] = useState(false);
  const daftar = urls.map(src => buku.find(b => b.src === src)).filter(Boolean);
  const n = daftar.length, i = n ? slide.i % n : 0;
  const belakang = index => n > 1 && index !== null ? daftar[(index+1)%n] : null;
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setOtomatis(!m.matches && !document.hidden);
    sync(); m.addEventListener('change',sync); document.addEventListener('visibilitychange',sync);
    return () => {m.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync)};
  },[]);
  useEffect(() => {
    if(n<2 || jeda || !otomatis) return;
    const t = setTimeout(() => setSlide({i:(i+1)%n,lama:i,arah:1}),5500);
    return () => clearTimeout(t);
  },[n,i,jeda,otomatis]);
  return <div className="rb-poster" data-rak-showcase="" role="region" aria-label="Pilihan sampul buku">
    <style>{gaya}</style>
    <div hidden>{buku.map(b => <img key={b.id} src={b.src} alt="" onLoad={() => setUrls(prev => prev.includes(b.src) ? prev : [...prev,b.src])} />)}</div>
    <div className="rb-label" aria-hidden="true"><span>RAKBACA PRESS</span><span>PL. 01</span></div>
    <div key={i} className="rak-stage" role="img" aria-label={daftar[i]?.judul || 'Dua buku bertumpuk'}>
      <Jilid buku={belakang(i)} lama={belakang(slide.lama)} arah={slide.arah}/>
      <Jilid depan buku={daftar[i]} lama={daftar[slide.lama]} arah={slide.arah}/>
    </div>
    <div className="rb-label rak-foot"><span>STUDI SAMPUL</span><div className="rak-controls" role="group" aria-label="Pilih sampul">
      {daftar.map((b,k) => <button type="button" key={b.src} className="rak-dot" aria-current={k===i?'true':undefined} aria-label={`Tampilkan ${b.judul}`} onClick={() => {setJeda(true);if(k!==i)setSlide({i:k,lama:i,arah:k>i?1:-1})}}/>)}
      {n>1 && otomatis && <button type="button" aria-label={jeda?'Lanjutkan rotasi':'Jeda rotasi'} onClick={() => setJeda(v=>!v)}><svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d={jeda?'M3 1l8 5-8 5z':'M2 1h3v10H2zM7 1h3v10H7z'}/></svg></button>}
    </div><span>FIG. 01 — 02</span></div>
  </div>;
}
