/**
 * Comparison table for Open Source evolution (OS 1.0, 2.0, 3.0)
 * Server Component
 */
export function OpenSourceComparison() {
  const versions = [
    {
      version: 'OS 1.0',
      example: 'Linux',
      motivation: 'Intrinsic Motivation (Altruism)',
      payment: 'No payment',
      color: 'gray',
    },
    {
      version: 'OS 2.0',
      example: 'Bounty Platforms',
      motivation: 'Extrinsic Motivation (Complete tasks)',
      payment: 'Paid like a freelancer',
      color: 'blue',
    },
    {
      version: 'OS 3.0',
      example: 'CrowdStaking',
      motivation: 'Intrinsic + Extrinsic Motivation',
      payment:
        'The incentive to contribute your own creative ideas (intrinsic) combined with the financial "upside" of a co-owner (extrinsic)',
      color: 'indigo',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 my-8">
      {versions.map((version, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 border-2 ${
            version.color === 'gray'
              ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              : version.color === 'blue'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
          }`}
        >
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {version.version}
          </h4>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
            ({version.example})
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            <span className="font-semibold">Motivation:</span>{' '}
            {version.motivation}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Payment:</span> {version.payment}
          </p>
        </div>
      ))}
    </div>
  )
}

