// Página de Configurações: Permitir ajustes do sistema e personalização.
// layout: Aba de preferências (idioma, moeda, unidades de medida). Aba de integrações (IoT, contabilidade).

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Assuming you have this utility
import {
  Search,
  User,
  Settings as SettingsIcon, // Alias to avoid naming conflict
  Bell,
  Link as LinkIcon,
  Info,
  Copy,
  ExternalLink,
  AlertTriangle,
  Home,
  FileText,
  HelpCircle,
  Book,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// interface SidebarItem {
//   category: string;
//   icon: React.ElementType;
//   items: string[];
// }

// interface Settings1Props {
//   teamName?: string;
//   teamUrlSlug?: string;
//   teamId?: string;
//   userAvatarSrc?: string;
//   activeSidebarItem?: string;
//   sidebarItems?: SidebarItem[];
//   texts?: Record<string, string>;
//   links?: Record<string, string>;
// }

const defaultProps = {
  teamName: "SERP AI's projects",
  teamUrlSlug: "serp-ais-projects",
  teamId: "team_edTxn3CaRm3NCYyMOUC0OM5V",
  userAvatarSrc:
    "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public",
  activeSidebarItem: "General",
  sidebarItems: [
    {
      category: "Team",
      icon: User,
      items: [
        "General",
        "Billing",
        "Invoices",
        "Members",
        "Access Groups",
        "Log Drains",
        "Security & Privacy",
        "Deployment Protection",
        "Environment Variables",
      ],
    },
    {
      category: "Account",
      icon: SettingsIcon,
      items: ["My Notifications"],
    },
  ],
  texts: {
    settings: "Settings",
    menu: "Menu",
    searchPlaceholder: "Search...",
    teamNameTitle: "Team Name",
    teamNameDescription:
      "This is your team's visible name within SERP. For example, the name of your company or department.",
    teamNameInputHint: "Please use 32 characters at maximum.",
    teamUrlTitle: "Team URL",
    teamUrlDescription:
      "This is your team's URL namespace on SERP. Within it, your team can inspect their projects, check out any recent activity, or configure settings to their liking.",
    teamUrlInputHint: "Please use 48 characters at maximum.",
    teamAvatarTitle: "Team Avatar",
    teamAvatarDescription:
      "This is your team's avatar. Click on the avatar to upload a custom one from your files.",
    teamAvatarRecommended: "An avatar is optional but strongly recommended.",
    changeAvatarButton: "Change Avatar",
    previewDeploymentSuffixTitle: "Preview Deployment Suffix",
    previewDeploymentSuffixDescription:
      "By default, the URL of every new Preview Deployment ends with .SERP.app. This setting allows you to choose your own custom domain in place of this suffix.",
    proPlanFeature: "This feature is available on the",
    proPlanLink: "Pro plan",
    proPlanPrice: "$100 per month",
    teamIdTitle: "Team ID",
    teamIdDescription: "This is your team's ID within SERP.",
    teamIdHint: "Used when interacting with the SERP API.",
    serpToolbarTitle: "SERP Toolbar",
    serpToolbarDescription: "Enable the SERP Toolbar on your Deployments.",
    preProdDeployments: "Pre-Production Deployments",
    prodDeployments: "Production Deployments",
    toolbarInfo:
      "To use the toolbar in production your team members need the Chrome extension or to enable the toolbar for that domain in the toolbar menu. Learn more about using the toolbar in production.",
    allowOverride: "Allow this setting to be overridden on the project level.",
    learnMoreToolbar: "Learn more about the SERP Toolbar",
    transferTitle: "Transfer",
    transferDescription:
      "Transfer your projects to another team without downtime or workflow interruptions.",
    learnMoreTransfer: "Learn more about Transferring Projects",
    transferButton: "Transfer",
    leaveTeamTitle: "Leave Team",
    leaveTeamDescription:
      "Revoke your access to this Team. Any resources you've added to the Team will remain.",
    leaveTeamWarning:
      "To leave this Team, ensure at least one more Member has the Owner role.",
    deleteTeamTitle: "Delete Team",
    deleteTeamDescription:
      "Permanently remove your team and all of its contents from the SERP platform. This action is not reversible — please continue with caution.",
    deleteTeamWarningTitle: "Warning",
    deleteTeamWarningDescription:
      "To delete your account, visit Account Settings.",
    deleteTeamButton: "Delete Team",
    footerHome: "Home",
    footerDocs: "Docs",
    footerGuides: "Guides",
    footerHelp: "Help",
    footerContact: "Contact",
    footerLegal: "Legal",
    footerStatus: "All systems normal",
    footerStatusMobile: "Systems OK",
    saveButton: "Save",
    upgradeButton: "Upgrade",
  },
  links: {
    proPlan: "#",
    chromeExtension: "#",
    toolbarInProduction: "#",
    serpToolbar: "#",
    transferringProjects: "#",
    accountSettings: "#",
    home: "#",
    docs: "#",
    guides: "#",
    help: "#",
    contact: "#",
  },
};

export default function Settings1(props) {
  const {
    teamName = defaultProps.teamName,
    teamUrlSlug = defaultProps.teamUrlSlug,
    teamId = defaultProps.teamId,
    userAvatarSrc = defaultProps.userAvatarSrc,
    texts = defaultProps.texts ?? {},
    links = defaultProps.links ?? {},
  } = props;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Main content wrapper */}
      <div className="relative flex flex-1 md:flex-row">
        

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-28">
          <h1 className="mb-6 hidden text-3xl font-bold md:mb-8 md:block">
            {texts.settings}
          </h1>

          {/* Team Name Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.teamNameTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.teamNameDescription}
            </p>
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2">
                <Input type="text" defaultValue={teamName} className="flex-1" />
                <Button size="sm">{texts.saveButton}</Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {texts.teamNameInputHint}
              </p>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Team URL Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">{texts.teamUrlTitle}</h2>
            <p className="mb-4 text-muted-foreground">
              {texts.teamUrlDescription}
            </p>
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center">
                  <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    SERP.com/
                  </span>
                  <Input
                    type="text"
                    defaultValue={teamUrlSlug}
                    className="min-w-0 flex-1 rounded-l-none"
                  />
                </div>
                <Button size="sm">{texts.saveButton}</Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {texts.teamUrlInputHint}
              </p>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Team Avatar Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.teamAvatarTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.teamAvatarDescription?.split("Click on")[0]}
              <br className="md:hidden" />
              {texts.teamAvatarDescription?.split(". ")[1]}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar className="h-16 w-16 cursor-pointer border-2 border-muted hover:border-primary">
                <AvatarImage src={userAvatarSrc} alt="Team Avatar" />
                <AvatarFallback>
                  {teamName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  {texts.teamAvatarRecommended}
                </p>
                <Button size="sm" variant="outline">
                  {texts.changeAvatarButton}
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Preview Deployment Suffix Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.previewDeploymentSuffixTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.previewDeploymentSuffixDescription?.split(".SERP.app")[0]}
              <code className="rounded bg-muted px-1 py-0.5 text-xs text-muted-foreground">
                .SERP.app
              </code>
              {texts.previewDeploymentSuffixDescription?.split(".SERP.app")[1]}
            </p>
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center">
                  <Input
                    type="text"
                    placeholder="my-deployment"
                    className="min-w-0 flex-1 rounded-r-none"
                    disabled // This feature requires upgrade
                  />
                  <span className="inline-flex h-10 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    .SERP.app
                  </span>
                </div>
                <Button size="sm" variant="secondary">
                  {texts.upgradeButton}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {texts.proPlanFeature}{" "}
                <a href={links.proPlan} className="text-primary underline">
                  {texts.proPlanLink}{" "}
                  <ExternalLink className="ml-0.5 inline h-3 w-3" />
                </a>{" "}
                for an additional{" "}
                <span className="font-semibold text-foreground">
                  {texts.proPlanPrice}
                </span>
                .
              </p>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Team ID Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">{texts.teamIdTitle}</h2>
            <p className="mb-4 text-muted-foreground">
              {texts.teamIdDescription}
            </p>
            <div className="w-full max-w-md">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="text"
                  value={teamId}
                  readOnly
                  className="flex-grow font-mono text-sm"
                />
                <Button variant="outline" size="icon" aria-label="Copy Team ID">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {texts.teamIdHint}
              </p>
            </div>
          </div>
          <Separator className="my-8" />

          {/* SERP Toolbar Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.serpToolbarTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.serpToolbarDescription}
            </p>
            <div className="mb-4 grid w-full max-w-lg grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="pre-prod-toolbar"
                  className="text-sm font-medium text-muted-foreground"
                >
                  {texts.preProdDeployments}
                </Label>
                <Select defaultValue="on">
                  <SelectTrigger id="pre-prod-toolbar" className="mt-1">
                    <SelectValue placeholder="Select setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Default (on)</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="prod-toolbar"
                  className="text-sm font-medium text-muted-foreground"
                >
                  {texts.prodDeployments}
                </Label>
                <Select defaultValue="on">
                  <SelectTrigger id="prod-toolbar" className="mt-1">
                    <SelectValue placeholder="Select setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Default (on)</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4 flex max-w-lg flex-wrap items-start gap-2 rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                {texts.toolbarInfo?.split("Chrome extension")[0]}
                <a
                  href={links.chromeExtension}
                  className="text-primary underline"
                >
                  Chrome extension
                </a>
                {
                  texts.toolbarInfo
                    ?.split("Chrome extension")[1]
                    .split("toolbar in production")[0]
                }
                <a
                  href={links.toolbarInProduction}
                  className="text-primary underline"
                >
                  toolbar in production
                </a>
                .
              </span>
            </div>
            <div className="mb-4 flex items-center space-x-2">
              <Switch id="allow-override" defaultChecked={true} />
              <Label htmlFor="allow-override" className="text-sm">
                {texts.allowOverride}
              </Label>
            </div>
            <div className="flex max-w-lg items-center justify-end">
              <p className="mr-4 text-sm text-muted-foreground">
                {texts.learnMoreToolbar?.split("SERP Toolbar")[0]}
                <a href={links.serpToolbar} className="text-primary underline">
                  SERP Toolbar{" "}
                  <ExternalLink className="ml-0.5 inline h-3 w-3" />
                </a>
              </p>
              <Button size="sm">{texts.saveButton}</Button>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Transfer Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.transferTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.transferDescription}
            </p>
            <div className="flex max-w-md items-center justify-end">
              <p className="mr-4 text-sm text-muted-foreground">
                {texts.learnMoreTransfer?.split("Transferring Projects")[0]}
                <a
                  href={links.transferringProjects}
                  className="text-primary underline"
                >
                  Transferring Projects{" "}
                  <ExternalLink className="ml-0.5 inline h-3 w-3" />
                </a>
              </p>
              <Button size="sm" variant="secondary">
                {texts.transferButton}
              </Button>
            </div>
          </div>
          <Separator className="my-8" />

          {/* Leave Team Section */}
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">
              {texts.leaveTeamTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.leaveTeamDescription}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              {texts.leaveTeamWarning}
            </p>
          </div>
          <Separator className="my-8" />

          {/* Delete Team Section */}
          <div>
            <h2 className="mb-2 text-xl font-semibold text-destructive">
              {texts.deleteTeamTitle}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {texts.deleteTeamDescription}
            </p>
            <Alert variant="destructive" className="mb-4 max-w-md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{texts.deleteTeamWarningTitle}</AlertTitle>
              <AlertDescription>
                {
                  texts.deleteTeamWarningDescription?.split(
                    "Account Settings",
                  )[0]
                }
                <a
                  href={links.accountSettings}
                  className="font-medium underline"
                >
                  Account Settings
                </a>
                .
              </AlertDescription>
            </Alert>
            <Button variant="destructive">{texts.deleteTeamButton}</Button>
          </div>
        </main>
      </div>

      {/* Footer - made responsive */}
      <footer className="left-0 right-0 z-40 flex flex-col border-t bg-background px-4 py-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 md:text-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto pb-1 md:pb-0">
          <span>▲</span>
          <a href={links.home} className="hover:text-foreground">
            {texts.footerHome}
          </a>
          <a href={links.docs} className="hover:text-foreground">
            {texts.footerDocs}
          </a>
          <a href={links.guides} className="hover:text-foreground md:block">
            {texts.footerGuides}
          </a>
          <a href={links.help} className="hover:text-foreground md:block">
            {texts.footerHelp}
          </a>
          <a href={links.contact} className="hover:text-foreground md:block">
            {texts.footerContact}
          </a>
          <span className="hidden shrink-0 sm:inline-block">
            © {new Date().getFullYear()} SERP Inc.
          </span>
          <div className="hidden sm:inline-block">
            <Select defaultValue="legal">
              <SelectTrigger className="h-auto border-none bg-transparent px-1 py-0 text-xs shadow-none focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder={texts.footerLegal} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="legal">{texts.footerLegal}</SelectItem>
                {/* Add other legal links */}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between md:space-x-4">
          <span className="flex items-center text-green-500">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
            <span className="hidden sm:inline">{texts.footerStatus}</span>
            <span className="sm:hidden">{texts.footerStatusMobile}</span>
          </span>
          {/* Theme toggle - more visible on mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
