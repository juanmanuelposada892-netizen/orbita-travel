import { useState, useMemo, useEffect, useRef } from "react";

const C = {
  bg:"#F8F7F4", panel:"#FFFFFF", sidebar:"#0F1117",
  sideText:"#9A9CAD", sideActive:"#FFFFFF",
  accent:"#2563EB", accentL:"#EFF6FF", accentD:"#1D4ED8",
  grn:"#16A34A", grnL:"#F0FDF4",
  red:"#DC2626", redL:"#FEF2F2",
  yel:"#D97706", yelL:"#FFFBEB",
  border:"#E5E7EB", t1:"#111827", t2:"#6B7280", t3:"#9CA3AF",
};

const INIT = {
  trips:[
    {id:"T-001",destination:"Bolivia Tour de Compras",country:"BO",type:"nacional",departure:"2026-05-28",returnDate:"2026-05-31",capacity:58,sold:31,price:180,status:"En venta",supplierId:"S-001",hotelCost:420,extrasCost:180,notes:"Público emprendedor. Salida fin de mes.",minPax:20,guide:"Carlos Medina",insurance:true},
    {id:"T-002",destination:"Cataratas del Iguazú",country:"AR",type:"nacional",departure:"2026-06-19",returnDate:"2026-06-22",capacity:45,sold:14,price:260,status:"Planificación",supplierId:"S-002",hotelCost:820,extrasCost:250,notes:"Ideal fin de semana largo.",minPax:25,guide:"Sin asignar",insurance:true},
    {id:"T-003",destination:"Machu Picchu + Cusco",country:"PE",type:"internacional",departure:"2026-07-15",returnDate:"2026-07-22",capacity:30,sold:8,price:890,status:"Planificación",supplierId:"S-001",hotelCost:2400,extrasCost:600,notes:"Requiere pasaporte vigente.",minPax:15,guide:"Ana Torres",insurance:true},
    {id:"T-004",destination:"Río de Janeiro Carnaval",country:"BR",type:"internacional",departure:"2027-02-26",returnDate:"2027-03-04",capacity:40,sold:22,price:650,status:"En venta",supplierId:"S-002",hotelCost:1800,extrasCost:400,notes:"Alta demanda. Cupos limitados.",minPax:20,guide:"Sin asignar",insurance:true},
  ],
  passengers:[
    {id:"P-001",fullName:"María Gómez",dni:"30111222",phone:"+54 3541 000001",email:"maria@email.com",tripId:"T-001",payment:"Pagado",amountPaid:180,seat:"12",emergency:"Juan Gómez +54 3541 111",notes:"",checklist:{dni:true,pago:true,seguro:true,contrato:true}},
    {id:"P-002",fullName:"José Ruiz",dni:"28999111",phone:"+54 3541 000002",email:"jose@email.com",tripId:"T-001",payment:"Seña",amountPaid:90,seat:"13",emergency:"",notes:"Paga resto el 15/05",checklist:{dni:true,pago:false,seguro:false,contrato:true}},
    {id:"P-003",fullName:"Luciana Pérez",dni:"33222999",phone:"+54 3541 000003",email:"luci@email.com",tripId:"T-002",payment:"Pendiente",amountPaid:0,seat:"7",emergency:"",notes:"",checklist:{dni:false,pago:false,seguro:false,contrato:false}},
    {id:"P-004",fullName:"Roberto Díaz",dni:"25888777",phone:"+54 3541 000004",email:"rob@email.com",tripId:"T-003",payment:"Pagado",amountPaid:890,seat:"3",emergency:"Silvia Díaz +54 3541 222",notes:"Alérgico al mariscos",checklist:{dni:true,pago:true,seguro:true,contrato:true}},
    {id:"P-005",fullName:"Valeria Torres",dni:"31444555",phone:"+54 3541 000005",email:"vale@email.com",tripId:"T-004",payment:"Seña",amountPaid:325,seat:"8",emergency:"",notes:"",checklist:{dni:true,pago:false,seguro:false,contrato:false}},
  ],
  sales:[
    {id:"V-001",date:"2026-04-19",channel:"Instagram",seller:"Juan",amount:180,tripId:"T-001",concept:"Asiento completo"},
    {id:"V-002",date:"2026-04-19",channel:"Ads",seller:"Juan",amount:90,tripId:"T-001",concept:"Seña 50%"},
    {id:"V-003",date:"2026-04-20",channel:"Referido",seller:"Lucas",amount:890,tripId:"T-003",concept:"Asiento completo"},
    {id:"V-004",date:"2026-04-21",channel:"WhatsApp",seller:"Juan",amount:325,tripId:"T-004",concept:"Seña 50%"},
  ],
  suppliers:[
    {id:"S-001",company:"Bus Córdoba SRL",contact:"Carlos Medina",phone:"+54 351 111111",email:"bus@cordoba.com",busCost:3200,type:"bus",availability:"Disponible",rating:5,notes:"Muy puntual. Unidad nueva."},
    {id:"S-002",company:"TurSur Transporte",contact:"Natalia Ríos",phone:"+54 351 222222",email:"tursur@email.com",busCost:4100,type:"bus",availability:"Consultar",rating:4,notes:""},
    {id:"S-003",company:"Hotel Paraíso",contact:"Mario Vega",phone:"+54 351 333333",email:"hotel@paraiso.com",busCost:0,type:"hotel",availability:"Disponible",rating:5,notes:"Desayuno incluido"},
    {id:"S-004",company:"Seguros Viajeros SA",contact:"Ana Suárez",phone:"+54 11 444444",email:"info@seguros.com",busCost:0,type:"seguro",availability:"Disponible",rating:5,notes:"Cobertura internacional"},
  ],
  expenses:[
    {id:"E-001",date:"2026-04-15",concept:"Publicidad Meta Ads",category:"Marketing",amount:120,tripId:"T-001"},
    {id:"E-002",date:"2026-04-18",concept:"Impresión folletería",category:"Marketing",amount:45,tripId:""},
    {id:"E-003",date:"2026-04-20",concept:"Combustible proveedor",category:"Operativo",amount:80,tripId:"T-002"},
  ],
  tasks:[
    {id:"TK-001",title:"Confirmar hotel Bolivia",tripId:"T-001",due:"2026-05-01",done:false,priority:"Alta",assignee:"Juan"},
    {id:"TK-002",title:"Publicar Story Iguazú",tripId:"T-002",due:"2026-04-25",done:true,priority:"Media",assignee:"Juan"},
    {id:"TK-003",title:"Verificar pasaportes Machu Picchu",tripId:"T-003",due:"2026-06-15",done:false,priority:"Alta",assignee:"Lucas"},
    {id:"TK-004",title:"Cobrar saldo José Ruiz",tripId:"T-001",due:"2026-05-15",done:false,priority:"Alta",assignee:"Juan"},
  ],
  team:[
    {id:"U-001",name:"Juan",role:"Marketing y ventas",avatar:"J",color:"#2563EB"},
    {id:"U-002",name:"Lucas",role:"Operaciones",avatar:"L",color:"#16A34A"},
  ],
};

