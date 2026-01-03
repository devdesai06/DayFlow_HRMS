import { useEffect, useState } from "react";
import {
  applyLeaveService,
  fetchMyLeaves,
} from "../../services/leaves.service";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLeaves().then((res) => {
      setLeaves(res);
      setLoading(false);
    });
  }, []);

  const handleApply = async () => {
    await applyLeaveService({
      leave_type_id: 1,
      start_date: "2026-01-10",
      end_date: "2026-01-11",
      reason: "Personal work",
    });
    fetchMyLeaves().then(setLeaves);
  };

  if (loading) return <p>Loading leaves...</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl mb-4">My Leaves</h2>

      <button
        onClick={handleApply}
        className="mb-4 px-4 py-2 bg-blue-600 rounded"
      >
        Apply Leave
      </button>

      <ul className="space-y-2">
        {leaves.map((l) => (
          <li key={l.id}>
            {l.start_date} → {l.end_date} ({l.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
