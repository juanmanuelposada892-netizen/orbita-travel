
import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════
//  ORBITA TRAVEL — Sistema Operativo para Agencias
// ═══════════════════════════════════════════════════════

// ── COLORES ──────────────────────────────────────────
const C = {
  bg: "#F8F7F4",
  panel: "#FFFFFF",
  sidebar: "#0F1117",
  sideText: "#9A9CAD",
  sideActive: "#FFFFFF",
  accent: "#2563EB",
  accentL: "#EFF6FF",
  accentD: "#1D4ED8",
  grn: "#16A34A",
  grnL: "#F0FDF4",
  red: "#DC2626",
  redL: "#FEF2F2",
  yel: "#D97706",
  yelL: "#FFFBEB",
  border: "#E5E7EB",
  t1: "#111827",
  t2: "#6B7280",
  t3: "#9CA3AF",
};

// ── DATOS INICIALES ───────────────────────────────────
const INIT = {
  trips: [
    { id:"T-001", destination:"Bolivia Tour de Compras", country:"BO", type:"nacional", departure:"2026-05-28", returnDate:"2026-05-31", capacity:58, sold:31, price:180, status:"En venta", supplierId:"S-001", hotelCost:420, extrasCost:180, notes:"Público emprendedor. Salida fin de mes.", minPax:20, guide:"Carlos Medina", insurance:true },
    { id:"T-002", destination:"Cataratas del Iguazú", country:"AR", type:"nacional", departure:"2026-06-19", returnDate:"2026-06-22", capacity:45, sold:14, price:260, status:"Planificación", supplierId:"S-002", hotelCost:820, extrasCost:250, notes:"Ideal fin de semana largo.", minPax:25, guide:"Sin asignar", insurance:true },
    { id:"T-003", destination:"Machu Picchu + Cusco", country:"PE", type:"internacional", departure:"2026-07-15", returnDate:"2026-07-22", capacity:30, sold:8, price:890, status:"Planificación", supplierId:"S-001", hotelCost:2400, extrasCost:600, notes:"Requiere pasaporte vigente.", minPax:15, guide:"Ana Torres", insurance:true },
    { id:"T-004", destination:"Río de Janeiro Carnaval", country:"BR", type:"internacional", departure:"2027-02-26", returnDate:"2027-03-04", capacity:40, sold:22, price:650, status:"En venta", supplierId:"S-002", hotelCost:1800, extrasCost:400, notes:"Alta demanda. Cupos limitados.", minPax:20, guide:"Sin asignar", insurance:true },
  ],
  passengers: [
    { id:"P-001", fullName:"María Gómez", dni:"30111222", phone:"+54 3541 000001", email:"maria@email.com", tripId:"T-001", payment:"Pagado", amountPaid:180, seat:"12", emergency:"Juan Gómez +54 3541 111", notes:"" },
    { id:"P-002", fullName:"José Ruiz", dni:"28999111", phone:"+54 3541 000002", email:"jose@email.com", tripId:"T-001", payment:"Seña", amountPaid:90, seat:"13", emergency:"", notes:"Paga resto el 15/05" },
    { id:"P-003", fullName:"Luciana Pérez", dni:"33222999", phone:"+54 3541 000003", email:"luci@email.com", tripId:"T-002", payment:"Pendiente", amountPaid:0, seat:"7", emergency:"", notes:"" },
    { id:"P-004", fullName:"Roberto Díaz", dni:"25888777", phone:"+54 3541 000004", email:"rob@email.com", tripId:"T-003", payment:"Pagado", amountPaid:890, seat:"3", emergency:"Silvia Díaz +54 3541 222", notes:"Alérgico al mariscos" },
    { id:"P-005", fullName:"Valeria Torres", dni:"31444555", phone:"+54 3541 000005", email:"vale@email.com", tripId:"T-004", payment:"Seña", amountPaid:325, seat:"8", emergency:"", notes:"" },
  ],
  sales: [
    { id:"V-001", date:"2026-04-19", channel:"Instagram", seller:"Juan", amount:180, tripId:"T-001", concept:"Asiento completo" },
    { id:"V-002", date:"2026-04-19", channel:"Ads", seller:"Juan", amount:90, tripId:"T-001", concept:"Seña 50%" },
    { id:"V-003", date:"2026-04-20", channel:"Referido", seller:"Lucas", amount:890, tripId:"T-003", concept:"Asiento completo" },
    { id:"V-004", date:"2026-04-21", channel:"WhatsApp", seller:"Juan", amount:325, tripId:"T-004", concept:"Seña 50%" },
  ],
  suppliers: [
    { id:"S-001", company:"Bus Córdoba SRL", contact:"Carlos Medina", phone:"+54 351 111111", email:"bus@cordoba.com", busCost:3200, type:"bus", availability:"Disponible", rating:5, notes:"Muy puntual. Unidad nueva." },
    { id:"S-002", company:"TurSur Transporte", contact:"Natalia Ríos", phone:"+54 351 222222", email:"tursur@email.com", busCost:4100, type:"bus", availability:"Consultar", rating:4, notes:"" },
    { id:"S-003", company:"Hotel Paraíso", contact:"Mario Vega", phone:"+54 351 333333", email:"hotel@paraiso.com", busCost:0, type:"hotel", availability:"Disponible", rating:5, notes:"Desayuno incluido" },
    { id:"S-004", company:"Seguros Viajeros SA", contact:"Ana Suárez", phone:"+54 11 444444", email:"info@seguros.com", busCost:0, type:"seguro", availability:"Disponible", rating:5, notes:"Cobertura internacional" },
  ],
  expenses: [
    { id:"E-001", date:"2026-04-15", concept:"Publicidad Meta Ads", category:"Marketing", amount:120, tripId:"T-001" },
    { id:"E-002", date:"2026-04-18", concept:"Impresión folletería", category:"Marketing", amount:45, tripId:"" },
    { id:"E-003", date:"2026-04-20", concept:"Combustible proveedor", category:"Operativo", amount:80, tripId:"T-002" },
  ],
  tasks: [
    { id:"TK-001", title:"Confirmar hotel Bolivia", tripId:"T-001", due:"2026-05-01", done:false, priority:"Alta", assignee:"Juan" },
    { id:"TK-002", title:"Publicar Story Iguazú", tripId:"T-002", due:"2026-04-25", done:true, priority:"Media", assignee:"Juan" },
    { id:"TK-003", title:"Verificar pasaportes Machu Picchu", tripId:"T-003", due:"2026-06-15", done:false, priority:"Alta", assignee:"Lucas" },
    { id:"TK-004", title:"Cobrar saldo José Ruiz", tripId:"T-001", due:"2026-05-15", done:false, priority:"Alta", assignee:"Juan" },
  ],
  team: [
    { id:"U-001", name:"Juan", role:"Marketing y ventas", avatar:"J", color:"#2563EB" },
    { id:"U-002", name:"Lucas", role:"Operaciones", avatar:"L", color:"#16A34A" },
  ],
};

