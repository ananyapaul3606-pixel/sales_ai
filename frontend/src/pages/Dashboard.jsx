import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Flame,
  Target,
  Plus,
  RefreshCw,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { useLeadSummary, useLeads } from "../hooks/useLeads";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { PipelineChart, ScoreDistribution, ActivityChart } from "../components/charts";
import { LeadTable } from "../components/leads";
import { SkeletonStats } from "../components/ui/Skeleton";

function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { summary, loading: summaryLoading, refetch: refetchSummary } = useLeadSummary();
  const { leads, loading: leadsLoading, refetch: refetchLeads } = useLeads();

  const [activityData, setActivityData] = useState([]);

  const pipelineData = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const chartPipelineData = Object.entries(pipelineData).map(([status, count]) => ({
    status,
    count,
  }));

  const chartScoreData = {
    hot: summary?.hot_leads || 0,
    warm: summary?.warm_leads || 0,
    cold: summary?.cold_leads || 0,
  };

  useEffect(() => {
    if (leads.length > 0 && leads[0].created_at) {
      const grouped = {};
      leads.forEach((lead) => {
        const date = new Date(lead.created_at).toLocaleDateString();
        grouped[date] = (grouped[date] || 0) + 1;
      });
      setActivityData(
        Object.entries(grouped)
          .map(([date, count]) => ({ date, count }))
          .slice(-7)
      );
    }
  }, [leads]);

  const handleRefresh = async () => {
    await Promise.all([refetchSummary(), refetchLeads()]);
    addToast("Dashboard refreshed", "success");
  };

  const loading = summaryLoading || leadsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleRefresh} icon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Link to="/add-lead">
            <Button icon={<Plus className="h-4 w-4" />}>
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Leads"
            value={summary?.total_leads ?? 0}
            icon={Users}
            color="default"
          />
          <StatCard
            title="Hot Leads"
            value={summary?.hot_leads ?? 0}
            icon={Flame}
            color="hot"
          />
          <StatCard
            title="Warm Leads"
            value={summary?.warm_leads ?? 0}
            icon={TrendingUp}
            color="warm"
          />
          <StatCard
            title="Average Score"
            value={Math.round(summary?.average_score ?? 0)}
            icon={Target}
            color="default"
          />
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pipeline Overview</h2>
              <p className="text-sm text-gray-500">Leads by status</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <PipelineChart data={chartPipelineData} loading={loading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Score Distribution</h2>
              <p className="text-sm text-gray-500">HOT / WARM / COLD</p>
            </div>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <ScoreDistribution data={chartScoreData} loading={loading} />
        </motion.div>
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lead Activity</h2>
            <p className="text-sm text-gray-500">New leads over time</p>
          </div>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <ActivityChart data={activityData} loading={loading} />
      </motion.div>

      {/* Recent Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <p className="text-sm text-gray-500">Your latest sales prospects</p>
          </div>
          <Link to="/leads">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <LeadTable
          leads={leads.slice(0, 5)}
          loading={loading}
          showActions={false}
        />
      </motion.div>
    </div>
  );
}

export default Dashboard;
