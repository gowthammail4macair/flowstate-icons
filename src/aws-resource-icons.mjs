import catalog from './drawio-stencils.json' with {type:'json'};
import {stencils,stencilAssetPath} from './drawio-appearance.mjs';
const aliases=id=>/queue/.test(id)?'SQS dead letter DLQ':/postgresql/.test(id)?'Postgres RDS database':/topic|rule$/.test(id)?'IoT MQTT':/application_load_balancer/.test(id)?'ALB ELB':/ecs_task/.test(id)?'ECS container task':/ecr/.test(id)?'ECR container registry':'';
export const awsResourceIcons=Object.entries(catalog).filter(([id])=>/^mxgraph\.aws[34]\./.test(id)).map(([id,entry])=>({id,stencil:id,label:entry.label.replaceAll('_',' '),category:id.startsWith('mxgraph.aws4.')?'AWS resources':'AWS legacy resources',src:stencilAssetPath(id,'svg'),color:entry.color,width:entry.width,height:entry.height,keywords:aliases(id)}));
export function resourceAppearance(id){
  if(!Object.hasOwn(stencils,id))throw new Error('Unknown diagram symbol.');
  const entry=stencils[id];
  return {glyph:id,glyphFill:entry.color,glyphBackground:'none',fill:'none',stroke:'none',strokeWidth:1,fontColor:'#232F3E',fontFamily:'Arial',fontWeight:400,fontStyle:'normal',underline:false,verticalAlign:'middle',wrap:false,padding:2,paddingTop:0,paddingRight:0,paddingBottom:0,paddingLeft:0,radius:0,rotation:0,verticalLabelPosition:'bottom',labelPosition:'center',borderStyle:'solid'};
}
