import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  selectedFlagId: number | null
  resolutionNote: string
  onNoteChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export default function ResolveFlagCard({
  selectedFlagId,
  resolutionNote,
  onNoteChange,
  onSubmit,
  onCancel,
}: Props) {
  if (!selectedFlagId) {
    return null
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>Resolve Flag</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write resolution note..."
          value={resolutionNote}
          onChange={(e) => onNoteChange(e.target.value)}
        />

        <div className="flex gap-2">
          <Button onClick={onSubmit}>Submit</Button>

          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
