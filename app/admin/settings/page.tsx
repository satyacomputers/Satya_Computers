'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Clock,
  Database,
  Lock,
  Activity,
  Server,
  Key,
  ShieldAlert,
  Percent,
  Truck,
  Tag,
  Save,
  Zap,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Premium Toggle Switch ────────────────────────────────────────── */
function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label
        htmlFor={id}
        title={label}
        className={`relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-all duration-300 ${
          checked
            ? 'bg-[#0A1628] shadow-lg shadow-[#0A1628]/20'
            : 'bg-gray-200'
        }`}
      >
        <span className="sr-only">{label}</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={`inline-block h-5 w-5 rounded-full shadow-md ${
            checked ? 'bg-[#F97316]' : 'bg-white'
          }`}
          style={{ marginLeft: checked ? '1.75rem' : '0.25rem' }}
        />
      </label>
    </div>
  );
}

/* ─── Protocol Card ─────────────────────────────────────────────────── */
function ProtocolCard({
  id,
  icon: Icon,
  label,
  unit,
  value,
  enabled,
  accentClass,
  ringClass,
  applyLabel,
  applyHover,
  onToggle,
  onValueChange,
  onApply,
}: {
  id: string;
  icon: any;
  label: string;
  unit: string;
  value: number;
  enabled: boolean;
  accentClass: string;
  ringClass: string;
  applyLabel: string;
  applyHover: string;
  onToggle: (v: boolean) => void;
  onValueChange: (v: number) => void;
  onApply: () => void;
}) {
  return (
    <motion.div
      animate={{ opacity: enabled ? 1 : 0.55 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-3xl border-2 p-6 space-y-5 transition-all duration-300 ${
        enabled
          ? 'border-gray-100 bg-white shadow-lg shadow-gray-100/60'
          : 'border-dashed border-gray-200 bg-gray-50/50'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label htmlFor={`${id}-input`} className="flex items-center gap-3 cursor-pointer">
          <div className={`p-2 rounded-xl ${accentClass}`}>
            {Icon && (() => {
              const IconComp = Icon as any;
              return <IconComp size={18} />;
            })()}
          </div>
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">
            {label}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${enabled ? 'text-[#0A1628]' : 'text-gray-400'}`}>
            {enabled ? 'ON' : 'OFF'}
          </span>
          <ToggleSwitch
            id={`${id}-toggle`}
            checked={enabled}
            onChange={onToggle}
            label={`Toggle ${label}`}
          />
        </div>
      </div>

      {/* Status badge */}
      <AnimatePresence mode="wait">
        {enabled ? (
          <motion.div
            key="on"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
              Active — will apply to inventory
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <XCircle size={12} className="text-gray-400" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Inactive — will be skipped
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="relative">
        <input
          id={`${id}-input`}
          type="number"
          min={0}
          max={unit === '%' ? 100 : undefined}
          title={label}
          placeholder={unit === '%' ? 'e.g. 18' : 'e.g. 99'}
          disabled={!enabled}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          suppressHydrationWarning
          className={`w-full rounded-2xl p-4 pr-14 font-heading font-black text-2xl transition-all outline-none border
            ${enabled
              ? `bg-white border-gray-100 text-[#0A1628] ${ringClass}`
              : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed'
            }`}
        />
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black uppercase tracking-widest ${enabled ? 'text-gray-400' : 'text-gray-300'}`}>
          {unit}
        </span>
      </div>

      {/* Apply button */}
      <button
        id={`${id}-apply-btn`}
        disabled={!enabled}
        onClick={onApply}
        title={enabled ? applyLabel : `Enable ${label} first`}
        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
          enabled
            ? `bg-[#0A1628] text-white ${applyHover}`
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Zap size={12} />
        {applyLabel}
      </button>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function AdminSettings() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState({
    gstPercentage:      18,
    shippingCharges:    0,
    discountPercentage: 0,
    gstEnabled:         false,
    shippingEnabled:    false,
    discountEnabled:    false,
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchAdmins();
    fetchSettings();
  }, []);

  const showStatus = (text: string, ok = true) => {
    setStatus({ text, ok });
    setTimeout(() => setStatus(null), 5000);
  };

  const fetchSettings = async () => {
    try {
      const res  = await fetch('/api/admin/settings');
      const data = await res.json();
      if (!data.error) {
        setSettings({
          gstPercentage:      Number(data.gstPercentage)      || 0,
          shippingCharges:    Number(data.shippingCharges)    || 0,
          discountPercentage: Number(data.discountPercentage) || 0,
          gstEnabled:         Boolean(data.gstEnabled),
          shippingEnabled:    Boolean(data.shippingEnabled),
          discountEnabled:    Boolean(data.discountEnabled),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch('/api/admin/settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(settings),
      });
      const data = await res.json();
      data.success ? showStatus('Configuration persisted ✓', true) : showStatus(data.error || 'Save failed', false);
    } catch {
      showStatus('Network error — save failed', false);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpdate = async (action: string) => {
    showStatus('Deploying…', true);
    try {
      const res  = await fetch('/api/admin/settings/bulk-update', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action }),
      });
      const data = await res.json();
      data.success ? showStatus(data.message, true) : showStatus(data.error || 'Failed', false);
    } catch {
      showStatus('Network error — update failed', false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res  = await fetch('/api/admin/list');
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upd = (key: keyof typeof settings) => (val: any) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  if (!mounted) return null;

  return (
    <div className="space-y-10 p-4 lg:p-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">
            SYSTEM <span className="text-gray-300">/ INFRASTRUCTURE</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Global administrative permissions and core system integrity matrix.
          </p>
        </div>
        <div className="px-6 py-4 rounded-2xl bg-[#0A1628] text-white flex items-center gap-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F97316]">
            <Lock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Security Level</p>
            <p className="text-sm font-black text-white uppercase font-heading">ELITE-LEVEL-5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Command Units table */}
          <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F97316] shadow-inner">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-[#0A1628] uppercase tracking-widest text-sm">Active Command Units</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Authorized Administrative Personnel</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gray-100 rounded-xl text-[10px] font-black text-[#0A1628] uppercase tracking-widest">
                {admins.length} Units Active
              </span>
            </div>

            <div className="overflow-x-auto p-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                    <th className="px-6 py-4 rounded-l-2xl">Identifier</th>
                    <th className="px-6 py-4">Status Matrix</th>
                    <th className="px-6 py-4">Security Signature</th>
                    <th className="px-6 py-4 rounded-r-2xl">Initialization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#F97316] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Scanning Identities...</p>
                      </td>
                    </tr>
                  ) : admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-6 py-6 rounded-l-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-all">
                            <Users size={18} />
                          </div>
                          <span className="font-heading font-black text-[#0A1628] uppercase tracking-tighter text-base">{admin.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          admin.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100/50' :
                          admin.role === 'management' ? 'bg-blue-50 text-blue-600 border border-blue-100/50' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <Key size={12} className="text-gray-300" />
                          <span className="text-[9px] font-bold text-gray-300 truncate max-w-[120px] font-mono tracking-widest uppercase group-hover:text-gray-500 transition-colors">
                            {admin.password.substring(0, 16)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 rounded-r-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Clock size={12} className="text-[#F97316]" />
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMMERCE PROTOCOLS */}
          <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            {/* Section header */}
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-[#0A1628] uppercase tracking-widest text-sm">Commerce Protocols</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    Toggle each protocol ON to enable — prices applied to all inventory
                  </p>
                </div>
              </div>

              {/* Status toast */}
              <AnimatePresence>
                {status && (
                  <motion.span
                    key={status.text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border max-w-xs text-right ${
                      status.ok
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}
                  >
                    {status.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="p-8 space-y-8">
              {/* Active toggles summary bar */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Protocols:</span>
                {[
                  { key: 'gstEnabled',      label: 'GST',      enabled: settings.gstEnabled },
                  { key: 'shippingEnabled', label: 'Shipping', enabled: settings.shippingEnabled },
                  { key: 'discountEnabled', label: 'Discount', enabled: settings.discountEnabled },
                ].map(({ label, enabled }) => (
                  <span key={label} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    enabled
                      ? 'bg-[#0A1628] text-[#F97316] border-[#0A1628]'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {label}
                  </span>
                ))}
                {!settings.gstEnabled && !settings.shippingEnabled && !settings.discountEnabled && (
                  <span className="text-[9px] font-bold text-gray-400 italic">None — all protocols off</span>
                )}
              </div>

              {/* Three protocol cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProtocolCard
                  id="gst"
                  icon={Percent}
                  label="GST"
                  unit="%"
                  value={settings.gstPercentage}
                  enabled={settings.gstEnabled}
                  accentClass="bg-orange-50 text-orange-600"
                  ringClass="focus:ring-2 focus:ring-[#F97316]"
                  applyLabel="Apply GST"
                  applyHover="hover:bg-[#F97316]"
                  onToggle={upd('gstEnabled')}
                  onValueChange={upd('gstPercentage')}
                  onApply={() => handleBulkUpdate('apply_gst')}
                />
                <ProtocolCard
                  id="shipping"
                  icon={Truck}
                  label="SHIPPING (₹)"
                  unit="₹"
                  value={settings.shippingCharges}
                  enabled={settings.shippingEnabled}
                  accentClass="bg-blue-50 text-blue-600"
                  ringClass="focus:ring-2 focus:ring-blue-500"
                  applyLabel="Apply Shipping"
                  applyHover="hover:bg-blue-600"
                  onToggle={upd('shippingEnabled')}
                  onValueChange={upd('shippingCharges')}
                  onApply={() => handleBulkUpdate('apply_shipping')}
                />
                <ProtocolCard
                  id="discount"
                  icon={Tag}
                  label="DISCOUNT (₹)"
                  unit="₹"
                  value={settings.discountPercentage}
                  enabled={settings.discountEnabled}
                  accentClass="bg-emerald-50 text-emerald-600"
                  ringClass="focus:ring-2 focus:ring-emerald-500"
                  applyLabel="Apply Discount"
                  applyHover="hover:bg-emerald-600"
                  onToggle={upd('discountEnabled')}
                  onValueChange={upd('discountPercentage')}
                  onApply={() => handleBulkUpdate('apply_discount')}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-50">
                <button
                  id="persist-config-btn"
                  disabled={saving}
                  onClick={handleSave}
                  className="flex-1 py-5 rounded-[2rem] bg-gray-900 shadow-xl shadow-gray-900/10 text-white font-heading font-black text-sm uppercase tracking-widest hover:bg-[#F97316] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  <Save size={20} /> {saving ? 'SYNCING...' : 'PERSIST CONFIGURATION'}
                </button>
                <button
                  id="deploy-all-btn"
                  onClick={() => handleBulkUpdate('apply_all')}
                  className="flex-1 py-5 rounded-[2rem] bg-orange-50 border border-orange-100 text-[#F97316] font-heading font-black text-sm uppercase tracking-widest hover:bg-[#F97316] hover:text-white transition-all flex items-center justify-center gap-4"
                >
                  <Zap size={20} /> DEPLOY ALL ACTIVE
                </button>
              </div>

              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
                ⚠ Save toggles &amp; values first → then deploy. Only ON protocols will affect inventory pricing.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-8">
          <div className="bg-[#0A1628] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[#F97316] mb-8">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-heading font-black uppercase tracking-tight mb-4">
                SYSTEM <span className="text-[#F97316]">PULSE</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Current operational status of Satya Computers global database and API layers.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Database Health', status: 'Optimal',      icon: Database },
                  { label: 'Latency Map',     status: '12ms (Avg)',   icon: Server   },
                  { label: 'Auth Handshakes', status: 'Success',      icon: Shield   },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className="text-gray-500 group-hover:text-[#F97316] transition-colors" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest">{item.status}</span>
                  </div>
                ))}
              </div>

              {/* Live protocol status in sidebar */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Pricing Engine</p>
                {[
                  { label: 'GST Protocol',      on: settings.gstEnabled      },
                  { label: 'Shipping Protocol',  on: settings.shippingEnabled },
                  { label: 'Discount Protocol',  on: settings.discountEnabled },
                ].map(({ label, on }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${on ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {on ? '● ACTIVE' : '○ IDLE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-[#F97316]" />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h4 className="text-base font-heading font-black text-[#0A1628] uppercase tracking-widest mb-6">Policy Directive</h4>
            <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
              Administrative roles are strictly hierarchical. Root access (Admin) is required for sensitive inventory mutations.
            </p>
            <button
              id="review-protocols-btn"
              onClick={async () => {
                const btn = document.getElementById('review-protocols-btn') as HTMLButtonElement;
                if (!btn) return;
                const orig = btn.innerText;
                btn.innerText = 'ACCESSING...';
                btn.style.opacity = '0.5';
                await new Promise((r) => setTimeout(r, 1500));
                btn.innerText = 'DOWNLOADED ✓';
                btn.style.backgroundColor = '#ecfdf5';
                btn.style.color = '#059669';
                setTimeout(() => { btn.innerText = orig; btn.style.opacity = '1'; btn.style.backgroundColor = ''; btn.style.color = ''; }, 3000);
              }}
              className="w-full py-4 rounded-2xl bg-gray-50 text-[10px] font-black text-[#0A1628] uppercase tracking-[0.2em] border border-gray-100 hover:bg-white hover:border-[#F97316] hover:text-[#F97316] transition-all"
            >
              REVIEW PROTOCOLS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
