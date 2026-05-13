import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState, type FormEventHandler } from "react"

type Props = {
  onResolve: (note: string) => void
}

export function ResolveFlagModal({ onResolve }: Props) {
  const [note, setNote] = useState("")
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    onResolve(note)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Resolve</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Resolution Note</DialogTitle>

            <DialogDescription>Add Resolution Note Here</DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <Label htmlFor="name-1">Note</Label>

              <Input
                id="name-1"
                name="name"
                placeholder="Enter resolution note"
                onChange={(e) => setNote(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
