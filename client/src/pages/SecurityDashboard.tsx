import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  User,
  Clock,
  Loader2,
  AlertCircle,
  Check,
  RotateCcw,
} from 'lucide-react';

export const SecurityDashboard: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'review' | 'handover' | 'custody' | 'returns'>('review');
  const [loading, setLoading] = useState(true);

  // Data State
  const [pendingClaims, setPendingClaims] = useState<any[]>([]);
  const [approvedHandover, setApprovedHandover] = useState<any[]>([]);
  const [custodyItems, setCustodyItems] = useState<any[]>([]);
  const [recentReturns, setRecentReturns] = useState<any[]>([]);

  // Action Modals & Forms
  const [reviewModalClaim, setReviewModalClaim] = useState<any | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [processingReview, setProcessingReview] = useState(false);

  // Handover Execution
  const [handoverClaim, setHandoverClaim] = useState<any | null>(null);
  const [idProof, setIdProof] = useState('');
  const [handoverRemarks, setHandoverRemarks] = useState('');
  const [processingHandover, setProcessingHandover] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any | null>(null);

  // Relocate Custody
  const [relocateItem, setRelocateItem] = useState<any | null>(null);
  const [newLocation, setNewLocation] = useState('');
  const [relocateNotes, setRelocateNotes] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const res = await api.getSecurityDashboard();
      setPendingClaims(res.pendingClaims);
      setApprovedHandover(res.approvedPendingHandover);
      setCustodyItems(res.custodyItems);
      setRecentReturns(res.recentReturns);
    } catch (err) {
      console.error('Error loading security data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalClaim) return;
    setProcessingReview(true);
    try {
      await api.reviewClaim(reviewModalClaim.id, reviewDecision, reviewRemarks);
      setReviewModalClaim(null);
      setReviewRemarks('');
      loadSecurityData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setProcessingReview(false);
    }
  };

  const handleHandoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverClaim) return;
    setProcessingHandover(true);
    try {
      const res = await api.executeHandover({
        claim_id: handoverClaim.id,
        receiver_id_proof: idProof,
        remarks: handoverRemarks,
      });

      setGeneratedReceipt(res);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}

      setHandoverClaim(null);
      setIdProof('');
      setHandoverRemarks('');
      loadSecurityData();
    } catch (err: any) {
      alert('Handover error: ' + err.message);
    } finally {
      setProcessingHandover(false);
    }
  };

  const handleRelocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relocateItem) return;
    try {
      await api.updateCustody({
        found_item_id: relocateItem.id,
        storage_location: newLocation,
        notes: relocateNotes,
      });
      setRelocateItem(null);
      loadSecurityData();
    } catch (err: any) {
      alert('Relocation error: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Security Header Banner */}
      <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-charcoal-700">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Security Custody Desk</span>
            <span>• Badge: {user?.identifier || 'SEC-OFFICER'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
            Security Desk Custody & Claim Workbench
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Review claimant ownership proofs, compare against confidential identifiers, manage locker custody, and execute legally binding item returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/report-found')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-charcoal-900 font-bold text-xs transition-colors shadow-sm"
          >
            + Log Found Property
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('review')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'review'
              ? 'border-amber-500 text-amber-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Claims Awaiting Review ({pendingClaims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'handover'
              ? 'border-emerald-500 text-emerald-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Ready for Handover ({approvedHandover.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custody')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'custody'
              ? 'border-peach-500 text-peach-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Locker Custody Inventory ({custodyItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'returns'
              ? 'border-purple-500 text-purple-700 font-extrabold'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Handover Receipts Audit ({recentReturns.length})</span>
        </button>
      </div>

      {/* Tab 1: Claims Awaiting Review */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {pendingClaims.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-charcoal-900">All Claims Reviewed</h3>
              <p className="text-xs text-gray-500">
                There are currently no ownership claims awaiting security review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl p-6 border border-[#F3E8E2] shadow-soft-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase">
                        Claim #{claim.id} • {claim.status}
                      </span>
                      <h3 className="text-lg font-bold text-charcoal-900 font-sans mt-1">
                        {claim.item_title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Category: {claim.category_name} • Storage:{' '}
                        <strong>{claim.storage_location}</strong>
                      </p>
                    </div>

                    <div className="text-xs text-charcoal-800 bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                      <p className="font-bold">{claim.claimant_name}</p>
                      <p className="text-gray-500">
                        Roll: {claim.claimant_roll || 'N/A'} • {claim.claimant_dept || 'Student'}
                      </p>
                      <p className="text-gray-500">Phone: {claim.claimant_phone || claim.contact_phone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Proof Comparison Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-cream-50/70 p-4 rounded-xl border border-cream-200 space-y-1">
                      <p className="font-bold text-charcoal-900">
                        Claimant Submitted Proof of Ownership:
                      </p>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{claim.proof_description}"
                      </p>
                    </div>

                    <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 space-y-1">
                      <p className="font-bold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Confidential Physical Marking Logged:</span>
                      </p>
                      <p className="text-amber-950 font-mono font-medium">
                        {claim.secret_identifying_details || 'No confidential mark recorded.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setReviewModalClaim(claim);
                        setReviewDecision('REJECTED');
                        setReviewRemarks('');
                      }}
                      className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => {
                        setReviewModalClaim(claim);
                        setReviewDecision('APPROVED');
                        setReviewRemarks('Proof verified against confidential markings. Approved for pickup.');
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      Approve Claim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Ready for Handover */}
      {activeTab === 'handover' && (
        <div className="space-y-4">
          {approvedHandover.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-2">
              <p className="text-sm text-gray-500">No approved claims currently awaiting physical handover.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedHandover.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-soft-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        Approved for Handover
                      </span>
                      <span className="text-xs text-gray-400">Claim #{claim.id}</span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal-900 font-sans">
                      {claim.item_title}
                    </h3>

                    <div className="text-xs text-gray-600 space-y-1 bg-cream-50 p-3 rounded-xl border border-cream-200">
                      <p>
                        Authorized Recipient: <strong>{claim.claimant_name}</strong> (Roll:{' '}
                        {claim.claimant_roll || 'N/A'})
                      </p>
                      <p>
                        Current Custody: <strong>{claim.storage_location}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setHandoverClaim(claim);
                      setIdProof(`NMIMS Student ID Card (${claim.claimant_roll || 'N022'})`);
                      setHandoverRemarks('Physical verification completed. Student signed handover register.');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Execute Physical Handover & Issue Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Locker Custody Inventory */}
      {activeTab === 'custody' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-gray-200 text-charcoal-800 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Storage Locker / Desk</th>
                  <th className="p-3.5">Custody Status</th>
                  <th className="p-3.5">Date Deposited</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {custodyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50">
                    <td className="p-3.5 font-bold text-gray-500">#{item.id}</td>
                    <td className="p-3.5 font-semibold text-charcoal-900">{item.title}</td>
                    <td className="p-3.5 text-gray-600">{item.category_name}</td>
                    <td className="p-3.5 font-medium text-peach-700">{item.storage_location}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-100 text-charcoal-800">
                        {item.custody_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500">{item.date_found}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setRelocateItem(item);
                          setNewLocation(item.storage_location);
                          setRelocateNotes('');
                        }}
                        className="px-3 py-1 bg-cream-100 hover:bg-cream-200 text-charcoal-800 rounded-lg text-xs font-semibold"
                      >
                        Relocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Handover Receipts Audit */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-soft-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100/70 border-b border-gray-200 text-charcoal-800 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5">Receipt #</th>
                    <th className="p-3.5">Item Returned</th>
                    <th className="p-3.5">Receiver</th>
                    <th className="p-3.5">Verification Proof</th>
                    <th className="p-3.5">Officer</th>
                    <th className="p-3.5">Handover Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentReturns.map((rr) => (
                    <tr key={rr.id} className="hover:bg-cream-50/50">
                      <td className="p-3.5 font-mono font-bold text-peach-700">
                        {rr.receipt_no}
                      </td>
                      <td className="p-3.5 font-semibold text-charcoal-900">{rr.item_title}</td>
                      <td className="p-3.5 text-charcoal-800">
                        {rr.receiver_name} {rr.receiver_roll && `(${rr.receiver_roll})`}
                      </td>
                      <td className="p-3.5 text-gray-600">{rr.receiver_id_proof}</td>
                      <td className="p-3.5 text-gray-700">{rr.officer_name}</td>
                      <td className="p-3.5 text-gray-500">
                        {new Date(rr.return_date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-charcoal-900 font-sans">
              Review Claim #{reviewModalClaim.id}
            </h3>

            <p className="text-xs text-gray-600">
              Claim for: <strong>{reviewModalClaim.item_title}</strong> by{' '}
              <strong>{reviewModalClaim.claimant_name}</strong>
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Official Decision
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('APPROVED')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      reviewDecision === 'APPROVED'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    APPROVE CLAIM
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('REJECTED')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      reviewDecision === 'REJECTED'
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    REJECT CLAIM
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Officer Remarks / Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="State justification for approval or reason for rejection..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalClaim(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingReview}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-charcoal-900 font-bold text-xs rounded-xl shadow-sm"
                >
                  {processingReview ? 'Saving...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover Execution Modal */}
      {handoverClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-charcoal-900 font-sans">
              Execute Physical Handover
            </h3>

            <p className="text-xs text-gray-600">
              Returning <strong>"{handoverClaim.item_title}"</strong> to{' '}
              <strong>{handoverClaim.claimant_name}</strong>.
            </p>

            <form onSubmit={handleHandoverSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Receiver ID Proof Verified <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={idProof}
                  onChange={(e) => setIdProof(e.target.value)}
                  placeholder="e.g. Student ID Card (Roll N022) or Aadhaar verified"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Handover Remarks
                </label>
                <input
                  type="text"
                  value={handoverRemarks}
                  onChange={(e) => setHandoverRemarks(e.target.value)}
                  placeholder="e.g. Item in pristine condition, student signed physical register."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
                🔒 <strong>Database Transaction:</strong> Executing this will update found & lost records atomically and generate an immutable return receipt code.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setHandoverClaim(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingHandover}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
                >
                  {processingHandover && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Generate Receipt & Handover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover Receipt Dialog */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl border border-emerald-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="font-extrabold text-2xl text-charcoal-900 font-sans">
              Handover Successfully Completed!
            </h3>

            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 font-mono text-sm space-y-1">
              <p className="text-gray-500 text-xs">Official Return Receipt Number:</p>
              <p className="font-bold text-lg text-peach-700">{generatedReceipt.receiptNo}</p>
              <p className="text-[10px] text-gray-400">
                Logged at: {new Date(generatedReceipt.returnDate).toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              The item has been returned, linked lost reports marked as RESOLVED, and the audit transaction committed permanently.
            </p>

            <button
              onClick={() => setGeneratedReceipt(null)}
              className="w-full py-3 bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm rounded-xl shadow-md"
            >
              Done & Return to Desk
            </button>
          </div>
        </div>
      )}

      {/* Relocate Storage Modal */}
      {relocateItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="font-bold text-lg text-charcoal-900 font-sans">
              Update Custody Storage
            </h3>

            <form onSubmit={handleRelocateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  New Storage Locker / Room
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. High Security Safe Cabinet B-1"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-peach-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Relocation Notes
                </label>
                <input
                  type="text"
                  value={relocateNotes}
                  onChange={(e) => setRelocateNotes(e.target.value)}
                  placeholder="e.g. Moved to electronics vault for overnight protection"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-peach-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRelocateItem(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save New Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
