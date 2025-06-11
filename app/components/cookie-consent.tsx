"use client"

import { useEffect } from "react"
import { Cookie, X, Settings, Check } from "lucide-react"

declare global {
  interface Window {
    cookieConsentHandled: boolean
  }
}

export default function CookieConsent() {
  useEffect(() => {
    // Prevent multiple instances
    if (typeof window !== "undefined" && window.cookieConsentHandled) {
      return
    }

    const hasConsent = localStorage.getItem("cookie-consent")
    if (!hasConsent) {
      const banner = document.getElementById("cookie-banner")
      if (banner) {
        banner.style.display = "block"
      }
    }

    if (typeof window !== "undefined") {
      window.cookieConsentHandled = true
    }
  }, [])

  return (
    <>
      {/* Cookie Banner */}
      <div
        id="cookie-banner"
        style={{ display: "none" }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[10000] p-4 md:p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="text-blue-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">We use cookies to enhance your experience</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to provide you with the best possible experience on our website.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  const modal = document.getElementById("cookie-modal")
                  if (modal) modal.style.display = "flex"
                }}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Customize
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "cookie-consent",
                    JSON.stringify({
                      necessary: true,
                      analytics: false,
                      marketing: false,
                      functional: false,
                    }),
                  )
                  const banner = document.getElementById("cookie-banner")
                  const modal = document.getElementById("cookie-modal")
                  if (banner) banner.style.display = "none"
                  if (modal) modal.style.display = "none"
                }}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "cookie-consent",
                    JSON.stringify({
                      necessary: true,
                      analytics: true,
                      marketing: true,
                      functional: true,
                    }),
                  )
                  const banner = document.getElementById("cookie-banner")
                  const modal = document.getElementById("cookie-modal")
                  if (banner) banner.style.display = "none"
                  if (modal) modal.style.display = "none"
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      <div
        id="cookie-modal"
        style={{ display: "none" }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie size={24} />
              <h2 className="text-xl font-bold">Cookie Preferences</h2>
            </div>
            <button
              onClick={() => {
                const banner = document.getElementById("cookie-banner")
                const modal = document.getElementById("cookie-modal")
                if (banner) banner.style.display = "none"
                if (modal) modal.style.display = "none"
              }}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">Customize your cookie preferences below.</p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Necessary Cookies</h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-gray-600">Essential for website functionality.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                  <input type="checkbox" id="analytics-check" className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-600">Help us understand website usage.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                  <input type="checkbox" id="marketing-check" className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-600">Used for advertising purposes.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={() => {
                localStorage.setItem(
                  "cookie-consent",
                  JSON.stringify({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    functional: false,
                  }),
                )
                const banner = document.getElementById("cookie-banner")
                const modal = document.getElementById("cookie-modal")
                if (banner) banner.style.display = "none"
                if (modal) modal.style.display = "none"
              }}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Necessary Only
            </button>
            <button
              onClick={() => {
                const analytics = (document.getElementById("analytics-check") as HTMLInputElement)?.checked || false
                const marketing = (document.getElementById("marketing-check") as HTMLInputElement)?.checked || false

                localStorage.setItem(
                  "cookie-consent",
                  JSON.stringify({
                    necessary: true,
                    analytics,
                    marketing,
                    functional: false,
                  }),
                )
                const banner = document.getElementById("cookie-banner")
                const modal = document.getElementById("cookie-modal")
                if (banner) banner.style.display = "none"
                if (modal) modal.style.display = "none"
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
