import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import { useLeads, useDeleteLead } from "../hooks/useLeads";
import Button from "../components/ui/Button";
import { LeadTable, LeadFilters } from "../components/leads";
import { SkeletonStats } from "../components/ui/Skeleton";
import { Modal } from "../components/ui";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
const SCORE_LABELS = ["HOT", "WARM", "COLD"];

function Leads() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { leads, loading, error, refetch } = useLeads();
  const { deleteLead, loading: deleteLoading } = useDeleteLead();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = !search ||
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesScore = !scoreFilter || lead.score_label === scoreFilter;
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      addToast("Lead deleted successfully", "success");
      refetch();
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.score_label === "HOT").length,
    warm: leads.filter((l) => l.score_label === "WARM").length,
    cold: leads.filter((l) => l.score_label === "COLD").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your sales prospects</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate("/add-lead")}>
          Add Lead
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Hot</p>
            <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Warm</p>
            <p className="text-2xl font-bold text-amber-600">{stats.warm}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm text-gray-500">Cold</p>
            <p className="text-2xl font-bold text-gray-600">{stats.cold}</p>
          </div>
        </motion.div>
      )}

      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        scoreFilter={scoreFilter}
        onScoreChange={setScoreFilter}
        statusOptions={STATUS_OPTIONS}
        scoreOptions={SCORE_LABELS}
        onReset={() => {
          setSearch("");
          setStatusFilter("");
          setScoreFilter("");
        }}
      />

      <LeadTable
        leads={filteredLeads}
        loading={loading}
        onLeadClick={(lead) => navigate(`/leads/${lead.id}`)}
        onDelete={(lead) => setDeleteConfirm(lead)}
      />

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Lead"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm?.id)} loading={deleteLoading}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Leads;
