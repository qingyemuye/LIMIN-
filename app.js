'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  'check-square':'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/>',
  'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 12h8M8 16h6"/>',
  link:'<path d="m10 13 4-4M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 8a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1"/>',
  settings:'<path d="m9 3 1-1h4l1 3 3 1 3 1v4l-2 2 1 3-3 3-3-1-2 2H8l-1-3-3-1-2-3 2-3V7l3-1Z"/><circle cx="12" cy="11" r="3"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'chevron-left':'<path d="m15 6-6 6 6 6"/>',
  'chevron-right':'<path d="m9 6 6 6-6 6"/>',
  edit:'<path d="m16 3 5 5-12 12-6 1 1-6Z"/><path d="m13 6 5 5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  headphones:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
  play:'<path d="m8 4 12 8-12 8Z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  rotate:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  x:'<path d="m6 6 12 12M6 18 18 6"/>',
  github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1-.4-2-1-2 4-.5 7-2 7-6 0-1.5-.5-3-1.5-4 .5-1.5.5-2.5 0-4-2 0-3.5 1-4 1a14 14 0 0 0-7 0c-.5 0-2-1-4-1-.5 1.5-.5 2.5 0 4C3.5 7 3 8.5 3 10c0 4 3 5.5 7 6-.6 0-1 1-1 2v4"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 6 9 7 9-7"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  book:'<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  music:'<path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>'
};
function icon(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.link}</svg>`; }
function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const STORAGE_KEY = 'richang-workspace-v1';
const today = new Date();
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const defaults = {
  name: '我的空间',
  tasks: [
    {id:'welcome-1',title:'梳理本周的工作计划',category:'工作',done:false},
    {id:'welcome-2',title:'阅读 20 分钟，记录一个新想法',category:'学习',done:false},
    {id:'welcome-3',title:'出门走走，给自己一点放空时间',category:'生活',done:false},
    {id:'welcome-4',title:'整理桌面，开启清爽的一天',category:'生活',done:true}
  ],
  notes: [
    {id:'note-1',title:'给自己的小提醒',content:'不必把每一天都安排得满满当当。留一点时间给散步、阅读，和那些让自己开心的小事。',updated:today.toISOString()},
    {id:'note-2',title:'灵感收集箱',content:'突然出现的想法，想读的书，想去的地方……先记在这里，让灵感有一个落脚点。',updated:today.toISOString()}
  ],
  links: [
    {id:'link-1',title:'Notion',description:'知识与灵感',url:'https://www.notion.so',symbol:'N',color:'#424345',bg:'#f1f1f0'},
    {id:'link-2',title:'GitHub',description:'代码与创造',url:'https://github.com',symbol:'github',color:'#464b53',bg:'#f0f1f3'},
    {id:'link-3',title:'Figma',description:'设计与协作',url:'https://www.figma.com',symbol:'F',color:'#ad817b',bg:'#f7eeea'},
    {id:'link-4',title:'邮箱',description:'连接每一份消息',url:'https://mail.google.com',symbol:'mail',color:'#b19a7b',bg:'#f6f1e8'},
    {id:'link-5',title:'少数派',description:'发现生活方式',url:'https://sspai.com',symbol:'S',color:'#ca827b',bg:'#faefec'},
    {id:'link-6',title:'豆瓣',description:'书影音的世界',url:'https://www.douban.com',symbol:'豆',color:'#82a18d',bg:'#edf4ed'},
    {id:'link-7',title:'即刻',description:'发现同频的人',url:'https://web.okjike.com',symbol:'J',color:'#bda356',bg:'#fbf5df'},
    {id:'link-8',title:'更多灵感',description:'打开新的世界',url:'https://www.are.na',symbol:'globe',color:'#9b91ac',bg:'#f2eff7'}
  ]
};
function safeURL(value) { try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; } }
function validState(value) {
  return value && typeof value.name === 'string' && value.name.length <= 60 && Array.isArray(value.tasks) && value.tasks.length <= 10000 && value.tasks.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.done === 'boolean' && ['工作','生活','学习'].includes(t.category)) && Array.isArray(value.notes) && value.notes.length <= 10000 && value.notes.every(n => n && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.content === 'string' && !Number.isNaN(Date.parse(n.updated))) && Array.isArray(value.links) && value.links.length <= 1000 && value.links.every(l => l && typeof l.id === 'string' && typeof l.title === 'string' && typeof l.description === 'string' && safeURL(l.url));
}
let state = structuredClone(defaults);
let loadWarning = '';
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const parsed = JSON.parse(saved); if (validState(parsed)) state = parsed; else loadWarning = '本地数据格式异常，暂时显示示例内容。请先导出备份。'; } } catch { loadWarning = '无法读取本地数据，请检查浏览器存储权限。'; }
let toastTimeout;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); $('.local-status').innerHTML = '<span></span>已保存至本地'; return true; }
  catch { $('.local-status').textContent = '未能保存'; toast('本地保存失败，请导出备份并检查存储空间。'); return false; }
}
let filter = 'pending';
const categories = {'工作':'tag-work','生活':'tag-life','学习':'tag-study'};
function renderStats() {
  const completed = state.tasks.filter(t => t.done).length;
  const pending = state.tasks.length - completed;
  $('#stat-pending').innerHTML = `${pending}<small>项</small>`;
  $('#stat-completed').innerHTML = `${completed}<small>项</small>`;
  $('#stat-notes').innerHTML = `${state.notes.length}<small>篇</small>`;
  $('#nav-count').textContent = pending;
  $('#pending-tab-count').textContent = pending;
  $('#task-count').textContent = `${state.tasks.length} 项`;
  $('#progress-label').textContent = `${completed} / ${state.tasks.length} 已完成`;
  $('#profile-name').textContent = state.name;
  $('.breadcrumb').firstChild.textContent = `${state.name} `;
}
function renderTasks() {
  const tasks = state.tasks.filter(t => filter === 'all' || t.done === (filter === 'completed'));
  $('#task-list').innerHTML = tasks.length ? tasks.map(t => `<div class="task-row ${t.done?'done':''}" data-id="${escapeHTML(t.id)}"><input class="task-check" type="checkbox" ${t.done?'checked':''} aria-label="${escapeHTML(t.title)}"><span class="task-text">${escapeHTML(t.title)}</span>${t.category==='工作'&&!t.done?'<span class="task-priority" title="工作事项"></span>':''}<span class="task-label ${categories[t.category]}">${escapeHTML(t.category)}</span><button class="row-delete" aria-label="删除待办：${escapeHTML(t.title)}">${icon('x')}</button></div>`).join('') : `<div class="empty">${filter==='completed'?'还没有完成的事项，从一件小事开始吧。':filter==='pending'?'待办都完成了，给自己一个小小的奖励吧。':'还没有待办，点击「添加」开始计划。'}</div>`;
  renderStats();
}
function renderNotes() {
  $('#notes-grid').innerHTML = state.notes.length ? state.notes.map(n => `<article class="note" data-id="${escapeHTML(n.id)}" tabindex="0" role="button" aria-label="编辑笔记：${escapeHTML(n.title)}"><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.content)||'点击记录你的想法…'}</p><time>${escapeHTML(new Date(n.updated).toLocaleDateString('zh-CN',{month:'long',day:'numeric'}))} · 随手记录</time><button class="note-delete" aria-label="删除笔记：${escapeHTML(n.title)}">${icon('x')}</button></article>`).join('') : '<div class="empty">把你的第一个灵感，记在这里。</div>';
  renderStats();
}
function renderLinks() {
  $('#links-grid').innerHTML = state.links.length ? state.links.map(l => `<a class="link-item" href="${escapeHTML(safeURL(l.url)||'#')}" target="_blank" rel="noopener noreferrer"><span class="link-icon" style="--link-bg:${/^#[0-9a-f]{6}$/i.test(l.bg)?l.bg:'#f0f1f3'};--link-color:${/^#[0-9a-f]{6}$/i.test(l.color)?l.color:'#788b80'}">${iconPaths[l.symbol]?icon(l.symbol):escapeHTML((l.symbol||l.title).slice(0,1))}</span><span><strong>${escapeHTML(l.title)}</strong><small>${escapeHTML(l.description)}</small></span></a>`).join('') : '<div class="empty">点击「编辑」添加常用网站。</div>';
}
const dialog = $('#editor-dialog');
let onSubmit;
function openDialog(title, fields, submit, options={}) {
  $('#dialog-title').textContent = title;
  $('#dialog-fields').innerHTML = fields;
  $('.dialog-actions').classList.toggle('hidden',options.noActions===true);
  onSubmit = submit;
  hydrateIcons(dialog);
  dialog.showModal();
  requestAnimationFrame(() => { const input = $('input:not([type="file"]),textarea',dialog); if(input) input.focus(); });
}
$('#editor-form').addEventListener('submit', event => { event.preventDefault(); if (onSubmit) onSubmit(new FormData(event.currentTarget)); });
$('#close-dialog').onclick = $('#cancel-dialog').onclick = () => dialog.close();
dialog.addEventListener('click', e => { if(e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
const field = (label,name,value='',type='text',max=200) => `<label class="field">${label}<input name="${name}" type="${type}" value="${escapeHTML(value)}" maxlength="${max}" required></label>`;
function newTask() {
  openDialog('留一件事给今天', `${field('待办事项','title')}<label class="field">分类<select name="category"><option>工作</option><option>学习</option><option>生活</option></select></label>`, data => {
    const title = data.get('title').trim(); if(!title) return toast('写下一件想做的事吧。');
    state.tasks.unshift({id:uid(),title,category:data.get('category'),done:false}); filter='pending'; setFilter(); persist(); renderTasks(); dialog.close(); toast('新待办已添加，一步一步来。');
  });
}
$('#new-task').onclick = $('#task-add-inline').onclick = $('#start-day').onclick = newTask;
function setFilter() { $$('[data-filter]').forEach(b => { b.classList.toggle('active',b.dataset.filter===filter); b.setAttribute('aria-selected',String(b.dataset.filter===filter)); }); }
$$('[data-filter]').forEach(b => { b.onclick = () => {filter=b.dataset.filter;setFilter();renderTasks();}; });
$('#task-list').addEventListener('change', e => { if(!e.target.matches('.task-check')) return; const task = state.tasks.find(t => t.id===e.target.closest('[data-id]').dataset.id); if(!task) return; task.done=e.target.checked; persist(); renderTasks(); if(task.done) toast('又完成了一件事，做得不错。'); });
$('#task-list').addEventListener('click', e => { const button=e.target.closest('.row-delete'); if(!button) return; const id=button.closest('[data-id]').dataset.id; state.tasks=state.tasks.filter(t => t.id!==id); persist(); renderTasks(); toast('待办已删除'); });
function editNote(id) {
  const note=state.notes.find(n=>n.id===id);
  openDialog(note?'留住这个想法':'记录一点新灵感', `${field('标题','title',note?.title||'', 'text',100)}<label class="field">内容<textarea name="content" maxlength="50000" placeholder="有什么想法，随手记下来…">${escapeHTML(note?.content||'')}</textarea></label>`,data=>{
    const title=data.get('title').trim(); if(!title) return toast('给这篇笔记取个名字吧。');
    const values={title,content:data.get('content'),updated:new Date().toISOString()};
    if(note) Object.assign(note,values); else state.notes.unshift({id:uid(),...values});
    persist();renderNotes();dialog.close();toast('灵感已妥善保存');
  });
}
$('#add-note').onclick = () => editNote();
$('#notes-grid').addEventListener('click', e => {
  const note=e.target.closest('.note'); if(!note) return;
  if(e.target.closest('.note-delete')) { const n=state.notes.find(n=>n.id===note.dataset.id); openDialog('删除这篇笔记？',`<p class="dialog-description">「${escapeHTML(n.title)}」将从此浏览器中删除。此操作无法撤销。</p>`,()=>{state.notes=state.notes.filter(x=>x.id!==n.id);persist();renderNotes();dialog.close();toast('笔记已删除');}); return; }
  editNote(note.dataset.id);
});
$('#notes-grid').addEventListener('keydown',e=>{if(e.target.matches('.note')&&['Enter',' '].includes(e.key)){e.preventDefault();editNote(e.target.dataset.id);}});
function editLinks() {
  openDialog('整理你的快捷入口', `<p class="dialog-description">常用的网站，一步就到。</p><div id="link-editor-list">${state.links.map(l=>`<div class="search-result"><span>${escapeHTML(l.title)}</span><button type="button" class="text-button" style="float:right" data-edit-link="${escapeHTML(l.id)}">编辑</button></div>`).join('')}</div><button type="button" class="button secondary" id="add-link" style="margin-top:16px">＋ 添加网站</button>`,null,{noActions:true});
  $$('[data-edit-link]',dialog).forEach(b=>b.onclick=()=>{dialog.close();editLink(b.dataset.editLink);});
  $('#add-link').onclick=()=>{dialog.close();editLink();};
}
function editLink(id) {
  const link=state.links.find(l=>l.id===id);
  openDialog(link?'编辑快捷入口':'添加快捷入口',`${field('网站名称','title',link?.title||'','text',40)}${field('网址（http / https）','url',link?.url||'','url',2000)}<label class="field">一句话描述<input name="description" maxlength="50" value="${escapeHTML(link?.description||'')}" placeholder="例如：知识与灵感"></label>${link?'<button type="button" class="text-button" id="delete-link">删除此入口</button>':''}`,data=>{
    const url=safeURL(data.get('url'));const title=data.get('title').trim();
    if(!url) return toast('请输入有效的 http 或 https 网址。'); if(!title) return toast('请填写网站名称。');
    if(link) Object.assign(link,{title,url,description:data.get('description').trim()}); else state.links.push({id:uid(),title,url,description:data.get('description').trim(),symbol:title.slice(0,1),bg:'#edf4ed',color:'#7e9485'});
    persist();renderLinks();dialog.close();toast('快捷入口已保存');
  });
  if(link) $('#delete-link').onclick=()=>{state.links=state.links.filter(l=>l.id!==id);persist();renderLinks();dialog.close();toast('快捷入口已删除');};
}
$('#edit-links').onclick=editLinks;
let calendarDate=new Date(today.getFullYear(),today.getMonth(),1);
let selectedDay=dateKey(today);
function renderCalendar() {
  const year=calendarDate.getFullYear(),month=calendarDate.getMonth();
  $('#calendar-title').textContent=`${year} 年 ${month+1} 月`;
  const start=new Date(year,month,1); start.setDate(start.getDate()-(start.getDay()+6)%7);
  const rows=Math.ceil(((new Date(year,month,1).getDay()+6)%7+new Date(year,month+1,0).getDate())/7);
  $('#calendar-grid').innerHTML=Array.from({length:rows*7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);const key=dateKey(d);return `<button class="calendar-day ${d.getMonth()!==month?'other':''} ${key===dateKey(new Date())?'today':''} ${key===selectedDay?'selected':''}" data-date="${key}" aria-label="${key}" ${key===dateKey(new Date())?'aria-current="date"':''}><span>${d.getDate()}</span></button>`;}).join('');
  $('#calendar-caption').textContent=`${selectedDay===dateKey(new Date())?'今天 · ':''}${new Date(selectedDay+'T12:00:00').toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}`;
}
$('#prev-month').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();};
$('#next-month').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();};
$('#calendar-reset').onclick=()=>{const now=new Date();calendarDate=new Date(now.getFullYear(),now.getMonth(),1);selectedDay=dateKey(now);renderCalendar();};
$('#calendar-grid').onclick=e=>{const b=e.target.closest('[data-date]');if(b){selectedDay=b.dataset.date;renderCalendar();}};
let remaining=25*60, timerRunning=false, deadline=0, timerInterval;
function drawTimer() {
  $('#timer').innerHTML=`${String(Math.floor(remaining/60)).padStart(2,'0')}<span>:</span>${String(remaining%60).padStart(2,'0')}`;
  $('#focus-start').innerHTML=`${icon(timerRunning?'pause':'play')}${timerRunning?'暂停专注':remaining===1500?'开始专注':'继续专注'}`;
  $('#focus-label').textContent=timerRunning?'正在专注，让思绪慢慢沉淀':remaining===1500?'一段专注，一点进步':'休息一下，随时可以继续';
}
function tick() {
  remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
  if(remaining===0){clearInterval(timerInterval);timerRunning=false;remaining=1500;toast('25 分钟专注完成，起身休息一下吧。');}
  drawTimer();
}
$('#focus-start').onclick=()=>{
  if(timerRunning){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(timerInterval);timerRunning=false;}
  else {timerRunning=true;deadline=Date.now()+remaining*1000;timerInterval=setInterval(tick,250);}
  drawTimer();
};
$('#focus-reset').onclick=()=>{clearInterval(timerInterval);timerRunning=false;remaining=1500;drawTimer();};
function updateView() {
  const view=location.hash.slice(1);const page=['tasks','notes','links'].includes(view)?view:'overview';
  const titles={overview:'工作台',tasks:'我的待办',notes:'随手笔记',links:'快捷入口'};
  $$('[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
  $('#page-title').textContent=titles[page];
  $('main').classList.toggle('view-focused',page!=='overview');$('main').dataset.view=page;
  $('#overview-content').classList.toggle('hidden',page!=='overview');
  $('#greeting').innerHTML=page==='overview'?`${today.getHours()<6?'夜深了':today.getHours()<12?'早上好':today.getHours()<18?'下午好':'晚上好'}，今天也要从容一点 <span>☀</span>`:titles[page];
}
window.addEventListener('hashchange',updateView);
$('#settings').onclick=()=>{
  openDialog('让这里，更像你的空间',`${field('空间名称','name',state.name,'text',60)}<p class="dialog-description">数据仅保存在当前浏览器，不会上传服务器。更换设备或清除浏览器数据前，记得导出备份。</p><div class="settings-actions"><button type="button" class="button secondary" id="export-data">导出备份</button><button type="button" class="button secondary" id="import-data">导入备份</button></div><input class="import-input" type="file" id="import-file" accept="application/json,.json">`, data=>{
    const name=data.get('name').trim();if(!name) return toast('请填写空间名称。');state.name=name;persist();renderStats();dialog.close();toast('空间设置已保存');
  });
  $('#export-data').onclick=()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`日常备份-${dateKey(new Date())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('备份已导出');
  };
  $('#import-data').onclick=()=>$('#import-file').click();
  $('#import-file').onchange=async e=>{
    const file=e.target.files[0];if(!file)return;if(file.size>5*1024*1024)return toast('文件过大，请使用小于 5 MB 的备份。');
    try {const parsed=JSON.parse(await file.text());if(!validState(parsed))throw new Error('Invalid backup');dialog.close();openDialog('使用备份替换当前数据？','<p class="dialog-description">导入将替换当前所有待办、笔记、快捷入口和空间名称。建议先导出当前数据备份。</p>',()=>{state=parsed;persist();renderAll();dialog.close();toast('备份已导入');});}
    catch{toast('无法导入，请选择有效的日常工作台备份文件。');e.target.value='';}
  };
};
$('#profile-button').onclick=()=>$('#settings').click();
$('#search-button').onclick=()=>{
  openDialog('搜索你的工作台','<input class="search-field" type="search" id="search-input" placeholder="搜索待办、笔记和快捷入口…" aria-label="搜索关键词" autocomplete="off"><div id="search-results" aria-live="polite"><div class="empty">输入关键词，找到你想要的内容。</div></div>',null,{noActions:true});
  $('#search-input').oninput=e=>{
    const query=e.target.value.trim().toLowerCase();if(!query){$('#search-results').innerHTML='<div class="empty">输入关键词，找到你想要的内容。</div>';return;}
    const results=[...state.tasks.filter(t=>t.title.toLowerCase().includes(query)).map(t=>({type:'待办',title:t.title,page:'tasks',id:t.id})),...state.notes.filter(n=>(n.title+' '+n.content).toLowerCase().includes(query)).map(n=>({type:'笔记',title:n.title,page:'notes',id:n.id})),...state.links.filter(l=>(l.title+' '+l.description).toLowerCase().includes(query)).map(l=>({type:'入口',title:l.title,page:'links',id:l.id}))];
    $('#search-results').innerHTML=results.length?results.map((r,i)=>`<button type="button" class="search-result" data-result="${i}"><small>${r.type}</small>${escapeHTML(r.title)}</button>`).join(''):'<div class="empty">没有找到相关内容，换个词试试。</div>';
    $$('[data-result]',dialog).forEach(b=>b.onclick=()=>{const r=results[Number(b.dataset.result)];dialog.close();if(r.page==='notes'){editNote(r.id);}else{if(r.page==='tasks'){filter='all';setFilter();renderTasks();}location.hash=r.page;updateView();const row=$$('[data-id]').find(x=>x.dataset.id===r.id);row?.scrollIntoView({block:'center',behavior:'smooth'});}});
  };
};
function renderAll(){renderTasks();renderNotes();renderLinks();renderCalendar();updateView();}
$('#today-date').textContent=today.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
hydrateIcons();renderAll();if(loadWarning)toast(loadWarning);
