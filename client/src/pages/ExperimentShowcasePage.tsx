import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Experiment } from '../types';
import {
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  Play,
  RotateCcw,
  Code,
  Layers,
  FileText,
  Shield,
  Award,
  Sparkles,
  Info,
  Maximize2,
  X,
} from 'lucide-react';

export const ExperimentShowcasePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [catalog, setCatalog] = useState<any | null>(null);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [loading, setLoading] = useState(true);

  // Exp 9 TCL Live Simulator State
  const [exp9Rows, setExp9Rows] = useState<any[]>([]);
  const [exp9InTransaction, setExp9InTransaction] = useState(false);
  const [exp9Savepoint, setExp9Savepoint] = useState<string | null>(null);
  const [exp9History, setExp9History] = useState<string[]>([]);
  const [exp9Loading, setExp9Loading] = useState(false);
  const [exp9SelectedId, setExp9SelectedId] = useState('101');
  const [exp9NewStatus, setExp9NewStatus] = useState('RETURNED');
  const [exp9NewHolder, setExp9NewHolder] = useState('Tanay Dekate (SAP 70011122001)');

  // Exp 10 MongoDB CRUD Simulator State
  const [mongoDocs, setMongoDocs] = useState<any[]>([]);
  const [mongoOp, setMongoOp] = useState<string>('find');
  const [mongoFilter, setMongoFilter] = useState('{\n  "category": "Electronics"\n}');
  const [mongoUpdate, setMongoUpdate] = useState('{\n  "$set": {\n    "custodyLocation": "High Security Vault Locker 01"\n  }\n}');
  const [mongoInsert, setMongoInsert] = useState('{\n  "itemTitle": "Apple iPad Pro 11-inch",\n  "category": "Electronics",\n  "brand": "Apple",\n  "color": "Space Grey",\n  "location": "Room 402",\n  "status": "in_custody"\n}');
  const [mongoResult, setMongoResult] = useState<any | null>(null);
  const [mongoLoading, setMongoLoading] = useState(false);

  // Diagram Lightbox
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    loadCatalog();
    loadExp9();
    loadExp10();
  }, []);

  const loadCatalog = async () => {
    try {
      const data = await api.getCatalog();
      setCatalog(data);
      if (data.experiments?.length > 0) {
        setSelectedExp(data.experiments[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadExp9 = async () => {
    try {
      const data = await api.getExp9State();
      setExp9Rows(data.rows);
      setExp9InTransaction(data.inTransaction);
      setExp9Savepoint(data.savepoint);
      setExp9History(data.history);
    } catch (e) {
      console.error(e);
    }
  };

  const loadExp10 = async () => {
    try {
      const data = await api.getExp10Docs();
      setMongoDocs(data.documents);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunExp9 = async (cmd: string) => {
    setExp9Loading(true);
    try {
      const res = await api.executeExp9(cmd, {
        itemId: exp9SelectedId,
        newStatus: exp9NewStatus,
        newHolder: exp9NewHolder,
      });
      setExp9Rows(res.rows);
      setExp9InTransaction(res.inTransaction);
      setExp9Savepoint(res.savepoint);
      setExp9History(res.history);
    } catch (err: any) {
      alert('TCL Error: ' + err.message);
    } finally {
      setExp9Loading(false);
    }
  };

  const handleResetExp9 = async () => {
    try {
      const res = await api.resetExp9();
      setExp9Rows(res.rows);
      setExp9InTransaction(false);
      setExp9Savepoint(null);
      setExp9History(['State reset to baseline.']);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunMongo = async () => {
    setMongoLoading(true);
    try {
      let payload: any = {};
      if (mongoOp === 'find') {
        payload = { filter: JSON.parse(mongoFilter || '{}') };
      } else if (mongoOp === 'insertOne') {
        payload = JSON.parse(mongoInsert);
      } else if (mongoOp === 'updateOne' || mongoOp === 'updateMany') {
        payload = {
          filter: JSON.parse(mongoFilter || '{}'),
          update: JSON.parse(mongoUpdate || '{}'),
        };
      } else if (mongoOp === 'deleteOne' || mongoOp === 'deleteMany') {
        payload = JSON.parse(mongoFilter || '{}');
      }

      const res = await api.runExp10Crud(mongoOp, payload);
      setMongoResult(res.result);
      setMongoDocs(res.currentCollectionState);
    } catch (err: any) {
      alert('MongoDB Error: ' + err.message);
    } finally {
      setMongoLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Showcase Hero Banner */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-charcoal-700 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach-500/20 text-peach-300 text-xs font-semibold border border-peach-500/30">
            <Award className="w-4 h-4 text-peach-400" />
            <span>SVKM's NMIMS MPSTME • Department of Computer Engineering</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-sans leading-tight">
            Software Engineering Lab Showcase
            <span className="block text-transparent bg-clip-text peach-gradient mt-1">
              Experiments 1 through 10
            </span>
          </h1>

          <p className="text-sm text-cream-100/90 leading-relaxed max-w-2xl">
            This showcase presents how the <strong>Campus Lost & Found Management System</strong>{' '}
            practically realizes every software engineering concept taught across Experiments 1 to 10.
          </p>

          {/* Student Contributors Pill */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Tanay Dekate (<strong>N022</strong>)
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Jivitesh Dutt (<strong>N026</strong>)
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              Gatha Jain (<strong>N038</strong>)
            </span>
            <span className="bg-peach-500/20 text-peach-300 px-3 py-1.5 rounded-lg border border-peach-500/30 font-semibold">
              MBA Tech CE • Div D / Batch D1
            </span>
          </div>
        </div>
      </div>

      {/* Main 10 Experiments Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-charcoal-900 font-sans">
              Experiments 1–10 Curriculum Mapping
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Select any experiment below to view objectives, authentic diagrams, and live interactive simulators.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading lab catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalog?.experiments.map((exp: Experiment) => {
              const isSelected = selectedExp?.id === exp.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-peach-500 ring-2 ring-peach-500/20 shadow-soft'
                      : 'border-[#F3E8E2] hover:border-peach-300 shadow-soft-sm hover:shadow-soft'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-lg bg-peach-100 text-peach-700 font-extrabold text-xs flex items-center justify-center font-mono">
                        E0{exp.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal-900 group-hover:text-peach-600 transition-colors font-sans line-clamp-1">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {exp.aim}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-peach-700 font-medium text-[11px]">
                      {exp.diagramType}
                    </span>
                    <span className="text-gray-400 group-hover:text-peach-600 flex items-center gap-0.5 font-semibold text-[11px]">
                      <span>Inspect Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Experiment In-Depth Viewer */}
      {selectedExp && (
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F3E8E2] shadow-soft space-y-8 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-peach-500 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                  Experiment 0{selectedExp.id}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Implemented in CampusFind
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-sans">
                {selectedExp.title}
              </h3>
            </div>

            <button
              onClick={() => navigate(selectedExp.featureLink)}
              className="px-5 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 font-bold text-xs border border-cream-300 transition-colors flex items-center gap-2 shrink-0 self-start"
            >
              <span>Test Live Application Feature</span>
              <ExternalLink className="w-3.5 h-3.5 text-peach-600" />
            </button>
          </div>

          {/* Aim & Implementation Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200 space-y-2">
              <h4 className="font-bold text-charcoal-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 text-peach-600" />
                <span>Lab Syllabus Aim & Objective</span>
              </h4>
              <p className="text-gray-700 leading-relaxed">{selectedExp.aim}</p>
            </div>

            <div className="bg-peach-50/50 p-5 rounded-2xl border border-peach-200 space-y-2">
              <h4 className="font-bold text-peach-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-peach-600" />
                <span>Project Implementation</span>
              </h4>
              <p className="text-charcoal-800 leading-relaxed">{selectedExp.implementation}</p>
            </div>
          </div>

          {/* Key Deliverables Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Student Lab Deliverables
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedExp.deliverables.map((del, i) => (
                <span
                  key={i}
                  className="bg-white border border-gray-200 text-charcoal-800 text-xs px-3 py-1.5 rounded-xl font-medium shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{del}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Authentic Lab Diagram Display (if present) */}
          {selectedExp.diagramImage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-peach-600" />
                  <span>Authentic StarUML / Lab Document Diagram</span>
                </h4>
                <button
                  onClick={() => setLightboxImg(selectedExp.diagramImage)}
                  className="text-xs font-bold text-peach-600 hover:underline flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Diagram</span>
                </button>
              </div>

              <div
                onClick={() => setLightboxImg(selectedExp.diagramImage)}
                className="bg-cream-100/60 rounded-2xl p-4 border border-cream-200 text-center overflow-hidden cursor-zoom-in group"
              >
                <img
                  src={selectedExp.diagramImage}
                  alt={selectedExp.title}
                  className="max-h-96 mx-auto rounded-xl object-contain shadow-sm group-hover:scale-[1.01] transition-transform"
                />
                <p className="text-[11px] text-gray-400 mt-3 font-medium">
                  Extracted directly from submitted Software Engineering Lab documentation (Tanay Dekate N022, Jivitesh Dutt N026, Gatha Jain N038). Click to zoom.
                </p>
              </div>
            </div>
          )}

          {/* SPECIAL SECTION: EXPERIMENT 9 LIVE TCL & DCL RUNNER */}
          {selectedExp.id === 9 && (
            <div className="bg-charcoal-900 rounded-3xl p-6 sm:p-8 text-cream-100 space-y-6 border border-charcoal-700 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-700 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-peach-400">
                    EXPERIMENT 09 LIVE WORKBENCH
                  </span>
                  <h4 className="text-xl font-bold text-white font-sans">
                    SQL Transaction Control (TCL) & Access Control (DCL)
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold font-mono ${
                      exp9InTransaction
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {exp9InTransaction ? 'TRANSACTION ACTIVE (IN PROGRESS)' : 'AUTOCOMMIT MODE'}
                  </span>
                  <button
                    onClick={handleResetExp9}
                    className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs flex items-center gap-1 border border-charcoal-700"
                    title="Reset Table to Seed State"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Table</span>
                  </button>
                </div>
              </div>

              {/* TCL Live Command Bar */}
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-medium">
                  Trigger genuine SQL Transaction commands against the live test relation:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRunExp9('START_TRANSACTION')}
                    disabled={exp9InTransaction || exp9Loading}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    1. START TRANSACTION
                  </button>

                  <button
                    onClick={() => handleRunExp9('UPDATE_RECORD')}
                    disabled={exp9Loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    2. UPDATE RECORD
                  </button>

                  <button
                    onClick={() => handleRunExp9('SAVEPOINT')}
                    disabled={!exp9InTransaction || exp9Loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    3. SAVEPOINT sp_handover
                  </button>

                  <button
                    onClick={() => handleRunExp9('ROLLBACK_TO_SAVEPOINT')}
                    disabled={!exp9Savepoint || exp9Loading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    4. ROLLBACK TO SAVEPOINT
                  </button>

                  <button
                    onClick={() => handleRunExp9('COMMIT')}
                    disabled={!exp9InTransaction || exp9Loading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    5. COMMIT (SAVE DISK)
                  </button>

                  <button
                    onClick={() => handleRunExp9('ROLLBACK')}
                    disabled={!exp9InTransaction || exp9Loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-mono transition-colors"
                  >
                    6. ROLLBACK (ABORT)
                  </button>
                </div>
              </div>

              {/* Live Table Display */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-mono font-bold">
                  DATABASE DISK STATE: SELECT * FROM exp9_demo_table;
                </p>
                <div className="overflow-x-auto rounded-xl border border-charcoal-700">
                  <table className="w-full text-left font-mono text-xs text-gray-300">
                    <thead className="bg-charcoal-800 text-gray-400 border-b border-charcoal-700 text-[11px]">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">ITEM NAME</th>
                        <th className="p-3">CUSTODY STATUS</th>
                        <th className="p-3">CURRENT HOLDER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal-800 bg-charcoal-900/60">
                      {exp9Rows.map((r) => (
                        <tr key={r.id} className="hover:bg-charcoal-800/50">
                          <td className="p-3 font-bold text-peach-400">#{r.id}</td>
                          <td className="p-3 text-white font-semibold">{r.item_name}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.custody_status === 'RETURNED'
                                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                                  : 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                              }`}
                            >
                              {r.custody_status}
                            </span>
                          </td>
                          <td className="p-3 text-gray-300">{r.holder_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transaction Execution History Log */}
              <div className="bg-charcoal-950 p-4 rounded-xl border border-charcoal-800 font-mono text-xs space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold">
                  Transaction Execution Audit Log:
                </p>
                {exp9History.slice(-5).map((h, idx) => (
                  <p key={idx} className="text-emerald-400">
                    › {h}
                  </p>
                ))}
              </div>

              {/* DCL Privileges Matrix */}
              <div className="space-y-3 pt-2 border-t border-charcoal-700">
                <h5 className="font-bold text-sm text-peach-400 font-sans">
                  Data Control Language (DCL) Role Privileges Matrix
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-charcoal-800/80 p-3.5 rounded-xl border border-charcoal-700 space-y-1.5">
                    <p className="font-bold text-white">campus_student</p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      GRANT SELECT, INSERT ON lost_items, claims;
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Cannot modify custody or execute handover returns.
                    </p>
                  </div>

                  <div className="bg-charcoal-800/80 p-3.5 rounded-xl border border-charcoal-700 space-y-1.5">
                    <p className="font-bold text-white">security_desk</p>
                    <p className="text-[11px] text-amber-300 font-mono">
                      GRANT SELECT, UPDATE ON claims, found_items, return_records;
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Can approve claims, relocate storage, and issue handover receipts.
                    </p>
                  </div>

                  <div className="bg-charcoal-800/80 p-3.5 rounded-xl border border-charcoal-700 space-y-1.5">
                    <p className="font-bold text-white">campus_admin</p>
                    <p className="text-[11px] text-purple-300 font-mono">
                      GRANT ALL PRIVILEGES ON campus_lost_found.* WITH GRANT OPTION;
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Full administrative control over users, schema, and audit logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPECIAL SECTION: EXPERIMENT 10 MONGODB CRUD PLAYGROUND */}
          {selectedExp.id === 10 && (
            <div className="bg-charcoal-900 rounded-3xl p-6 sm:p-8 text-cream-100 space-y-6 border border-charcoal-700 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-700 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    EXPERIMENT 10 MONGODB CRUD PLAYGROUND
                  </span>
                  <h4 className="text-xl font-bold text-white font-sans">
                    NoSQL Document Operations Console
                  </h4>
                </div>

                <div className="text-xs font-mono text-gray-400 bg-charcoal-800 px-3 py-1.5 rounded-lg border border-charcoal-700">
                  Collection: <strong className="text-white">found_items</strong> ({mongoDocs.length} docs)
                </div>
              </div>

              {/* CRUD Operation Selector */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['find', 'insertOne', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany'].map((op) => (
                    <button
                      key={op}
                      onClick={() => {
                        setMongoOp(op);
                        setMongoResult(null);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                        mongoOp === op
                          ? 'bg-emerald-500 text-charcoal-950 shadow-md'
                          : 'bg-charcoal-800 text-gray-300 hover:bg-charcoal-700'
                      }`}
                    >
                      db.found_items.{op}()
                    </button>
                  ))}
                </div>

                {/* Input Fields based on Operation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Query / Filter Input */}
                  {(mongoOp === 'find' || mongoOp.startsWith('update') || mongoOp.startsWith('delete')) && (
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400">
                        Query Filter Object (JSON):
                      </label>
                      <textarea
                        rows={4}
                        value={mongoFilter}
                        onChange={(e) => setMongoFilter(e.target.value)}
                        className="w-full p-3 bg-charcoal-950 border border-charcoal-700 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  )}

                  {/* Update Payload */}
                  {mongoOp.startsWith('update') && (
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold text-gray-400">
                        Update Operations Object (JSON):
                      </label>
                      <textarea
                        rows={4}
                        value={mongoUpdate}
                        onChange={(e) => setMongoUpdate(e.target.value)}
                        className="w-full p-3 bg-charcoal-950 border border-charcoal-700 rounded-xl font-mono text-xs text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                      />
                    </div>
                  )}

                  {/* Insert Document */}
                  {mongoOp === 'insertOne' && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-mono font-bold text-gray-400">
                        Document to Insert (JSON):
                      </label>
                      <textarea
                        rows={5}
                        value={mongoInsert}
                        onChange={(e) => setMongoInsert(e.target.value)}
                        className="w-full p-3 bg-charcoal-950 border border-charcoal-700 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleRunMongo}
                  disabled={mongoLoading}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-charcoal-950 font-mono font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute {mongoOp}()</span>
                </button>
              </div>

              {/* Execution Result Box */}
              {mongoResult && (
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-gray-400">
                    MongoDB Output Result Payload:
                  </p>
                  <pre className="p-4 bg-charcoal-950 rounded-xl border border-charcoal-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60">
                    {JSON.stringify(mongoResult, null, 2)}
                  </pre>
                </div>
              )}

              {/* Collection Documents View */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold text-gray-400">
                  Current Collection State ({mongoDocs.length} Documents):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {mongoDocs.map((doc) => (
                    <div
                      key={doc._id}
                      className="p-3 bg-charcoal-950/70 border border-charcoal-800 rounded-xl font-mono text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-gray-500 text-[10px]">
                        <span>_id: {doc._id}</span>
                        <span className="text-peach-400 font-bold">{doc.category}</span>
                      </div>
                      <p className="font-bold text-white">{doc.itemTitle}</p>
                      <p className="text-gray-400 text-[11px]">
                        Custody: {doc.custodyLocation || doc.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-charcoal-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden shadow-2xl">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-charcoal-900/80 text-white hover:bg-charcoal-900 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImg}
              alt="Diagram Zoom"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
