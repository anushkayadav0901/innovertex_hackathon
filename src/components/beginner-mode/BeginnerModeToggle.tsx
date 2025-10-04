import { useStore } from '@/store/useStore'
import { Tooltip } from '../common/Tooltip'

export function BeginnerModeToggle() {
  const { isBeginnerMode, toggleBeginnerMode, startSecondStepTour, clearSecondStepTour } = useStore()

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg p-2 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 px-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Beginner Mode
        </span>
        <Tooltip content="Toggle beginner-friendly guidance and tooltips">
          <button 
            onClick={() => {
              toggleBeginnerMode()
              if (!isBeginnerMode) {
                // Start quick tour that only shows the 2nd step
                startSecondStepTour()
              } else {
                // Clear quick tour flag when turning off
                clearSecondStepTour()
              }
            }}
            className={`${
              isBeginnerMode 
                ? 'bg-indigo-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                isBeginnerMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
