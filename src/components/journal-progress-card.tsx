import { Card } from "@/components/ui/card";

interface JournalProgressCardProps {
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  entriesLogged: number;
  totalXp: number;
  lastEarnedXp?: number | null;
  isLeveledUp?: boolean;
}

export function JournalProgressCard({
  level,
  xpInLevel,
  xpToNextLevel,
  entriesLogged,
  totalXp,
  lastEarnedXp,
  isLeveledUp,
}: JournalProgressCardProps) {
  const progressPercent =
    xpToNextLevel > 0 ? Math.min(100, Math.round((xpInLevel / xpToNextLevel) * 100)) : 0;

  return (
    <Card className="border-4 border-black pixel-shadow bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="font-pixel text-xs md:text-sm text-black">
              JOURNAL LEVEL
            </p>
            <div className="mt-1 flex items-end gap-3">
              <span className="font-pixel text-2xl md:text-3xl text-black whitespace-nowrap">
                LV {level}
              </span>
              <span className="text-xs md:text-sm text-gray-700">
                Stored on this device
              </span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="font-pixel text-xs text-black">{entriesLogged} ENTRIES</p>
            <p className="text-xs text-gray-700">{totalXp} TOTAL XP</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="font-pixel text-xs md:text-sm text-black">XP BAR</p>
            <p className="font-pixel text-xs md:text-sm text-black">
              {xpInLevel} / {xpToNextLevel} XP
            </p>
          </div>

          <div className="h-8 overflow-hidden border-4 border-black bg-gray-300 relative">
            <div
              className="h-full bg-linear-to-r from-[#4a90e2] via-[#3d79c4] to-[#255a9e] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-pixel text-[10px] md:text-xs text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  {progressPercent}% COMPLETE
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs font-pixel text-gray-600">
            <span>NEXT LEVEL AT {xpToNextLevel} XP</span>
            {lastEarnedXp ? (
              <span>+{lastEarnedXp} XP FROM LAST ENTRY</span>
            ) : (
              <span>WRITE AN ENTRY TO EARN XP</span>
            )}
          </div>

          {isLeveledUp && (
            <div className="border-4 border-black bg-[#dff7e6] px-3 py-2 text-center">
              <p className="font-pixel text-xs md:text-sm text-black">
                LEVEL UP SAVED LOCALLY
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}