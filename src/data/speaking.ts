export interface SpeakingEvent {
  title: string;
  region: string;
  date?: string;
  format: string;
  audience?: string;
  sourceLinks: { label: string; url: string }[];
  images: string[];
  imageAlt?: string;
  summary: string;
  insights: string[];
  featuredPriority?: number;
}

const yearPattern = /\b(20\d{2})\b/;

export function speakingEventSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function speakingEventSortValue(date?: string): number {
  if (!date) return 0;

  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) return parsed;

  const year = date.match(yearPattern)?.[1];
  return year ? Date.UTC(Number(year), 0, 1) : 0;
}

export function speakingEventYear(date?: string): string | undefined {
  if (!date) return undefined;
  return date.match(yearPattern)?.[1];
}

export function speakingEventDateLabel(date?: string): string | undefined {
  if (!date) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const parsed = Date.parse(date);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });
    }
  }

  return date;
}

export const speakingEvents: SpeakingEvent[] = [
  {
    title: 'Hong Kong CIO Roundtable',
    region: 'Hong Kong',
    date: 'June 2025',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/feed/update/urn:li:activity:7333805611039563777/',
      },
    ],
    images: [
      '/images/hong-kong-roundtable-1.png',
      '/images/hong-kong-roundtable-2.png',
    ],
    imageAlt:
      'Executive roundtable in Hong Kong focused on enterprise AI adoption, Copilot deployment, and security governance.',
    summary:
      'Led a CIO roundtable in Hong Kong discussing enterprise AI adoption, Copilot deployment strategies, and the intersection of developer productivity with security governance.',
    insights: [
      'Velocity metrics (lines of code, PR throughput) are a trap; sophisticated leaders measure things like defect density and % resources spent on KTLO activities vs value creation.',
      'Governance is shifting from "blocking AI" to "tagging AI provenance" in commit history.',
      'The pilot-to-scale gap is usually caused by lack of internal platform engineering and AI-first mindset.',
    ],
  },
  {
    title: 'Sydney CIO Roundtable',
    region: 'Sydney, Australia',
    date: 'June 2025',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/palo-it_paloit-gene2-github-activity-7341298696837337090-5O8T',
      },
    ],
    images: ['/images/sydney-cio-roundtable-2.jpeg'],
    imageAlt:
      'Sydney CIO roundtable session with a live presentation on AI-driven software delivery, developer productivity, and GitHub x PALO IT collaboration.',
    summary:
      'Joined PALO IT’s APAC AI Delivery private roundtable in Sydney to discuss AI-driven software delivery, from AI-native product design methods to secure agentic workflows across the SDLC.',
    insights: [
      'AI delivery resonates most when it spans the full lifecycle — product design, engineering, infrastructure, and compliance — instead of being framed as a code-generation story only.',
      'Teams are more ready to trust agentic workflows when the emphasis is on verified iteration rather than blind automation.',
      'The strongest transformation story is collaborative, with AI agents acting as peers inside delivery teams rather than as isolated productivity tools for individuals.',
    ],
  },
  {
    title: 'Singapore CIO Roundtable',
    region: 'Singapore',
    date: '2025-05-01',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/ai-gene2-githubcopilot-ugcPost-7333737668935069696-laWV/',
      },
    ],
    images: ['/images/singapore-cio-roundtable.png'],
    imageAlt:
      'Executive roundtable in Singapore focused on AI coding adoption, enterprise governance, and Copilot strategy.',
    summary:
      'Participated in a CIO roundtable in Singapore covering AI coding adoption patterns and the governance frameworks enterprises need before scaling.',
    insights: [
      'AI delivery lands best when it is anchored in methodology and context — not just raw generation — with a workflow that can carry teams from design artifacts to validated frontend output inside one loop.',
      'Enterprise adoption becomes more credible when AI is framed as a way to unblock developers through verified, collaborative workflows across design, code, infrastructure, and compliance rather than as a replacement for engineering judgement.',
    ],
    featuredPriority: 3,
  },
  {
    title: 'Bangkok CIO Roundtable',
    region: 'Bangkok, Thailand',
    date: '2025-05-01',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/ai-gene2-githubcopilot-ugcPost-7335181424829845504-5NwI/',
      },
    ],
    images: ['/images/bangkok-roundtable.jpeg'],
    imageAlt:
      'Presentation in Bangkok on agentic SDLC, GitHub Copilot, and AI-assisted software delivery for technology leaders.',
    summary:
      'Co-led a CIO roundtable in Bangkok exploring how enterprise technology leaders in Southeast Asia are approaching AI-augmented development.',
    insights: [
      'Agentic AI works best when every handoff leaves a visible trail across planning, code, tests, and review.',
      'The real shift is not faster generation alone; it is engineering teams learning to orchestrate specialized agents inside disciplined delivery loops.',
    ],
    featuredPriority: 4,
  },
  {
    title: 'Auckland AI Coding Panel',
    region: 'Auckland, New Zealand',
    date: '2025',
    format: 'Panel discussion',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/feed/update/urn:li:activity:7377201072525754368/',
      },
    ],
    images: ['/images/auckland-panel.png'],
    imageAlt:
      'Panel discussion in Auckland on AI coding, pair programming, and agentic development workflows.',
    summary:
      'Panelist at an AI coding event in Auckland discussing practical applications of AI pair programming and agentic development workflows.',
    insights: [
      'The most credible AI coding stories are still workflow stories — review quality, test discipline, and developer judgement matter more than raw generation speed.',
      'Audiences respond fastest when AI is framed as a better pair programmer rather than a replacement for engineering craft.',
      'Teams want concrete patterns for adopting agentic workflows safely, not just another benchmark-heavy demo.',
    ],
  },
  {
    title: 'GitHub SKO Main Stage Keynote',
    region: 'Global (internal)',
    date: 'July 2023',
    format: 'Keynote',
    audience: 'Approximately 1,600 attendees',
    sourceLinks: [],
    images: ['/images/hero-rko-stage.png'],
    imageAlt:
      'Main stage keynote at GitHub Sales Kickoff delivered to a large internal audience.',
    summary:
      'Delivered an application security keynote on the main stage at GitHub Sales Kickoff to approximately 1,600 attendees.',
    insights: [
      'Security leaders respond best when AppSec is framed as a force multiplier for engineering throughput, not a separate control function that arrives after the build.',
      'The commercial story gets sharper when you can show how developer-native security tooling reduces remediation lag instead of simply increasing alert volume.',
    ],
    featuredPriority: 2,
  },
  {
    title: 'OctoNihon Tokyo User Group',
    region: 'Tokyo, Japan',
    date: '2025-06-06',
    format: 'User group presentation',
    audience: 'Approximately 400 attendees',
    sourceLinks: [
      {
        label: 'Event page',
        url: 'https://octonihon.github.io/events/2025-06-06-GitHub-OctoNihon-Forum/',
      },
    ],
    images: ['/images/octonihon-tokyo.png'],
    imageAlt:
      'Presentation at the OctoNihon Tokyo user group on AI-driven development practices.',
    summary:
      'Presented at OctoNihon, the GitHub user group in Tokyo, to approximately 400 attendees on AI-driven development practices.',
    insights: [
      'Developer communities want practical demonstrations of AI inside real delivery loops, not abstract future-of-work talk.',
      'The strongest live examples combined AI speed with clearer testing, review, and quality guardrails.',
      'Trust rises when AI is shown as part of disciplined engineering practice instead of a shortcut around it.',
    ],
    featuredPriority: 1,
  },
  {
    title: 'Absolute AppSec Podcast E217',
    region: 'Online',
    date: 'September 2023',
    format: 'Podcast',
    sourceLinks: [
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/watch?v=VJrb3SPGcyQ',
      },
    ],
    images: [],
    summary:
      'Guest appearance on the Absolute AppSec podcast (Episode 217) discussing application security topics with the GitHub Advanced Security team.',
    insights: [
      'Developer adoption improves when security findings are delivered inside the pull request, where context is fresh and the fix is still cheap.',
      'Mature AppSec programmes are moving from periodic scanning to continuous feedback loops that make secure engineering feel like part of normal delivery work.',
    ],
  },
  {
    title: 'Absolute AppSec Podcast E203',
    region: 'Online',
    date: '2023',
    format: 'Podcast',
    sourceLinks: [
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/watch?v=PoR2G8e6V5o&list=PLObjwXTc0xGM40uOAQx8fk3KQKjr_8ofR&index=7',
      },
    ],
    images: [],
    summary:
      'Guest appearance on Absolute AppSec (Episode 203) covering application security strategy and developer-first security tooling.',
    insights: [
      'Security strategy becomes credible when it prioritises the top few engineering choke points rather than attempting to solve every class of risk at once.',
      'Developer-first tooling works because it respects flow state: the best controls shorten the path to a fix instead of adding another queue to manage.',
    ],
  },
  {
    title: 'Supercharge the Power of your Security Team',
    region: 'Online',
    date: '2023',
    format: 'Webinar',
    sourceLinks: [
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/watch?v=FxVGNQsK0qo',
      },
    ],
    images: [],
    summary:
      'Presented a webinar on how security teams can amplify their impact by integrating developer-first security tooling into existing workflows.',
    insights: [
      'The highest-leverage security teams build paved roads for developers, then use automation to scale guidance without scaling headcount at the same rate.',
      'Security earns influence when it removes toil from engineering teams and turns review time into reusable guardrails, templates, and policy-as-code.',
    ],
  },
  {
    title: 'Building a Frictionless Application Security Program',
    region: 'Online',
    date: '2022',
    format: 'Conference talk (GitHub InFocus)',
    sourceLinks: [
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/watch?v=5phnJ3WdTb8',
      },
    ],
    images: ['/images/infocus-2022-frictionless-appsec.png'],
    imageAlt:
      'Building a Frictionless Application Security Program — GitHub InFocus 2022 conference talk.',
    summary:
      'Spoke at GitHub InFocus on building application security programs that developers actually adopt, emphasizing frictionless integration and shift-left practices.',
    insights: [
      'Frictionless AppSec is less about adding more scanners and more about fitting security signals into the tools, rituals, and metrics developers already trust.',
      'Shift-left only works when teams also shift clarity left, giving developers actionable fixes, ownership, and enough context to remediate quickly.',
    ],
  },
  {
    title: 'Identifying and Mitigating Insider Risk',
    region: 'Online',
    date: '2020',
    format: 'Webinar',
    sourceLinks: [
      {
        label: 'YouTube',
        url: 'https://www.youtube.com/watch?v=6hMYMefDcMo',
      },
    ],
    images: [],
    summary:
      'Delivered a webinar on insider risk identification and mitigation strategies, covering detection frameworks and response playbooks.',
    insights: [
      'Insider risk programmes become more accurate when they look for changes in behaviour over time rather than treating every access anomaly as malicious intent.',
      'The strongest response playbooks balance investigation speed with employee trust, because heavy-handed controls can create the very disengagement they are meant to prevent.',
    ],
  },
  {
    title: '5 Steps to Building A People-Centric Insider Threat Program',
    region: 'APAC (Online)',
    date: '2020',
    format: 'Webinar',
    sourceLinks: [
      {
        label: 'BrightTALK',
        url: 'https://www.brighttalk.com/webcast/13513/398861',
      },
    ],
    images: [],
    summary:
      'Presented a framework for building people-centric insider threat programs across the APAC region, emphasizing behavioral indicators and organizational culture.',
    insights: [
      'People-centric programmes work when they combine technical telemetry with manager awareness, wellbeing signals, and clear escalation pathways.',
      'Culture is a genuine security control: teams with psychological safety surface risk earlier, long before it appears in logs or exfiltration alerts.',
    ],
  },
  {
    title: 'Application Security in the World of AI Engineering',
    region: 'Sydney, Australia',
    date: '2023',
    format: 'Panel discussion',
    sourceLinks: [
      {
        label: '6degrees Media',
        url: 'https://6degreesmedia.com.au/6d-sec-speakers-syd23/',
      },
      {
        label: 'The Missing Link',
        url: 'https://www.themissinglink.com.au/news/the-insider-threat',
      },
    ],
    images: ['/images/appsec-speaking-2.png'],
    imageAlt:
      'Security panel in Sydney on application security in the world of AI engineering.',
    summary:
      'Panelist at a Sydney security event discussing application security challenges in the context of AI-assisted engineering and the evolving threat landscape.',
    insights: [
      'AI engineering changes AppSec by increasing the volume of code and infrastructure decisions, which means review systems need more verification, provenance, and policy automation.',
      'The winning pattern is not to ban AI from engineering, but to pair it with stronger test discipline, secure defaults, and visible accountability for generated changes.',
    ],
  },
];
