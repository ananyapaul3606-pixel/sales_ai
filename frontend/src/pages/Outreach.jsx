import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import { useToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import { Card, EmptyState } from "../components/ui";
import api from "../services/api";

function Outreach() {
  const { leads } = useLeads();
  const { addToast } = useToast();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [template, setTemplate] = useState("intro");
  const [generatedOutreach, setGeneratedOutreach] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generateOutreach = async () => {
    if (!selectedLeadId) return;
    try {
      setGenerating(true);
      setError("");

      let lead = null;
      try {
        const leadRes = await api.get(`/leads/${selectedLeadId}`);
        lead = leadRes.data;
      } catch {
        throw new Error("Failed to load lead details.");
      }

      const companyAnalysis = {
        business_needs: lead.business_needs || ["Grow revenue", "Improve efficiency"],
        expansion_signals: lead.expansion_signals || [],
        opportunities: lead.opportunities || [],
        pain_points: lead.pain_points || ["Manual processes", "High costs"],
      };

      const leadIntelligence = {
        qualification_reasoning: lead.qualification_reasoning || "Qualified lead based on profile.",
        decision_maker_probability: 0.7,
        buying_signals: lead.buying_signals || [],
        recommended_approach: lead.recommended_approach || "Direct outreach with value proposition",
      };

      const leadScore = {
        lead_score: lead.score || 50,
        conversion_probability: 0.5,
        priority_level: lead.score_label || "WARM",
        reasoning: lead.score_reasoning || "Standard outreach candidate",
      };

      const response = await api.post("/ai/outreach", {
        lead_name: lead.name,
        job_title: lead.job_title || "",
        company_name: lead.company || "",
        industry: lead.industry || "",
        company_analysis: companyAnalysis,
        lead_intelligence: leadIntelligence,
        lead_score: leadScore,
      });

      setGeneratedOutreach(response.data);
      addToast("Outreach generated successfully", "success");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Failed to generate outreach.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Outreach Management</h1>
        <p className="text-sm text-gray-500 mt-1">Create AI-powered outreach messages</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Compose Outreach</h2>
                <p className="text-xs text-gray-500">Generate AI-powered outreach</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Template</label>
              <select
                className="input-field"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="intro">Introduction</option>
                <option value="followup">Follow-up</option>
                <option value="proposal">Proposal</option>
                <option value="meeting">Meeting Request</option>
              </select>
            </div>
            <Button
              onClick={generateOutreach}
              disabled={!selectedLeadId || generating}
              className="w-full"
              icon={<Sparkles size={18} />}
            >
              Generate Outreach
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          {generatedOutreach ? (
            <Card>
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Preview</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                  <p className="text-sm font-semibold text-gray-900 bg-gray-50 rounded-lg p-3">{generatedOutreach.subject}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Body</label>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{generatedOutreach.body}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tone</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                      {generatedOutreach.recommended_tone}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CTA</label>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{generatedOutreach.call_to_action}</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-12">
                <EmptyState
                  icon={<Mail size={40} />}
                  title="No outreach generated yet"
                  description="Select a lead and generate AI-powered outreach to see it here."
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Outreach;
