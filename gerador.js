const fs=require('fs'),path=require('path');
const dirProjetos=path.join(__dirname,'projetos'),arquivoSaida=path.join(__dirname,'dados.json');
const categoriasValidas=['pc_console','mobile','illustration'];
let bancoDeDados=[];
if(!fs.existsSync(dirProjetos)){fs.mkdirSync(dirProjetos);categoriasValidas.forEach(c=>fs.mkdirSync(path.join(dirProjetos,c)));}
categoriasValidas.forEach(cat=>{
    const caminhoCat=path.join(dirProjetos,cat);
    if(fs.existsSync(caminhoCat)){
        fs.readdirSync(caminhoCat).forEach(nomeItem=>{
            const caminhoItem=path.join(caminhoCat,nomeItem),stats=fs.statSync(caminhoItem);
            if(stats.isDirectory()){
                const arquivos=fs.readdirSync(caminhoItem),caminhoInfo=path.join(caminhoItem,'info.json');
                let info={titulo:nomeItem.replace(/_/g,' '),subtitulo:""};
                if(fs.existsSync(caminhoInfo))try{info=JSON.parse(fs.readFileSync(caminhoInfo,'utf8'));}catch(e){}
                let capa=arquivos.find(a=>a.startsWith('thumb.'))||arquivos.find(a=>a.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                bancoDeDados.push({id:nomeItem,titulo:info.titulo,subtitulo:info.subtitulo||(cat==='illustration'?"Illustration":"Game Project"),categoria:cat,caminho_base:`projetos/${cat}/${nomeItem}/`,capa:capa||null,galeria:arquivos.filter(a=>a.match(/\.(jpg|jpeg|png|gif|webp)$/i)&&a!==capa)});
            }else if(stats.isFile()&&nomeItem.match(/\.(jpg|jpeg|png|gif|webp)$/i)){
                const nomeSemExtensao=path.parse(nomeItem).name.replace(/_/g,' ');
                bancoDeDados.push({id:nomeSemExtensao,titulo:nomeSemExtensao,subtitulo:"Illustration",categoria:cat,caminho_base:`projetos/${cat}/`,capa:nomeItem,galeria:[]});
            }
        });
    }
});
fs.writeFileSync(arquivoSaida,JSON.stringify(bancoDeDados,null,2));
console.log("Banco de dados atualizado!");