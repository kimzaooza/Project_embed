import { prisma } from "../../lib/prisma";
import { CalendarDays, Contact } from "lucide-react";
import { scan_logs } from "@prisma/client";
import Chart from "./components/Chart";
import { notFound } from "next/navigation";

const PAGE_SIZE = 5; // จำนวน log ต่อหน้า

function groupLogsByDate(logs: scan_logs[]) {
  const countMap = new Map();
  logs.forEach((log) => {
    const date = new Date(log.created_at).toLocaleDateString("th-TH");
    countMap.set(date, (countMap.get(date) || 0) + 1);
  });
  return Array.from(countMap, ([date, count]) => ({ date, count }));
}

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(await searchParams?.page || "1", 10);
  if (isNaN(currentPage) || currentPage < 1) return notFound();

  const skip = (currentPage - 1) * PAGE_SIZE;

  const [logs, totalLogs] = await Promise.all([
    prisma.scan_logs.findMany({
      orderBy: { created_at: "desc" },
      include: { card: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.scan_logs.count(),
  ]);

  const totalPages = Math.ceil(totalLogs / PAGE_SIZE);
  const graphData = groupLogsByDate(await prisma.scan_logs.findMany()); // ใช้ทั้งหมดสำหรับ Chart

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-20 font-sans">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        📋 Access Logs
      </h1>

      {/* 📊 Chart */}
      <section className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md mb-12 border border-gray-200 mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          สถิติการสแกนบัตรต่อวัน
        </h2>
        <Chart data={graphData} />
      </section>

      {/* 🔒 Logs */}
      <main className="flex flex-col gap-6 items-center mb-12">
        {logs.map((log) => (
          <div
            key={log.id}
            className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2 text-gray-800">
              <Contact className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">
                {log.card.first_name} {log.card.last_name}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Card ID:</span>{" "}
              {log.card.card_id}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <CalendarDays className="w-4 h-4 text-green-500" />
              <span>
                {new Date(log.created_at).toLocaleString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* ⏮️ Pagination */}
      <div className="flex justify-center gap-4 mb-10">
        {currentPage > 1 && (
          <a
            href={`/?page=${currentPage - 1}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ⬅ ย้อนกลับ
          </a>
        )}
        {currentPage < totalPages && (
          <a
            href={`/?page=${currentPage + 1}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ถัดไป ➡
          </a>
        )}
      </div>
    </div>
  );
}
