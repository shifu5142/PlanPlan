'use client'

import { MoreHorizontal, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SettingsPageHeader } from '../_components/settings-page-header'
import { SettingsSection } from '../_components/settings-section'

const members = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'Owner',
  },
  {
    id: '2',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    role: 'Admin',
  },
  {
    id: '3',
    name: 'Sam Patel',
    email: 'sam@example.com',
    role: 'Member',
  },
]

export default function TeamSettingsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Team members"
        description="Invite collaborators and manage roles across your workspace."
      />

      <div className="space-y-6">
        <SettingsSection
          title="Invite people"
          description="Invitations expire after 7 days. Guests count toward your seat limit."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@company.com"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select defaultValue="member">
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="button" className="gap-2 sm:shrink-0">
              <UserPlus className="h-4 w-4" />
              Send invite
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="People"
          description="Roles control billing visibility, integrations, and workspace settings."
        >
          <div className="overflow-hidden rounded-xl border border-border/80">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Role
                  </th>
                  <th className="w-12 px-2 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((m) => (
                  <tr key={m.id} className="bg-card/30 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                      <div className="mt-1 text-xs text-muted-foreground sm:hidden">
                        {m.role}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {m.role}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${m.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change role…</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove from workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsSection>
      </div>
    </>
  )
}
