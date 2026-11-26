import {writeFile} from 'node:fs/promises';
import aws from '../src/aws-icons.json' with {type:'json'};
import {softwareIcons} from '../src/software-icons.mjs';
import {stencils,stencilAssetPath} from '../src/drawio-appearance.mjs';
import {cloudResourceIcons,cloudStencils} from '../src/drawio-cloud-icons.mjs';
import {awsResourceIcons} from '../src/aws-resource-icons.mjs';
const general=['globe','server','database','user','shield','cloud','mail','credit-card','clock','box','zap','check'];
const other=Object.entries(stencils).filter(([id])=>!/^mxgraph\.aws[34]\./.test(id)&&!Object.hasOwn(cloudStencils,id))
  .map(([id,entry])=>({...entry,id,category:'Other symbols',src:stencilAssetPath(id,'svg')}));
const records=[...general.map(id=>({id,label:id,src:'/general/'+id+'.svg',category:'General icons',builtin:true})),
  ...aws,...awsResourceIcons,...cloudResourceIcons,...softwareIcons,...other].map(entry=>{
  const {src,id,...metadata}=entry;
  const glyph=Object.hasOwn(stencils,id);
  return {id,...metadata,thumbnail:src.slice(1),canvas:glyph?stencilAssetPath(id,'svg').slice(1):src.slice(1),
    ...(glyph&&stencilAssetPath(id)?{descriptor:stencilAssetPath(id).slice(1)}:{})};
});
if(records.length!==4002||new Set(records.map(r=>r.id)).size!==4002)throw Error('Baseline requires 4,002 unique symbols.');
await writeFile(new URL('../catalog.json',import.meta.url),JSON.stringify(records,null,2)+'\n');