// ── HELPERS ───────────────────────────────────────────
const usd = (v) => `$${Number(v||0).toLocaleString("es-AR",{maximumFractionDigits:0})}`;
const dateStr = (d) => d ? new Date(d+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"}) : "-";
const daysLeft = (d) => { if(!d) return null; const diff = Math.ceil((new Date(d+"T12:00:00") - new Date()) / 86400000); return diff; };
const flags = { AR:"🇦🇷", BO:"🇧🇴", BR:"🇧🇷", PE:"🇵🇪", CL:"🇨🇱", UY:"🇺🇾", CO:"🇨🇴", MX:"🇲🇽", US:"🇺🇸", EU:"🇪🇺" };

const STATUS_COLOR = {
  "En venta": { bg:"#F0FDF4", text:"#16A34A", dot:"#16A34A" },
  "Planificación": { bg:"#EFF6FF", text:"#2563EB", dot:"#2563EB" },
  "Completo": { bg:"#F9FAFB", text:"#6B7280", dot:"#9CA3AF" },
  "Cancelado": { bg:"#FEF2F2", text:"#DC2626", dot:"#DC2626" },
};

const PAY_COLOR = {
  "Pagado": { bg:"#F0FDF4", text:"#16A34A" },
  "Seña": { bg:"#FFFBEB", text:"#D97706" },
  "Pendiente": { bg:"#FEF2F2", text:"#DC2626" },
};

// ── COMPONENTES BASE ──────────────────────────────────
function Badge({ children, bg, text }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:100, background:bg, color:text, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Card({ children, style={} }) {
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:14, padding:24, ...style }}>
      {children}
    </div>
  );
}

