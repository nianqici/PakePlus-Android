const fs=require('fs');
const html=fs.readFileSync('index.html','utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1]
  + '\n;globalThis.__X={S,kvGet,hashPin,childMark,approveLog,points,doRedeem,curStreak,multOf,csvPoints,csvCheckin};';
const mem={};
global.localStorage={ getItem:k=>(k in mem?mem[k]:null), setItem:(k,v)=>{mem[k]=String(v)}, removeItem:k=>{delete mem[k]} };
function el(){
  const e={ _html:'', dataset:{}, style:{}, value:'', textContent:'',
    classList:{add(){},remove(){},toggle(){},contains(){return false}},
    appendChild(){}, remove(){}, setAttribute(){}, addEventListener(){},
    querySelector(){return el()}, querySelectorAll(){return []}, closest(){return null}, focus(){} };
  Object.defineProperty(e,'innerHTML',{get(){return e._html},set(v){e._html=v}});
  return e;
}
global.document={ addEventListener(){}, createElement:()=>el(), querySelector:()=>el(), querySelectorAll:()=>[], body:el() };
global.window=global; global.innerWidth=1200; global.innerHeight=800;
global.URL={createObjectURL:()=>'blob:x',revokeObjectURL(){}};
global.Blob=class{constructor(a){this.a=a}};
const origLog=console.log; console.log=()=>{}; // 屏蔽 toast 里的输出
eval(code);
console.log=origLog;
setTimeout(()=>{
  const X=globalThis.__X;
  origLog('tasks:',X.S.tasks.length,'rewards:',X.S.rewards.length);
  origLog('pin 校验:', X.kvGet('pin')===X.hashPin('123456'));
  (async()=>{
    await X.childMark(X.S.tasks[0]);
    const l=X.S.logs[0];
    origLog('标记后状态:',l.status,'| 倍率:',X.multOf(l.date));
    await X.approveLog(l);
    origLog('实得:',l.got,'| 余额:',X.points(),'| 流水:',X.S.ledger.length,'| 连续天数:',X.curStreak());
    await X.doRedeem(X.S.rewards[1]);
    origLog('兑换后余额:',X.points(),'| 库存:',X.S.rewards[1].stock);
    origLog('localStorage 键:',Object.keys(mem).filter(k=>k.startsWith('xstar_v1_')).join(', '));
    origLog('已持久化 logs:',JSON.parse(mem['xstar_v1_logs']).length,'ledger:',JSON.parse(mem['xstar_v1_ledger']).length);
  })();
},200);
