import { BreachHorizon } from "@/components/breach-horizon";
import { RiskScoreCard } from "@/components/risk-score-card";
import { Card } from "@/components/ui/card";
import { sampleReport } from "@/lib/server/sample";

export default async function VendorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  const report = sampleReport(name, `https://www.${slug}.com`);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Vendor Detail</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">{report.vendorName}</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Vendor profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><dt className="text-slate-400">Website</dt><dd className="text-cyan-200">{report.website}</dd></div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><dt className="text-slate-400">Confidence</dt><dd className="text-white">{report.confidenceScore}%</dd></div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3"><dt className="text-slate-400">Encrypted report</dt><dd className="text-teal-200">Available after investigation</dd></div>
          </dl>
        </Card>
        <Card className="p-6"><BreachHorizon stage={report.breachHorizonStage} vendor={report.vendorName} /></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <RiskScoreCard label="Overall" score={report.riskScores.overall} />
        <RiskScoreCard label="Security" score={report.riskScores.security} />
        <RiskScoreCard label="Exposure" score={report.riskScores.exposure} />
        <RiskScoreCard label="Compliance" score={report.riskScores.compliance} />
        <RiskScoreCard label="Operational" score={report.riskScores.operational} />
        <RiskScoreCard label="Reputation" score={report.riskScores.reputation} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Evidence list</h2>
          <div className="mt-4 space-y-3">{report.evidence.map((item) => <div key={item.url} className="border-t border-white/10 pt-3 text-sm"><a href={item.url} className="text-cyan-200">{item.title}</a><p className="mt-1 text-slate-400">{item.summary}</p></div>)}</div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white">Recommended actions</h2>
          <div className="mt-4 space-y-3">{report.recommendedActions.map((item) => <p key={item} className="border-t border-white/10 pt-3 text-sm text-slate-300">{item}</p>)}</div>
        </Card>
      </div>
    </div>
  );
}