function Input({ label, type="text", value, onChange, placeholder="", style={} }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      {label && <label style={{ fontSize:12, fontWeight:500, color:C.t2 }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ padding:"9px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.t1, outline:"none", background:"#FAFAFA", width:"100%", ...style }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options=[] }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      {label && <label style={{ fontSize:12, fontWeight:500, color:C.t2 }}>{label}</label>}
      <select
        value={value}
        onChange={e=>onChange(e.target.value)}
        style={{ padding:"9px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.t1, outline:"none", background:"#FAFAFA", width:"100%" }}
      >
        <option value="">Seleccionar...</option>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false }) {
  const styles = {
    primary: { background:C.accent, color:"#fff", border:"none" },
    secondary: { background:"transparent", color:C.t1, border:`1px solid ${C.border}` },
    danger: { background:C.red, color:"#fff", border:"none" },
    ghost: { background:"transparent", color:C.t2, border:"none" },
    success: { background:C.grn, color:"#fff", border:"none" },
  };
  const sizes = { sm:"6px 12px", md:"9px 18px", lg:"12px 28px" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles[variant], padding:sizes[size], borderRadius:8, fontSize:13, fontWeight:500, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, display:"inline-flex", alignItems:"center", gap:6, transition:"all .15s" }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, color=C.accent, icon }) {
  return (
    <Card style={{ padding:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:12, color:C.t2, fontWeight:500, marginBottom:6 }}>{label}</div>
          <div style={{ fontSize:26, fontWeight:700, color:C.t1, lineHeight:1 }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:C.t3, marginTop:6 }}>{sub}</div>}
        </div>
        <div style={{ width:40, height:40, background:`${color}18`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
      </div>
    </Card>
  );
}

function Table({ headers=[], rows=[] }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ borderBottom:`2px solid ${C.border}` }}>
            {headers.map((h,i)=>(
              <th key={i} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, fontWeight:600, color:C.t2, textTransform:"uppercase", letterSpacing:".05em", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, transition:"background .1s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              {row.map((cell,j)=>(
                <td key={j} style={{ padding:"12px 12px", color:C.t1, whiteSpace:"nowrap" }}>{cell}</td>
              ))}
            </tr>
          ))}
          {rows.length===0 && (
            <tr><td colSpan={headers.length} style={{ padding:32, textAlign:"center", color:C.t3, fontSize:13 }}>Sin datos</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProgressBar({ pct, color=C.accent }) {
  return (
    <div style={{ height:6, background:C.border, borderRadius:100, overflow:"hidden", width:"100%" }}>
      <div style={{ height:"100%", width:`${Math.min(100,pct)}%`, background:color, borderRadius:100, transition:"width .4s ease" }}/>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:"🏠", label:"Dashboard" },
  { id:"viajes", icon:"✈️", label:"Viajes" },
  { id:"pasajeros", icon:"👥", label:"Pasajeros" },
  { id:"ventas", icon:"💳", label:"Ventas" },
  { id:"gastos", icon:"📊", label:"Gastos" },
  { id:"proveedores", icon:"🚌", label:"Proveedores" },
  { id:"rentabilidad", icon:"💰", label:"Rentabilidad" },
  { id:"tareas", icon:"✅", label:"Tareas" },
  { id:"documentos", icon:"📄", label:"Documentos" },
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{ background:C.sidebar, width:220, minHeight:"100vh", padding:"20px 12px", display:"flex", flexDirection:"column", gap:4, position:"fixed", top:0, left:0, bottom:0, zIndex:100 }}>
      <div style={{ padding:"12px 10px 24px" }}>
        <div style={{ fontSize:20, fontWeight:800, color:"#FFFFFF", letterSpacing:"-.04em", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:28, height:28, background:C.accent, borderRadius:7, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🌍</span>
          ÓRBITA
        </div>
        <div style={{ fontSize:10, color:C.sideText, marginTop:3, letterSpacing:".06em", textTransform:"uppercase" }}>Travel Management</div>
      </div>

      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setActive(n.id)}
          style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer", transition:"all .15s", fontSize:13, fontWeight:500, background:active===n.id?"#1D2230":"transparent", color:active===n.id?C.sideActive:C.sideText, width:"100%", textAlign:"left" }}
        >
          <span style={{ fontSize:16 }}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div style={{ marginTop:"auto", padding:"16px 10px 8px", borderTop:"1px solid #1D2230" }}>
        <div style={{ fontSize:11, color:C.sideText, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>Equipo</div>
        {INIT.team.map(u=>(
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>{u.avatar}</div>
            <div>
              <div style={{ fontSize:12, color:"#E5E7EB", fontWeight:500 }}>{u.name}</div>
              <div style={{ fontSize:10, color:C.sideText }}>{u.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────
function Dashboard({ data }) {
  const { trips, passengers, sales, expenses } = data;
  
  const enriched = trips.map(t => {
    const sup = data.suppliers.find(s=>s.id===t.supplierId);
    const rev = t.sold * t.price;
    const cost = (sup?.busCost||0) + t.hotelCost + t.extrasCost;
    const profit = rev - cost;
    const occ = t.capacity ? Math.round(t.sold/t.capacity*100) : 0;
    return { ...t, sup, rev, cost, profit, occ };
  });

  const totalRev = enriched.reduce((a,t)=>a+t.rev,0);
  const totalCost = enriched.reduce((a,t)=>a+t.cost,0);
  const totalExp = expenses.reduce((a,e)=>a+e.amount,0);
  const totalProfit = totalRev - totalCost - totalExp;
  const paxPagados = passengers.filter(p=>p.payment==="Pagado").length;
  const paxPendientes = passengers.filter(p=>p.payment==="Pendiente").length;
  const pendingAmount = passengers.filter(p=>p.payment!=="Pagado").reduce((a,p)=>{
    const trip = trips.find(t=>t.id===p.tripId);
    return a + (trip?.price||0) - p.amountPaid;
  },0);

  const upcomingTrips = [...enriched].sort((a,b)=>new Date(a.departure)-new Date(b.departure)).slice(0,3);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Dashboard</h2>
        <p style={{ fontSize:13, color:C.t2 }}>Visión general de tu agencia · {new Date().toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard label="Viajes activos" value={trips.filter(t=>t.status!=="Cancelado").length} sub="nacionales e internacionales" color={C.accent} icon="✈️"/>
        <StatCard label="Pasajeros totales" value={passengers.length} sub={`${paxPagados} pagados · ${paxPendientes} pendientes`} color={C.grn} icon="👥"/>
        <StatCard label="Ingresos proyectados" value={usd(totalRev)} sub="asientos vendidos" color={C.accent} icon="💵"/>
        <StatCard label="Costos totales" value={usd(totalCost+totalExp)} sub="bus + hotel + extras + gastos" color={C.yel} icon="📊"/>
        <StatCard label="Ganancia neta" value={usd(totalProfit)} sub="resultado proyectado" color={totalProfit>0?C.grn:C.red} icon="💰"/>
        <StatCard label="Cobros pendientes" value={usd(pendingAmount)} sub="señas y pagos incompletos" color={C.red} icon="⏳"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:16 }}>Próximos viajes</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {upcomingTrips.map(t=>{
              const days = daysLeft(t.departure);
              return (
                <div key={t.id} style={{ padding:14, background:C.bg, borderRadius:10, border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ fontWeight:600, fontSize:13, color:C.t1 }}>{flags[t.country]||"🌍"} {t.destination}</div>
                    <Badge bg={STATUS_COLOR[t.status]?.bg} text={STATUS_COLOR[t.status]?.text}>{t.status}</Badge>
                  </div>
                  <div style={{ fontSize:12, color:C.t2, marginBottom:8 }}>{dateStr(t.departure)} — {dateStr(t.returnDate)}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/>
                    <span style={{ fontSize:11, color:C.t2, whiteSpace:"nowrap" }}>{t.sold}/{t.capacity}</span>
                  </div>
                  {days!==null && <div style={{ fontSize:11, color:days<30?C.red:C.t3 }}>⏱ {days>0?`en ${days} días`:"hoy"}</div>}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:16 }}>Rentabilidad por viaje</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {enriched.map(t=>(
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:500, color:C.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{flags[t.country]||"🌍"} {t.destination}</div>
                  <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>{usd(t.rev)} ingresos · {usd(t.cost)} costos</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:t.profit>0?C.grn:C.red, whiteSpace:"nowrap" }}>{usd(t.profit)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:14 }}>Estado de pasajeros</div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { label:"Pagado completo", val:passengers.filter(p=>p.payment==="Pagado").length, color:C.grn },
              { label:"Con seña", val:passengers.filter(p=>p.payment==="Seña").length, color:C.yel },
              { label:"Pendiente", val:passengers.filter(p=>p.payment==="Pendiente").length, color:C.red },
            ].map(s=>(
              <div key={s.label} style={{ flex:1, padding:14, background:s.color+"12", borderRadius:10, textAlign:"center", minWidth:80 }}>
                <div style={{ fontSize:24, fontWeight:700, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:11, color:s.color, marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:14 }}>Ventas por canal</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {["Instagram","Ads","WhatsApp","Referido","Oficina"].map(canal=>{
              const total = sales.filter(s=>s.channel===canal).reduce((a,s)=>a+s.amount,0);
              const max = Math.max(...["Instagram","Ads","WhatsApp","Referido","Oficina"].map(c=>sales.filter(s=>s.channel===c).reduce((a,s)=>a+s.amount,0)));
              return (
                <div key={canal} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontSize:12, color:C.t2, width:80 }}>{canal}</div>
                  <div style={{ flex:1 }}><ProgressBar pct={max?total/max*100:0}/></div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.t1, width:70, textAlign:"right" }}>{usd(total)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── VIAJES ────────────────────────────────────────────
function Viajes({ data, setData }) {
  const { trips, suppliers } = data;
  const [form, setForm] = useState({ destination:"", country:"AR", type:"nacional", departure:"", returnDate:"", capacity:"45", price:"", supplierId:"", hotelCost:"0", extrasCost:"0", notes:"", minPax:"20", guide:"", insurance:true });
  const [view, setView] = useState("lista");
  const [selected, setSelected] = useState(null);

  const enriched = trips.map(t=>{
    const sup = suppliers.find(s=>s.id===t.supplierId);
    const rev = t.sold * t.price;
    const cost = (sup?.busCost||0) + t.hotelCost + t.extrasCost;
    const profit = rev - cost;
    const occ = t.capacity ? Math.round(t.sold/t.capacity*100) : 0;
    const days = daysLeft(t.departure);
    return { ...t, sup, rev, cost, profit, occ, days };
  });

  const addTrip = () => {
    if(!form.destination||!form.departure||!form.returnDate||!form.price||!form.supplierId) return;
    const newTrip = {
      id:`T-${String(trips.length+1).padStart(3,"0")}`,
      destination:form.destination, country:form.country, type:form.type,
      departure:form.departure, returnDate:form.returnDate,
      capacity:Number(form.capacity), sold:0, price:Number(form.price),
      status:"Planificación", supplierId:form.supplierId,
      hotelCost:Number(form.hotelCost||0), extrasCost:Number(form.extrasCost||0),
      notes:form.notes, minPax:Number(form.minPax||0), guide:form.guide||"Sin asignar", insurance:form.insurance,
    };
    setData(d=>({...d, trips:[newTrip,...d.trips]}));
    setForm({ destination:"", country:"AR", type:"nacional", departure:"", returnDate:"", capacity:"45", price:"", supplierId:"", hotelCost:"0", extrasCost:"0", notes:"", minPax:"20", guide:"", insurance:true });
  };

  const updateStatus = (id, status) => {
    setData(d=>({...d, trips:d.trips.map(t=>t.id===id?{...t,status}:t)}));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Viajes</h2>
          <p style={{ fontSize:13, color:C.t2 }}>{trips.length} viajes · {trips.filter(t=>t.type==="internacional").length} internacionales</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Btn variant={view==="lista"?"primary":"secondary"} onClick={()=>setView("lista")} size="sm">Lista</Btn>
          <Btn variant={view==="nuevo"?"primary":"secondary"} onClick={()=>setView("nuevo")} size="sm">+ Nuevo viaje</Btn>
        </div>
      </div>

      {view==="nuevo" && (
        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:18 }}>Nuevo viaje</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Input label="Destino" value={form.destination} onChange={v=>setForm(f=>({...f,destination:v}))} placeholder="Ej: Machu Picchu, Bolivia, Río de Janeiro"/>
            </div>
            <Select label="País destino" value={form.country} onChange={v=>setForm(f=>({...f,country:v}))} options={[
              {value:"AR",label:"🇦🇷 Argentina"},{value:"BO",label:"🇧🇴 Bolivia"},{value:"BR",label:"🇧🇷 Brasil"},
              {value:"PE",label:"🇵🇪 Perú"},{value:"CL",label:"🇨🇱 Chile"},{value:"UY",label:"🇺🇾 Uruguay"},
              {value:"CO",label:"🇨🇴 Colombia"},{value:"MX",label:"🇲🇽 México"},{value:"US",label:"🇺🇸 EEUU"},{value:"EU",label:"🇪🇺 Europa"},
            ]}/>
            <Select label="Tipo" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={[{value:"nacional",label:"Nacional"},{value:"internacional",label:"Internacional"}]}/>
            <Input label="Fecha salida" type="date" value={form.departure} onChange={v=>setForm(f=>({...f,departure:v}))}/>
            <Input label="Fecha regreso" type="date" value={form.returnDate} onChange={v=>setForm(f=>({...f,returnDate:v}))}/>
            <Input label="Capacidad bus" type="number" value={form.capacity} onChange={v=>setForm(f=>({...f,capacity:v}))}/>
            <Input label="Precio por asiento (USD)" type="number" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))} placeholder="180"/>
            <Input label="Mínimo de pasajeros" type="number" value={form.minPax} onChange={v=>setForm(f=>({...f,minPax:v}))}/>
            <Select label="Proveedor de bus" value={form.supplierId} onChange={v=>setForm(f=>({...f,supplierId:v}))} options={suppliers.filter(s=>s.type==="bus").map(s=>({value:s.id,label:s.company}))}/>
            <Input label="Guía asignado" value={form.guide} onChange={v=>setForm(f=>({...f,guide:v}))} placeholder="Nombre del guía"/>
            <Input label="Costo hotel (USD)" type="number" value={form.hotelCost} onChange={v=>setForm(f=>({...f,hotelCost:v}))}/>
            <Input label="Extras / imprevistos (USD)" type="number" value={form.extrasCost} onChange={v=>setForm(f=>({...f,extrasCost:v}))}/>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:500, color:C.t2, display:"block", marginBottom:5 }}>Notas</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Público, condiciones, feriados, requisitos..." style={{ width:"100%", padding:"9px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.t1, minHeight:72, resize:"vertical", outline:"none", background:"#FAFAFA" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            <Btn onClick={addTrip}>Crear viaje</Btn>
            <Btn variant="secondary" onClick={()=>setView("lista")}>Cancelar</Btn>
          </div>
        </Card>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {enriched.map(t=>(
          <Card key={t.id} style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div style={{ fontSize:22 }}>{flags[t.country]||"🌍"}</div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontWeight:600, fontSize:15, color:C.t1 }}>{t.destination}</div>
                <div style={{ fontSize:12, color:C.t2, marginTop:2 }}>{dateStr(t.departure)} → {dateStr(t.returnDate)} · {t.type} {t.days!==null&&<span style={{ color:t.days<14?C.red:C.t3 }}>· {t.days>0?`en ${t.days} días`:"hoy"}</span>}</div>
              </div>
              <Badge bg={STATUS_COLOR[t.status]?.bg} text={STATUS_COLOR[t.status]?.text}>{t.status}</Badge>
              <select value={t.status} onChange={e=>updateStatus(t.id,e.target.value)} style={{ padding:"5px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, color:C.t2, background:"#FAFAFA" }}>
                {["Planificación","En venta","Completo","Cancelado"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:16 }}>
              <div>
                <div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Ocupación</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginTop:3 }}>{t.sold}/{t.capacity}</div>
                <ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/>
                <div style={{ fontSize:11, color:C.t3, marginTop:3 }}>{t.occ}% · faltan {t.capacity-t.sold}</div>
              </div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Precio/asiento</div><div style={{ fontSize:15, fontWeight:600, color:C.t1, marginTop:3 }}>{usd(t.price)}</div></div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Ingresos</div><div style={{ fontSize:15, fontWeight:600, color:C.t1, marginTop:3 }}>{usd(t.rev)}</div></div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Costos</div><div style={{ fontSize:15, fontWeight:600, color:C.yel, marginTop:3 }}>{usd(t.cost)}</div></div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Ganancia</div><div style={{ fontSize:15, fontWeight:700, color:t.profit>0?C.grn:C.red, marginTop:3 }}>{usd(t.profit)}</div></div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Guía</div><div style={{ fontSize:13, color:C.t2, marginTop:3 }}>{t.guide}</div></div>
              <div><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Proveedor</div><div style={{ fontSize:13, color:C.t2, marginTop:3 }}>{t.sup?.company||"-"}</div></div>
              {t.notes&&<div style={{ gridColumn:"1/-1" }}><div style={{ fontSize:11, color:C.t3, textTransform:"uppercase", letterSpacing:".05em" }}>Notas</div><div style={{ fontSize:12, color:C.t2, marginTop:3 }}>{t.notes}</div></div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── PASAJEROS ─────────────────────────────────────────
function Pasajeros({ data, setData }) {
  const { passengers, trips } = data;
  const [form, setForm] = useState({ fullName:"", dni:"", phone:"", email:"", tripId:"", payment:"Pendiente", amountPaid:"0", seat:"", emergency:"", notes:"" });
  const [filter, setFilter] = useState({ trip:"", payment:"", search:"" });
  const [showForm, setShowForm] = useState(false);

  const filtered = passengers.filter(p=>{
    const trip = trips.find(t=>t.id===p.tripId);
    const match = !filter.search || p.fullName.toLowerCase().includes(filter.search.toLowerCase()) || p.dni.includes(filter.search);
    return (!filter.trip || p.tripId===filter.trip) && (!filter.payment || p.payment===filter.payment) && match;
  });

  const addPassenger = () => {
    if(!form.fullName||!form.tripId) return;
    const newP = { id:`P-${String(passengers.length+1).padStart(3,"0")}`, ...form, amountPaid:Number(form.amountPaid||0) };
    setData(d=>({
      ...d,
      passengers:[newP,...d.passengers],
      trips:d.trips.map(t=>t.id===form.tripId?{...t,sold:t.sold+1}:t)
    }));
    setForm({ fullName:"", dni:"", phone:"", email:"", tripId:"", payment:"Pendiente", amountPaid:"0", seat:"", emergency:"", notes:"" });
    setShowForm(false);
  };

  const pendingAmount = (p) => {
    const trip = trips.find(t=>t.id===p.tripId);
    return (trip?.price||0) - p.amountPaid;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Pasajeros</h2>
          <p style={{ fontSize:13, color:C.t2 }}>{passengers.length} registrados</p>
        </div>
        <Btn onClick={()=>setShowForm(s=>!s)}>+ Nuevo pasajero</Btn>
      </div>

      <Card style={{ padding:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 200px", gap:10 }}>
          <Input placeholder="Buscar por nombre o DNI..." value={filter.search} onChange={v=>setFilter(f=>({...f,search:v}))}/>
          <Select value={filter.trip} onChange={v=>setFilter(f=>({...f,trip:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
          <Select value={filter.payment} onChange={v=>setFilter(f=>({...f,payment:v}))} options={[{value:"Pagado",label:"Pagado"},{value:"Seña",label:"Seña"},{value:"Pendiente",label:"Pendiente"}]}/>
        </div>
      </Card>

      {showForm && (
        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:16 }}>Nuevo pasajero</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Input label="Nombre completo" value={form.fullName} onChange={v=>setForm(f=>({...f,fullName:v}))}/>
            </div>
            <Input label="DNI" value={form.dni} onChange={v=>setForm(f=>({...f,dni:v}))}/>
            <Input label="Teléfono" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))}/>
            <Input label="Email" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/>
            <Select label="Viaje" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
            <Select label="Estado de pago" value={form.payment} onChange={v=>setForm(f=>({...f,payment:v}))} options={[{value:"Pendiente",label:"Pendiente"},{value:"Seña",label:"Seña (50%)"},{value:"Pagado",label:"Pagado completo"}]}/>
            <Input label="Monto pagado (USD)" type="number" value={form.amountPaid} onChange={v=>setForm(f=>({...f,amountPaid:v}))}/>
            <Input label="Asiento Nº" value={form.seat} onChange={v=>setForm(f=>({...f,seat:v}))}/>
            <Input label="Contacto de emergencia" value={form.emergency} onChange={v=>setForm(f=>({...f,emergency:v}))} placeholder="Nombre y teléfono"/>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:500, color:C.t2, display:"block", marginBottom:5 }}>Notas</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Alergias, preferencias, condiciones especiales..." style={{ width:"100%", padding:"9px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.t1, minHeight:60, resize:"vertical", outline:"none", background:"#FAFAFA" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <Btn onClick={addPassenger}>Agregar pasajero</Btn>
            <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}

      <Card style={{ padding:0 }}>
        <Table
          headers={["Pasajero","DNI","Teléfono","Viaje","Asiento","Pago","Monto pagado","Saldo pendiente","Notas"]}
          rows={filtered.map(p=>{
            const trip = trips.find(t=>t.id===p.tripId);
            const pending = pendingAmount(p);
            return [
              <div><div style={{ fontWeight:500 }}>{p.fullName}</div>{p.email&&<div style={{ fontSize:11, color:C.t3 }}>{p.email}</div>}</div>,
              p.dni||"-",
              p.phone||"-",
              <div style={{ fontSize:12 }}>{flags[trip?.country]||"🌍"} {trip?.destination||p.tripId}</div>,
              p.seat||"-",
              <Badge bg={PAY_COLOR[p.payment]?.bg} text={PAY_COLOR[p.payment]?.text}>{p.payment}</Badge>,
              <span style={{ fontWeight:500 }}>{usd(p.amountPaid)}</span>,
              <span style={{ color:pending>0?C.red:C.grn, fontWeight:600 }}>{pending>0?usd(pending):"✓"}</span>,
              <span style={{ fontSize:11, color:C.t3 }}>{p.notes||"-"}</span>,
            ];
          })}
        />
      </Card>
    </div>
  );
}

// ── VENTAS ────────────────────────────────────────────
function Ventas({ data, setData }) {
  const { sales, trips } = data;
  const [form, setForm] = useState({ date:new Date().toISOString().split("T")[0], channel:"Instagram", seller:"Juan", amount:"", tripId:"", concept:"" });

  const addSale = () => {
    if(!form.tripId||!form.amount||!form.date) return;
    const newS = { id:`V-${String(sales.length+1).padStart(3,"0")}`, ...form, amount:Number(form.amount) };
    setData(d=>({...d, sales:[newS,...d.sales]}));
    setForm(f=>({...f, amount:"", concept:"", tripId:"" }));
  };

  const byChannel = ["Instagram","WhatsApp","Ads","Referido","Oficina"].map(ch=>({
    ch, total:sales.filter(s=>s.channel===ch).reduce((a,s)=>a+s.amount,0), count:sales.filter(s=>s.channel===ch).length,
  }));
  const totalSales = sales.reduce((a,s)=>a+s.amount,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Ventas</h2>
        <p style={{ fontSize:13, color:C.t2 }}>{sales.length} transacciones · total {usd(totalSales)}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card style={{ marginBottom:0 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:14 }}>Ventas por canal</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {byChannel.filter(c=>c.total>0).map(c=>(
                <div key={c.ch} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:90, fontSize:12, color:C.t2 }}>{c.ch}</div>
                  <div style={{ flex:1 }}><ProgressBar pct={totalSales?c.total/totalSales*100:0}/></div>
                  <div style={{ fontSize:12, color:C.t1, fontWeight:600, width:60, textAlign:"right" }}>{usd(c.total)}</div>
                  <div style={{ fontSize:11, color:C.t3, width:30, textAlign:"right" }}>{c.count}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:0 }}>
            <Table
              headers={["ID","Fecha","Canal","Vendedor","Viaje","Concepto","Monto"]}
              rows={sales.map(s=>{
                const trip = trips.find(t=>t.id===s.tripId);
                return [
                  <span style={{ fontSize:11, color:C.t3, fontFamily:"monospace" }}>{s.id}</span>,
                  dateStr(s.date),
                  <Badge bg={C.accentL} text={C.accent}>{s.channel}</Badge>,
                  s.seller,
                  <span style={{ fontSize:12 }}>{flags[trip?.country]||"🌍"} {trip?.destination||s.tripId}</span>,
                  <span style={{ fontSize:12, color:C.t2 }}>{s.concept||"-"}</span>,
                  <span style={{ fontWeight:600, color:C.grn }}>{usd(s.amount)}</span>,
                ];
              })}
            />
          </Card>
        </div>

        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:16 }}>Registrar venta</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Fecha" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/>
            <Select label="Canal" value={form.channel} onChange={v=>setForm(f=>({...f,channel:v}))} options={[{value:"Instagram",label:"Instagram"},{value:"WhatsApp",label:"WhatsApp"},{value:"Ads",label:"Ads"},{value:"Referido",label:"Referido"},{value:"Oficina",label:"Oficina"}]}/>
            <Select label="Vendedor" value={form.seller} onChange={v=>setForm(f=>({...f,seller:v}))} options={INIT.team.map(u=>({value:u.name,label:u.name}))}/>
            <Select label="Viaje" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
            <Input label="Concepto" value={form.concept} onChange={v=>setForm(f=>({...f,concept:v}))} placeholder="Asiento completo, seña 50%, etc."/>
            <Input label="Monto (USD)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/>
            <Btn onClick={addSale}>Registrar venta</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── GASTOS ────────────────────────────────────────────
function Gastos({ data, setData }) {
  const { expenses, trips } = data;
  const [form, setForm] = useState({ date:new Date().toISOString().split("T")[0], concept:"", category:"Marketing", amount:"", tripId:"" });

  const CATS = ["Marketing","Operativo","Administrativo","Hospedaje","Transporte","Comisiones","Otros"];

  const addExpense = () => {
    if(!form.concept||!form.amount||!form.date) return;
    const newE = { id:`E-${String(expenses.length+1).padStart(3,"0")}`, ...form, amount:Number(form.amount) };
    setData(d=>({...d, expenses:[newE,...d.expenses]}));
    setForm(f=>({...f, concept:"", amount:"", tripId:"" }));
  };

  const total = expenses.reduce((a,e)=>a+e.amount,0);
  const byCategory = CATS.map(cat=>({ cat, total:expenses.filter(e=>e.category===cat).reduce((a,e)=>a+e.amount,0) })).filter(c=>c.total>0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Gastos operativos</h2>
        <p style={{ fontSize:13, color:C.t2 }}>Total: {usd(total)}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card>
            <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:14 }}>Por categoría</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {byCategory.map(c=>(
                <div key={c.cat} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:120, fontSize:12, color:C.t2 }}>{c.cat}</div>
                  <div style={{ flex:1 }}><ProgressBar pct={total?c.total/total*100:0} color={C.yel}/></div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.yel, width:60, textAlign:"right" }}>{usd(c.total)}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:0 }}>
            <Table
              headers={["Fecha","Concepto","Categoría","Viaje asociado","Monto"]}
              rows={expenses.map(e=>{
                const trip = trips.find(t=>t.id===e.tripId);
                return [
                  dateStr(e.date),
                  e.concept,
                  <Badge bg={C.yelL} text={C.yel}>{e.category}</Badge>,
                  trip?<span style={{ fontSize:12 }}>{flags[trip?.country]||"🌍"} {trip.destination}</span>:<span style={{ color:C.t3, fontSize:12 }}>General</span>,
                  <span style={{ fontWeight:600, color:C.yel }}>{usd(e.amount)}</span>,
                ];
              })}
            />
          </Card>
        </div>

        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:16 }}>Registrar gasto</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Fecha" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/>
            <Input label="Concepto" value={form.concept} onChange={v=>setForm(f=>({...f,concept:v}))} placeholder="Ej: Publicidad Instagram, nafta, etc."/>
            <Select label="Categoría" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} options={CATS.map(c=>({value:c,label:c}))}/>
            <Select label="Viaje asociado (opcional)" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
            <Input label="Monto (USD)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/>
            <Btn variant="danger" onClick={addExpense}>Registrar gasto</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── PROVEEDORES ───────────────────────────────────────
function Proveedores({ data, setData }) {
  const { suppliers } = data;
  const [form, setForm] = useState({ company:"", contact:"", phone:"", email:"", busCost:"0", type:"bus", availability:"Disponible", rating:5, notes:"" });
  const [showForm, setShowForm] = useState(false);

  const add = () => {
    if(!form.company) return;
    const newS = { id:`S-${String(suppliers.length+1).padStart(3,"0")}`, ...form, busCost:Number(form.busCost||0), rating:Number(form.rating||5) };
    setData(d=>({...d, suppliers:[newS,...d.suppliers]}));
    setForm({ company:"", contact:"", phone:"", email:"", busCost:"0", type:"bus", availability:"Disponible", rating:5, notes:"" });
    setShowForm(false);
  };

  const typeLabel = { bus:"🚌 Bus", hotel:"🏨 Hotel", seguro:"🛡️ Seguro", otro:"📦 Otro" };
  const avColors = { "Disponible":{bg:C.grnL,text:C.grn}, "Consultar":{bg:C.yelL,text:C.yel}, "No disponible":{bg:C.redL,text:C.red} };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Proveedores</h2>
          <p style={{ fontSize:13, color:C.t2 }}>{suppliers.length} proveedores registrados</p>
        </div>
        <Btn onClick={()=>setShowForm(s=>!s)}>+ Nuevo proveedor</Btn>
      </div>

      {showForm && (
        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:16 }}>Nuevo proveedor</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}><Input label="Empresa" value={form.company} onChange={v=>setForm(f=>({...f,company:v}))}/></div>
            <Input label="Contacto" value={form.contact} onChange={v=>setForm(f=>({...f,contact:v}))}/>
            <Input label="Teléfono" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))}/>
            <Input label="Email" type="email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))}/>
            <Select label="Tipo" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={[{value:"bus",label:"Bus"},{value:"hotel",label:"Hotel"},{value:"seguro",label:"Seguro"},{value:"otro",label:"Otro"}]}/>
            <Input label="Costo bus (USD)" type="number" value={form.busCost} onChange={v=>setForm(f=>({...f,busCost:v}))}/>
            <Select label="Disponibilidad" value={form.availability} onChange={v=>setForm(f=>({...f,availability:v}))} options={[{value:"Disponible",label:"Disponible"},{value:"Consultar",label:"Consultar"},{value:"No disponible",label:"No disponible"}]}/>
            <Select label="Rating" value={String(form.rating)} onChange={v=>setForm(f=>({...f,rating:Number(v)}))} options={[5,4,3,2,1].map(n=>({value:String(n),label:"⭐".repeat(n)}))}/>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:500, color:C.t2, display:"block", marginBottom:5 }}>Notas</label>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ width:"100%", padding:"9px 13px", border:`1px solid ${C.border}`, borderRadius:8, fontSize:13, color:C.t1, minHeight:60, resize:"vertical", outline:"none", background:"#FAFAFA" }}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:14 }}>
            <Btn onClick={add}>Guardar</Btn>
            <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancelar</Btn>
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
        {suppliers.map(s=>(
          <Card key={s.id}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ fontSize:22 }}>{typeLabel[s.type]?.split(" ")[0]||"📦"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:C.t1 }}>{s.company}</div>
                <div style={{ fontSize:12, color:C.t2 }}>{typeLabel[s.type]||s.type}</div>
              </div>
              <Badge bg={avColors[s.availability]?.bg||C.accentL} text={avColors[s.availability]?.text||C.accent}>{s.availability}</Badge>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ fontSize:12, color:C.t2 }}>👤 {s.contact}</div>
              <div style={{ fontSize:12, color:C.t2 }}>📞 {s.phone}</div>
              {s.email && <div style={{ fontSize:12, color:C.t2 }}>✉️ {s.email}</div>}
              {s.busCost>0 && <div style={{ fontSize:12, fontWeight:600, color:C.t1 }}>💵 Costo: {usd(s.busCost)}</div>}
              {s.notes && <div style={{ fontSize:11, color:C.t3, marginTop:4 }}>{s.notes}</div>}
              <div style={{ fontSize:13, color:"#F59E0B" }}>{"⭐".repeat(s.rating||0)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── RENTABILIDAD ──────────────────────────────────────
function Rentabilidad({ data }) {
  const { trips, suppliers, sales, expenses, passengers } = data;

  const enriched = trips.map(t=>{
    const sup = suppliers.find(s=>s.id===t.supplierId);
    const tripSales = sales.filter(s=>s.tripId===t.id);
    const revenueSeats = t.sold * t.price;
    const extraSales = tripSales.reduce((a,s)=>a+s.amount,0);
    const busCost = sup?.busCost||0;
    const totalCost = busCost + t.hotelCost + t.extrasCost;
    const totalRev = revenueSeats;
    const profit = totalRev - totalCost;
    const occ = t.capacity ? Math.round(t.sold/t.capacity*100) : 0;
    const pax = passengers.filter(p=>p.tripId===t.id);
    const collected = pax.reduce((a,p)=>a+p.amountPaid,0);
    const pending = totalRev - collected;
    const breakeven = totalCost / (t.price||1);
    return { ...t, sup, busCost, totalCost, totalRev, profit, occ, collected, pending, breakeven, tripSales };
  });

  const totalRev = enriched.reduce((a,t)=>a+t.totalRev,0);
  const totalCost = enriched.reduce((a,t)=>a+t.totalCost,0);
  const totalExp = expenses.reduce((a,e)=>a+e.amount,0);
  const netProfit = totalRev - totalCost - totalExp;
  const margin = totalRev ? Math.round(netProfit/totalRev*100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Rentabilidad</h2>
        <p style={{ fontSize:13, color:C.t2 }}>Análisis financiero completo de la agencia</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        <StatCard label="Ingresos totales" value={usd(totalRev)} icon="💵" color={C.grn}/>
        <StatCard label="Costos operativos" value={usd(totalCost)} icon="🚌" color={C.yel}/>
        <StatCard label="Gastos extras" value={usd(totalExp)} icon="📊" color={C.yel}/>
        <StatCard label="Ganancia neta" value={usd(netProfit)} icon="💰" color={netProfit>0?C.grn:C.red}/>
        <StatCard label="Margen" value={`${margin}%`} icon="📈" color={margin>20?C.grn:margin>10?C.yel:C.red}/>
      </div>

      <Card style={{ padding:0 }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.t1 }}>Análisis por viaje</div>
        </div>
        <Table
          headers={["Viaje","Ocupación","Ingresos","Costos","Ganancia","Margen","Break-even","Cobrado","Pendiente"]}
          rows={enriched.map(t=>{
            const margin = t.totalRev ? Math.round(t.profit/t.totalRev*100) : 0;
            return [
              <div><div style={{ fontWeight:500 }}>{flags[t.country]||"🌍"} {t.destination}</div><div style={{ fontSize:11, color:C.t3 }}>{t.type}</div></div>,
              <div style={{ minWidth:100 }}>
                <div style={{ fontSize:12, color:C.t1, marginBottom:3 }}>{t.occ}% ({t.sold}/{t.capacity})</div>
                <ProgressBar pct={t.occ} color={t.occ>80?C.grn:t.occ>50?C.yel:C.accent}/>
              </div>,
              <span style={{ color:C.grn, fontWeight:600 }}>{usd(t.totalRev)}</span>,
              <span style={{ color:C.yel }}>{usd(t.totalCost)}</span>,
              <span style={{ color:t.profit>0?C.grn:C.red, fontWeight:700 }}>{usd(t.profit)}</span>,
              <Badge bg={margin>20?C.grnL:margin>0?C.yelL:C.redL} text={margin>20?C.grn:margin>0?C.yel:C.red}>{margin}%</Badge>,
              <div style={{ fontSize:12 }}><div>{Math.ceil(t.breakeven)} pax</div><div style={{ fontSize:10, color:t.sold>=t.breakeven?C.grn:C.red }}>{t.sold>=t.breakeven?"✓ cubierto":"⚠ faltan "+(Math.ceil(t.breakeven)-t.sold)}</div></div>,
              <span style={{ color:C.grn }}>{usd(t.collected)}</span>,
              <span style={{ color:t.pending>0?C.red:C.grn, fontWeight:600 }}>{t.pending>0?usd(t.pending):"✓"}</span>,
            ];
          })}
        />
      </Card>
    </div>
  );
}

