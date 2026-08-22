import { useState } from "react";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function useCompanyAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function mutate(companyData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/ai/company-analysis", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(companyData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Company analysis failed" }));
        throw new Error(err.detail || "Company analysis failed");
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

  return { companyAnalysis: mutate, loading, error, data };
}

export function useOutreach() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function mutate(outreachData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/ai/outreach", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(outreachData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Outreach generation failed" }));
        throw new Error(err.detail || "Outreach generation failed");
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

  return { outreach: mutate, loading, error, data };
}

export function useCRMUpdate(leadId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function mutate(updateData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/ai/leads/${leadId}/crm-update`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "CRM update failed" }));
        throw new Error(err.detail || "CRM update failed");
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

  return { crmUpdate: mutate, loading, error, data };
}

export function useRunFullIntelligence(leadId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function mutate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/ai/leads/${leadId}/run-intelligence`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Full intelligence run failed" }));
        throw new Error(err.detail || "Full intelligence run failed");
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

  return { runFullIntelligence: mutate, loading, error, data };
}
