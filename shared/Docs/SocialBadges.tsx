import Link from "next/link";
import {
  RiGithubFill,
  RiBlueskyFill,
  RiTwitterXFill,
  RiDiscordFill,
} from "@remixicon/react";

function SocialLink({ href, icon: Icon, children }) {
  return (
    <Link href={href} className="group">
      <span className="sr-only">{children}</span>
      <Icon className="h-5 w-5 text-subtle transition group-hover:text-link" />
    </Link>
  );
}

export default function SocialBadges() {
  return (
    <div className="flex gap-4">
      <SocialLink href="https://github.com/inngest/inngest" icon={RiGithubFill}>
        Star our open source repository
      </SocialLink>
      <SocialLink
        href="https://www.inngest.com/discord?ref=social-badge"
        icon={RiDiscordFill}
      >
        Join our Discord community
      </SocialLink>
      <span className="transform scale-75">
        <SocialLink href="https://twitter.com/inngest" icon={RiTwitterXFill}>
          Follow us on X
        </SocialLink>
      </span>
      <SocialLink
        href="https://bsky.app/profile/inngest.com"
        icon={RiBlueskyFill}
      >
        Follow us on Bluesky
      </SocialLink>
    </div>
  );
}
