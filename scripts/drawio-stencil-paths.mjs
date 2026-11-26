// Both the upstream binary decoder and XML expose a linked list of elements.
function elements(parent){
  const result=[];
  for(let child=parent?.firstChild;child;child=child.nextSibling)if(child.nodeType===1)result.push(child);
  return result;
}
export const value=(e,key,fallback=0)=>{const n=Number(e.getAttribute(key)??fallback);if(!Number.isFinite(n))throw new Error(`Invalid ${key}`);return n;};
function pathData(e){return elements(e).map(p=>{
  switch(p.nodeName){
    case 'move':return `M${value(p,'x')},${value(p,'y')}`;
    case 'line':return `L${value(p,'x')},${value(p,'y')}`;
    case 'curve':return `C${value(p,'x1')},${value(p,'y1')} ${value(p,'x2')},${value(p,'y2')} ${value(p,'x3')},${value(p,'y3')}`;
    case 'quad':return `Q${value(p,'x1')},${value(p,'y1')} ${value(p,'x2')},${value(p,'y2')}`;
    case 'arc':return `A${value(p,'rx')},${value(p,'ry')} ${value(p,'x-axis-rotation')} ${value(p,'large-arc-flag')},${value(p,'sweep-flag')} ${value(p,'x')},${value(p,'y')}`;
    case 'close':return 'Z';
    default:throw new Error(`Unsupported path command: ${p.nodeName}`);
  }
}).join(' ');}
export function convertStencil(shape){
  const result={width:value(shape,'w',100),height:value(shape,'h',100),paths:[]};
  let state={fill:'currentColor',stroke:'currentColor',opacity:1,fillOpacity:1,strokeOpacity:1,strokeWidth:1,lineJoin:'miter',lineCap:'butt'},pending='';const stack=[];
  for(const section of ['background','foreground'])for(const e of elements(shape.getElementsByTagName(section)[0])){
    switch(e.nodeName){
      case 'save':stack.push({...state});break;
      case 'restore':state=stack.pop()||state;break;
      case 'fillcolor':state.fill=e.getAttribute('color');break;
      case 'strokecolor':state.stroke=e.getAttribute('color');break;
      case 'alpha':state.opacity=value(e,'alpha',1);break;
      case 'fillalpha':state.fillOpacity=value(e,'alpha',1);break;
      case 'strokealpha':state.strokeOpacity=value(e,'alpha',1);break;
      case 'strokewidth':state.strokeWidth=value(e,'width',1);break;
      case 'linejoin':state.lineJoin=e.getAttribute('join');break;
      case 'linecap':state.lineCap=e.getAttribute('cap');break;
      case 'miterlimit':break;
      case 'dashpattern':state.dash=e.getAttribute('pattern');break;
      case 'dashed':if(value(e,'dashed')===0)delete state.dash;break;
      case 'path':pending=pathData(e);break;
      case 'rect':{const x=value(e,'x'),y=value(e,'y'),w=value(e,'w'),h=value(e,'h');pending=w&&h?`M${x},${y} h${w} v${h} h${-w} Z`:'';break;}
      case 'roundrect':{
        const x=value(e,'x'),y=value(e,'y'),w=value(e,'w'),h=value(e,'h'),r=Math.min(w,h)*(value(e,'arcsize')||15)/100;
        pending=`M${x+r},${y} h${w-2*r} Q${x+w},${y} ${x+w},${y+r} v${h-2*r} Q${x+w},${y+h} ${x+w-r},${y+h} h${2*r-w} Q${x},${y+h} ${x},${y+h-r} v${2*r-h} Q${x},${y} ${x+r},${y} Z`;break;
      }
      case 'ellipse':{const x=value(e,'x'),y=value(e,'y'),rx=value(e,'w')/2,ry=value(e,'h')/2;pending=`M${x},${y+ry} a${rx},${ry} 0 1,0 ${rx*2},0 a${rx},${ry} 0 1,0 ${-rx*2},0`;break;}
      case 'fill':case 'stroke':case 'fillstroke':
        if(pending)result.paths.push({d:pending,...state,fill:e.nodeName==='stroke'?'none':state.fill,stroke:e.nodeName==='fill'?'none':state.stroke});pending='';break;
      default:throw new Error(`Unsupported stencil command: ${e.nodeName}`);
    }
  }
  if(!result.paths.length)throw new Error(`Empty stencil: ${shape.getAttribute('name')}`);
  return result;
}