const usd=(v)=>`$${Number(v||0).toLocaleString("es-AR",{maximumFractionDigits:0})}`;
const dateStr=(d)=>d?new Date(d+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"}):"-";
const daysLeft=(d)=>{if(!d)return null;return Math.ceil((new Date(d+"T12:00:00")-new Date())/86400000);};
const flags={AR:"🇦🇷",BO:"🇧🇴",BR:"🇧🇷",PE:"🇵🇪",CL:"🇨🇱",UY:"🇺🇾",CO:"🇨🇴",MX:"🇲🇽",US:"🇺🇸",EU:"🇪🇺"};
const STATUS_COLOR={"En venta":{bg:"#F0FDF4",text:"#16A34A"},"Planificación":{bg:"#EFF6FF",text:"#2563EB"},"Armado":{bg:"#FFF7ED",text:"#EA580C"},"Cerrado":{bg:"#F9FAFB",text:"#6B7280"},"En ejecución":{bg:"#ECFDF5",text:"#15803D"},"Finalizado":{bg:"#F1F5F9",text:"#475569"},"Cancelado":{bg:"#FEF2F2",text:"#DC2626"}};
const PAY_COLOR={"Pagado":{bg:"#F0FDF4",text:"#16A34A"},"Seña":{bg:"#FFFBEB",text:"#D97706"},"Pendiente":{bg:"#FEF2F2",text:"#DC2626"}};

function generarAlertas(data){
  const a=[];
  data.trips.forEach(t=>{
    if(!t.supplierId) a.push({tipo:"error",msg:`🚨 ${t.destination}: sin proveedor asignado`,mod:"viajes"});
    if(t.sold<t.minPax&&t.status==="En venta") a.push({tipo:"warn",msg:`⚠️ ${t.destination}: no cubre mínimo (${t.sold}/${t.minPax} pax)`,mod:"viajes"});
    const sup=data.suppliers.find(s=>s.id===t.supplierId);
    if(sup?.availability==="Consultar") a.push({tipo:"warn",msg:`⚠️ ${t.destination}: proveedor requiere confirmación`,mod:"proveedores"});
    const days=daysLeft(t.departure);
    if(days!==null&&days<=7&&days>=0&&!["Finalizado","Cancelado"].includes(t.status)) a.push({tipo:"error",msg:`🔴 ${t.destination}: sale en ${days} días — revisá todo`,mod:"viajes"});
  });
  data.passengers.forEach(p=>{
    if(!p.dni) a.push({tipo:"error",msg:`🚨 ${p.fullName}: sin DNI cargado`,mod:"pasajeros"});
    if(p.payment==="Pendiente") a.push({tipo:"warn",msg:`💰 ${p.fullName}: pago pendiente`,mod:"pasajeros"});
  });
  const totalPend=data.passengers.filter(p=>p.payment!=="Pagado").reduce((acc,p)=>{const t=data.trips.find(tr=>tr.id===p.tripId);return acc+(t?.price||0)-p.amountPaid;},0);
  if(totalPend>0) a.push({tipo:"info",msg:`💵 Total por cobrar: ${usd(totalPend)}`,mod:"rentabilidad"});
  return a;
}

function Badge({children,bg,text}){return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:100,background:bg,color:text,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;}
function Card({children,style={}}){return <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:24,...style}}>{children}</div>;}

function FInput({label,type="text",value,onChange,placeholder="",required=false,style={}}){
  const [touched,setTouched]=useState(false);
  const err=required&&touched&&!value;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:12,fontWeight:500,color:err?C.red:C.t2}}>{label}{required&&" *"}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} onBlur={()=>setTouched(true)} placeholder={placeholder}
        style={{padding:"9px 13px",border:`1px solid ${err?C.red:C.border}`,borderRadius:8,fontSize:13,color:C.t1,outline:"none",background:"#FAFAFA",width:"100%",...style}}/>
      {err&&<span style={{fontSize:11,color:C.red}}>Campo requerido</span>}
    </div>
  );
}

function FSelect({label,value,onChange,options=[],required=false}){
  const [touched,setTouched]=useState(false);
  const err=required&&touched&&!value;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<label style={{fontSize:12,fontWeight:500,color:err?C.red:C.t2}}>{label}{required&&" *"}</label>}
      <select value={value} onChange={e=>onChange(e.target.value)} onBlur={()=>setTouched(true)}
        style={{padding:"9px 13px",border:`1px solid ${err?C.red:C.border}`,borderRadius:8,fontSize:13,color:C.t1,outline:"none",background:"#FAFAFA",width:"100%"}}>
        <option value="">Seleccionar...</option>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {err&&<span style={{fontSize:11,color:C.red}}>Campo requerido</span>}
    </div>
  );
}

function Btn({children,onClick,variant="primary",size="md",disabled=false}){
  const styles={primary:{background:C.accent,color:"#fff",border:"none"},secondary:{background:"transparent",color:C.t1,border:`1px solid ${C.border}`},danger:{background:C.red,color:"#fff",border:"none"},ghost:{background:"transparent",color:C.t2,border:"none"},success:{background:C.grn,color:"#fff",border:"none"}};
  const sizes={sm:"6px 12px",md:"9px 18px",lg:"12px 28px"};
  return <button onClick={onClick} disabled={disabled} style={{...styles[variant],padding:sizes[size],borderRadius:8,fontSize:13,fontWeight:500,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,display:"inline-flex",alignItems:"center",gap:6,transition:"all .15s"}}>{children}</button>;
}

function StatCard({label,value,sub,color=C.accent,icon}){
  return(
    <Card style={{padding:20}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:12,color:C.t2,fontWeight:500,marginBottom:6}}>{label}</div>
          <div style={{fontSize:26,fontWeight:700,color:C.t1,lineHeight:1}}>{value}</div>
          {sub&&<div style={{fontSize:11,color:C.t3,marginTop:6}}>{sub}</div>}
        </div>
        <div style={{width:40,height:40,background:`${color}18`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{icon}</div>
      </div>
    </Card>
  );
}

function ProgressBar({pct,color=C.accent}){
  return <div style={{height:6,background:C.border,borderRadius:100,overflow:"hidden",width:"100%"}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:100,transition:"width .4s ease"}}/></div>;
}

