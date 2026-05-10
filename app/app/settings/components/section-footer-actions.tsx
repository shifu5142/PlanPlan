import { Button } from '@/components/ui/button'

/** UI-only Save / Cancel row for settings cards. */
export function SectionFooterActions() {
  return (
    <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="button">Save changes</Button>
    </div>
  )
}
