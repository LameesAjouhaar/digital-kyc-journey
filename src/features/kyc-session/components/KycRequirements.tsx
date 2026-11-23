
import { CheckCircle2, Clock, FileText, Smartphone } from 'lucide-react';

const requirements = [
  'A valid Passport, National ID or Driver’s Licence',
  'A device with a working camera',
  'A well-lit environment for your selfie',
];

export function KycRequirements() {
  return (
    <section
      aria-labelledby="requirements-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <FileText size={22} aria-hidden="true" />
        </div>

        <div>
          <h2
            id="requirements-heading"
            className="font-semibold text-slate-900"
          >
            What you will need
          </h2>
          <p className="text-sm text-slate-500">
            Have these ready before you begin.
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {requirements.map((requirement) => (
          <li key={requirement} className="flex items-start gap-3">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <span className="text-sm leading-6 text-slate-700">
              {requirement}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={17} aria-hidden="true" />
          <span>About 5 minutes</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Smartphone size={17} aria-hidden="true" />
          <span>Mobile or desktop</span>
        </div>
      </div>
    </section>
  );
}