function Table({headers=[],rows=[]}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:`2px solid ${C.border}`}}>{headers.map((h,i)=><th key={i} style={{padding:"10px 12px",textAlign:"left",fontSize:11,fontWeight:600,color:C.t2,textTransform:"uppercase",letterSpacing:".05em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${C.border}`,transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{row.map((cell,j)=><td key={j} style={{padding:"12px 12px",color:C.t1,whiteSpace:"nowrap"}}>{cell}</td>)}</tr>)}
          {rows.length===0&&<tr><td colSpan={headers.length} style={{padding:32,textAlign:"center",color:C.t3,fontSize:13}}>Sin datos</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AlertPanel({alertas,onNav}){
  if(!alertas.length) return <div style={{padding:"12px 16px",background:C.grnL,border:`1px solid ${C.grn}33`,borderRadius:10,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>✅</span><span style={{fontSize:13,color:C.grn,fontWeight:500}}>Todo en orden — sin alertas activas</span></div>;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {alertas.filter(a=>a.tipo==="error").map((a,i)=><div key={i} onClick={()=>onNav(a.mod)} style={{padding:"10px 14px",background:C.redL,border:`1px solid ${C.red}33`,borderRadius:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><span style={{fontSize:14,flex:1}}>{a.msg}</span><span style={{fontSize:11,color:C.red}}>→ ir</span></div>)}
      {alertas.filter(a=>a.tipo==="warn").map((a,i)=><div key={i} onClick={()=>onNav(a.mod)} style={{padding:"10px 14px",background:C.yelL,border:`1px solid ${C.yel}33`,borderRadius:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><span style={{fontSize:14,flex:1}}>{a.msg}</span><span style={{fontSize:11,color:C.yel}}>→ ir</span></div>)}
      {alertas.filter(a=>a.tipo==="info").map((a,i)=><div key={i} onClick={()=>onNav(a.mod)} style={{padding:"10px 14px",background:C.accentL,border:`1px solid ${C.accent}33`,borderRadius:8,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><span style={{fontSize:14,flex:1}}>{a.msg}</span><span style={{fontSize:11,color:C.accent}}>→ ir</span></div>)}
    </div>
  );
}

const NAV=[{id:"dashboard",icon:"🏠",label:"Dashboard"},{id:"viajes",icon:"✈️",label:"Viajes"},{id:"pasajeros",icon:"👥",label:"Pasajeros"},{id:"ventas",icon:"💳",label:"Ventas"},{id:"gastos",icon:"📊",label:"Gastos"},{id:"proveedores",icon:"🚌",label:"Proveedores"},{id:"rentabilidad",icon:"💰",label:"Rentabilidad"},{id:"tareas",icon:"✅",label:"Tareas"},{id:"documentos",icon:"📄",label:"Documentos"}];

function ResetModal({onConfirm,onCancel}){
  const [secs,setSecs]=useState([]);
  const SECS=["viajes","pasajeros","ventas","gastos","tareas","todo"];
  const toggle=(s)=>setSecs(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s]);
  return(
    <div style={{position:"fixed",inset:0,background:"#000000AA",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.panel,borderRadius:16,padding:32,width:"100%",maxWidth:400,border:`2px solid ${C.red}`}}>
        <div style={{fontSize:18,fontWeight:700,color:C.red,marginBottom:8}}>⚠️ Puesta a cero</div>
        <div style={{fontSize:13,color:C.t2,marginBottom:20}}>Seleccioná qué secciones resetear. Esta acción no se puede deshacer.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {SECS.map(s=><label key={s} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 12px",borderRadius:8,background:secs.includes(s)?C.redL:"#F9FAFB",border:`1px solid ${secs.includes(s)?C.red:C.border}`}}><input type="checkbox" checked={secs.includes(s)} onChange={()=>toggle(s)} style={{width:16,height:16}}/><span style={{fontSize:13,fontWeight:500,color:C.t1,textTransform:"capitalize"}}>{s==="todo"?"🔴 Borrar TODO":s}</span></label>)}
        </div>
        <div style={{display:"flex",gap:8}}><Btn variant="danger" onClick={()=>secs.length&&onConfirm(secs)} disabled={!secs.length}>Confirmar reset</Btn><Btn variant="secondary" onClick={onCancel}>Cancelar</Btn></div>
      </div>
    </div>
  );
}

function Sidebar({active,setActive,alertas}){
  const [clicks,setClicks]=useState(0);
  const [showReset,setShowReset]=useState(false);
  const timer=useRef(null);
  const handleLogo=()=>{
    const n=clicks+1;setClicks(n);clearTimeout(timer.current);
    if(n>=3){setShowReset(true);setClicks(0);}
    else timer.current=setTimeout(()=>setClicks(0),800);
  };
  return(
    <>
      <div style={{background:C.sidebar,width:220,minHeight:"100vh",padding:"20px 12px",display:"flex",flexDirection:"column",gap:4,position:"fixed",top:0,left:0,bottom:0,zIndex:100,overflowY:"auto"}}>
        <div style={{padding:"12px 10px 20px",cursor:"pointer",userSelect:"none"}} onClick={handleLogo}>
          <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-.04em",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:28,height:28,background:C.accent,borderRadius:7,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🌍</span>
            ÓRBITA
          </div>
          <div style={{fontSize:10,color:C.sideText,marginTop:3,letterSpacing:".06em",textTransform:"uppercase"}}>Travel Management</div>
        </div>
        {alertas.length>0&&<div style={{margin:"0 4px 10px",padding:"8px 12px",background:"#DC262618",border:"1px solid #DC262633",borderRadius:8,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>🚨</span><span style={{fontSize:11,color:"#FCA5A5",fontWeight:500}}>{alertas.filter(a=>a.tipo==="error").length} err · {alertas.filter(a=>a.tipo==="warn").length} avisos</span></div>}
        {NAV.map(n=><button key={n.id} onClick={()=>setActive(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",transition:"all .15s",fontSize:13,fontWeight:500,background:active===n.id?"#1D2230":"transparent",color:active===n.id?C.sideActive:C.sideText,width:"100%",textAlign:"left"}}><span style={{fontSize:16}}>{n.icon}</span>{n.label}</button>)}
        <div style={{marginTop:"auto",padding:"16px 10px 8px",borderTop:"1px solid #1D2230"}}>
          <div style={{fontSize:11,color:C.sideText,marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>Equipo</div>
          {INIT.team.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}><div style={{width:28,height:28,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{u.avatar}</div><div><div style={{fontSize:12,color:"#E5E7EB",fontWeight:500}}>{u.name}</div><div style={{fontSize:10,color:C.sideText}}>{u.role}</div></div></div>)}
        </div>
      </div>
      {showReset&&<ResetModal onConfirm={(s)=>{window.__orbitaReset&&window.__orbitaReset(s);setShowReset(false);}} onCancel={()=>setShowReset(false)}/>}
    </>
  );
}

function Dashboard({data,alertas,onNav}){
  const {trips,passengers,sales,expenses}=data;
  const enriched=trips.map(t=>{const sup=data.suppliers.find(s=>s.id===t.supplierId);const rev=t.sold*t.price;const cost=(sup?.busCost||0)+t.hotelCost+t.extrasCost;return{...t,sup,rev,cost,profit:rev-cost,occ:t.capacity?Math.round(t.sold/t.capacity*100):0};});
  const totalRev=enriched.reduce((a,t)=>a+t.rev,0);
  const totalCost=enriched.reduce((a,t)=>a+t.cost,0);
  const totalExp=expenses.reduce((a,e)=>a+e.amount,0);
  const totalProfit=totalRev-totalCost-totalExp;
  const pendingAmount=passengers.filter(p=>p.payment!=="Pagado").reduce((a,p)=>{const t=trips.find(tr=>tr.id===p.tripId);return a+(t?.price||0)-p.amountPaid;},0);
  const upcoming=[...enriched].sort((a,b)=>new Date(a.departure)-new Date(b.departure)).slice(0,3);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Dashboard</h2><p style={{fontSize:13,color:C.t2}}>{new Date().toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p></div>
      {alertas.length>0&&<Card style={{padding:16}}><div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:12}}>🚨 Alertas activas ({alertas.length})</div><AlertPanel alertas={alertas} onNav={onNav}/></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <StatCard label="Viajes activos" value={trips.filter(t=>t.status!=="Cancelado").length} sub="nacionales e internacionales" color={C.accent} icon="✈️"/>
        <StatCard label="Pasajeros" value={passengers.length} sub={`${passengers.filter(p=>p.payment==="Pagado").length} pagados`} color={C.grn} icon="👥"/>
        <StatCard label="Ingresos" value={usd(totalRev)} sub="asientos vendidos" color={C.accent} icon="💵"/>
        <StatCard label="Costos" value={usd(totalCost+totalExp)} sub="bus + hotel + extras" color={C.yel} icon="📊"/>
        <StatCard label="Ganancia neta" value={usd(totalProfit)} sub="resultado proyectado" color={totalProfit>0?C.grn:C.red} icon="💰"/>
        <StatCard label="Por cobrar" value={usd(pendingAmount)} sub="señas y pendientes" color={C.red} icon="⏳"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
        <Card>
          <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:16}}>Próximos viajes</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {upcoming.map(t=>{const days=daysLeft(t.departure);return(
              <div key={t.id} style={{padding:14,background:C.bg,borderRadius:10,border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><div style={{fontWeight:600,fontSize:13,color:C.t1}}>{flags[t.country]||"🌍"} {t.destination}</div><Badge bg={STATUS_COLOR[t.status]?.bg} text={STATUS_COLOR[t.status]?.text}>{t.status}</Badge></div>
                <div style={{fontSize:12,color:C.t2,marginBottom:8}}>{dateStr(t.departure)} — {dateStr(t.returnDate)}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/><span style={{fontSize:11,color:C.t2,whiteSpace:"nowrap"}}>{t.sold}/{t.capacity}</span></div>
                {days!==null&&<div style={{fontSize:11,color:days<=7?C.red:C.t3}}>⏱ {days>0?`en ${days} días`:"¡HOY!"}</div>}
              </div>
            );})}
          </div>
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:16}}>Rentabilidad por viaje</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {enriched.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:12}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{flags[t.country]||"🌍"} {t.destination}</div><div style={{fontSize:11,color:C.t3,marginTop:2}}>{usd(t.rev)} ing · {usd(t.cost)} cos</div></div><div style={{fontSize:13,fontWeight:700,color:t.profit>0?C.grn:C.red,whiteSpace:"nowrap"}}>{usd(t.profit)}</div></div>)}
          </div>
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Estado pasajeros</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {[{label:"Pagado",val:passengers.filter(p=>p.payment==="Pagado").length,color:C.grn},{label:"Seña",val:passengers.filter(p=>p.payment==="Seña").length,color:C.yel},{label:"Pendiente",val:passengers.filter(p=>p.payment==="Pendiente").length,color:C.red}].map(s=><div key={s.label} style={{flex:1,padding:14,background:s.color+"12",borderRadius:10,textAlign:"center",minWidth:70}}><div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:s.color,marginTop:3}}>{s.label}</div></div>)}
          </div>
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Ventas por canal</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {["Instagram","Ads","WhatsApp","Referido","Oficina"].map(canal=>{const total=sales.filter(s=>s.channel===canal).reduce((a,s)=>a+s.amount,0);const max=Math.max(...["Instagram","Ads","WhatsApp","Referido","Oficina"].map(c=>sales.filter(s=>s.channel===c).reduce((a,s)=>a+s.amount,0)));return<div key={canal} style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:12,color:C.t2,width:80}}>{canal}</div><div style={{flex:1}}><ProgressBar pct={max?total/max*100:0}/></div><div style={{fontSize:12,fontWeight:600,color:C.t1,width:60,textAlign:"right"}}>{usd(total)}</div></div>;})}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Viajes({data,setData}){
  const {trips,suppliers}=data;
  const [form,setForm]=useState({destination:"",country:"AR",type:"nacional",departure:"",returnDate:"",capacity:"45",price:"",supplierId:"",hotelCost:"0",extrasCost:"0",notes:"",minPax:"20",guide:"",insurance:true});
  const [view,setView]=useState("lista");
  const enriched=trips.map(t=>{const sup=suppliers.find(s=>s.id===t.supplierId);const rev=t.sold*t.price;const cost=(sup?.busCost||0)+t.hotelCost+t.extrasCost;const profit=rev-cost;const occ=t.capacity?Math.round(t.sold/t.capacity*100):0;const days=daysLeft(t.departure);const breakeven=cost/(t.price||1);return{...t,sup,rev,cost,profit,occ,days,breakeven};});
  const addTrip=()=>{
    if(!form.destination||!form.departure||!form.returnDate||!form.price||!form.supplierId) return;
    const newTrip={id:`T-${String(trips.length+1).padStart(3,"0")}`,destination:form.destination,country:form.country,type:form.type,departure:form.departure,returnDate:form.returnDate,capacity:Number(form.capacity),sold:0,price:Number(form.price),status:"Planificación",supplierId:form.supplierId,hotelCost:Number(form.hotelCost||0),extrasCost:Number(form.extrasCost||0),notes:form.notes,minPax:Number(form.minPax||0),guide:form.guide||"Sin asignar",insurance:form.insurance};
    setData(d=>({...d,trips:[newTrip,...d.trips]}));
    setForm({destination:"",country:"AR",type:"nacional",departure:"",returnDate:"",capacity:"45",price:"",supplierId:"",hotelCost:"0",extrasCost:"0",notes:"",minPax:"20",guide:"",insurance:true});
    setView("lista");
  };
  const updateStatus=(id,status)=>setData(d=>({...d,trips:d.trips.map(t=>t.id===id?{...t,status}:t)}));
  const STATUS_FLOW=["Planificación","Armado","En venta","Cerrado","En ejecución","Finalizado","Cancelado"];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Viajes</h2><p style={{fontSize:13,color:C.t2}}>{trips.length} viajes · {trips.filter(t=>t.type==="internacional").length} internacionales</p></div>
        <div style={{display:"flex",gap:8}}><Btn variant={view==="lista"?"primary":"secondary"} onClick={()=>setView("lista")} size="sm">Lista</Btn><Btn variant={view==="nuevo"?"primary":"secondary"} onClick={()=>setView("nuevo")} size="sm">+ Nuevo viaje</Btn></div>
      </div>
      {view==="nuevo"&&<Card>
        <div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:18}}>Nuevo viaje</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
          <div style={{gridColumn:"1/-1"}}><FInput label="Destino" required value={form.destination} onChange={v=>setForm(f=>({...f,destination:v}))} placeholder="Ej: Bolivia, Machu Picchu"/></div>
          <FSelect label="País" required value={form.country} onChange={v=>setForm(f=>({...f,country:v}))} options={[{value:"AR",label:"🇦🇷 Argentina"},{value:"BO",label:"🇧🇴 Bolivia"},{value:"BR",label:"🇧🇷 Brasil"},{value:"PE",label:"🇵🇪 Perú"},{value:"CL",label:"🇨🇱 Chile"},{value:"UY",label:"🇺🇾 Uruguay"},{value:"CO",label:"🇨🇴 Colombia"},{value:"MX",label:"🇲🇽 México"},{value:"US",label:"🇺🇸 EEUU"},{value:"EU",label:"🇪🇺 Europa"}]}/>
          <FSelect label="Tipo" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={[{value:"nacional",label:"Nacional"},{value:"internacional",label:"Internacional"}]}/>
          <FInput label="Salida" required type="date" value={form.departure} onChange={v=>setForm(f=>({...f,departure:v}))}/>
          <FInput label="Regreso" required type="date" value={form.returnDate} onChange={v=>setForm(f=>({...f,returnDate:v}))}/>
          <FInput label="Capacidad" type="number" value={form.capacity} onChange={v=>setForm(f=>({...f,capacity:v}))}/>
          <FInput label="Precio/asiento (USD)" required type="number" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))}/>
          <FInput label="Mínimo pax" type="number" value={form.minPax} onChange={v=>setForm(f=>({...f,minPax:v}))}/>
          <FSelect label="Proveedor bus" required value={form.supplierId} onChange={v=>setForm(f=>({...f,supplierId:v}))} options={suppliers.filter(s=>s.type==="bus").map(s=>({value:s.id,label:s.company}))}/>
          <FInput label="Guía" value={form.guide} onChange={v=>setForm(f=>({...f,guide:v}))} placeholder="Nombre del guía"/>
          <FInput label="Costo hotel (USD)" type="number" value={form.hotelCost} onChange={v=>setForm(f=>({...f,hotelCost:v}))}/>
          <FInput label="Extras (USD)" type="number" value={form.extrasCost} onChange={v=>setForm(f=>({...f,extrasCost:v}))}/>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:500,color:C.t2,display:"block",marginBottom:5}}>Notas</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Público, condiciones..." style={{width:"100%",padding:"9px 13px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.t1,minHeight:72,resize:"vertical",outline:"none",background:"#FAFAFA"}}/></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:16}}><Btn onClick={addTrip}>Crear viaje</Btn><Btn variant="secondary" onClick={()=>setView("lista")}>Cancelar</Btn></div>
      </Card>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {enriched.map(t=>(
          <Card key={t.id} style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{fontSize:22}}>{flags[t.country]||"🌍"}</div>
              <div style={{flex:1,minWidth:160}}><div style={{fontWeight:600,fontSize:15,color:C.t1}}>{t.destination}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{dateStr(t.departure)} → {dateStr(t.returnDate)} · {t.type}{t.days!==null&&<span style={{color:t.days<=7?C.red:C.t3}}> · {t.days>0?`en ${t.days} días`:"¡HOY!"}</span>}</div></div>
              <Badge bg={STATUS_COLOR[t.status]?.bg||C.accentL} text={STATUS_COLOR[t.status]?.text||C.accent}>{t.status}</Badge>
              <select value={t.status} onChange={e=>updateStatus(t.id,e.target.value)} style={{padding:"5px 10px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:12,color:C.t2,background:"#FAFAFA"}}>{STATUS_FLOW.map(s=><option key={s} value={s}>{s}</option>)}</select>
            </div>
            <div style={{padding:"12px 18px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:14}}>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>Ocupación</div><div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:4}}>{t.sold}/{t.capacity}</div><ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/><div style={{fontSize:11,color:t.sold<t.breakeven?C.red:C.grn,marginTop:3}}>{t.sold>=Math.ceil(t.breakeven)?"✓ break-even":"⚠ faltan "+(Math.ceil(t.breakeven)-t.sold)}</div></div>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Precio</div><div style={{fontSize:14,fontWeight:600,color:C.t1,marginTop:4}}>{usd(t.price)}</div></div>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Ingresos</div><div style={{fontSize:14,fontWeight:600,color:C.t1,marginTop:4}}>{usd(t.rev)}</div></div>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Costos</div><div style={{fontSize:14,fontWeight:600,color:C.yel,marginTop:4}}>{usd(t.cost)}</div></div>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Ganancia</div><div style={{fontSize:14,fontWeight:700,color:t.profit>0?C.grn:C.red,marginTop:4}}>{usd(t.profit)}</div></div>
              <div><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Guía</div><div style={{fontSize:12,color:C.t2,marginTop:4}}>{t.guide}</div></div>
              {t.notes&&<div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,color:C.t3,textTransform:"uppercase",letterSpacing:".05em"}}>Notas</div><div style={{fontSize:12,color:C.t2,marginTop:3}}>{t.notes}</div></div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Pasajeros({data,setData}){
  const {passengers,trips}=data;
  const [form,setForm]=useState({fullName:"",dni:"",phone:"",email:"",tripId:"",payment:"Pendiente",amountPaid:"0",seat:"",emergency:"",notes:""});
  const [filter,setFilter]=useState({trip:"",payment:"",search:""});
  const [showForm,setShowForm]=useState(false);
  const [viewTrip,setViewTrip]=useState(null);
  const filtered=passengers.filter(p=>{const match=!filter.search||p.fullName.toLowerCase().includes(filter.search.toLowerCase())||p.dni.includes(filter.search);return(!filter.trip||p.tripId===filter.trip)&&(!filter.payment||p.payment===filter.payment)&&match;});
  const pendingAmount=(p)=>{const t=trips.find(tr=>tr.id===p.tripId);return(t?.price||0)-p.amountPaid;};
  const addPassenger=()=>{
    if(!form.fullName||!form.tripId) return;
    if(!form.dni){alert("⚠️ El pasajero debe tener DNI.");return;}
    const newP={id:`P-${String(passengers.length+1).padStart(3,"0")}`,...form,amountPaid:Number(form.amountPaid||0),checklist:{dni:!!form.dni,pago:form.payment==="Pagado",seguro:false,contrato:false}};
    setData(d=>({...d,passengers:[newP,...d.passengers],trips:d.trips.map(t=>t.id===form.tripId?{...t,sold:t.sold+1}:t)}));
    setForm({fullName:"",dni:"",phone:"",email:"",tripId:"",payment:"Pendiente",amountPaid:"0",seat:"",emergency:"",notes:""});
    setShowForm(false);
  };
  const toggleCL=(pId,field)=>setData(d=>({...d,passengers:d.passengers.map(p=>p.id===pId?{...p,checklist:{...p.checklist,[field]:!p.checklist?.[field]}}:p)}));
  const printList=(tripId)=>{
    const trip=trips.find(t=>t.id===tripId);const pax=passengers.filter(p=>p.tripId===tripId);
    const win=window.open("","_blank");
    win.document.write(`<html><head><title>${trip?.destination}</title><style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px}h1{font-size:16px}table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border:1px solid #ddd;padding:7px;text-align:left}th{background:#f5f5f5;font-weight:600;font-size:11px}tr:nth-child(even){background:#fafafa}@media print{button{display:none}}</style></head><body>
    <button onclick="window.print()" style="margin-bottom:14px;padding:8px 18px;background:#2563EB;color:white;border:none;border-radius:6px;cursor:pointer">🖨️ Imprimir</button>
    <h1>📋 ${trip?.destination||tripId}</h1><p style="color:#666;font-size:11px">Salida: ${dateStr(trip?.departure)} · Regreso: ${dateStr(trip?.returnDate)} · ${pax.length} pasajeros · ${new Date().toLocaleString("es-AR")}</p>
    <table><tr><th>#</th><th>Nombre</th><th>DNI</th><th>Teléfono</th><th>Asiento</th><th>Pago</th><th>Pagado</th><th>Saldo</th><th>DNI✓</th><th>Pago✓</th><th>Seguro✓</th><th>Contrato✓</th><th>Emergencia</th><th>Notas</th></tr>
    ${pax.map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p.fullName}</strong></td><td>${p.dni||"⚠ FALTA"}</td><td>${p.phone||"-"}</td><td style="text-align:center">${p.seat||"-"}</td><td>${p.payment}</td><td>$${p.amountPaid}</td><td style="color:${pendingAmount(p)>0?"red":"green"}">${pendingAmount(p)>0?"$"+pendingAmount(p):"✓"}</td><td style="text-align:center">${p.checklist?.dni?"✓":""}</td><td style="text-align:center">${p.checklist?.pago?"✓":""}</td><td style="text-align:center">${p.checklist?.seguro?"✓":""}</td><td style="text-align:center">${p.checklist?.contrato?"✓":""}</td><td>${p.emergency||"-"}</td><td>${p.notes||"-"}</td></tr>`).join("")}
    </table></body></html>`);win.document.close();
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Pasajeros</h2><p style={{fontSize:13,color:C.t2}}>{passengers.length} registrados</p></div>
        <Btn onClick={()=>setShowForm(s=>!s)}>+ Nuevo pasajero</Btn>
      </div>
      <Card style={{padding:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr repeat(2,140px)",gap:10}}>
          <FInput placeholder="Buscar nombre o DNI..." value={filter.search} onChange={v=>setFilter(f=>({...f,search:v}))}/>
          <FSelect value={filter.trip} onChange={v=>setFilter(f=>({...f,trip:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
          <FSelect value={filter.payment} onChange={v=>setFilter(f=>({...f,payment:v}))} options={[{value:"Pagado",label:"Pagado"},{value:"Seña",label:"Seña"},{value:"Pendiente",label:"Pendiente"}]}/>
        </div>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Lista por viaje</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {trips.map(t=>{const pax=passengers.filter(p=>p.tripId===t.id);return(
            <button key={t.id} onClick={()=>setViewTrip(viewTrip===t.id?null:t.id)} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${viewTrip===t.id?C.accent:C.border}`,background:viewTrip===t.id?C.accentL:"transparent",color:viewTrip===t.id?C.accent:C.t2,fontSize:13,cursor:"pointer",fontWeight:500}}>
              {flags[t.country]||"🌍"} {t.destination} <span style={{background:C.accent,color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:10,marginLeft:6}}>{pax.length}</span>
            </button>
          );})}
        </div>
        {viewTrip&&(()=>{
          const trip=trips.find(t=>t.id===viewTrip);const pax=passengers.filter(p=>p.tripId===viewTrip);
          return(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{flags[trip?.country]||"🌍"} {trip?.destination} · {pax.length} pasajeros · Salida: {dateStr(trip?.departure)}</div>
                <Btn size="sm" variant="secondary" onClick={()=>printList(viewTrip)}>🖨️ Imprimir lista completa</Btn>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {pax.map((p,i)=>{
                  const pending=pendingAmount(p);const checks=p.checklist||{};const allOk=checks.dni&&checks.pago&&checks.seguro&&checks.contrato;
                  return(
                    <div key={p.id} style={{padding:14,border:`1px solid ${allOk?C.grn+"44":C.border}`,borderRadius:10,background:allOk?C.grnL:"#FAFAFA"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:C.accent,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
                        <div style={{flex:1,minWidth:140}}>
                          <div style={{fontWeight:600,fontSize:14,color:C.t1}}>{p.fullName}</div>
                          <div style={{fontSize:11,color:C.t3}}>DNI: {p.dni||"⚠️ SIN DNI"} · Asiento: {p.seat||"-"} · {p.phone||"-"}</div>
                        </div>
                        <Badge bg={PAY_COLOR[p.payment]?.bg} text={PAY_COLOR[p.payment]?.text}>{p.payment}</Badge>
                        <div style={{fontSize:12,fontWeight:600,color:pending>0?C.red:C.grn}}>{pending>0?`debe ${usd(pending)}`:"✓ pagado"}</div>
                      </div>
                      <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
                        {[{key:"dni",label:"DNI ✓"},{key:"pago",label:"Pago ✓"},{key:"seguro",label:"Seguro ✓"},{key:"contrato",label:"Contrato ✓"}].map(ck=>(
                          <label key={ck.key} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:checks[ck.key]?C.grn:C.t3}}>
                            <input type="checkbox" checked={!!checks[ck.key]} onChange={()=>toggleCL(p.id,ck.key)} style={{width:14,height:14}}/>{ck.label}
                          </label>
                        ))}
                        {p.emergency&&<span style={{fontSize:11,color:C.t2,marginLeft:"auto"}}>🆘 {p.emergency}</span>}
                        {p.notes&&<span style={{fontSize:11,color:C.t3}}>📝 {p.notes}</span>}
                      </div>
                    </div>
                  );
                })}
                {pax.length===0&&<div style={{textAlign:"center",padding:20,color:C.t3,fontSize:13}}>Sin pasajeros en este viaje</div>}
              </div>
            </div>
          );
        })()}
      </Card>
      {showForm&&<Card>
        <div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:16}}>Nuevo pasajero</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
          <div style={{gridColumn:"1/-1"}}><FInput required label="Nombre completo" value={form.fullName} onChange={v=>setForm(f=>({...f,fullName:v}))}/></div>
          <FInput required label="DNI (obligatorio)" value={form.dni} onChange={v=>setForm(f=>({...f,dni:v}))} placeholder="Sin DNI no se puede agregar"/>
          <FInput label="Teléfono" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))}/>
          <FInput label="Email" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/>
          <FSelect required label="Viaje" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
          <FSelect label="Estado pago" value={form.payment} onChange={v=>setForm(f=>({...f,payment:v}))} options={[{value:"Pendiente",label:"Pendiente"},{value:"Seña",label:"Seña"},{value:"Pagado",label:"Pagado completo"}]}/>
          <FInput label="Monto pagado (USD)" type="number" value={form.amountPaid} onChange={v=>setForm(f=>({...f,amountPaid:v}))}/>
          <FInput label="Asiento Nº" value={form.seat} onChange={v=>setForm(f=>({...f,seat:v}))}/>
          <FInput label="Contacto emergencia" value={form.emergency} onChange={v=>setForm(f=>({...f,emergency:v}))} placeholder="Nombre y teléfono"/>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:500,color:C.t2,display:"block",marginBottom:5}}>Notas</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Alergias, preferencias..." style={{width:"100%",padding:"9px 13px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.t1,minHeight:60,resize:"vertical",outline:"none",background:"#FAFAFA"}}/></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14}}><Btn onClick={addPassenger}>Agregar pasajero</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancelar</Btn></div>
      </Card>}
      <Card style={{padding:0}}>
        <Table headers={["Pasajero","DNI","Teléfono","Viaje","Asiento","Pago","Pagado","Saldo","Check"]} rows={filtered.map(p=>{const trip=trips.find(t=>t.id===p.tripId);const pending=pendingAmount(p);const checks=p.checklist||{};const done=[checks.dni,checks.pago,checks.seguro,checks.contrato].filter(Boolean).length;return[<div><div style={{fontWeight:500}}>{p.fullName}</div>{p.email&&<div style={{fontSize:11,color:C.t3}}>{p.email}</div>}</div>,p.dni?p.dni:<span style={{color:C.red,fontWeight:600}}>⚠ FALTA</span>,p.phone||"-",<div style={{fontSize:12}}>{flags[trip?.country]||"🌍"} {trip?.destination||"-"}</div>,p.seat||"-",<Badge bg={PAY_COLOR[p.payment]?.bg} text={PAY_COLOR[p.payment]?.text}>{p.payment}</Badge>,<span style={{fontWeight:500}}>{usd(p.amountPaid)}</span>,<span style={{color:pending>0?C.red:C.grn,fontWeight:600}}>{pending>0?usd(pending):"✓"}</span>,<span style={{fontSize:12,color:done===4?C.grn:done>=2?C.yel:C.red}}>{done}/4 ✓</span>];})}/>
      </Card>
    </div>
  );
}

