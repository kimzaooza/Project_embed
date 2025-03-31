'use client';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // อัปเดตทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Access Logs</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">UID</th>
            <th className="p-2">Time</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="text-center border-t">
              <td className="p-2">{log.name}</td>
              <td className="p-2">{log.uid}</td>
              <td className="p-2">{log.time}</td>
              <td className="p-2">{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
