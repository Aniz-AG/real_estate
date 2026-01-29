import clsx from 'clsx';

export default function AuroraBackground({ className }) {
    return (
        <div className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
            <span className="aurora-blob aurora-1" />
            <span className="aurora-blob aurora-2" />
            <span className="aurora-blob aurora-3" />
            <span className="aurora-blob aurora-4" />
        </div>
    );
}
