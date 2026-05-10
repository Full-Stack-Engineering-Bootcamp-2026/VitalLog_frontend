interface Props {
  score: number
}

export default function WellnessScore({ score }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-green-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="max-w-md">
          <h3 className="text-lg font-bold">Health Wellness Score</h3>
          <p className="mt-1 text-sm text-green-200">
            Your profile is {score}% complete.{" "}
            {score < 100 && "Fill in more details to improve your score."}
          </p>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-green-700">
              <div
                className="h-full rounded-full bg-green-400 transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-green-300">
              <span>{score}% COMPLETE</span>
              <span>{100 - score}% TO OPTIMAL</span>
            </div>
          </div>
        </div>

        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#166534" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="#4ade80" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>
    </div>
  )
}