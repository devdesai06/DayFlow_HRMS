import { useEffect, useState } from "react";
import EmployeeCard from "../../components/EmployeeCard";
import { fetchEmployees } from "../../services/employee.service";
import { Users, Loader2, Search, Filter } from "lucide-react";

export default function EmployeesGrid() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, []);

  /**
   * Backend-safe search
   */
  const filteredEmployees = employees.filter((emp) => {
    const query = searchTerm.toLowerCase();
    return (
      emp.full_name?.toLowerCase().includes(query) ||
      emp.role?.toLowerCase().includes(query) ||
      emp.department?.toLowerCase().includes(query) ||
      emp.designation?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No employees found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white">Employees</h2>
              <p className="text-gray-400">
                Manage and view organization workforce
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-4">
            <div className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl">
              <span className="text-gray-400 text-sm">Total: </span>
              <span className="text-white font-semibold">
                {employees.length}
              </span>
            </div>
            {searchTerm && (
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <span className="text-gray-400 text-sm">Showing: </span>
                <span className="text-blue-400 font-semibold">
                  {filteredEmployees.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="px-6 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No employees match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
