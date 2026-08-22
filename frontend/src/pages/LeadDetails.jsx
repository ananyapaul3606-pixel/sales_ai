import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Flame,
  Building2,
  Mail,
  Clock,
  Target,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  Globe,
  MapPin,
  FileText,
  X,
  Save,
  AlertTriangle,
  Loader2,
  Sparkles,
  TrendingUp,
  Send,
  Calendar,
} from "lucide-react";
import api from "../services/api";

function LeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [aiData, setAiData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({});

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState({});

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "ai", label: "AI Analysis", icon: Brain },
    { id: "outreach", label: "Outreach", icon: Send },
    { id: "followups", label: "Follow-ups", icon: Calendar },
  ];

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/leads/${leadId}`);
      setLead(response.data);
      setEditForm(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load lead.");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  const runAI = async () => {
    try {
      setAiLoading(true);
      setError("");
      const response = await api.post(`/ai/leads/${leadId}/run-intelligence`);
      setAiData(response.data);
      await fetchLead();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to run AI intelligence.");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const handleEditSave = async () => {
    try {
      setSaving(true);
      await api.put(`/leads/${leadId}`, editForm);
      setLead(editForm);
      setEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update lead.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/leads/${leadId}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete lead.");
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: "bg-blue-50 text-blue-700",
      CONTACTED: "bg-yellow-50 text-yellow-700",
      QUALIFIED: "bg-green-50 text-green-700",
      PROPOSAL: "bg-purple-50 text-purple-700",
      NEGOTIATION: "bg-orange-50 text-orange-700",
      CLOSED_WON: "bg-emerald-50 text-emerald-700",
      CLOSED_LOST: "bg-red-50 text-red-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 font-medium">{error}</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                <p className="text-gray-500 mt-1">
                  {lead.job_title || "Lead"}
                  {lead.company && <span> at {lead.company}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn-secondary"
              >
                <Edit3 size={18} />
                Edit
              </button>
              <button
                onClick={runAI}
                disabled={aiLoading}
                className="btn-primary"
              >
                {aiLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {aiLoading ? "Running AI..." : "Run AI Intelligence"}
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Score", value: lead.score || 0, icon: Target, color: "bg-primary-50 text-primary-600" },
            { label: "Priority", value: lead.score_label || "N/A", icon: Flame, color: "bg-orange-50 text-orange-600" },
            { label: "Status", value: lead.status || "-", icon: CheckCircle2, color: "bg-blue-50 text-blue-600" },
            { label: "Company", value: lead.company || "-", icon: Building2, color: "bg-purple-50 text-purple-600" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Lead Information</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Full Name", value: lead.name, icon: User },
                          { label: "Email", value: lead.email, icon: Mail },
                          { label: "Phone", value: lead.phone || "-", icon: Phone },
                          { label: "Job Title", value: lead.job_title || "-", icon: User },
                          { label: "Industry", value: lead.industry || "-", icon: Building2 },
                        ].map((field) => (
                          <div key={field.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <field.icon size={16} className="text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">{field.label}</p>
                              <p className="text-sm font-medium text-gray-900 mt-0.5">{field.value || "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Company", value: lead.company, icon: Building2 },
                          { label: "Website", value: lead.website || "-", icon: Globe },
                          { label: "Location", value: lead.location || "-", icon: MapPin },
                          { label: "Company Size", value: lead.company_size || "-", icon: Users },
                          { label: "Industry", value: lead.industry || "-", icon: Building2 },
                        ].map((field) => (
                          <div key={field.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <field.icon size={16} className="text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">{field.label}</p>
                              <p className="text-sm font-medium text-gray-900 mt-0.5">{field.value || "-"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes || "No notes added."}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {!aiData ? (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Analysis Yet</h3>
                      <p className="text-gray-500 mb-6">Run AI intelligence to get detailed insights about this lead.</p>
                      <button onClick={runAI} disabled={aiLoading} className="btn-primary">
                        {aiLoading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Sparkles size={18} />
                        )}
                        Run AI Intelligence
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiData.company_analysis && (
                        <AISection
                          title="Company Analysis"
                          icon={Building2}
                          expanded={expandedSections.company_analysis}
                          onToggle={() => toggleSection("company_analysis")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.company_analysis, null, 2), "company_analysis")}
                          copied={copied.company_analysis}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { label: "Business Needs", items: aiData.company_analysis.business_needs || [] },
                              { label: "Pain Points", items: aiData.company_analysis.pain_points || [] },
                              { label: "Opportunities", items: aiData.company_analysis.opportunities || [] },
                            ].map((group) => (
                              <div key={group.label} className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">{group.label}</h4>
                                <ul className="space-y-2">
                                  {group.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </AISection>
                      )}

                      {aiData.lead_intelligence && (
                        <AISection
                          title="Lead Intelligence"
                          icon={Brain}
                          expanded={expandedSections.lead_intelligence}
                          onToggle={() => toggleSection("lead_intelligence")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.lead_intelligence, null, 2), "lead_intelligence")}
                          copied={copied.lead_intelligence}
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Qualification</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.lead_intelligence.qualification_reasoning}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Decision Maker Probability</h4>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(aiData.lead_intelligence.decision_maker_probability * 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {Math.round(aiData.lead_intelligence.decision_maker_probability * 100)}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Recommended Approach</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.lead_intelligence.recommended_approach}</p>
                            </div>
                          </div>
                        </AISection>
                      )}

                      {aiData.lead_score && (
                        <AISection
                          title="AI Score"
                          icon={Target}
                          expanded={expandedSections.lead_score}
                          onToggle={() => toggleSection("lead_score")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.lead_score, null, 2), "lead_score")}
                          copied={copied.lead_score}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`text-5xl font-bold px-6 py-4 rounded-xl ${getScoreColor(aiData.lead_score.lead_score)}`}>
                              {aiData.lead_score.lead_score}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <span className="text-sm text-gray-500">Priority: </span>
                                <span className="text-sm font-semibold text-gray-900">{aiData.lead_score.priority_level}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Conversion Probability: </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {Math.round(aiData.lead_score.conversion_probability * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-4">{aiData.lead_score.reasoning}</p>
                        </AISection>
                      )}

                      {aiData.outreach && (
                        <AISection
                          title="AI Outreach"
                          icon={Mail}
                          expanded={expandedSections.outreach}
                          onToggle={() => toggleSection("outreach")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.outreach, null, 2), "outreach")}
                          copied={copied.outreach}
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Subject</h4>
                              <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-lg p-3">{aiData.outreach.subject}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Body</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{aiData.outreach.body}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Tone</h4>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                                  {aiData.outreach.recommended_tone}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">CTA</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{aiData.outreach.call_to_action}</p>
                              </div>
                            </div>
                          </div>
                        </AISection>
                      )}

                      {aiData.follow_up && (
                        <AISection
                          title="Follow-up Recommendation"
                          icon={Clock}
                          expanded={expandedSections.follow_up}
                          onToggle={() => toggleSection("follow_up")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.follow_up, null, 2), "follow_up")}
                          copied={copied.follow_up}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">Timing</h4>
                              <p className="text-sm text-gray-700">{aiData.follow_up.recommended_timing}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">Channel</h4>
                              <p className="text-sm text-gray-700">{aiData.follow_up.recommended_channel}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-900 mb-1">Content Strategy</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.follow_up.content_strategy}</p>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-900 mb-1">Reasoning</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.follow_up.reasoning}</p>
                          </div>
                        </AISection>
                      )}

                      {aiData.crm_update && (
                        <AISection
                          title="CRM Recommendation"
                          icon={TrendingUp}
                          expanded={expandedSections.crm_update}
                          onToggle={() => toggleSection("crm_update")}
                          onCopy={() => copyToClipboard(JSON.stringify(aiData.crm_update, null, 2), "crm_update")}
                          copied={copied.crm_update}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(aiData.crm_update.status)}`}>
                                {aiData.crm_update.status}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">Score</h4>
                              <p className="text-2xl font-bold text-gray-900">{aiData.crm_update.score}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 md:col-span-1">
                              <h4 className="font-semibold text-gray-900 mb-1">Next Action</h4>
                              <p className="text-sm text-gray-700">{aiData.crm_update.next_action}</p>
                            </div>
                          </div>
                        </AISection>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "outreach" && (
                <motion.div
                  key="outreach"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">AI-Generated Outreach</h3>
                  {aiData?.outreach ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Outreach Preview</h4>
                        <button
                          onClick={() => copyToClipboard(aiData.outreach.body || "", "outreach_body")}
                          className="btn-ghost"
                        >
                          {copied.outreach_body ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                          {copied.outreach_body ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                        <p className="text-sm font-semibold text-gray-900 bg-gray-50 rounded-lg p-3">{aiData.outreach.subject}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Body</label>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{aiData.outreach.body}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tone</label>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                            {aiData.outreach.recommended_tone}
                          </span>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CTA</label>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{aiData.outreach.call_to_action}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Outreach Generated</h3>
                      <p className="text-gray-500">Run AI intelligence to generate personalized outreach for this lead.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "followups" && (
                <motion.div
                  key="followups"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Follow-up Recommendations</h3>
                  {aiData?.follow_up ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">Recommended Timing</h4>
                          <p className="text-sm text-gray-700">{aiData.follow_up.recommended_timing}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">Recommended Channel</h4>
                          <p className="text-sm text-gray-700">{aiData.follow_up.recommended_channel}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Content Strategy</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.follow_up.content_strategy}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Reasoning</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{aiData.follow_up.reasoning}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Follow-up Recommendations</h3>
                      <p className="text-gray-500">Run AI intelligence to get follow-up recommendations for this lead.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Lead</h2>
                <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Name", field: "name" },
                  { label: "Email", field: "email" },
                  { label: "Phone", field: "phone" },
                  { label: "Company", field: "company" },
                  { label: "Job Title", field: "job_title" },
                  { label: "Industry", field: "industry" },
                  { label: "Website", field: "website" },
                  { label: "Location", field: "location" },
                  { label: "Notes", field: "notes", textarea: true },
                ].map((field) => (
                  <div key={field.field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="input-field"
                        rows={3}
                        value={editForm[field.field] || ""}
                        onChange={(e) => setEditForm({ ...editForm, [field.field]: e.target.value })}
                      />
                    ) : (
                      <input
                        type="text"
                        className="input-field"
                        value={editForm[field.field] || ""}
                        onChange={(e) => setEditForm({ ...editForm, [field.field]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setEditModalOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleEditSave} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Delete Lead</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AISection({ title, icon: Icon, expanded, onToggle, onCopy, copied, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
          </button>
          {expanded ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LeadDetails;
