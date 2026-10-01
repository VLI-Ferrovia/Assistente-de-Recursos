import { useState } from 'react'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#0D1117',
  surface:  '#161B22',
  panel:    '#1C2333',
  muted:    '#21262D',
  border:   '#30363D',
  text:     '#E6EDF3',
  sub:      '#8B949E',
  dim:      '#6E7681',
  amber:    '#F5A623',
  navy:     '#003865',
  gold:     '#FFB800',
  danger:   '#F85149',
  success:  '#3FB950',
  warning:  '#D29922',
  info:     '#58A6FF',
}

// ─── Problem data ─────────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    severity: 'critical',
    area: 'Hierarquia Visual',
    title: 'Dois tons de cinza escuro indistintos no header',
    detail: 'O header (#1a1a1a) e a barra de filtros (#242424) diferem apenas 26 pontos em luminosidade. Em monitores calibrados para operação 24x7 a distinção some completamente, causando perda de orientação contextual.',
    fix: 'Separar header por cor semântica (navy VLI #003865) e filtros por superfície elevada (#1C2333) com borda de separação visível.',
  },
  {
    severity: 'critical',
    area: 'Usabilidade',
    title: 'Botão de busca sem label (apenas ícone)',
    detail: 'O botão de busca exibe somente um ícone de lupa sem texto. Em operações de emergência qualquer ambiguidade cognitiva custa segundos críticos. Não há tooltip para usuários de teclado.',
    fix: 'Adicionar label "Buscar" + atalho de teclado (Enter no campo). Mostrar loading state durante processamento.',
  },
  {
    severity: 'critical',
    area: 'Indicadores de Status',
    title: 'Indicadores de sistema (SISMOR / Terceiros) sem contexto de ação',
    detail: '"🟡 CARREGANDO BASES" e "TERCEIROS: CARREGANDO" são badges sem feedback progressivo, sem porcentagem, sem ETA e sem opção de retry em caso de falha. O operador não sabe se deve aguardar ou recarregar.',
    fix: 'Substituir por status pills com ícone animado, progresso (ex: "847 de 1.200 recursos"), e botão de retry visível em falha.',
  },
  {
    severity: 'high',
    area: 'Mapa',
    title: 'Tile layer padrão Leaflet OSM — sem contexto ferroviário',
    detail: 'O mapa usa o tile padrão OpenStreetMap sem adaptação visual. Cores brilhantes do OSM criam fadiga visual em ambiente escuro. Sem camadas temáticas (linhas ferroviárias destacadas, corredor ativo, heatmap de ocorrências).',
    fix: 'Trocar por tile escuro (CartoDB Dark Matter ou Mapbox Dark v10). Adicionar camada vetorial das linhas VLI em amarelo âmbar. Clusters inteligentes para recursos agrupados.',
  },
  {
    severity: 'high',
    area: 'Painel Lateral',
    title: 'Painel de resultados ocupa 460px fixos sem adaptação responsiva real',
    detail: 'O painel desliza sobre o mapa mas empurra o conteúdo de forma inconsistente em telas < 1280px. Não há indicador visual de que pode ser recolhido. A aba ativa usa cor laranja (vli-orange) com borda bottom que some em contraste baixo.',
    fix: 'Implementar painel flutuante com handle de resize, estado minimizado (strip lateral), e tabs com indicador de contagem em badge estilizado.',
  },
  {
    severity: 'high',
    area: 'Cards de Recursos',
    title: 'Ausência de hierarquia nos cards de resultado — dados críticos nivelados',
    detail: 'Nome, tipo, distância, telefone e status aparecem em tamanhos de fonte similares (text-xs). O operador precisa ler cada linha para encontrar a distância — dado mais importante na triagem de emergência.',
    fix: 'Card com zona de destaque para DISTÂNCIA (número grande), status badge colorido semântico, contatos em one-tap click-to-call, e ação primária em botão de acionamento.',
  },
  {
    severity: 'high',
    area: 'Filtros',
    title: 'Filtros sem feedback de estado ativo ou contagem de resultados',
    detail: 'Após buscar, o operador não vê quantos recursos foram encontrados na barra de filtros. O campo KM aceita texto livre sem validação de formato ferroviário (###+###). Sem sugestões de autocompletar para Trecho/SB.',
    fix: 'Adicionar chip de resultado ativo ("23 recursos encontrados em 15km"), validação inline do formato KM com regex ferroviário, e dropdown de trechos conhecidos.',
  },
  {
    severity: 'medium',
    area: 'Seletor de Recursos',
    title: 'Sidebar de seleção de recursos sem agrupamento visual adequado',
    detail: 'A árvore de recursos no sidebar usa espaçamento mínimo (p-2) sem separação clara entre categorias. Checkboxes padrão do sistema operacional sem estilo. Contagem de selecionados em texto muito pequeno (10px).',
    fix: 'Grupos com header colapsável estilo Grafana, checkboxes estilizados com cor semântica por tipo de recurso, contagem em badge de destaque.',
  },
  {
    severity: 'medium',
    area: 'Wizard / Playbook',
    title: 'Tela de Playbook perde contexto operacional ao trocar de modo',
    detail: 'Ao clicar "Fluxo Guiado", o mapa desaparece completamente. O operador perde a referência geográfica da ocorrência durante o acionamento de recursos. Sem breadcrumb de progresso no fluxo de acionamento.',
    fix: 'Layout split: mapa em miniatura persistente à esquerda + wizard à direita. Barra de progresso de etapas estilo Azure DevOps. Contexto da ocorrência fixo no topo.',
  },
  {
    severity: 'medium',
    area: 'Acessibilidade',
    title: 'Múltiplas falhas de acessibilidade para operação por teclado',
    detail: 'Botões de ação usam apenas cor para comunicar estado ativo (tab ativa: border-vli-orange). Ícones Phosphor sem aria-label. Campos de filtro sem autocomplete attr. Contraste do texto #text-slate-400 sobre #242424 é ~3.1:1 (falha WCAG AA para texto normal).',
    fix: 'Adicionar aria-label a todos os controles, focus rings visíveis (ring-2 amber), aria-live regions para atualizações de status, e aumentar contraste de labels para ≥4.5:1.',
  },
  {
    severity: 'low',
    area: 'Toast / Feedback',
    title: 'Toast global sem fila, sem tipagem e sem auto-dismiss temporizável',
    detail: 'Um único div de toast pode ser sobrescrito por mensagens sequenciais. Não há diferenciação visual entre informação, sucesso, alerta e erro. Sem opção de fixar mensagens críticas.',
    fix: 'Implementar fila de toasts tipados (info/success/warning/error) com ícone semântico, barra de progresso de auto-dismiss, e pin para mensagens críticas.',
  },
]

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  critical: { label: 'Crítico',  color: '#F85149', bg: 'rgba(248,81,73,0.12)',  icon: '⬛' },
  high:     { label: 'Alto',     color: '#D29922', bg: 'rgba(210,153,34,0.12)', icon: '🔶' },
  medium:   { label: 'Médio',    color: '#58A6FF', bg: 'rgba(88,166,255,0.10)', icon: '🔷' },
  low:      { label: 'Baixo',    color: '#3FB950', bg: 'rgba(63,185,80,0.10)',  icon: '🟢' },
}

