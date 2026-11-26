// Usage: node scripts/import-drawio-cloud-icons.mjs /path/to/drawio-32.7.4 /path/to/v24.7.17/Sidebar-GCP2.js
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {inflateRawSync} from 'node:zlib';
import {runInNewContext} from 'node:vm';
import {createRequire} from 'node:module';
import {DOMParser,XMLSerializer} from '@xmldom/xmldom';
import {convertStencil} from './drawio-stencil-paths.mjs';

const [checkout,legacyGcp] = process.argv.slice(2);
if(!checkout||!legacyGcp)throw new Error('Provide the pinned draw.io checkout and legacy Sidebar-GCP2.js.');
const web = path.join(checkout,'src/main/webapp');
const readSidebar = name => fs.readFileSync(path.join(web,'js/diagramly/sidebar',name),'utf8');
const require = createRequire(import.meta.url);
const {parseSync} = require('@babel/core');
const parser = new DOMParser();
const serializer = new XMLSerializer();
const directory = new URL('../public/drawio-cloud-icons/',import.meta.url);
const catalog = {};
const imageAliases = {};
const embedded = {};
const sidebarStyles = new Map();
const paletteByAsset = new Map();
const azureFolders = new Map();
const categoryKey = value => value.toLowerCase().replace(/[^a-z0-9]/g,'');
// The GCP3 library groups its newest service glyphs together as "Core Products".
const gcpCoreCategories = {
  aihypercomputer:'AI and Machine Learning', alloydb:'Databases', anthos:'Hybrid and Multi Cloud',
  apigee:'API Management', bigquery:'Data Analytics', cloudrun:'Serverless', cloudspanner:'Databases',
  cloudsql:'Databases', cloud_storage:'Storage', computeengine:'Compute', distributedcloud:'Hybrid and Multi Cloud',
  gke:'Containers', hyperdisk:'Storage', looker:'Data Analytics', mandiant:'Security', secops:'Security',
  securitycommandcenter:'Security', threatintelligence:'Security', vertexai:'AI and Machine Learning'
};
const categoryNames = {
  'AI and ML':'AI and Machine Learning', 'Container':'Containers', 'Other Category':'Other',
  'IoT':'Internet of Things', 'Internet Of Things':'Internet of Things', 'Compute Service VM':'Compute', 'Management and Governance Service - Media':'Media',
  'Opsmanager':'Operations Manager', 'Vm':'Compute', 'Dep':'Deprecated', 'Categories':'Category symbols'
};
function categoryName(name) {
  const title = name.replace(/ Service$| \(flat\)$/g,'');
  return categoryNames[title] || title;
}
const libraryLabels = {
  azure2:'Azure', mscae:'Azure Legacy', azure:'Azure Legacy',
  gcp3:'Google Cloud', gcpicons:'Google Cloud', gcp2:'Google Cloud Legacy', gcp:'Google Cloud Legacy'
};
const sha256 = value => createHash('sha256').update(value).digest('hex');
const normalLabel = text => text.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const words = text => text.replace(/_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Z])([A-Z][a-z])/g,'$1 $2');
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const xml = text => String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const add = (id,entry,svg) => {
  if(catalog[id])throw new Error(`Duplicate icon ${id}`);
  if(!entry.label||!(entry.width>0&&entry.height>0))throw new Error(`Invalid icon metadata for ${id}`);
  catalog[id]=entry;
  fs.writeFileSync(new URL(`${id}.svg`,directory),svg);
};
fs.mkdirSync(directory,{recursive:true});

function literal(node,bindings){
  if(node?.type==='StringLiteral')return node.value;
  if(node?.type==='Identifier')return bindings.get(node.name)||'';
  if(node?.type==='BinaryExpression'&&node.operator==='+')return literal(node.left,bindings)+literal(node.right,bindings);
  return '';
}
function walk(node,visit){
  if(!node?.type)return;
  visit(node);
  for(const item of Object.values(node)){
    if(Array.isArray(item))for(const child of item)walk(child,visit);
    else walk(item,visit);
  }
}

