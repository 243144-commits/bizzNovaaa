import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  FileText,
  CheckCircle2,
  Lock,
  Globe,
  AlertTriangle,
} from 'lucide-react';

export const LegalGuidancePage: React.FC = () => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('Delaware (C-Corp / LLC)');

  const mandatoryDisclaimer =
    'General informational guidance only. Consult a qualified legal professional for your specific situation.';

  const legalGuides = [
    {
      id: 'incorporation',
      title: 'Company Formation & Jurisdiction Selection',
      summary: 'Establishing your legal corporate entity for venture scalability and liability isolation.',
      checklist: [
        'Delaware C-Corp is standard for venture-backed equity investment.',
        'File Certificate of Incorporation and obtain Employer Identification Number (EIN).',
        'Open dedicated business bank account; never commingle personal and company funds.',
        'File 83(b) tax election with the IRS within 30 days of receiving founder shares.',
      ],
      jurisdictionSpecific: 'In the US, Delaware franchise tax requires annual filing before March 1.',
    },
    {
      id: 'founder-vesting',
      title: 'Founder Agreements & Reverse Vesting',
      summary: 'Protecting the cap table from early departures and aligning long-term founder incentives.',
      checklist: [
        'Standard 4-year vesting schedule with a 1-year cliff (25% vests at month 12, monthly thereafter).',
        'Single or double-trigger acceleration clauses upon acquisition or termination without cause.',
        'IP Assignment Agreement: All code, designs, and domain assets must belong to the corporate entity, not the individual founder.',
        'Document clear equity split, roles, and departure buyout clauses in writing before accepting checks.',
      ],
      jurisdictionSpecific: 'Requires mutual written execution and corporate board resolution approval.',
    },
    {
      id: 'privacy-terms',
      title: 'Privacy Policy, Terms of Service & Data Protection',
      summary: 'Public compliance policies governing customer signups, billing, and cookie disclosures.',
      checklist: [
        'Terms of Service must include limitation of liability, payment terms, and dispute arbitration.',
        'Privacy Policy must disclose what customer data is stored, third-party processors (e.g. Stripe, AWS), and cookie tracking.',
        'GDPR & CCPA compliance: Provide users with a mechanism to request data deletion and opt out of analytics tracking.',
        'Maintain a sub-processor directory listing all APIs receiving user data.',
      ],
      jurisdictionSpecific: 'EU visitors require explicit opt-in cookie consent banner prior to script loading.',
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property, Trademarks & Open Source Licenses',
      summary: 'Defending brand identity and ensuring open-source code compliance.',
      checklist: [
        'Audit third-party npm packages to prevent viral GPL/AGPL licenses in proprietary closed-source codebases.',
        'Conduct USPTO TESS search for trademark clearance before investing in logo design and merchandise.',
        'Register primary domain name (.com preferred) and handle handles across major social networks.',
        'Non-Disclosure Agreements (NDAs) are generally rejected by VCs, but appropriate for proprietary contractor work.',
      ],
      jurisdictionSpecific: 'Trademark protection is territorial; international filing requires Madrid Protocol application.',
    },
    {
      id: 'commercial-contracts',
      title: 'Customer Pilot Agreements & Letters of Intent (LOI)',
      summary: 'Legal structure for onboarding early design partners and commercial pilots.',
      checklist: [
        'Define clear pilot scope, duration (e.g. 60 or 90 days), and pricing conversion threshold.',
        'Include SLA caveats for beta software: explicitly state prototype is provided "as is".',
        'Define confidential customer feedback rights: permission to use anonymized metrics in case studies.',
      ],
      jurisdictionSpecific: 'Commercial contract enforcement follows designated governing law clause in Delaware or California.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>COMPLIANCE & LEGAL HYGIENE</span>
            <span>·</span>
            <span>CORPORATE READINESS</span>
            <span>·</span>
            <span className="text-indigo-400">INFORMATIONAL ONLY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-indigo-400" />
            <span>Founder Legal & Compliance Guidance</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Essential corporate formation checklists, vesting hygiene, IP assignments, and data privacy frameworks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Jurisdiction:</span>
          <select
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
          >
            <option value="Delaware (C-Corp / LLC)">Delaware (US C-Corp)</option>
            <option value="California">California (US)</option>
            <option value="United Kingdom">United Kingdom (Ltd)</option>
            <option value="European Union">European Union (GmbH / SAS)</option>
            <option value="Singapore">Singapore (Pte Ltd)</option>
          </select>
        </div>
      </div>

      {/* Mandatory Prominent Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block mb-0.5">LEGAL DISCLAIMER</span>
          <p className="leading-relaxed font-medium">{mandatoryDisclaimer}</p>
        </div>
      </div>

      {/* Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {legalGuides.map((guide) => (
          <div
            key={guide.id}
            className="rounded-2xl glass-card p-5 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <h3 className="font-bold text-sm text-white">{guide.title}</h3>
              </div>
              <p className="text-xs text-slate-300 mb-3">{guide.summary}</p>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Essential Founder Checklist
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {guide.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              <span className="text-indigo-400">Jurisdiction Note:</span> {guide.jurisdictionSpecific}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
