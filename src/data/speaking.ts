export interface SpeakingEvent {
  title: string;
  region: string;
  date?: string;
  format: string;
  audience?: string;
  sourceLinks: { label: string; url: string }[];
  images?: string[];
  imageAlt?: string;
  summary: string;
}

export const speakingEvents: SpeakingEvent[] = [
  {
    title: 'Hong Kong CIO Roundtable',
    region: 'Hong Kong',
    date: '2025',
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
  },
  {
    title: 'Sydney CIO Roundtable',
    region: 'Sydney, Australia',
    date: '2025',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/palo-it_paloit-gene2-microsoft-activity-7334061125036101632-MpsN/',
      },
    ],
    images: [],
    summary:
      'Facilitated an executive roundtable in Sydney focused on AI-assisted software development and enterprise readiness for agentic coding workflows.',
  },
  {
    title: 'Singapore CIO Roundtable',
    region: 'Singapore',
    date: '2025',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/ai-gene2-githubcopilot-ugcPost-7333737668935069696-laWV/',
      },
    ],
    images: [],
    summary:
      'Participated in a CIO roundtable in Singapore covering AI coding adoption patterns and the governance frameworks enterprises need before scaling.',
  },
  {
    title: 'Bangkok CIO Roundtable',
    region: 'Bangkok, Thailand',
    date: '2025',
    format: 'Executive roundtable',
    audience: 'CIOs and senior technology leaders',
    sourceLinks: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/posts/ai-gene2-githubcopilot-ugcPost-7335181424829845504-5NwI/',
      },
    ],
    images: [],
    summary:
      'Co-led a CIO roundtable in Bangkok exploring how enterprise technology leaders in Southeast Asia are approaching AI-augmented development.',
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
  },
  {
    title: 'GitHub SKO Main Stage Keynote',
    region: 'Global (internal)',
    date: '2023',
    format: 'Keynote',
    audience: 'Approximately 3,000 attendees',
    sourceLinks: [],
    images: ['/images/hero-rko-stage.png'],
    imageAlt:
      'Main stage keynote at GitHub Sales Kickoff delivered to a large internal audience.',
    summary:
      'Delivered an application security keynote on the main stage at GitHub Sales Kickoff to approximately 3,000 attendees.',
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
    images: [],
    summary:
      'Spoke at GitHub InFocus on building application security programs that developers actually adopt, emphasizing frictionless integration and shift-left practices.',
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
    images: ['/images/appsec-speaking-1.png', '/images/appsec-speaking-2.png'],
    imageAlt:
      'Security panel in Sydney on application security in the world of AI engineering.',
    summary:
      'Panelist at a Sydney security event discussing application security challenges in the context of AI-assisted engineering and the evolving threat landscape.',
  },
];