function Ventas({data,setData}){
  const {sales,trips}=data;
  const [form,setForm]=useState({date:new Date().toISOString().split("T")[0],channel:"Instagram",seller:"Juan",amount:"",tripId:"",concept:""});
  const addSale=()=>{if(!form.tripId||!form.amount||!form.date)return;const newS={id:`V-${String(sales.length+1).padStart(3,"0")}`,...form,amount:Number(form.amount)};setData(d=>({...d,sales:[newS,...d.sales]}));setForm(f=>({...f,amount:"",concept:"",tripId:""}));};
  const byChannel=["Instagram","WhatsApp","Ads","Referido","Oficina"].map(ch=>({ch,total:sales.filter(s=>s.channel===ch).reduce((a,s)=>a+s.amount,0),count:sales.filter(s=>s.channel===ch).length}));
  const totalSales=sales.reduce((a,s)=>a+s.amount,0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Ventas</h2><p style={{fontSize:13,color:C.t2}}>{sales.length} transacciones · {usd(totalSales)}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card><div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Por canal</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{byChannel.filter(c=>c.total>0).map(c=><div key={c.ch} style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:90,fontSize:12,color:C.t2}}>{c.ch}</div><div style={{flex:1}}><ProgressBar pct={totalSales?c.total/totalSales*100:0}/></div><div style={{fontSize:12,color:C.t1,fontWeight:600,width:60,textAlign:"right"}}>{usd(c.total)}</div><div style={{fontSize:11,color:C.t3,width:20,textAlign:"right"}}>{c.count}</div></div>)}</div></Card>
          <Card style={{padding:0}}><Table headers={["Fecha","Canal","Vendedor","Viaje","Concepto","Monto"]} rows={sales.map(s=>{const trip=trips.find(t=>t.id===s.tripId);return[dateStr(s.date),<Badge bg={C.accentL} text={C.accent}>{s.channel}</Badge>,s.seller,<span style={{fontSize:12}}>{flags[trip?.country]||"🌍"} {trip?.destination||"-"}</span>,<span style={{fontSize:12,color:C.t2}}>{s.concept||"-"}</span>,<span style={{fontWeight:600,color:C.grn}}>{usd(s.amount)}</span>];})}/></Card>
        </div>
        <Card><div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:16}}>Registrar venta</div><div style={{display:"flex",flexDirection:"column",gap:12}}><FInput label="Fecha" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/><FSelect label="Canal" value={form.channel} onChange={v=>setForm(f=>({...f,channel:v}))} options={["Instagram","WhatsApp","Ads","Referido","Oficina"].map(c=>({value:c,label:c}))}/><FSelect label="Vendedor" value={form.seller} onChange={v=>setForm(f=>({...f,seller:v}))} options={INIT.team.map(u=>({value:u.name,label:u.name}))}/><FSelect required label="Viaje" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/><FInput label="Concepto" value={form.concept} onChange={v=>setForm(f=>({...f,concept:v}))} placeholder="Asiento completo, seña..."/><FInput required label="Monto (USD)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/><Btn onClick={addSale}>Registrar venta</Btn></div></Card>
      </div>
    </div>
  );
}

