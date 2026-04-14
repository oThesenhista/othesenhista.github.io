let todosProjetos=[],projetosFiltrados=[],indiceAtual=0;
const carrosselTrack=document.getElementById('carrossel-track'),gridInsta=document.getElementById('insta-grid'),layoutCarrossel=document.getElementById('layout-carrossel'),layoutGrid=document.getElementById('layout-grid'),modalProjeto=document.getElementById('modal-projeto'),conteudoProjeto=document.getElementById('conteudo-projeto'),modalScrollArea=document.getElementById('modal-scroll'),modalWrapper=document.getElementById('modal-content-wrapper');

// Gatilho inicial alterado para 'pc_console'
fetch('dados.json').then(r=>r.json()).then(d=>{todosProjetos=d;trocarCategoria('pc_console');});

function trocarCategoria(cat){
    projetosFiltrados=todosProjetos.filter(p=>p.categoria===cat);indiceAtual=0;
    document.querySelectorAll('.nav-item').forEach(e=>e.classList.toggle('active',e.getAttribute('data-cat')===cat));
    if(cat==='illustration'){layoutCarrossel.classList.add('oculto');layoutGrid.classList.remove('oculto');renderizarGrid();}
    else{layoutGrid.classList.add('oculto');layoutCarrossel.classList.remove('oculto');construirCarrosselFisico();}
}
function construirCarrosselFisico(){
    carrosselTrack.innerHTML='';
    projetosFiltrados.forEach((proj,i)=>{
        const c=document.createElement('article');c.className='carrossel-card';
        c.addEventListener('click',()=>abrirModal(i));
        c.innerHTML=`<div class="card-imagem" style="background-image:url('${proj.caminho_base}${proj.capa}')"><div class="card-overlay"><h3 class="card-titulo">${proj.titulo}</h3><p class="card-subtitulo">${proj.subtitulo}</p></div></div>`;
        carrosselTrack.appendChild(c);
    });
    atualizarPosicoesCarrossel();
}
function atualizarPosicoesCarrossel(){
    const cards=carrosselTrack.querySelectorAll('.carrossel-card'),t=cards.length;if(t===0)return;
    cards.forEach((c,i)=>{
        c.className='carrossel-card';
        if(i===indiceAtual)c.classList.add('destaque');
        else if(i===(indiceAtual===0?t-1:indiceAtual-1))c.classList.add('esquerdo');
        else if(i===(indiceAtual===t-1?0:indiceAtual+1))c.classList.add('direito');
        else c.classList.add(((i-indiceAtual+t)%t)>t/2?'espera-esq':'espera-dir');
    });
}
function renderizarGrid(){
    gridInsta.innerHTML='';
    projetosFiltrados.forEach((proj,i)=>{
        const item=document.createElement('div');item.className='insta-item';
        item.addEventListener('click',()=>abrirModal(i));
        item.innerHTML=`<img src="${proj.caminho_base}${proj.capa}" alt="${proj.titulo}"><div class="insta-overlay"><h4 class="insta-overlay-titulo">${proj.titulo}</h4></div>`;
        gridInsta.appendChild(item);
    });
}
function abrirModal(index){
    const proj=projetosFiltrados[index];conteudoProjeto.innerHTML='';let t=0;
    if(proj.galeria&&proj.galeria.length>0){t=proj.galeria.length;proj.galeria.forEach(img=>conteudoProjeto.innerHTML+=`<img src="${proj.caminho_base}${img}">`);}
    else if(proj.categoria==='illustration'){t=1;conteudoProjeto.innerHTML+=`<img src="${proj.caminho_base}${proj.capa}">`;}
    t===1?modalWrapper.classList.add('centralizar'):modalWrapper.classList.remove('centralizar');
    modalProjeto.classList.remove('oculto');modalScrollArea.scrollTop=0;
}
function fecharModal(){modalProjeto.classList.add('oculto');}
document.querySelectorAll('.nav-item').forEach(b=>b.onclick=e=>{e.preventDefault();trocarCategoria(b.getAttribute('data-cat'));});
document.getElementById('btn-next').onclick=()=>{indiceAtual=(indiceAtual===projetosFiltrados.length-1)?0:indiceAtual+1;atualizarPosicoesCarrossel();};
document.getElementById('btn-prev').onclick=()=>{indiceAtual=(indiceAtual===0)?projetosFiltrados.length-1:indiceAtual-1;atualizarPosicoesCarrossel();};
document.getElementById('btn-fechar').onclick=fecharModal;
modalProjeto.onclick=e=>{if(e.target===modalProjeto||e.target===modalScrollArea||e.target===modalWrapper)fecharModal();};
document.addEventListener('keydown',e=>{
    if(!modalProjeto.classList.contains('oculto')){if(e.key==='Escape')fecharModal();}
    else if(!layoutCarrossel.classList.contains('oculto')){if(e.key==='ArrowRight')document.getElementById('btn-next').click();if(e.key==='ArrowLeft')document.getElementById('btn-prev').click();}
});