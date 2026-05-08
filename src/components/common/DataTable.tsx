interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`py-3 pr-6 text-left text-xs font-medium tracking-wide text-gray-400 uppercase ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-50 transition-colors hover:bg-gray-50"
            >
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`py-4 pr-6 text-gray-700 ${col.className ?? ""}`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