function Gastos({data,setData}){
  const {expenses,trips}=data;
  const [form,setForm]=useState({date:new Date().toISOString().split("T")[0],concept:"",category:"Marketing",amount:"",tripId:""});
  const CATS=["Marketing","Operativo","Administrativo","Hospedaje","Transporte","Comisiones","Otros"];
  const addExpense=()=>{if(!form.concept||!form.amount)return;const newE={id:`E-${String(expenses.length+1).padStart(3,"0")}`,...form,amount:Number(form.amount)};setData(d=>({...d,expenses:[newE,...d.expenses]}));setForm(f=>({...f,concept:"",amount:"",tripId:""}));};
  const total=expenses.reduce((a,e)=>a+e.amount,0);
  const byCategory=CATS.map(cat=>({cat,total:expenses.filter(e=>e.category===cat).reduce((a,e)=>a+e.amount,0)})).filter(c=>c.total>0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Gastos operativos</h2><p style={{fontSize:13,color:C.t2}}>Total: {usd(total)}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card><div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Por categoría</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{byCategory.map(c=><div key={c.cat} style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:120,fontSize:12,color:C.t2}}>{c.cat}</div><div style={{flex:1}}><ProgressBar pct={total?c.total/total*100:0} color={C.yel}/></div><div style={{fontSize:12,fontWeight:600,color:C.yel,width:60,textAlign:"right"}}>{usd(c.total)}</div></div>)}</div></Card>
          <Card style={{padding:0}}><Table headers={["Fecha","Concepto","Categoría","Viaje","Monto"]} rows={expenses.map(e=>{const trip=trips.find(t=>t.id===e.tripId);return[dateStr(e.date),e.concept,<Badge bg={C.yelL} text={C.yel}>{e.category}</Badge>,trip?<span style={{fontSize:12}}>{flags[trip?.country]||"🌍"} {trip.destination}</span>:<span style={{color:C.t3,fontSize:12}}>General</span>,<span style={{fontWeight:600,color:C.yel}}>{usd(e.amount)}</span>];})}/></Card>
        </div>
        <Card><div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:16}}>Registrar gasto</div><div style={{display:"flex",flexDirection:"column",gap:12}}><FInput label="Fecha" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/><FInput required label="Concepto" value={form.concept} onChange={v=>setForm(f=>({...f,concept:v}))} placeholder="Publicidad, nafta..."/><FSelect label="Categoría" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={CATS.map(c=>({value:c,label:c}))}/><FSelect label="Viaje (opcional)" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/><FInput required label="Monto (USD)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/><Btn variant="danger" onClick={addExpense}>Registrar gasto</Btn></div></Card>
      </div>
    </div>
  );
}

