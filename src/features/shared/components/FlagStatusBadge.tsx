type Props = {
  status: "OPEN" | "RESOLVED"
}

export default function FlagStatusBadge({ status }: Props) {
  const isOpen = status === "OPEN"

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isOpen ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          isOpen ? "bg-red-500" : "bg-primary"
        }`}
      />

      {status}
    </span>
  )
}
