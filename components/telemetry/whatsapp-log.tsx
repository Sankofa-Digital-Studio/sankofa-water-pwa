import React from 'react';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { AlertDispatchLogRow } from '@/types/supabase.types';

export interface AlertDispatchLogItem {
  id: string;
  ward_id: number;
  alert_type: string;
  message_text: string;
  dispatched_at: string;
  whatsapp_message_id?: string | null;
  recipients_count: number;
}

export interface WhatsappLogProps {
  entries: (AlertDispatchLogRow | AlertDispatchLogItem)[];
  maxHeight?: string;
  className?: string;
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function WhatsappLog({ entries, maxHeight = '320px', className = '' }: WhatsappLogProps) {
  if (!entries || entries.length === 0) {
    return (
      <div
        data-testid="whatsapp-log"
        className={`flex flex-col items-center justify-center py-10 text-slate-500 ${className}`}
      >
        <MessageCircle size={28} className="mb-2 opacity-40" />
        <span className="text-sm">No dispatch logs recorded</span>
      </div>
    );
  }

  return (
    <div
      data-testid="whatsapp-log"
      className={`overflow-y-auto space-y-2 pr-1 ${className}`}
      style={{ maxHeight }}
      aria-label="WhatsApp dispatch log"
    >
      {entries.map((entry) => {
        const isDispatched = !!entry.whatsapp_message_id || entry.alert_type.includes('DISPATCHED');
        const isSuppressed = entry.alert_type.includes('REJECTED') || entry.alert_type.includes('FILTERED') || entry.alert_type.includes('LOCKED');

        return (
          <div
            key={entry.id}
            className={`flex gap-3 p-3 rounded-lg border text-xs transition-colors ${
              isDispatched
                ? 'bg-emerald-400/5 border-emerald-400/20'
                : isSuppressed
                ? 'bg-amber-400/5 border-amber-400/20'
                : 'bg-slate-800/50 border-slate-700/50'
            }`}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {isDispatched ? (
                <CheckCircle size={14} className="text-emerald-400" />
              ) : (
                <XCircle size={14} className={isSuppressed ? 'text-amber-400' : 'text-slate-500'} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold text-slate-200 truncate">
                  Ward {entry.ward_id} — {entry.alert_type}
                </span>
                <span className="text-slate-500 shrink-0 font-mono text-[11px]">
                  {formatTime(entry.dispatched_at)}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed break-words">{entry.message_text}</p>
              <div className="flex items-center gap-3 mt-1.5 text-slate-500 text-[11px]">
                <span>{entry.recipients_count} recipients</span>
                {entry.whatsapp_message_id && (
                  <span className="text-emerald-500 font-mono text-[10px]">
                    ID: {entry.whatsapp_message_id}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
