import { Clock, CheckCircle, X } from 'lucide-react';
import { TrackingEvent } from '../types';

interface TrackingHistoryTimelineProps {
  events: TrackingEvent[];
 
  onEdit?: (event: TrackingEvent) => void;
  onDelete?: (eventId: string) => void;
  
  showHeading?: boolean;

  compact?: boolean;
}


export function TrackingHistoryTimeline({
  events,
  onEdit,
  onDelete,
  showHeading = true,
  compact = false,
}: TrackingHistoryTimelineProps) {
  return (
    <div className={compact ? '' : 'bg-white rounded-lg shadow-md p-6'}>
      {showHeading && (
        <h2 className={`font-bold text-gray-900 mb-6 flex items-center ${compact ? 'text-sm mb-4' : 'text-2xl'}`}>
          <Clock className={`mr-2 text-amber-800 ${compact ? 'h-4 w-4' : 'h-6 w-6'}`} />
          Tracking History
        </h2>
      )}

      {events.length > 0 ? (
        <div className="space-y-6">
          {events.map((event, index) => {
            const isCurrentStep = index === 0;
            return (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrentStep
                        ? 'bg-amber-800 text-white'
                        : 'bg-gray-300'
                    } ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}
                  >
                    {isCurrentStep ? (
                      <CheckCircle className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  {index < events.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[24px] bg-gray-300 mt-2" />
                  )}
                </div>

                <div className={`flex-1 pb-6 min-w-0 ${compact ? 'pb-4' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-gray-900 capitalize ${compact ? 'text-sm' : ''}`}>
                      {event.status.replace(/_/g, ' ')}
                    </h3>
                    <span className={`text-gray-500 whitespace-nowrap ${compact ? 'text-xs' : 'text-sm'}`}>
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.location && (
                    <p className={`text-gray-600 mb-1 ${compact ? 'text-xs' : 'text-sm'}`}>{event.location}</p>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-gray-600 ${compact ? 'text-sm' : ''}`}>{event.description}</p>
                    {(onEdit || onDelete) && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(event)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(event.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Delete event"
                          >
                            <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={`text-gray-600 text-center py-8 ${compact ? 'text-sm py-4' : ''}`}>
          No tracking events available yet.
        </p>
      )}
    </div>
  );
}
