"use client"
import GlobalOperations from "./global-operations"

interface GlobalOperationsSectionProps {
  t: (key: string) => string
}

export default function GlobalOperationsSection({ t }: GlobalOperationsSectionProps) {
  return (
    <section
      id="operations"
      className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIHN0cm9rZT0iIzM3NDE1MTIwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Global Operations Network
          </h3>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover our worldwide presence with strategic locations across Europe and MENA, delivering excellence
            through innovation and expertise
          </p>
        </div>

        <GlobalOperations t={t} />
      </div>
    </section>
  )
}