// ─── Tiny shared components ───────────────────────────────────────────────────

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ color, background: bg, border: `1px solid ${color}40`, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' as const }}>
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
      <div style={{ width: 3, height: 18, background: C.amber, borderRadius: 2 }} />
      <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.sub, margin: 0 }}>{children}</h2>
    </div>
  )
}

// ─── Tab 1: Diagnóstico ────────────────────────────────────────────────────────

function TabDiagnostico() {
  const [filter, setFilter] = useState<string | null>(null)

  const counts = {
    critical: PROBLEMS.filter(p => p.severity === 'critical').length,
    high:     PROBLEMS.filter(p => p.severity === 'high').length,
    medium:   PROBLEMS.filter(p => p.severity === 'medium').length,
    low:      PROBLEMS.filter(p => p.severity === 'low').length,
  }

  const shown = filter ? PROBLEMS.filter(p => p.severity === filter) : PROBLEMS

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {(Object.entries(counts) as [string, number][]).map(([sev, count]) => {
          const cfg = SEVERITY_CONFIG[sev]
          const active = filter === sev
          return (
            <button
              key={sev}
              onClick={() => setFilter(active ? null : sev)}
              style={{
                background: active ? cfg.bg : C.surface,
                border: `1px solid ${active ? cfg.color : C.border}`,
                borderRadius: 10,
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: cfg.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {filter && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge label={`Filtrando: ${SEVERITY_CONFIG[filter].label}`} color={SEVERITY_CONFIG[filter].color} bg={SEVERITY_CONFIG[filter].bg} />
          <button onClick={() => setFilter(null)} style={{ background: 'none', border: 'none', color: C.sub, fontSize: 12, cursor: 'pointer', padding: '2px 6px' }}>× limpar</button>
        </div>
      )}

      {/* Problem cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((p, i) => {
          const cfg = SEVERITY_CONFIG[p.severity]
          return (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <div style={{ width: 4, background: cfg.color, flexShrink: 0 }} />
                <div style={{ padding: '14px 16px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Badge label={cfg.label} color={cfg.color} bg={cfg.bg} />
                    <span style={{ fontSize: 10, color: C.dim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.area}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.55, marginBottom: 10 }}>{p.detail}</div>
                  <div style={{ background: `${cfg.color}0d`, border: `1px solid ${cfg.color}26`, borderRadius: 6, padding: '8px 12px', display: 'flex', gap: 8 }}>
                    <span style={{ color: cfg.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>→ FIX</span>
                    <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{p.fix}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab 2: Sistema Visual ─────────────────────────────────────────────────────

function ColorSwatch({ hex, label, sub }: { hex: string; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ height: 48, background: hex, borderRadius: 8, border: `1px solid ${C.border}` }} />
      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{label}</div>
      <div style={{ fontSize: 10, color: C.dim, fontFamily: 'JetBrains Mono, monospace' }}>{hex}</div>
      {sub && <div style={{ fontSize: 10, color: C.sub }}>{sub}</div>}
    </div>
  )
}

function TabSistemaVisual() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

      {/* Palette */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Paleta de Cores — Dark Mode (padrão 24×7)</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginTop: 16 }}>
          <ColorSwatch hex="#0D1117" label="Background" sub="Fundo base" />
          <ColorSwatch hex="#161B22" label="Surface" sub="Cards e painéis" />
          <ColorSwatch hex="#1C2333" label="Panel" sub="Superfícies elevadas" />
          <ColorSwatch hex="#21262D" label="Muted" sub="Agrupamentos" />
          <ColorSwatch hex="#30363D" label="Border" sub="Divisórias" />
          <ColorSwatch hex="#003865" label="VLI Navy" sub="Acento institucional" />
          <ColorSwatch hex="#F5A623" label="VLI Amber" sub="Ação primária" />
          <ColorSwatch hex="#FFB800" label="VLI Gold" sub="Destaque crítico" />
          <ColorSwatch hex="#F85149" label="Danger" sub="Ocorrência crítica" />
          <ColorSwatch hex="#D29922" label="Warning" sub="Atenção" />
          <ColorSwatch hex="#3FB950" label="Success" sub="Disponível" />
          <ColorSwatch hex="#58A6FF" label="Info" sub="Informativo" />
        </div>
      </div>

      {/* Light mode note */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px', marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Light Mode — Turno diário</div>
        <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
          Background <code style={{ fontFamily: 'monospace', color: C.amber }}>#F4F6F8</code> · Surface <code style={{ fontFamily: 'monospace', color: C.amber }}>#FFFFFF</code> · Text <code style={{ fontFamily: 'monospace', color: C.amber }}>#0D1117</code> · Accent Navy mantido · Amber mantido como ação primária. Implementar via classe <code style={{ fontFamily: 'monospace', color: C.info }}>data-theme="light"</code> no root.
        </div>
      </div>

      {/* Typography */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Tipografia</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 10, color: C.dim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Display · Inter 800 · 28px</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Assistente de Recursos</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>Fluxo Operacional de Emergência Ferroviária</div>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: C.dim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Body · Inter 400 · 14px</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>Recurso disponível e alocado ao corredor Centro Leste com mobilização estimada em 45 minutos.</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.dim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Mono · JetBrains Mono 500 · 13px</div>
              <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: C.amber, lineHeight: 1.6 }}>
                KM: 472+069<br />
                LAT: -19.9847°<br />
                LON: -43.8714°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component examples */}
      <div style={{ marginBottom: 40 }}>
        <SectionTitle>Componentes Base</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>

          {/* Buttons */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Botões</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
              <button style={{ background: C.amber, color: '#0D1117', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                ⚡ Acionar Recurso
              </button>
              <button style={{ background: C.navy, color: C.text, border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Voltar ao Mapa
              </button>
              <button style={{ background: 'transparent', color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button style={{ background: 'rgba(248,81,73,0.1)', color: C.danger, border: `1px solid rgba(248,81,73,0.3)`, borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                ⚠ Emergência
              </button>
            </div>
          </div>

          {/* Status badges */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Status Operacional</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
              <span style={{ background: 'rgba(63,185,80,0.12)', color: C.success, border: '1px solid rgba(63,185,80,0.3)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, display: 'inline-block' }} />
                DISPONÍVEL
              </span>
              <span style={{ background: 'rgba(210,153,34,0.12)', color: C.warning, border: '1px solid rgba(210,153,34,0.3)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.warning, display: 'inline-block' }} />
                EM MOBILIZAÇÃO
              </span>
              <span style={{ background: 'rgba(248,81,73,0.12)', color: C.danger, border: '1px solid rgba(248,81,73,0.3)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.danger, display: 'inline-block' }} />
                CRÍTICO
              </span>
              <span style={{ background: 'rgba(88,166,255,0.10)', color: C.info, border: '1px solid rgba(88,166,255,0.3)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.info, display: 'inline-block' }} />
                ACIONADO
              </span>
            </div>
          </div>

          {/* Form inputs */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Campos de Filtro</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              <div>
                <label style={{ fontSize: 10, color: C.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>1. Trecho / SB</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.dim, fontSize: 13 }}>📍</span>
                  <input
                    placeholder="Ex: ZCE, ZCEZHI"
                    style={{ width: '100%', background: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 10px 8px 30px', fontSize: 12, color: C.text, fontFamily: 'inherit', outline: 'none', textTransform: 'uppercase' as const }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 10, color: C.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>2. KM</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.dim, fontSize: 13 }}>📏</span>
                  <input
                    placeholder="Ex: 472+069"
                    style={{ width: '100%', background: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 10px 8px 30px', fontSize: 12, color: C.text, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System status */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Indicadores de Sistema</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              <div style={{ background: C.panel, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.success, flexShrink: 0, boxShadow: `0 0 8px ${C.success}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>SISMOR Conectado</div>
                  <div style={{ fontSize: 10, color: C.sub }}>1.247 recursos · Atualizado há 2 min</div>
                </div>
                <div style={{ fontSize: 10, color: C.sub, fontFamily: 'JetBrains Mono, monospace' }}>09:14</div>
              </div>
              <div style={{ background: C.panel, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.warning, flexShrink: 0, boxShadow: `0 0 8px ${C.warning}` }} className="pulse-amber" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>Terceiros — Carregando</div>
                  <div style={{ fontSize: 10, color: C.sub }}>437 de 892 · Geocodificando...</div>
                </div>
                <div style={{ width: 48, height: 4, background: C.muted, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '49%', height: '100%', background: C.warning, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 3: Protótipo — Header + Filtros ──────────────────────────────────────

function TabProtoHeader() {
  const [mode, setMode] = useState<'mapa' | 'assistente'>('mapa')

  return (
    <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Protótipo — Header & Barra de Filtros Modernizados</SectionTitle>
      </div>

      {/* Modernized Header */}
      <div style={{ background: C.navy, borderRadius: '10px 10px 0 0', border: `1px solid rgba(255,255,255,0.08)`, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: C.amber, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#0D1117', flexShrink: 0 }}>V</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.2 }}>Assistente Recursos</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.04em' }}>Fluxo Operacional de Emergência Ferroviária</div>
          </div>
        </div>

        {/* Mode toggle + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* System status pills */}
          <div style={{ display: 'flex', gap: 8, marginRight: 8 }}>
            <div style={{ background: 'rgba(63,185,80,0.12)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 99, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success, boxShadow: `0 0 6px ${C.success}` }} />
              <span style={{ fontSize: 10, color: C.success, fontWeight: 700, letterSpacing: '0.05em' }}>SISMOR 1.247</span>
            </div>
            <div style={{ background: 'rgba(210,153,34,0.12)', border: '1px solid rgba(210,153,34,0.3)', borderRadius: 99, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.warning, animation: 'pulse-amber 2s infinite' }} />
              <span style={{ fontSize: 10, color: C.warning, fontWeight: 700, letterSpacing: '0.05em' }}>TERCEIROS 437/892</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

          {/* Selecionar recursos */}
          <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: 7, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            ☰ Recursos
          </button>

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 3, gap: 2 }}>
            <button
              onClick={() => setMode('mapa')}
              style={{ background: mode === 'mapa' ? C.amber : 'transparent', color: mode === 'mapa' ? '#0D1117' : 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: mode === 'mapa' ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              🗺 Mapa
            </button>
            <button
              onClick={() => setMode('assistente')}
              style={{ background: mode === 'assistente' ? C.amber : 'transparent', color: mode === 'assistente' ? '#0D1117' : 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: mode === 'assistente' ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              ▶ Fluxo Guiado
            </button>
          </div>
        </div>
      </div>

      {/* Modernized filter bar */}
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderTop: 'none', padding: '10px 16px', display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' as const }}>
        <div>
          <label style={{ fontSize: 10, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Trecho / SB</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: C.amber, fontSize: 12 }}>📍</span>
            <input
              placeholder="Ex: ZCE, ZCEZHI"
              style={{ background: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: '7px 10px 7px 28px', fontSize: 12, color: C.text, fontFamily: 'inherit', outline: 'none', textTransform: 'uppercase' as const, width: 180 }}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 10, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>KM</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: C.amber, fontSize: 12 }}>📏</span>
            <input
              placeholder="Ex: 472+069"
              style={{ background: C.muted, border: `1px solid ${C.border}`, borderRadius: 7, padding: '7px 10px 7px 28px', fontSize: 12, color: C.text, fontFamily: 'JetBrains Mono, monospace', outline: 'none', width: 140 }}
            />
          </div>
        </div>
        <button style={{ background: C.amber, color: '#0D1117', border: 'none', borderRadius: 7, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, height: 33 }}>
          🔍 Buscar
        </button>

        {/* Active result chip */}
        <div style={{ background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 99, padding: '4px 12px', fontSize: 11, color: C.success, fontWeight: 700, marginLeft: 'auto' }}>
          ✓ 23 recursos encontrados · raio 50 km · ZCE 472+069
        </div>
      </div>

      {/* Annotation layer */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { title: 'Status pills semânticos', desc: 'Verde/amarelo com glow e progresso em tempo real. Substituem os badges monocromáticos.' },
            { title: 'Toggle de modo integrado', desc: 'Substituição do par de botões soltos por pill toggle com transição animada. Estado ativo sempre visível.' },
            { title: 'Chip de resultado ativo', desc: 'Feedback imediato pós-busca com contagem, raio e contexto. Elimina ambiguidade sobre o estado do filtro.' },
          ].map((a, i) => (
            <div key={i} style={{ background: C.muted, borderRadius: 8, padding: '12px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, marginBottom: 4 }}>↑ {a.title}</div>
              <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tab 4: Protótipo — Painel de Recursos ────────────────────────────────────

const SAMPLE_RESOURCES = [
  { dist: '4.2 km', type: 'Escavadeira', name: 'Rental Service', city: 'Araguari · MG', corridor: 'Centro Sudeste', phone: '(34) 98808-6663', status: 'available', source: 'sismor', id: 'REC-0041' },
  { dist: '7.8 km', type: 'Guindaste', name: 'Condor Locações', city: 'Araxá · MG', corridor: 'Centro Leste', phone: '(34) 99940-4136', status: 'mobilizing', source: 'terceiro', id: 'TER-0087' },
  { dist: '12.1 km', type: 'Retroescavadeira', name: 'ZFox Locações', city: 'Araguari · MG', corridor: 'Centro Sudeste', phone: '(34) 98808-1744', status: 'available', source: 'terceiro', id: 'TER-0091' },
  { dist: '18.5 km', type: 'Caminhão Basculante', name: 'Sincinato Locação', city: 'Araguari · MG', corridor: 'Centro Sudeste', phone: '(34) 99294-2062', status: 'engaged', source: 'sismor', id: 'REC-0103' },
]

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  available:  { label: 'Disponível',     color: C.success, bg: 'rgba(63,185,80,0.12)' },
  mobilizing: { label: 'Mobilizando',    color: C.warning, bg: 'rgba(210,153,34,0.12)' },
  engaged:    { label: 'Acionado',       color: C.info,    bg: 'rgba(88,166,255,0.10)' },
}

function ResourceCard({ r }: { r: typeof SAMPLE_RESOURCES[0] }) {
  const st = STATUS_MAP[r.status]
  const isOwn = r.source === 'sismor'

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14 }}>
      {/* Distance spotlight */}
      <div style={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.panel, borderRadius: 8, padding: '8px 4px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.amber, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{r.dist.split(' ')[0]}</div>
        <div style={{ fontSize: 9, color: C.sub, fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>KM</div>
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ background: isOwn ? 'rgba(0,56,101,0.3)' : 'rgba(88,166,255,0.1)', color: isOwn ? '#58A6FF' : C.info, border: `1px solid ${isOwn ? 'rgba(0,56,101,0.5)' : 'rgba(88,166,255,0.3)'}`, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            {isOwn ? '● SISMOR' : '○ Terceiro'}
          </span>
          <span style={{ background: st.bg, color: st.color, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.05em', border: `1px solid ${st.color}40` }}>
            {st.label}
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 3 }}>{r.name}</div>
        <div style={{ fontSize: 11, color: C.sub }}>{r.type} · {r.city}</div>
        <div style={{ fontSize: 10, color: C.dim, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>{r.id} · {r.corridor}</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <a href={`tel:${r.phone}`} style={{ background: C.muted, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
          📞 {r.phone}
        </a>
        <button style={{ background: C.amber, color: '#0D1117', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
          ⚡ Acionar
        </button>
      </div>
    </div>
  )
}

function TabProtoRecursos() {
  const [activeTab, setActiveTab] = useState<'int' | 'terceiros'>('int')

  return (
    <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Protótipo — Painel de Recursos Modernizado</SectionTitle>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' }}>
        {/* Map placeholder */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, height: 460, position: 'relative', overflow: 'hidden' }}>
          {/* Fake dark map */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0D1117 0%, #0a1628 50%, #0f1923 100%)' }}>
            {/* Grid lines simulating map */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 14}%`, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 14}%`, width: 1, background: 'rgba(255,255,255,0.04)' }} />
            ))}

            {/* Rail line */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
              <path d="M 80,380 Q 200,300 280,240 Q 380,180 460,160 Q 540,140 620,180 Q 700,220 780,200" stroke="#F5A623" strokeWidth="2.5" fill="none" opacity="0.7" strokeDasharray="none" />
              <path d="M 80,380 Q 200,300 280,240 Q 380,180 460,160 Q 540,140 620,180 Q 700,220 780,200" stroke="#F5A623" strokeWidth="8" fill="none" opacity="0.08" />
              {/* Tie markers */}
              {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((x, i) => {
                const y = 380 - i * 24
                return <circle key={x} cx={x + 20} cy={Math.max(160, y)} r="3.5" fill="#F5A623" opacity="0.6" />
              })}
            </svg>

            {/* Incident marker */}
            <div style={{ position: 'absolute', left: '45%', top: '30%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.danger, boxShadow: `0 0 0 6px rgba(248,81,73,0.2), 0 0 0 12px rgba(248,81,73,0.08)`, border: '2px solid rgba(255,255,255,0.4)', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', background: C.danger, color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' as const }}>⚠ OCORRÊNCIA</div>
              </div>
            </div>

            {/* Resource markers */}
            {[
              { x: '35%', y: '55%', color: C.success },
              { x: '55%', y: '65%', color: C.warning },
              { x: '62%', y: '42%', color: C.success },
              { x: '28%', y: '38%', color: C.info },
            ].map((m, i) => (
              <div key={i} style={{ position: 'absolute', left: m.x, top: m.y, transform: 'translate(-50%, -50%)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: m.color, border: '2px solid rgba(255,255,255,0.4)', boxShadow: `0 0 8px ${m.color}60` }} />
              </div>
            ))}

            {/* Cluster */}
            <div style={{ position: 'absolute', left: '70%', top: '55%', transform: 'translate(-50%, -50%)', width: 28, height: 28, borderRadius: '50%', background: C.amber, border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#0D1117' }}>
              7
            </div>

            {/* Distance rings */}
            <div style={{ position: 'absolute', left: '45%', top: '30%', transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: '50%', border: '1px dashed rgba(245,166,35,0.3)' }} />
            <div style={{ position: 'absolute', left: '45%', top: '30%', transform: 'translate(-50%,-50%)', width: 220, height: 220, borderRadius: '50%', border: '1px dashed rgba(245,166,35,0.15)' }} />

            {/* Map controls */}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['+', '−', '⊕'].map((btn, i) => (
                <button key={i} style={{ width: 30, height: 30, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{btn}</button>
              ))}
            </div>

            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(8px)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: 9, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Legenda</div>
              {[
                { color: C.success, label: 'Disponível' },
                { color: C.warning, label: 'Mobilizando' },
                { color: C.info, label: 'Acionado' },
                { color: C.danger, label: 'Ocorrência' },
                { color: C.amber, label: 'Cluster' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 10, color: C.sub }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Tile attribution */}
            <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>CartoDB Dark Matter · VLI Layer</div>
          </div>
        </div>

        {/* Results panel */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Panel header */}
          <div style={{ background: C.navy, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: 7 }}>
                🎯 Recursos por Proximidade
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>ZCE · 472+069 · raio 50 km</div>
            </div>
            <button style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: C.panel, borderBottom: `1px solid ${C.border}` }}>
            {([['int', '🛡 SISMOR', 12], ['terceiros', '🏢 Terceiros', 8]] as const).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{ flex: 1, padding: '10px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: 'none', color: activeTab === key ? C.amber : C.sub, borderBottom: `2px solid ${activeTab === key ? C.amber : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
              >
                {label}
                <span style={{ background: activeTab === key ? C.amber : C.muted, color: activeTab === key ? '#0D1117' : C.sub, fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 99 }}>{count}</span>
              </button>
            ))}
          </div>

          {/* Resource list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320 }}>
            {SAMPLE_RESOURCES.filter(r => activeTab === 'int' ? r.source === 'sismor' : r.source === 'terceiro').map((r, i) => (
              <ResourceCard key={i} r={r} />
            ))}
          </div>

          {/* CTA footer */}
          <div style={{ padding: '10px', borderTop: `1px solid ${C.border}`, background: C.panel }}>
            <button style={{ width: '100%', background: C.panel, color: C.text, border: `1px solid ${C.border}`, borderRadius: 7, padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              ▶ Abrir Fluxo de Acionamento Guiado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 5: Protótipo — Wizard / Playbook ─────────────────────────────────────

const WIZARD_STEPS = [
  { id: 1, label: 'Ocorrência',    done: true },
  { id: 2, label: 'Triagem',       done: true },
  { id: 3, label: 'Acionamento',   done: false, active: true },
  { id: 4, label: 'Confirmação',   done: false },
  { id: 5, label: 'Monitoramento', done: false },
]

function TabProtoWizard() {
  return (
    <div style={{ padding: '24px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <SectionTitle>Protótipo — Playbook de Acionamento Modernizado</SectionTitle>
      </div>

      {/* Top context bar */}
      <div style={{ background: C.navy, borderRadius: '10px 10px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: 'rgba(248,81,73,0.15)', color: C.danger, border: '1px solid rgba(248,81,73,0.3)', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>⚠ Protocolo CCO Ativo</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Trecho: <strong style={{ color: C.amber }}>ZCE</strong></span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>KM: <strong style={{ color: C.amber, fontFamily: 'JetBrains Mono, monospace' }}>472+069</strong></span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Coord: <strong style={{ color: C.sub, fontFamily: 'JetBrains Mono, monospace' }}>-19.9847, -43.8714</strong></span>
        </div>
        <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          ← Voltar ao Mapa
        </button>
      </div>

      {/* Progress stepper */}
      <div style={{ background: C.panel, padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 0 }}>
        {WIZARD_STEPS.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < WIZARD_STEPS.length - 1 ? 1 : 'initial' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0,
                background: step.done ? C.success : step.active ? C.amber : C.muted,
                color: step.done || step.active ? '#0D1117' : C.dim,
                boxShadow: step.active ? `0 0 12px ${C.amber}60` : 'none',
              }}>
                {step.done ? '✓' : step.id}
              </div>
              <span style={{ fontSize: 10, fontWeight: step.active ? 700 : 500, color: step.done ? C.success : step.active ? C.amber : C.dim, whiteSpace: 'nowrap' as const }}>{step.label}</span>
            </div>
            {i < WIZARD_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: step.done ? C.success : C.muted, margin: '0 8px', marginBottom: 14, borderRadius: 1 }} />
            )}
          </div>
        ))}
      </div>

      {/* Main layout: mini map + wizard content */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden', minHeight: 380 }}>
        {/* Mini map */}
        <div style={{ background: '#0a1628', borderRight: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
              <path d="M 20,200 Q 80,140 110,110 Q 160,80 200,100" stroke="#F5A623" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
            {/* Incident pin */}
            <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.danger, border: '2px solid white', boxShadow: `0 0 0 4px rgba(248,81,73,0.3)` }} />
            </div>
            <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, background: 'rgba(13,17,23,0.8)', borderRadius: 6, padding: '6px 8px' }}>
              <div style={{ fontSize: 9, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Ocorrência</div>
              <div style={{ fontSize: 10, color: C.amber, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>ZCE · 472+069</div>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>Mapa Contextual</div>
        </div>

        {/* Wizard content */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: 11, color: C.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Passo 3 de 5</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 2 }}>Acionamento de Recursos</div>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 20 }}>Selecione e acione os recursos necessários para atender a ocorrência.</div>

          {/* Selected resources to dispatch */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.sub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recursos Selecionados para Acionamento</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '🚧', name: 'Rental Service — Escavadeira', dist: '4.2 km', eta: '~25 min' },
                { icon: '🏗', name: 'ZFox Locações — Retroescavadeira', dist: '12.1 km', eta: '~45 min' },
              ].map((r, i) => (
                <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.sub }}>Distância: <span style={{ color: C.amber, fontFamily: 'JetBrains Mono, monospace' }}>{r.dist}</span> · ETA estimado: <span style={{ color: C.info }}>{r.eta}</span></div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ background: 'rgba(248,81,73,0.1)', color: C.danger, border: `1px solid rgba(248,81,73,0.3)`, borderRadius: 6, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>Remover</button>
                    <button style={{ background: C.amber, color: '#0D1117', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>⚡ Acionar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email draft preview */}
          <div style={{ background: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.amber, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>📧 Rascunho de E-mail de Acionamento</div>
            <div style={{ fontSize: 11, color: C.sub, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
              Para: fornecedor@email.com<br />
              Assunto: [VLI/EMERGÊNCIA] Acionamento de Recurso – ZCE 472+069<br />
              <br />
              <span style={{ color: C.dim }}>Solicitamos mobilização imediata de 1 (uma) Escavadeira...</span>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={{ background: C.muted, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 7, padding: '9px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ← Triagem
            </button>
            <button style={{ background: C.amber, color: '#0D1117', border: 'none', borderRadius: 7, padding: '9px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Confirmação →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 6: UX Suggestions (Roadmap) ─────────────────────────────────────────

const SUGGESTIONS = [
  {
    phase: 'Imediato (Sprint 1)',
    color: C.danger,
    items: [
      'Trocar tile Leaflet para CartoDB Dark Matter (1 linha de config)',
      'Adicionar label "Buscar" no botão de busca + atalho Enter',
      'Aumentar contraste dos labels de filtro (text-slate-400 → #8B949E sobre fundo escuro ≥4.5:1)',
      'Separar header por cor semântica (navy VLI) da barra de filtros',
      'Status pills animados com progresso para SISMOR e Terceiros',
    ]
  },
  {
    phase: 'Curto Prazo (Sprint 2–3)',
    color: C.warning,
    items: [
      'Destaque de DISTÂNCIA como dado primário nos cards de recurso (número grande)',
      'Tabs SISMOR / Terceiros com badge de contagem estilizado',
      'Toggle de modo (Mapa / Fluxo Guiado) como pill, não par de botões',
      'Chip de resultado ativo pós-busca com contagem e raio',
      'Fila de toasts tipados (info / success / warning / error) com auto-dismiss',
    ]
  },
  {
    phase: 'Médio Prazo (Sprint 4–6)',
    color: C.info,
    items: [
      'Clusterização de marcadores Leaflet.markercluster com threshold configurável',
      'Layout split no Wizard: mini mapa persistente + painel de playbook',
      'Progress stepper de 5 etapas no Wizard (estilo Azure DevOps)',
      'Dark Mode / Light Mode via data-theme com persistência em localStorage',
      'Sidebar de seleção de recursos com grupos colapsáveis e checkboxes estilizados',
    ]
  },
  {
    phase: 'Longo Prazo (Roadmap)',
    color: C.success,
    items: [
      'Heatmap de ocorrências históricas por trecho/corredor (Leaflet.heat)',
      'Camada vetorial das linhas ferroviárias VLI (GeoJSON) sobre tile escuro',
      'Autocomplete de Trecho/SB com dropdown de sugestões da base SBS',
      'Dashboard KPI: ocorrências/mês por corredor, tempo médio de acionamento',
      'Acessibilidade WCAG AA completa: aria-live, focus rings, skip-to-content',
    ]
  },
]

function TabSugestoesUX() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Sugestões de UX — Roadmap Priorizado</SectionTitle>
        <p style={{ fontSize: 13, color: C.sub, marginTop: 8, lineHeight: 1.6 }}>
          Todas as sugestões preservam 100% das regras de negócio, fluxos, campos e integrações existentes. São mudanças puramente de interface e experiência.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SUGGESTIONS.map((phase, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: C.panel, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: phase.color, boxShadow: `0 0 8px ${phase.color}60` }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{phase.phase}</span>
              <span style={{ background: `${phase.color}18`, color: phase.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, marginLeft: 'auto', border: `1px solid ${phase.color}40` }}>
                {phase.items.length} itens
              </span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {phase.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${phase.color}60`, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${phase.color}08` }}>
                    <span style={{ fontSize: 9, color: phase.color, fontWeight: 800 }}>{j + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Closing note */}
      <div style={{ background: `rgba(0,56,101,0.15)`, border: `1px solid rgba(0,56,101,0.4)`, borderRadius: 10, padding: '16px 20px', marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.info, marginBottom: 6 }}>Nota sobre implementação</div>
        <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.7 }}>
          O sistema atual é uma aplicação HTML/JS vanilla monolítica com Leaflet, PapaParse e lógica de negócio em JS puro. A modernização da UI pode ser feita em duas abordagens: <strong style={{ color: C.text }}>(A) CSS-only</strong> — substituir classes Tailwind inline e adicionar CSS customizado sem refatorar o JS (menor risco, deploy imediato) — ou <strong style={{ color: C.text }}>(B) Migração React</strong> — portar a lógica para hooks React preservando todas as funções e IDs do DOM que o JS já usa. A Abordagem A é recomendada para entrega rápida de valor visual; a B para manutenibilidade a longo prazo.
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'diagnostico',   label: '🔍 Diagnóstico',     count: PROBLEMS.length },
  { id: 'visual',        label: '🎨 Sistema Visual',  count: null },
  { id: 'header',        label: '🖥 Header & Filtros', count: null },
  { id: 'recursos',      label: '📋 Painel Recursos',  count: null },
  { id: 'wizard',        label: '▶ Wizard/Playbook',  count: null },
  { id: 'sugestoes',     label: '🗺 Roadmap UX',       count: SUGGESTIONS.reduce((a, s) => a + s.items.length, 0) },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('diagnostico')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* App Header */}
      <header style={{ background: C.navy, padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, paddingTop: 14, paddingBottom: 0 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14 }}>
            <div style={{ width: 32, height: 32, background: C.amber, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#0D1117', flexShrink: 0 }}>V</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, lineHeight: 1.1, letterSpacing: '-0.01em' }}>Assistente Recursos — UX Review</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Análise UX/UI · VLI Logística Ferroviária · 2026</div>
            </div>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', gap: 2, marginLeft: 'auto', overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? C.amber : 'transparent'}`,
                  color: activeTab === tab.id ? C.amber : 'rgba(255,255,255,0.55)',
                  padding: '10px 14px 12px',
                  fontSize: 12,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap' as const,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span style={{ background: activeTab === tab.id ? C.amber : 'rgba(255,255,255,0.12)', color: activeTab === tab.id ? '#0D1117' : 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 99 }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Tab content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'diagnostico' && <TabDiagnostico />}
        {activeTab === 'visual'      && <TabSistemaVisual />}
        {activeTab === 'header'      && <TabProtoHeader />}
        {activeTab === 'recursos'    && <TabProtoRecursos />}
        {activeTab === 'wizard'      && <TabProtoWizard />}
        {activeTab === 'sugestoes'   && <TabSugestoesUX />}
      </main>

      {/* Footer */}
      <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: C.dim }}>VLI Assistente Recursos · UX Review · {PROBLEMS.length} problemas identificados</span>
        <span style={{ fontSize: 11, color: C.dim, fontFamily: 'JetBrains Mono, monospace' }}>Dark Mode · Inter + JetBrains Mono</span>
      </footer>
    </div>
  )
}
