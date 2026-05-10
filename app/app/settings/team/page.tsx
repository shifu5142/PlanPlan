'use client'

import * as React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Mail, MoreHorizontal, UserPlus } from 'lucide-react'
import { SettingsPageHeader } from '../components/settings-page-header'

const members = [
  { name: 'Jordan Douglas', email: 'jordan@example.com', role: 'Owner', initials: 'JD' },
  { name: 'Priya N.', email: 'priya@example.com', role: 'Admin', initials: 'PN' },
  { name: 'Mateo Silva', email: 'mateo@example.com', role: 'Member', initials: 'MS' },
  { name: 'Chen Wei', email: 'chen@example.com', role: 'Member', initials: 'CW' },
  { name: 'Lina Haddad', email: 'lina@example.com', role: 'Billing', initials: 'LH' },
]

export default function SettingsTeamPage() {
  const [inviteOpen, setInviteOpen] = React.useState(false)

  return (
    <>
      <SettingsPageHeader
        title="Team"
        description="Members, roles, and invitations — orchestrate access before connecting your directory."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Team' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg">Members</CardTitle>
              <CardDescription>8 seats on Pro · 5 active (mock counts).</CardDescription>
            </div>
            <Button type="button" className="gap-2 shrink-0" onClick={() => setInviteOpen(true)}>
              <UserPlus className="size-4" />
              Invite member
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 font-medium">Person</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 hidden md:table-cell font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m, i) => (
                  <tr key={m.email} className="transition hover:bg-muted/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border shadow-sm ring-2 ring-offset-2 ring-offset-background ring-primary/20">
                          <AvatarFallback>{m.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Mail className="size-3 shrink-0" />
                            <span>{m.email}</span>
                          </div>
                          {i === 4 ? (
                            <p className="text-muted-foreground text-xs">Pending invite · sent 2d ago</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-xs">{m.role}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                      {i === 4 ? 'Invited' : 'Active'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${m.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuItem>View activity</DropdownMenuItem>
                          {m.role !== 'Owner' ? (
                            <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-dashed bg-muted/40 shadow-inner">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Role templates</CardTitle>
            <CardDescription>Starter matrix for onboarding UI reviews.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Owner', detail: 'Full billing + workspace teardown rights.' },
              { title: 'Admin', detail: 'Invites + security policies without deleting org.' },
              { title: 'Member', detail: 'Standard board creation with approved templates.' },
            ].map((r) => (
              <div key={r.title} className="rounded-lg border bg-card px-4 py-4 text-sm shadow-sm">
                <p className="font-semibold">{r.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent className="gap-6 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite teammate</DialogTitle>
              <DialogDescription>Send email + optionally pre-assign lanes (UI only).</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Work email</Label>
                <Input id="invite-email" type="email" placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role preset</Label>
                <Select defaultValue="member">
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[110]">
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Personal note (optional)</Label>
                <Input id="note" placeholder="We'll share the Roadmap Alpha board automatically." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setInviteOpen(false)}>
                Send invite (mock)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