// ── TAREAS ────────────────────────────────────────────
function Tareas({ data, setData }) {
  const { tasks, trips } = data;
  const [form, setForm] = useState({ title:"", tripId:"", due:"", priority:"Media", assignee:"Juan" });

  const addTask = () => {
    if(!form.title) return;
    const newT = { id:`TK-${String(tasks.length+1).padStart(3,"0")}`, ...form, done:false };
    setData(d=>({...d, tasks:[newT,...d.tasks]}));
    setForm({ title:"", tripId:"", due:"", priority:"Media", assignee:"Juan" });
  };

  const toggleDone = (id) => {
    setData(d=>({...d, tasks:d.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}));
  };

  const priColors = { "Alta":{bg:C.redL,text:C.red}, "Media":{bg:C.yelL,text:C.yel}, "Baja":{bg:C.grnL,text:C.grn} };
  const pending = tasks.filter(t=>!t.done);
  const done = tasks.filter(t=>t.done);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Tareas</h2>
          <p style={{ fontSize:13, color:C.t2 }}>{pending.length} pendientes · {done.length} completadas</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {pending.length>0 && <div style={{ fontSize:12, fontWeight:600, color:C.t2, textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>Pendientes ({pending.length})</div>}
          {pending.map(t=>{
            const trip = trips.find(tr=>tr.id===t.tripId);
            const days = daysLeft(t.due);
            return (
              <Card key={t.id} style={{ padding:14, display:"flex", alignItems:"flex-start", gap:12 }}>
                <input type="checkbox" checked={t.done} onChange={()=>toggleDone(t.id)} style={{ marginTop:3, cursor:"pointer", width:16, height:16 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, fontSize:14, color:C.t1 }}>{t.title}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6, flexWrap:"wrap" }}>
                    <Badge bg={priColors[t.priority]?.bg} text={priColors[t.priority]?.text}>{t.priority}</Badge>
                    {trip && <span style={{ fontSize:11, color:C.t2 }}>{flags[trip.country]||"🌍"} {trip.destination}</span>}
                    {t.due && <span style={{ fontSize:11, color:days<3?C.red:C.t3 }}>{days!==null&&days<0?"⚠ vencida":days===0?"hoy":`${days} días`}</span>}
                    <span style={{ fontSize:11, color:C.t3 }}>👤 {t.assignee}</span>
                  </div>
                </div>
              </Card>
            );
          })}
          {done.length>0 && <div style={{ fontSize:12, fontWeight:600, color:C.t2, textTransform:"uppercase", letterSpacing:".05em", marginTop:8, marginBottom:4 }}>Completadas ({done.length})</div>}
          {done.map(t=>(
            <Card key={t.id} style={{ padding:14, display:"flex", alignItems:"center", gap:12, opacity:.6 }}>
              <input type="checkbox" checked={t.done} onChange={()=>toggleDone(t.id)} style={{ cursor:"pointer", width:16, height:16 }}/>
              <div style={{ textDecoration:"line-through", color:C.t3, fontSize:13 }}>{t.title}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ fontSize:15, fontWeight:600, color:C.t1, marginBottom:16 }}>Nueva tarea</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Tarea" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Ej: Confirmar hotel, cobrar seña..."/>
            <Select label="Viaje asociado" value={form.tripId} onChange={v=>setForm(f=>({...f,tripId:v}))} options={trips.map(t=>({value:t.id,label:t.destination}))}/>
            <Input label="Fecha límite" type="date" value={form.due} onChange={v=>setForm(f=>({...f,due:v}))}/>
            <Select label="Prioridad" value={form.priority} onChange={v=>setForm(f=>({...f,priority:v}))} options={[{value:"Alta",label:"🔴 Alta"},{value:"Media",label:"🟡 Media"},{value:"Baja",label:"🟢 Baja"}]}/>
            <Select label="Responsable" value={form.assignee} onChange={v=>setForm(f=>({...f,assignee:v}))} options={INIT.team.map(u=>({value:u.name,label:u.name}))}/>
            <Btn onClick={addTask}>Agregar tarea</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── DOCUMENTOS ────────────────────────────────────────
function Documentos({ data }) {
  const { trips, passengers } = data;

  const generateManifest = (tripId) => {
    const trip = trips.find(t=>t.id===tripId);
    const pax = passengers.filter(p=>p.tripId===tripId);
    if(!trip||!pax.length) return;
    const lines = [
      `MANIFIESTO DE PASAJEROS — ÓRBITA TRAVEL`,
      `===========================================`,
      `Destino: ${trip.destination}`,
      `Salida: ${dateStr(trip.departure)} | Regreso: ${dateStr(trip.returnDate)}`,
      `Total pasajeros: ${pax.length} / ${trip.capacity}`,
      `===========================================`,
      ``,
      ...pax.map((p,i)=>`${String(i+1).padStart(2,"0")}. ${p.fullName.padEnd(25)} DNI: ${(p.dni||"-").padEnd(12)} Asiento: ${(p.seat||"-").padEnd(5)} Pago: ${p.payment}`),
      ``,
      `Generado: ${new Date().toLocaleString("es-AR")}`,
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`manifiesto-${trip.destination.replace(/\s+/g,"-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:C.t1, marginBottom:4 }}>Documentos</h2>
        <p style={{ fontSize:13, color:C.t2 }}>Generá manifiestos, listas de pasajeros y reportes</p>
      </div>

      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:16 }}>Manifiesto de pasajeros</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {trips.map(t=>{
            const pax = passengers.filter(p=>p.tripId===t.id);
            return (
              <div key={t.id} style={{ padding:16, border:`1px solid ${C.border}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <div>
                  <div style={{ fontWeight:500, fontSize:13, color:C.t1 }}>{flags[t.country]||"🌍"} {t.destination}</div>
                  <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>{dateStr(t.departure)} · {pax.length} pasajeros</div>
                </div>
                <Btn size="sm" onClick={()=>generateManifest(t.id)} disabled={pax.length===0}>📄 Descargar</Btn>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:C.t1, marginBottom:14 }}>Checklist operativo por viaje</div>
        {trips.map(t=>(
          <div key={t.id} style={{ marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:500, fontSize:13, color:C.t1, marginBottom:8 }}>{flags[t.country]||"🌍"} {t.destination} — {dateStr(t.departure)}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:6 }}>
              {["Bus confirmado","Hotel reservado","Seguro de viaje","Lista de pasajeros","Guía asignado","Itinerario enviado","Cobros completos","Documentación OK"].map(item=>(
                <label key={item} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.t2, cursor:"pointer" }}>
                  <input type="checkbox" style={{ width:14, height:14 }}/>
                  {item}
                </label>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────
function Login({ onLogin }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handle = () => {
    if(pass === "JuanLucasalmundo26") {
      localStorage.setItem("orbita_auth", "1");
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0F1117", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      <div style={{ background:"#1A1D27", border:"1px solid #2A2D3E", borderRadius:16, padding:40, width:360, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🌍</div>
        <div style={{ fontSize:22, fontWeight:800, color:"#FFFFFF", letterSpacing:"-.04em", marginBottom:4 }}>ÓRBITA TRAVEL</div>
        <div style={{ fontSize:12, color:"#9A9CAD", marginBottom:32, textTransform:"uppercase", letterSpacing:".06em" }}>Acceso privado</div>
        <div style={{ position:"relative", marginBottom:16 }}>
          <input
            type={show?"text":"password"}
            value={pass}
            onChange={e=>setPass(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handle()}
            placeholder="Contraseña"
            style={{ width:"100%", padding:"12px 44px 12px 16px", background:"#0F1117", border:`1px solid ${error?"#DC2626":"#2A2D3E"}`, borderRadius:8, fontSize:14, color:"#FFFFFF", outline:"none", boxSizing:"border-box", transition:"border-color .2s" }}
          />
          <button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9A9CAD" }}>{show?"🙈":"👁️"}</button>
        </div>
        {error && <div style={{ fontSize:12, color:"#DC2626", marginBottom:12 }}>Contraseña incorrecta</div>}
        <button onClick={handle} style={{ width:"100%", padding:"12px", background:"#2563EB", color:"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:600, cursor:"pointer", transition:"background .2s" }}>
          Ingresar →
        </button>
        <div style={{ fontSize:11, color:"#444", marginTop:20 }}>Uso interno · Órbita Travel</div>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────
export default function OrbitaTravel() {
  const [active, setActive] = useState("dashboard");
  const [data, setData] = useState(INIT);
  const [auth, setAuth] = useState(!!localStorage.getItem("orbita_auth"));

  if(!auth) return <Login onLogin={()=>setAuth(true)}/>;

  const screens = {
    dashboard: <Dashboard data={data}/>,
    viajes: <Viajes data={data} setData={setData}/>,
    pasajeros: <Pasajeros data={data} setData={setData}/>,
    ventas: <Ventas data={data} setData={setData}/>,
    gastos: <Gastos data={data} setData={setData}/>,
    proveedores: <Proveedores data={data} setData={setData}/>,
    rentabilidad: <Rentabilidad data={data}/>,
    tareas: <Tareas data={data} setData={setData}/>,
    documentos: <Documentos data={data}/>,
  };

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", background:C.bg, minHeight:"100vh", display:"flex" }}>
      <Sidebar active={active} setActive={setActive}/>
      <div style={{ marginLeft:220, flex:1, padding:28, minWidth:0 }}>
        {screens[active]}
      </div>
    </div>
  );
}
