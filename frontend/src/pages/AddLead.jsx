import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building2, Phone, Briefcase, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "../components/ui/Toast";
import { useCreateLead } from "../hooks/useLeads";
import Button from "../components/ui/Button";
import { Input, Textarea } from "../components/ui";
import { Card } from "../components/ui";

function AddLead() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { createLead, loading: createLoading } = useCreateLead();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    job_title: "",
    phone: "",
    industry: "",
    company_size: "",
    funding: "",
    technology_stack: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await createLead(formData);
      addToast(`Lead created successfully! Score: ${data.score}, Label: ${data.score_label}`, "success");
      navigate("/leads");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={() => navigate("/leads")} icon={<ArrowLeft className="h-4 w-4" />} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-500">Create a new sales prospect</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-primary-600" />
              Personal Information
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
              icon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              error={errors.email}
              required
              icon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="h-4 w-4" />}
            />
            <Input
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="CTO"
              icon={<Briefcase className="h-4 w-4" />}
            />
          </div>
        </Card>

        <Card className="mb-6">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary-600" />
              Company Information
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Inc."
              icon={<Building2 className="h-4 w-4" />}
            />
            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Technology"
            />
            <Input
              label="Company Size"
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              placeholder="50-200"
            />
            <Input
              label="Funding"
              name="funding"
              value={formData.funding}
              onChange={handleChange}
              placeholder="$5M Series A"
            />
            <div className="md:col-span-2">
              <Input
                label="Technology Stack"
                name="technology_stack"
                value={formData.technology_stack}
                onChange={handleChange}
                placeholder="React, Python, AWS"
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary-600" />
              Notes
            </h3>
          </div>
          <div className="p-6">
            <Textarea
              label="Additional Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any relevant information about this lead..."
              rows={4}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate("/leads")}>
            Cancel
          </Button>
          <Button type="submit" loading={createLoading}>
            Create Lead
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddLead;
