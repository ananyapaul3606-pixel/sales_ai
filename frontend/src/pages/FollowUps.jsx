import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { useLeads, useRunIntelligence } from "../hooks/useLeads";
import Button from "../components/ui/Button";
import { Card, EmptyState } from "../components/ui";

function FollowUps() {
  const { leads } = useLeads();
  const { runIntelligence } = useRunIntelligence();
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [generatedFollowUp, setGeneratedFollowUp] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateFollowUpAI = async () => {
    if (!selectedLeadId) return;
    try {
      setGenerating(true);
      setError("");
      const response = await runIntelligence(selectedLeadId);
      setGeneratedFollowUp(response?.follow_up || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups Management</h1>
        <p className="text-sm text-gray-500 mt-1">Generate AI-powered follow-up recommendations</p>
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
                <h2 className="font-semibold text-gray-900">AI Follow-up</h2>
                <p className="text-xs text-gray-500">Generate follow-up plan</p>
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
              onClick={generateFollowUpAI}
              disabled={!selectedLeadId || generating}
              className="w-full"
              icon={<Sparkles size={18} />}
            >
              Generate AI Follow-up
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          {generatedFollowUp ? (
            <Card>
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">AI Recommendation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(generatedFollowUp, null, 2))}
                  icon={copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timing</p>
                    <p className="text-sm font-medium text-gray-900">{generatedFollowUp.recommended_timing}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Channel</p>
                    <p className="text-sm font-medium text-gray-900">{generatedFollowUp.recommended_channel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Strategy</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{generatedFollowUp.content_strategy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reasoning</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{generatedFollowUp.reasoning}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-12">
                <EmptyState
                  icon={<Calendar size={40} />}
                  title="No follow-up recommendations yet"
                  description="Select a lead and run AI intelligence to get personalized follow-up recommendations."
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowUps;
