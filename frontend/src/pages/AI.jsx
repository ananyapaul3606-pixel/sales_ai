import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Building2,
  Users,
  Sparkles,
  Copy,
  CheckCircle2,
  Target,
  FlaskConical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useLeads, useRunIntelligence } from "../hooks/useLeads";
import { useCompanyAnalysis } from "../hooks/useAI";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import { Card, Input, Textarea } from "../components/ui";

function AI() {
  const { addToast } = useToast();
  const { leads, refetch: refetchLeads } = useLeads();
  const { runIntelligence, loading: aiLoading, data: aiData } = useRunIntelligence();
  const { companyAnalysis, loading: companyLoading, data: companyResult } = useCompanyAnalysis();

  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [bulkResults, setBulkResults] = useState([]);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState({});
  const [expandedResults, setExpandedResults] = useState({});

  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    funding: "",
    technology_stack: "",
    description: "",
  });

  const handleCompanyAnalysis = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const result = await companyAnalysis(companyForm);
      setCompanyResult(result);
      addToast("Company analysis complete", "success");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLeadAI = async () => {
    if (!selectedLeadId) return;
    try {
      setError("");
      await runIntelligence(selectedLeadId);
      addToast("AI intelligence complete", "success");
      refetchLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkAnalysis = async () => {
    if (leads.length === 0) return;
    try {
      setLoadingBulk(true);
      setError("");
      const results = [];
      for (const lead of leads.slice(0, 5)) {
        const data = await runIntelligence(lead.id);
        results.push({ lead, data });
      }
      setBulkResults(results);
      addToast("Bulk analysis complete", "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBulk(false);
    }
  };

  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const toggleExpand = (key) => {
    setExpandedResults((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Intelligence Hub</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze companies and leads with AI-powered insights</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Company Analysis</h2>
                  <p className="text-xs text-gray-500">Analyze a company</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleCompanyAnalysis} className="p-6 space-y-4">
              <Input
                label="Company Name"
                value={companyForm.company_name}
                onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Industry"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                />
                <Input
                  label="Company Size"
                  value={companyForm.company_size}
                  onChange={(e) => setCompanyForm({ ...companyForm, company_size: e.target.value })}
                />
              </div>
              <Input
                label="Funding"
                value={companyForm.funding}
                onChange={(e) => setCompanyForm({ ...companyForm, funding: e.target.value })}
              />
              <Input
                label="Tech Stack"
                value={companyForm.technology_stack}
                onChange={(e) => setCompanyForm({ ...companyForm, technology_stack: e.target.value })}
              />
              <Textarea
                label="Description"
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                rows={3}
              />
              <Button type="submit" loading={companyLoading} className="w-full" icon={<Sparkles size={18} />}>
                Analyze Company
              </Button>
            </form>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Target size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Lead Intelligence</h2>
                  <p className="text-xs text-gray-500">Run AI on a specific lead</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Lead</label>
                <select
                  className="input-field"
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                >
                  <option value="">Choose a lead...</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>{lead.name} - {lead.company || "N/A"}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleLeadAI}
                disabled={!selectedLeadId || aiLoading}
                className="w-full"
                icon={<Brain size={18} />}
              >
                Run Lead Intelligence
              </Button>
            </div>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Bulk Analysis</h2>
                  <p className="text-xs text-gray-500">Analyze up to 5 leads</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Button
                onClick={handleBulkAnalysis}
                disabled={loadingBulk || leads.length === 0}
                className="w-full"
                icon={<Users size={18} />}
              >
                {loadingBulk ? "Analyzing..." : `Analyze ${Math.min(leads.length, 5)} Leads`}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div className="xl:col-span-2 space-y-6">
          {companyResult && (
            <ResultCard
              title="Company Analysis"
              data={companyResult}
              onToggle={() => toggleExpand("company")}
              onCopy={() => copyToClipboard(JSON.stringify(companyResult, null, 2), "company_result")}
              copied={copied.company_result}
              expanded={expandedResults.company}
            />
          )}

          {aiData && (
            <ResultCard
              title="Lead Intelligence Result"
              data={aiData}
              onToggle={() => toggleExpand("lead")}
              onCopy={() => copyToClipboard(JSON.stringify(aiData, null, 2), "lead_result")}
              copied={copied.lead_result}
              expanded={expandedResults.lead}
            />
          )}

          {bulkResults.length > 0 && (
            <Card>
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-900">Bulk Analysis Results</h3>
              </div>
              <div className="p-6 space-y-3">
                {bulkResults.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{result.lead.name}</p>
                      <p className="text-sm text-gray-500">{result.lead.company || "N/A"}</p>
                    </div>
                    {result.data?.lead_score && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{result.data.lead_score.lead_score}</p>
                        <p className="text-xs text-gray-500">{result.data.lead_score.priority_level}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, data, onToggle, onCopy, copied, expanded }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <Brain size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">Analysis Complete</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
          </button>
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100 space-y-4">
              {data.lead_score && (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary-600 bg-primary-50 px-4 py-2 rounded-lg">
                    {data.lead_score.lead_score}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-semibold text-gray-900">{data.lead_score.priority_level}</p>
                  </div>
                </div>
              )}
              {data.company_analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Business Needs", items: data.company_analysis.business_needs || [] },
                    { label: "Pain Points", items: data.company_analysis.pain_points || [] },
                    { label: "Opportunities", items: data.company_analysis.opportunities || [] },
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
              )}
              {data.lead_intelligence && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualification</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{data.lead_intelligence.qualification_reasoning}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Decision Maker Probability</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(data.lead_intelligence.decision_maker_probability * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {Math.round(data.lead_intelligence.decision_maker_probability * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {data.outreach && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Outreach</h4>
                  <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-lg p-3">{data.outreach.subject}</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{data.outreach.body}</p>
                </div>
              )}
              {data.follow_up && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Timing</h4>
                    <p className="text-sm text-gray-700">{data.follow_up.recommended_timing}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Channel</h4>
                    <p className="text-sm text-gray-700">{data.follow_up.recommended_channel}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AI;
