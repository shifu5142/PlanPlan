import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SettingsPageHeader } from '../components/settings-page-header'
import { SectionFooterActions } from '../components/section-footer-actions'

export default function SettingsProfilePage() {
  return (
    <>
      <SettingsPageHeader
        title="Profile"
        description="How you appear across TaskFlow boards and shared workspaces."
        breadcrumbs={[
          { label: 'App', href: '/app/dashboard' },
          { label: 'Settings', href: '/app/settings' },
          { label: 'Profile' },
        ]}
      />

      <div className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Avatar & visibility</CardTitle>
            <CardDescription>JPEG or PNG recommended, at least 400×400px.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-24 border-4 border-background shadow-md ring-1 ring-foreground/10">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground font-semibold">JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary">
                  Upload photo
                </Button>
                <Button type="button" variant="outline">
                  Remove
                </Button>
                <Button type="button" variant="ghost">
                  Crop (preview)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Basic info</CardTitle>
            <CardDescription>Displayed on cards, mentions, and member lists.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2 md:max-w-md">
              <Label htmlFor="display-name">Display name</Label>
              <Input id="display-name" defaultValue="Jordan Douglas" placeholder="Your name" autoComplete="name" />
            </div>
            <div className="space-y-2 md:col-span-2 md:max-w-md">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="jordan.douglas@example.com"
                placeholder="you@company.com"
                autoComplete="email"
              />
              <p className="text-muted-foreground text-xs">Primary workspace email • verification UI only</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue="Product lead focused on humane workflows. Helping teams ship with calm boards."
                rows={4}
                className="min-h-[120px] resize-y"
              />
              <p className="text-muted-foreground text-xs">320 characters suggested for previews on hover cards.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role title</Label>
              <Select defaultValue="lead">
                <SelectTrigger id="role" size="default" className="w-full">
                  <SelectValue placeholder="Pick a role" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="contributor">Individual contributor</SelectItem>
                  <SelectItem value="lead">Team lead</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select defaultValue="product">
                <SelectTrigger id="department" size="default" className="w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SectionFooterActions />
          </CardContent>
        </Card>

        <Card className="border-dashed bg-muted/40 shadow-inner">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Public presence</CardTitle>
            <CardDescription>Coming soon indicators are useful for stakeholder reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed bg-card/70 px-4 py-8 text-center text-muted-foreground text-sm shadow-sm">
              <p className="font-medium text-foreground">No public profile enabled</p>
              <p className="mx-auto mt-1 max-w-sm">
                Showcase recent boards and snippets from your bio once you flip this on in a future release.
              </p>
              <Button type="button" className="mt-4" variant="outline">
                Preview public URL
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
