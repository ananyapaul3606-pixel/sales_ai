import { useState, useEffect } from "react";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/leads", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch leads" }));
        throw new Error(err.detail || "Failed to fetch leads");
      }
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  return { leads, loading, error, refetch: fetchLeads };
}

export function useLead(id) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLead() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/leads/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch lead" }));
        throw new Error(err.detail || "Failed to fetch lead");
      }
      const data = await res.json();
      setLead(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { lead, loading, error, refetch: fetchLead };
}

export function useCreateLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function mutate(leadData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/leads", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to create lead" }));
        throw new Error(err.detail || "Failed to create lead");
      }
      return await res.json();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { createLead: mutate, loading, error };
}

export function useUpdateLead(id) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function mutate(leadData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/leads/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to update lead" }));
        throw new Error(err.detail || "Failed to update lead");
      }
      return await res.json();
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { updateLead: mutate, loading, error };
}

export function useDeleteLead(id) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function mutate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/leads/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to delete lead" }));
        throw new Error(err.detail || "Failed to delete lead");
      }
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { deleteLead: mutate, loading, error };
}

export function useLeadSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSummary() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/leads/summary", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch summary" }));
        throw new Error(err.detail || "Failed to fetch summary");
      }
      const result = await res.json();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary: data, loading, error, refetch: fetchSummary };
}

export function useRunIntelligence() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function mutate(id) {
    if (!id) {
      const err = new Error("Lead ID is required to run intelligence");
      setError(err.message);
      throw err;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/leads/${id}/run-intelligence`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to run intelligence" }));
        throw new Error(err.detail || "Failed to run intelligence");
      }
      const result = await res.json();
      setData(result);
      return result;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { runIntelligence: mutate, loading, error, data };
}