function localSvg(data){
  const doc=parser.parseFromString(data,'image/svg+xml'),root=doc.documentElement;
  if(root.localName!=='svg'||doc.doctype)throw new Error('Expected standalone SVG.');
  for(const element of Array.from(root.getElementsByTagName('*')).concat(root)){
    if(['script','foreignObject','iframe','animate','set'].includes(element.localName))throw new Error('Unexpected SVG element: '+element.localName);
    for(const attribute of Array.from(element.attributes)){
      const value=attribute.value.trim();
      if(/^on/i.test(attribute.name)||(attribute.localName==='href'&&!/^(?:#|data:image\/(?:png|jpeg);base64,)/i.test(value)))throw new Error('Unexpected SVG reference: '+value.slice(0,40));
      if(/url\(\s*['"]?(?!['"#\s])/i.test(value))throw new Error('Unexpected SVG URL.');
    }
    if(element.localName==='style'&&/@import|url\(\s*['"]?(?!['"#\s])/i.test(element.textContent))throw new Error('Unexpected SVG CSS.');
  }
  const [, , viewWidth,viewHeight]=(root.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);
  const width=viewWidth||parseFloat(root.getAttribute('width')),height=viewHeight||parseFloat(root.getAttribute('height'));
  if(!root.hasAttribute('viewBox'))root.setAttribute('viewBox',`0 0 ${width} ${height}`);
  // Some upstream SVGs have intrinsic dimensions above 60,000 pixels.
  // Cap their presentation size while leaving the vector coordinate system intact.
  const scale=Math.min(1,256/Math.max(width,height));
  root.setAttribute('width',String(width*scale));
  root.setAttribute('height',String(height*scale));
  return {svg:serializer.serializeToString(root),width:width*scale,height:height*scale};
}
function addEmbedded(style,label,library,serviceCategory){
  const payload=[...style.matchAll(/image=data:image\/svg\+xml,(?:base64,)?([A-Za-z0-9+/=]+)/g)].at(-1)?.[1];
  if(!payload||!label)return;
  const bytes=Buffer.from(payload,'base64'),hash=sha256(bytes);
  if(embedded[hash])return;
  label=normalLabel(label);
  const id=`drawio.${library}.${slug(label)}.${hash.slice(0,12)}`;
  let asset;
  try{asset=localSvg(bytes.toString('utf8'));}catch(error){throw new Error(`Cannot read ${label} in ${library} after ${payload.length} base64 characters (${style.slice(style.indexOf(payload)+payload.length,style.indexOf(payload)+payload.length+45)}).`,{cause:error});}
  const {svg,width,height}=asset;
  add(id,{label,width,height,category:libraryLabels[library],serviceCategory,color:'#4285f4'},svg);
  embedded[hash]=id;
}

function readPalette(source,library){
  const ast=parseSync(source,{configFile:false,babelrc:false});
  walk(ast,node=>{
    if(node.type!=='AssignmentExpression'||node.left.property?.name?.endsWith('Palette')!==true)return;
    const bindings=new Map(),variables=node.right.body?.body||[];
    for(const statement of variables)for(const variable of statement.declarations||[]){
      if(variable.id.type==='Identifier')bindings.set(variable.id.name,literal(variable.init,bindings));
    }
    const palette=variables.map(statement=>statement.expression).find(call=>call?.callee?.property?.name==='addPalette');
    const title=palette?.arguments[1]?.value;
    const serviceCategory=categoryName(title?.split(' / ').at(-1).replace(/^GCP /,'')||'General');
    if(library==='azure2'&&title){
      const folderKey=palette.arguments[0].value.replace(/^azure2/,'');
      azureFolders.set(categoryKey(folderKey),serviceCategory);
    }
    walk(node.right,child=>{
      if(child.type!=='CallExpression')return;
      if(child.callee.property?.name==='createVertexTemplateEntry'){
        const style=literal(child.arguments[0],bindings),label=normalLabel(literal(child.arguments[4],bindings)||literal(child.arguments[3],bindings));
        const stencil=/(?:^|;)shape=(mxgraph\.[^;]+)(?:;|$)/.exec(style)?.[1];
        const image=/image=(img\/lib\/(?:azure2|mscae)\/[^;]+)/.exec(style)?.[1];
        if(stencil&&label&&!sidebarStyles.has(stencil))sidebarStyles.set(stencil,{style,label});
        if(image&&label&&!sidebarStyles.has(image))sidebarStyles.set(image,{style,label});
        // MSCAE passes the shared image path into each palette as a parameter.
        const asset=stencil||image||(library==='mscae'&&style.match(/^([^;]+\.svg);/)?.[1]);
        if(asset){
          const key=asset.endsWith('.svg')&&!image?'img/lib/mscae/'+asset:asset;
          if(!paletteByAsset.has(key))paletteByAsset.set(key,serviceCategory);
        }
        addEmbedded(style,label,library,serviceCategory);
      }
      if(child.callee.property?.name==='addEntry'){
        const entry=child.arguments[1];
        let name='';
        const styles=[];
        walk(entry,descendant=>{
          if(descendant.callee?.property?.name==='createVertexTemplateFromCells')name=literal(descendant.arguments[3],bindings);
          if(descendant.type==='NewExpression'&&descendant.callee.name==='mxCell')styles.push(literal(descendant.arguments[2],bindings));
        });
        for(const style of styles)addEmbedded(style,name,library,serviceCategory);
      }
    });
  });
}
for(const [name,library] of [['Azure','azure'],['Azure2','azure2'],['MSCAE','mscae'],['GCP3','gcp3'],['GCPIcons','gcpicons'],['GCP2','gcp2']]){
  readPalette(readSidebar(`Sidebar-${name}.js`),library);
}
const legacySource=fs.readFileSync(legacyGcp,'utf8');
if(sha256(legacySource)!=='0a2f140e69c506cf2e61f7f2fd29875b82f7899acd8cedfbbe5fe2e1e9cebcd1')throw new Error('Expected draw.io v24.7.17 Sidebar-GCP2.js.');
readPalette(legacySource,'gcp2');

for(const library of ['azure2','mscae']){
  const base=path.join(web,'img/lib',library);
  for(const file of fs.readdirSync(base,{recursive:true}).filter(file=>file.endsWith('.svg')).sort()){
    const relative=file.split(path.sep).join('/'),source=`img/lib/${library}/${relative}`;
    const baseId=`drawio.${library}.${relative.slice(0,-4).replaceAll('/','.').toLowerCase().replace(/[^a-z0-9._-]/g,'_')}`;
    const id=catalog[baseId]?`${baseId}.${sha256(source).slice(0,8)}`:baseId;
    const {svg,width,height}=localSvg(fs.readFileSync(path.join(base,file),'utf8'));
    const label=sidebarStyles.get(source)?.label||words(path.basename(file,'.svg'));
    const folder=relative.split('/').slice(0,-1).join(' / ').replaceAll('_',' ');
    const folderCategory=library==='azure2'?azureFolders.get(categoryKey(folder)):null;
    const serviceCategory=folderCategory||paletteByAsset.get(source)||categoryName(folder.replace(/\b\w/g,c=>c.toUpperCase())||'Legacy symbols');
    add(id,{label,width,height,category:libraryLabels[library],serviceCategory,color:'#0079d6'},svg);
    imageAliases[source]=id;
  }
}

// Run the exact offline draw.io decoder against the pinned binary stencil bundle.
const stencilBundle=fs.readFileSync(path.join(web,'js/stencils.min.js'),'utf8');
if(sha256(stencilBundle)!=='989d72d18bbf02e61c74937d7f51f048d198bb559c3ede4ae66c08e52544b983')throw new Error('Expected draw.io v32.7.4 stencils.min.js.');
const mxStencilRegistry={};
runInNewContext(stencilBundle,{mxStencilRegistry,STENCIL_PATH:'stencils',atob,TextDecoder,pako:{inflateRaw:inflateRawSync}},{timeout:2000});
for(const [,file] of stencilBundle.matchAll(/f\['((?:azure|gcp|mscae)[^']*\.xml)'\]/g)){
  const root=mxStencilRegistry.loadStencil(`stencils/${file}`).documentElement;
  const namespace=root.getAttribute('name'),library=namespace.split('.')[1];
  for(const shape of root.getElementsByTagName('shape')){
    const name=shape.getAttribute('name'),id=`${namespace}.${name.toLowerCase().replaceAll(' ','_')}`;
    if(!/^[a-z0-9._-]+$/.test(id))throw new Error(`Unexpected stencil name: ${id}`);
    const sidebar=sidebarStyles.get(id),label=sidebar?.label||words(name);
    const defaultFill=library==='azure'?'#00bef2':library==='mscae'?'#0079d6':library==='gcp3'?'#4285f4':'#3b8df1';
    const color=/(?:^|;)fillColor=(#[\da-f]{6})\b/i.exec(sidebar?.style||'')?.[1]||defaultFill;
    const stroke=/(?:^|;)strokeColor=(#[\da-f]{6}|none)\b/i.exec(sidebar?.style||'')?.[1]||'none';
    const {width,height,paths}=convertStencil(shape);
    const artwork=paths.map(p=>`<path d="${xml(p.d)}" fill="${xml(p.fill==='currentColor'?color:p.fill)}" stroke="${xml(p.stroke==='currentColor'?stroke:p.stroke)}" stroke-width="${p.strokeWidth}" opacity="${p.opacity}" fill-opacity="${p.fillOpacity}" stroke-opacity="${p.strokeOpacity}" stroke-linejoin="${p.lineJoin}" stroke-linecap="${p.lineCap}"${p.dash?` stroke-dasharray="${xml(p.dash)}"`:''}/>`).join('');
    const section=namespace.split('.')[2];
    const palette=paletteByAsset.get(id);
    const fallback=section?categoryName(words(section).replace(/\b\w/g,c=>c.toUpperCase())):'Legacy symbols';
    const serviceCategory=(library==='gcp3'&&gcpCoreCategories[id.split('.').at(-1)])||palette||fallback;
    add(id,{label,width,height,category:libraryLabels[library],serviceCategory,color},`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${artwork}</svg>\n`);
  }
}
const data={icons:catalog,images:imageAliases,embedded};
fs.writeFileSync(new URL('../src/drawio-cloud-icons.json',import.meta.url),JSON.stringify(data)+'\n');
console.log(Object.values(catalog).reduce((counts,icon)=>({...counts,[icon.category]:(counts[icon.category]||0)+1}),{}));