function Proveedores({data,setData}){
  const {suppliers}=data;
  const [form,setForm]=useState({company:"",contact:"",phone:"",email:"",busCost:"0",type:"bus",availability:"Disponible",rating:5,notes:""});
  const [showForm,setShowForm]=useState(false);
  const add=()=>{if(!form.company)return;const newS={id:`S-${String(suppliers.length+1).padStart(3,"0")}`,...form,busCost:Number(form.busCost||0),rating:Number(form.rating||5)};setData(d=>({...d,suppliers:[newS,...d.suppliers]}));setForm({company:"",contact:"",phone:"",email:"",busCost:"0",type:"bus",availability:"Disponible",rating:5,notes:""});setShowForm(false);};
  const typeLabel={bus:"🚌 Bus",hotel:"🏨 Hotel",seguro:"🛡️ Seguro",otro:"📦 Otro"};
  const avColors={"Disponible":{bg:C.grnL,text:C.grn},"Consultar":{bg:C.yelL,text:C.yel},"No disponible":{bg:C.redL,text:C.red}};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Proveedores</h2><p style={{fontSize:13,color:C.t2}}>{suppliers.length} registrados</p></div><Btn onClick={()=>setShowForm(s=>!s)}>+ Nuevo proveedor</Btn></div>
      {showForm&&<Card><div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:16}}>Nuevo proveedor</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}><div style={{gridColumn:"1/-1"}}><FInput required label="Empresa" value={form.company} onChange={v=>setForm(f=>({...f,company:v}))}/></div><FInput label="Contacto" value={form.contact} onChange={v=>setForm(f=>({...f,contact:v}))}/><FInput label="Teléfono" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))}/><FInput label="Email" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/><FSelect label="Tipo" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={[{value:"bus",label:"Bus"},{value:"hotel",label:"Hotel"},{value:"seguro",label:"Seguro"},{value:"otro",label:"Otro"}]}/><FInput label="Costo (USD)" type="number" value={form.busCost} onChange={v=>setForm(f=>({...f,busCost:v}))}/><FSelect label="Disponibilidad" value={form.availability} onChange={v=>setForm(f=>({...f,availability:v}))} options={[{value:"Disponible",label:"Disponible"},{value:"Consultar",label:"Consultar"},{value:"No disponible",label:"No disponible"}]}/><FSelect label="Rating" value={String(form.rating)} onChange={v=>setForm(f=>({...f,rating:Number(v)}))} options={[5,4,3,2,1].map(n=>({value:String(n),label:"⭐".repeat(n)}))}/><div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:500,color:C.t2,display:"block",marginBottom:5}}>Notas</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{width:"100%",padding:"9px 13px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,minHeight:60,resize:"vertical",outline:"none",background:"#FAFAFA"}}/></div></div><div style={{display:"flex",gap:8,marginTop:14}}><Btn onClick={add}>Guardar</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancelar</Btn></div></Card>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
        {suppliers.map(s=><Card key={s.id}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{fontSize:22}}>{typeLabel[s.type]?.split(" ")[0]||"📦"}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.t1}}>{s.company}</div><div style={{fontSize:12,color:C.t2}}>{typeLabel[s.type]||s.type}</div></div><Badge bg={avColors[s.availability]?.bg||C.accentL} text={avColors[s.availability]?.text||C.accent}>{s.availability}</Badge></div><div style={{display:"flex",flexDirection:"column",gap:5}}><div style={{fontSize:12,color:C.t2}}>👤 {s.contact}</div><div style={{fontSize:12,color:C.t2}}>📞 {s.phone}</div>{s.email&&<div style={{fontSize:12,color:C.t2}}>✉️ {s.email}</div>}{s.busCost>0&&<div style={{fontSize:12,fontWeight:600,color:C.t1}}>💵 {usd(s.busCost)}</div>}{s.notes&&<div style={{fontSize:11,color:C.t3,marginTop:4}}>{s.notes}</div>}<div style={{fontSize:13,color:"#F59E0B"}}>{"⭐".repeat(s.rating||0)}</div></div></Card>)}
      </div>
    </div>
  );
}

