import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, Atom, Award, BookOpen, Check, ChevronDown, CircleHelp, Coins, Gem, Grid3X3, History, LockKeyhole, Package, RotateCw, Settings2, Sparkles, Star, TrendingUp, WandSparkles, Zap } from 'lucide-react'
import { AURAS, RARITIES } from './data'
import { essenceValue, formatOdds, rollAura } from './engine'
import { loadSave, saveGame } from './storage'
import type { Aura, Rarity, SaveData } from './types'

type Tab = 'Roll' | 'Inventory' | 'Collection' | 'Upgrades'
const rarityColors: Record<Rarity, string> = Object.fromEntries(RARITIES.map(r => [r.name, r.color])) as Record<Rarity, string>

export default function App() {
  const [save, setSave] = useState<SaveData>(loadSave)
  const [tab, setTab] = useState<Tab>('Roll')
  const [lastRoll, setLastRoll] = useState<Aura | null>(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<Aura[]>([])
  const [notice, setNotice] = useState('')
  const [showOdds, setShowOdds] = useState(false)
  const [auto, setAuto] = useState(false)

  useEffect(() => { saveGame(save) }, [save])
  const owned = useMemo(() => Object.entries(save.inventory).filter(([, count]) => count > 0), [save.inventory])
  const equippedAura = AURAS.find(a => a.id === save.equipped)
  const discoveredCount = save.discovered.length
  const luck = 1 + save.luckLevel * 0.12

  function update(patch: Partial<SaveData>) { setSave(current => ({ ...current, ...patch })) }
  function performRoll() {
    if (rolling) return
    setRolling(true)
    const result = rollAura(save.luckLevel)
    window.setTimeout(() => {
      const nextInventory = { ...save.inventory, [result.id]: (save.inventory[result.id] ?? 0) + 1 }
      const fresh = !save.discovered.includes(result.id)
      setSave(current => ({
        ...current, inventory: nextInventory, discovered: fresh ? [...current.discovered, result.id] : current.discovered,
        totalRolls: current.totalRolls + 1, coins: current.coins + 3,
      }))
      setLastRoll(result)
      setHistory(current => [result, ...current].slice(0, 8))
      setRolling(false)
      if (fresh) setNotice('NEW DISCOVERY')
      else setNotice('DUPLICATE · +3 COINS')
    }, 650)
  }
  function dismantle(id: string) {
    const aura = AURAS.find(a => a.id === id)
    const count = save.inventory[id] ?? 0
    if (!aura || count < 2 || save.equipped === id) return
    const amount = essenceValue(aura.rarity)
    setSave(current => ({ ...current, inventory: { ...current.inventory, [id]: current.inventory[id] - 1 }, essence: current.essence + amount }))
    setNotice('+' + amount.toLocaleString() + ' ESSENCE')
  }
  function upgrade(kind: 'luck' | 'speed') {
    const level = kind === 'luck' ? save.luckLevel : save.speedLevel
    const cost = kind === 'luck' ? 50 * (level + 1) : 75 * (level + 1)
    if (save.coins < cost) { setNotice('NOT ENOUGH COINS'); return }
    setSave(current => ({ ...current, coins: current.coins - cost, [kind === 'luck' ? 'luckLevel' : 'speedLevel']: level + 1 }))
    setNotice('UPGRADE PURCHASED')
  }
  const nav: { label: Tab; icon: typeof Sparkles }[] = [
    { label: 'Roll', icon: Sparkles }, { label: 'Inventory', icon: Package },
    { label: 'Collection', icon: BookOpen }, { label: 'Upgrades', icon: TrendingUp },
  ]
  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Atom size={22}/></div><div><strong>LARNG</strong><span>AURA RNG</span></div></div>
      <div className="side-label">MAIN MENU</div>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={tab === label ? 'nav-item active' : 'nav-item'} onClick={() => setTab(label)}><Icon size={17}/><span>{label}</span>{tab === label && <i/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="side-label">YOUR JOURNEY</div><div className="journey-card"><div className="journey-icon"><Award size={17}/></div><div><b>{discoveredCount} / {AURAS.length}</b><span>Auras discovered</span></div></div><div className="sidebar-foot"><span className="online-dot"/> LOCAL SAVE ACTIVE <span>v0.1.0</span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>THE ORIGIN</span><ChevronDown size={13}/><b>{tab.toUpperCase()}</b></div><div className="resource-bar"><div className="resource"><Coins size={16}/><b>{save.coins.toLocaleString()}</b><span>COINS</span></div><div className="resource"><Gem size={16}/><b>{save.gems.toLocaleString()}</b><span>GEMS</span></div><div className="resource"><Sparkles size={16}/><b>{save.essence.toLocaleString()}</b><span>ESSENCE</span></div><button className="icon-button" title="Settings"><Settings2 size={18}/></button></div></header>
      <div className="page-wrap">
        {tab === 'Roll' && <>
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> DIMENSION 01 — THE BEGINNING</div><h1>Discover the <em>impossible.</em></h1><p>Every roll is a new universe. How far will your luck take you?</p></div><div className="roll-count"><span>TOTAL ROLLS</span><strong>{save.totalRolls.toLocaleString()}</strong><small><Activity size={12}/> YOUR JOURNEY SO FAR</small></div></div>
          <div className="roll-layout">
            <section className="roll-panel">
              <div className="panel-top"><span><span className="live-dot"/> ROLL ALTAR</span><button className="subtle-button" onClick={() => setShowOdds(v => !v)}><CircleHelp size={14}/> {showOdds ? 'HIDE ODDS' : 'VIEW ODDS'}</button></div>
              <div className={'orb-stage ' + (rolling ? 'is-rolling' : '')}>
                <div className="orb-orbit orbit-a"/><div className="orb-orbit orbit-b"/><div className="orb-glow"/>
                <div className="orb-core" style={{ '--aura-color': lastRoll ? rarityColors[lastRoll.rarity] : '#9d80ff' } as React.CSSProperties}>
                  <span>{rolling ? '✧' : lastRoll?.symbol ?? '✦'}</span>
                </div>
                <div className="orb-stars">✦　·　✧　　·　✦</div>
                {lastRoll && !rolling && <div className="result-float"><span style={{ color: rarityColors[lastRoll.rarity] }}>{lastRoll.rarity.toUpperCase()}</span><b>{lastRoll.name}</b></div>}
              </div>
              <div className="altar-footer"><div><span className="altar-caption">CURRENT LUCK</span><b><WandSparkles size={14}/> {luck.toFixed(2)}x</b></div><div className="altar-divider"/><div><span className="altar-caption">ROLL SPEED</span><b><Zap size={14}/> {save.speedLevel ? (1.5 + save.speedLevel * .1).toFixed(1) : '1.5'}s</b></div><div className="altar-divider"/><div><span className="altar-caption">DISCOVERED</span><b><Star size={14}/> {discoveredCount}/{AURAS.length}</b></div></div>
              <button className="roll-button" onClick={performRoll} disabled={rolling}><Sparkles size={19}/>{rolling ? 'CHANNELING...' : 'ROLL FOR AURA'}<span>FREE</span></button>
              <div className="roll-subrow"><button className={auto ? 'toggle-button selected' : 'toggle-button'} onClick={() => { setAuto(v => !v); setNotice(auto ? 'AUTO ROLL OFF' : 'AUTO ROLL ENABLED') }}><RotateCw size={14}/> AUTO ROLL <i>{auto ? 'ON' : 'OFF'}</i></button><span>NO COST PER ROLL</span></div>
              {showOdds && <div className="odds-panel"><div className="odds-heading">RARITY PROBABILITIES <span>BASE ODDS</span></div>{RARITIES.map(r => <div className="odds-row" key={r.name}><span style={{ color: r.color }}>● {r.name}</span><b>{formatOdds(r.weight)}</b></div>)}</div>}
              {notice && <div className="notice">{notice}</div>}
            </section>
            <aside className="right-column">
              <div className="mini-panel equipped-panel"><div className="mini-heading">EQUIPPED AURA <span>ACTIVE</span></div>{equippedAura ? <div className="equipped-content"><div className="mini-aura" style={{ color: rarityColors[equippedAura.rarity] }}>{equippedAura.symbol}</div><div><b>{equippedAura.name}</b><span>{equippedAura.rarity}</span></div></div> : <div className="empty-equipped"><div className="mini-aura">?</div><div><b>No aura equipped</b><span>Discover one and equip it</span></div></div>}</div>
              <div className="mini-panel"><div className="mini-heading">RECENT DISCOVERIES <span>LAST 8</span></div>{history.length ? <div className="history-list">{history.slice(0,5).map((a,i) => <div className="history-row" key={i}><span className="history-symbol" style={{ color: rarityColors[a.rarity] }}>{a.symbol}</span><div><b>{a.name}</b><span>{a.rarity}</span></div><small>{i === 0 ? 'NOW' : i + ' ROLLS AGO'}</small></div>)}</div> : <div className="empty-history"><History size={22}/><span>Your discoveries will appear here.</span></div>}</div>
              <div className="tip-card"><div className="tip-icon"><Zap size={17}/></div><div><b>THE COSMOS FAVORS THE PATIENT</b><p>Every roll brings you closer to something extraordinary. Upgrade your luck to shift the odds.</p></div></div>
            </aside>
          </div>
          <div className="bottom-stats"><div><span>COLLECTION PROGRESS</span><div className="progress-track"><i style={{ width: (discoveredCount / AURAS.length * 100) + '%' }}/></div><b>{Math.round(discoveredCount / AURAS.length * 100)}%</b></div><div><span>RAREST DISCOVERY</span><b>{AURAS.filter(a => save.discovered.includes(a.id)).sort((a,b) => b.odds-a.odds)[0]?.name ?? '—'}</b></div><div><span>UNIQUE AURAS</span><b>{discoveredCount} <small>/ {AURAS.length}</small></b></div></div>
        </>}
        {tab === 'Inventory' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR COLLECTION</div><h1>Aura <em>inventory.</em></h1><p>Manage your discoveries. Keep your favorites close.</p></div><div className="roll-count"><span>UNIQUE AURAS</span><strong>{owned.length}</strong><small>ITEMS IN YOUR VAULT</small></div></div><div className="inventory-grid">{owned.length ? owned.map(([id,count]) => { const a = AURAS.find(x=>x.id===id)!; return <div className="aura-card" key={id} style={{ '--aura-color': rarityColors[a.rarity] } as React.CSSProperties}><div className="card-symbol">{a.symbol}</div><div className="card-rarity">{a.rarity}</div><h3>{a.name}</h3><p>{formatOdds(a.odds)}</p><div className="card-actions"><button onClick={() => { update({ equipped: id }); setNotice(a.name + ' EQUIPPED') }} disabled={save.equipped===id}>{save.equipped===id ? <><Check size={13}/> EQUIPPED</> : 'EQUIP'}</button><button title="Dismantle one duplicate" onClick={() => dismantle(id)} disabled={count < 2 || save.equipped===id}><Sparkles size={13}/> +{essenceValue(a.rarity)} ESSENCE</button></div><span className="quantity">×{count}</span></div> }) : <div className="empty-state"><Package size={30}/><h3>Your vault is waiting.</h3><p>Roll your first aura to begin your collection.</p><button onClick={() => setTab('Roll')}>GO TO ROLL ALTAR <ArrowUpRight size={14}/></button></div>}</div></>}
        {tab === 'Collection' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> FIELD GUIDE</div><h1>The aura <em>codex.</em></h1><p>Every aura has a story. Only the discovered ones reveal their secrets.</p></div><div className="roll-count"><span>DISCOVERY RATE</span><strong>{Math.round(discoveredCount/AURAS.length*100)}%</strong><small>{discoveredCount} OF {AURAS.length} FOUND</small></div></div><div className="codex-list">{RARITIES.map(r => { const group=AURAS.filter(a=>a.rarity===r.name); return <section className="codex-tier" key={r.name}><div className="codex-tier-head"><span style={{color:r.color}}>{r.name.toUpperCase()}</span><b>{group.filter(a=>save.discovered.includes(a.id)).length} / {group.length}</b></div><div className="codex-grid">{group.map(a => { const found=save.discovered.includes(a.id); return <div className={'codex-card '+(found?'found':'unknown')} key={a.id} style={{'--aura-color':r.color} as React.CSSProperties}><span>{found?a.symbol:'?'}</span><b>{found?a.name:'Undiscovered'}</b><small>{formatOdds(a.odds)}</small></div> })}</div></section> })}</div></>}
        {tab === 'Upgrades' && <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> ASCENSION PATH</div><h1>Become <em>unstoppable.</em></h1><p>Invest your coins into permanent improvements to your rolling power.</p></div><div className="roll-count"><span>AVAILABLE COINS</span><strong>{save.coins.toLocaleString()}</strong><small>SPEND WISELY</small></div></div><div className="upgrade-grid"><div className="upgrade-card"><div className="upgrade-icon luck"><WandSparkles size={24}/></div><div className="upgrade-kicker">ROLLING · LUCK</div><h2>Fortune's Favor</h2><p>Increase your luck modifier, nudging the cosmic scales toward rarer discoveries.</p><div className="upgrade-level">LEVEL <b>{save.luckLevel}</b><span>MAX 100</span></div><div className="upgrade-bottom"><div><small>NEXT LEVEL</small><b>{(1+save.luckLevel*.12).toFixed(2)}x → {(1+(save.luckLevel+1)*.12).toFixed(2)}x</b></div><button disabled={save.coins < 50*(save.luckLevel+1) || save.luckLevel>=100} onClick={()=>upgrade('luck')}><Coins size={14}/> { (50*(save.luckLevel+1)).toLocaleString()}</button></div></div><div className="upgrade-card"><div className="upgrade-icon speed"><Zap size={24}/></div><div className="upgrade-kicker">ROLLING · SPEED</div><h2>Quickened Pulse</h2><p>Reduce the time it takes to channel an aura and get back to discovering.</p><div className="upgrade-level">LEVEL <b>{save.speedLevel}</b><span>MAX 25</span></div><div className="upgrade-bottom"><div><small>UPGRADE COST</small><b>FASTER ROLLS</b></div><button disabled={save.coins < 75*(save.speedLevel+1) || save.speedLevel>=25} onClick={()=>upgrade('speed')}><Coins size={14}/> { (75*(save.speedLevel+1)).toLocaleString()}</button></div></div><div className="upgrade-note"><LockKeyhole size={16}/><span>More upgrade paths unlock as you progress. Rebirth, crafting, and advanced automation are planned for future milestones.</span></div></div></>}
      </div>
      <footer><span>✦ LARNG <b>·</b> AURA RNG</span><span>THE COSMOS IS YOURS TO DISCOVER.</span></footer>
    </main>
  </div>
}