function Rentabilidad({data}){
  const {trips,suppliers,expenses,passengers}=data;
  const enriched=trips.map(t=>{const sup=suppliers.find(s=>s.id===t.supplierId);const busCost=sup?.busCost||0;const totalCost=busCost+t.hotelCost+t.extrasCost;const totalRev=t.sold*t.price;const profit=totalRev-totalCost;const occ=t.capacity?Math.round(t.sold/t.capacity*100):0;const pax=passengers.filter(p=>p.tripId===t.id);const collected=pax.reduce((a,p)=>a+p.amountPaid,0);const pending=totalRev-collected;const breakeven=totalCost/(t.price||1);return{...t,sup,busCost,totalCost,totalRev,profit,occ,collected,pending,breakeven};});
  const totalRev=enriched.reduce((a,t)=>a+t.totalRev,0);const totalCost=enriched.reduce((a,t)=>a+t.totalCost,0);const totalExp=expenses.reduce((a,e)=>a+e.amount,0);const netProfit=totalRev-totalCost-totalExp;const margin=totalRev?Math.round(netProfit/totalRev*100):0;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Rentabilidad</h2><p style={{fontSize:13,color:C.t2}}>Análisis financiero completo</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <StatCard label="Ingresos totales" value={usd(totalRev)} icon="💵" color={C.grn}/>
        <StatCard label="Costos" value={usd(totalCost)} icon="🚌" color={C.yel}/>
        <StatCard label="Gastos extras" value={usd(totalExp)} icon="📊" color={C.yel}/>
        <StatCard label="Ganancia neta" value={usd(netProfit)} icon="💰" color={netProfit>0?C.grn:C.red}/>
        <StatCard label="Margen" value={`${margin}%`} icon="📈" color={margin>20?C.grn:margin>10?C.yel:C.red}/>
      </div>
      <Card style={{padding:0}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:14,fontWeight:600,color:C.t1}}>Análisis por viaje</div></div>
        <Table headers={["Viaje","Ocupación","Ingresos","Costos","Ganancia","Margen","Break-even","Cobrado","Pendiente"]} rows={enriched.map(t=>{const m=t.totalRev?Math.round(t.profit/t.totalRev*100):0;return[<div><div style={{fontWeight:500}}>{flags[t.country]||"🌍"} {t.destination}</div><div style={{fontSize:11,color:C.t3}}>{t.type}</div></div>,<div style={{minWidth:90}}><div style={{fontSize:12,marginBottom:3}}>{t.occ}% ({t.sold}/{t.capacity})</div><ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/></div>,<span style={{color:C.grn,fontWeight:600}}>{usd(t.totalRev)}</span>,<span style={{color:C.yel}}>{usd(t.totalCost)}</span>,<span style={{color:t.profit>0?C.grn:C.red,fontWeight:700}}>{usd(t.profit)}</span>,<Badge bg={m>20?C.grnL:m>0?C.yelL:C.redL} text={m>20?C.grn:m>0?C.yel:C.red}>{m}%</Badge>,<div style={{fontSize:12}}><div>{Math.ceil(t.breakeven)} pax</div><div style={{fontSize:10,color:t.sold>=t.breakeven?C.grn:C.red}}>{t.sold>=t.breakeven?"✓ cubierto":"⚠ faltan "+(Math.ceil(t.breakeven)-t.sold)}</div></div>,<span style={{color:C.grn}}>{usd(t.collected)}</span>,<span style={{color:t.pending>0?C.red:C.grn,fontWeight:600}}>{t.pending>0?usd(t.pending):"✓"}</span>];})}/>
      </Card>
    </div>
  );
}

function Tareas({data,setData}){
  const {tasks,trips}=data;
  const [form,setForm]=useState({title:"",tripId:"",due:"",priority:"Media",assignee:"Juan"});
  const addTask=()=>{if(!form.title)return;const newT={id:`TK-${String(tasks.length+1).padStart(3,"0")}`,...form,done:false};setData(d=>({...d,tasks:[newT,...d.tasks]}));setForm({title:"",tripId:"",due:"",priority:"Media",assignee:"Juan"});};
  const toggleDone=(id)=>setData(d=>({...d,tasks:d.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}));
  const priColors={"Alta":{bg:C.redL,text:C.red},"Media":{bg:C.yelL,text:C.yel},"Baja":{bg:C.grnL,text:C.grn}};
  const pending=tasks.filter(t=>!t.done);const done=tasks.filter(t=>t.done);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Tareas</h2><p style={{fontSize:13,color:C.t2}}>{pending.length} pendientes · {done.length} completadas</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {pending.length>0&&<div style={{fontSize:12,fontWeight:600,color:C.t2,textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>Pendientes ({pending.length})</div>}
          {pending.map(t=>{const trip=trips.find(tr=>tr.id===t.tripId);const days=daysLeft(t.due);return(<Card key={t.id} style={{padding:14,display:"flex",alignItems:"flex-start",gap:12}}><input type="checkbox" checked={t.done} onChange={()=>toggleDone(t.id)} style={{marginTop:3,cursor:"pointer",width:16,height:16}}/><div style={{flex:1}}><div style={{fontWeight:500,fontSize:14,color:C.t1}}>{t.title}</div><div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,flexWrap:"wrap"}}><Badge bg={priColors[t.priority]?.bg} text={priColors[t.priority]?.text}>{t.priority}</Badge>{trip&&<span style={{fontSize:11,color:C.t2}}>{flags[trip.country]||"🌍"} {trip.destination}</span>}{t.due&&<span style={{fontSize:11,color:days!==null&&days<3?C.red:C.t3}}>{days!==null&&days<0?"⚠ vencida":days===0?"hoy":`${days} días`}</span>}<span style={{fontSize:11,color:C.t3}}>👤 {t.assignee}</span></div></div></Card>);})}
          {done.length>0&&<div style={{fontSize:12,fontWeight:600,color:C.t2,textTransform:"uppercase",letterSpacing:".05em",marginTop:8,marginBottom:4}}>Completadas</div>}
          {done.map(t=><Card key={t.id} style={{padding:14,display:"flex",alignItems:"center",gap:12,opacity:.6}}><input type="checkbox" checked={t.done} onChange={()=>toggleDone(t.id)} style={{cursor:"pointer",width:16,height:16}}/><div style={{textDecoration:"line-through",color:C.t3,fontSize:13}}>{t.title}</div></Card>)}
        </div>
        <Card><div style={{fontSize:15,fontWeight:600,color:C.t1,marginBottom:16}}>Nueva tarea</div><div style={{display:"flex",flexDirection:"column",gap:12}}><FInput required label="Tarea" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Ej: Confirmar hotel..."/><FSelect label="Viaje asociado" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/><FInput label="Fecha límite" type="date" value={form.due} onChange={v=>setForm(f=>({...f,due:v}))}/><FSelect label="Prioridad" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={[{value:"Alta",label:"🔴 Alta"},{value:"Media",label:"🟡 Media"},{value:"Baja",label:"🟢 Baja"}]}/><FSelect label="Responsable" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))} options={INIT.team.map(u=>({value:u.name,label:u.name}))}/><Btn onClick={addTask}>Agregar tarea</Btn></div></Card>
      </div>
    </div>
  );
}

function Documentos({data}){
  const {trips,passengers}=data;
  const pendingAmount=(p)=>{const t=trips.find(tr=>tr.id===p.tripId);return(t?.price||0)-p.amountPaid;};
  const printList=(tripId)=>{
    const trip=trips.find(t=>t.id===tripId);const pax=passengers.filter(p=>p.tripId===tripId);
    const win=window.open("","_blank");
    win.document.write(`<html><head><title>${trip?.destination}</title><style>body{font-family:Arial,sans-serif;padding:24px;font-size:12px}h1{font-size:16px}table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border:1px solid #ddd;padding:7px;text-align:left}th{background:#f5f5f5;font-weight:600;font-size:11px}tr:nth-child(even){background:#fafafa}@media print{button{display:none}}</style></head><body>
    <button onclick="window.print()" style="margin-bottom:14px;padding:8px 18px;background:#2563EB;color:white;border:none;border-radius:6px;cursor:pointer">🖨️ Imprimir</button>
    <h1>📋 ${trip?.destination||tripId}</h1><p style="color:#666;font-size:11px">Salida: ${dateStr(trip?.departure)} · ${pax.length} pasajeros · ${new Date().toLocaleString("es-AR")}</p>
    <table><tr><th>#</th><th>Nombre</th><th>DNI</th><th>Teléfono</th><th>Asiento</th><th>Pago</th><th>Pagado</th><th>Saldo</th><th>DNI✓</th><th>Pago✓</th><th>Seguro✓</th><th>Contrato✓</th><th>Emergencia</th><th>Notas</th></tr>
    ${pax.map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p.fullName}</strong></td><td>${p.dni||"⚠ FALTA"}</td><td>${p.phone||"-"}</td><td style="text-align:center">${p.seat||"-"}</td><td>${p.payment}</td><td>$${p.amountPaid}</td><td style="color:${pendingAmount(p)>0?"red":"green"}">${pendingAmount(p)>0?"$"+pendingAmount(p):"✓"}</td><td style="text-align:center">${p.checklist?.dni?"✓":""}</td><td style="text-align:center">${p.checklist?.pago?"✓":""}</td><td style="text-align:center">${p.checklist?.seguro?"✓":""}</td><td style="text-align:center">${p.checklist?.contrato?"✓":""}</td><td>${p.emergency||"-"}</td><td>${p.notes||"-"}</td></tr>`).join("")}
    </table></body></html>`);win.document.close();
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div><h2 style={{fontSize:22,fontWeight:700,color:C.t1,marginBottom:4}}>Documentos</h2><p style={{fontSize:13,color:C.t2}}>Manifiestos, listas imprimibles y checklists</p></div>
      <Card>
        <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:16}}>Lista de pasajeros por viaje</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {trips.map(t=>{const pax=passengers.filter(p=>p.tripId===t.id);const sinDni=pax.filter(p=>!p.dni).length;const sinPagar=pax.filter(p=>p.payment!=="Pagado").length;return(<div key={t.id} style={{padding:16,border:`1px solid ${C.border}`,borderRadius:10}}><div style={{fontWeight:500,fontSize:13,color:C.t1,marginBottom:4}}>{flags[t.country]||"🌍"} {t.destination}</div><div style={{fontSize:11,color:C.t3,marginBottom:6}}>{dateStr(t.departure)} · {pax.length} pasajeros</div>{sinDni>0&&<div style={{fontSize:11,color:C.red,marginBottom:4}}>⚠️ {sinDni} sin DNI</div>}{sinPagar>0&&<div style={{fontSize:11,color:C.yel,marginBottom:8}}>💰 {sinPagar} pago pendiente</div>}<Btn size="sm" onClick={()=>printList(t.id)} disabled={pax.length===0}>🖨️ Imprimir lista</Btn></div>);})}
        </div>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:600,color:C.t1,marginBottom:14}}>Checklist operativo por viaje</div>
        {trips.map(t=>(
          <div key={t.id} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontWeight:500,fontSize:13,color:C.t1,marginBottom:8}}>{flags[t.country]||"🌍"} {t.destination} — {dateStr(t.departure)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:6}}>
              {["Bus confirmado","Hotel reservado","Seguro de viaje","Lista de pasajeros","Guía asignado","Itinerario enviado","Cobros completos","Documentación OK","Pasaportes verificados","Seguro contratado"].map(item=><label key={item} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.t2,cursor:"pointer"}}><input type="checkbox" style={{width:14,height:14}}/>{item}</label>)}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Login({onLogin}){
  const [pass,setPass]=useState("");const [error,setError]=useState(false);const [show,setShow]=useState(false);
  const handle=()=>{if(pass==="JuanLucasalmundo26"){localStorage.setItem("orbita_auth","1");onLogin();}else{setError(true);setTimeout(()=>setError(false),2000);}};
  return(
    <div style={{minHeight:"100vh",background:"#0F1117",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,-apple-system,sans-serif",padding:20}}>
      <div style={{background:"#1A1D27",border:"1px solid #2A2D3E",borderRadius:16,padding:40,width:"100%",maxWidth:360,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>🌍</div>
        <div style={{fontSize:22,fontWeight:800,color:"#FFFFFF",letterSpacing:"-.04em",marginBottom:4}}>ÓRBITA TRAVEL</div>
        <div style={{fontSize:12,color:"#9A9CAD",marginBottom:32,textTransform:"uppercase",letterSpacing:".06em"}}>Acceso privado · Uso interno</div>
        <div style={{position:"relative",marginBottom:16}}>
          <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="Contraseña" style={{width:"100%",padding:"12px 44px 12px 16px",background:"#0F1117",border:`1px solid ${error?"#DC2626":"#2A2D3E"}`,borderRadius:8,fontSize:14,color:"#FFFFFF",outline:"none",boxSizing:"border-box"}}/>
          <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#9A9CAD"}}>{show?"🙈":"👁️"}</button>
        </div>
        {error&&<div style={{fontSize:12,color:"#DC2626",marginBottom:12}}>Contraseña incorrecta</div>}
        <button onClick={handle} style={{width:"100%",padding:12,background:"#2563EB",color:"#fff",border:"none",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer"}}>Ingresar →</button>
        <div style={{fontSize:11,color:"#333",marginTop:20}}>Órbita Travel · Sistema interno</div>
      </div>
    </div>
  );
}

export default function OrbitaTravel(){
  const [active,setActive]=useState("dashboard");
  const [data,setData]=useState(INIT);
  const [auth,setAuth]=useState(!!localStorage.getItem("orbita_auth"));
  const alertas=useMemo(()=>generarAlertas(data),[data]);

  useEffect(()=>{
    window.__orbitaReset=(secciones)=>{
      const all=secciones.includes("todo");
      setData(d=>({...d,
        trips:all||secciones.includes("viajes")?[]:d.trips,
        passengers:all||secciones.includes("pasajeros")?[]:d.passengers,
        sales:all||secciones.includes("ventas")?[]:d.sales,
        expenses:all||secciones.includes("gastos")?[]:d.expenses,
        tasks:all||secciones.includes("tareas")?[]:d.tasks,
      }));
    };
  },[]);

  if(!auth) return <Login onLogin={()=>setAuth(true)}/>;

  const screens={
    dashboard:<Dashboard data={data} alertas={alertas} onNav={setActive}/>,
    viajes:<Viajes data={data} setData={setData}/>,
    pasajeros:<Pasajeros data={data} setData={setData}/>,
    ventas:<Ventas data={data} setData={setData}/>,
    gastos:<Gastos data={data} setData={setData}/>,
    proveedores:<Proveedores data={data} setData={setData}/>,
    rentabilidad:<Rentabilidad data={data}/>,
    tareas:<Tareas data={data} setData={setData}/>,
    documentos:<Documentos data={data}/>,
  };

  return(
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",background:C.bg,minHeight:"100vh",display:"flex"}}>
      <Sidebar active={active} setActive={setActive} alertas={alertas}/>
      <div style={{marginLeft:220,flex:1,padding:28,minWidth:0}}>
        {screens[active]}
      </div>
      <style>{`@media(max-width:768px){body .main-wrap{margin-left:0!important;padding:16px!important}input,select,textarea{font-size:16px!important}}*{-webkit-tap-highlight-color:transparent;box-sizing:border-box}`}</style>
    </div>
  );
}
