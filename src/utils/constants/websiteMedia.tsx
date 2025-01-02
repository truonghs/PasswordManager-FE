import { icons } from '@/utils/icons'

export const FEATURES = [
  {
    title: 'Enhanced Security',
    text: 'Keep your passwords safe with encryption.',
    icon: icons.safety
  },
  {
    title: 'Easy Sharing',
    text: 'Securely share credentials with your team members.',
    icon: icons.userSwitch
  },
  {
    title: 'Cloud Sync',
    text: 'Access your passwords from anywhere, anytime.',
    icon: icons.cloud
  },
  {
    title: 'Secure Backup',
    text: 'Never lose your data with our automated backup.',
    icon: icons.lockLine
  },
  {
    title: 'Custom Integrations',
    text: 'Integrate with other tools to enhance your workflow.',
    icon: icons.tool
  },
  {
    title: 'Activity Monitoring',
    text: 'Track all activities to prevent unauthorized access.',
    icon: icons.antDashboard
  }
]

export const PRICING_PLAN_ITEMS = [
  {
    title: 'FREE',
    description: 'Get started and try our service before pricing',
    weights: 1,
    price: '$0',
    features: [
      {
        icon: icons.checkmark,
        text: 'Save account'
      },
      {
        icon: icons.checkmark,
        text: 'Access on all devices'
      },
      {
        icon: icons.checkmark,
        text: 'Password generator'
      },
      {
        icon: icons.checkmark,
        text: 'Save and autofill'
      },
      {
        icon: icons.checkmark,
        text: 'Storage limit of 10 accounts'
      },
      {
        icon: icons.checkmark,
        text: 'Personal support'
      },
      {
        icon: icons.checkmark,
        text: 'Multifactor authentication'
      },
      {
        icon: icons.checkmark,
        text: '1 workspace'
      }
    ]
  },
  {
    title: 'STARTER',
    description: 'Best option for personal use and small projects.',
    weights: 10,

    price: '$19',
    features: [
      {
        icon: icons.checkmark,
        text: 'Includes all free features'
      },
      {
        icon: icons.checkmark,
        text: 'Storage limit of 25 accounts'
      },
      {
        icon: icons.checkmark,
        text: 'Workspace'
      },
      {
        icon: icons.checkmark,
        text: '4 workspaces'
      }
    ]
  },
  {
    title: 'PROFESSIONAL',
    description: 'Ideal for freelancers and growing businesses.',
    weights: 100,

    price: '$49',
    features: [
      {
        icon: icons.checkmark,
        text: 'Includes all starter features'
      },
      {
        icon: icons.checkmark,
        text: 'Storage limit of 100 accounts'
      },
      {
        icon: icons.checkmark,
        text: '10 workspaces'
      }
    ]
  },
  {
    title: 'BUSINESS',
    description: 'Perfect for small to medium-sized teams.',
    weights: 1000,

    price: '$99',
    features: [
      {
        icon: icons.checkmark,
        text: 'Includes all Professional features'
      },
      {
        icon: icons.checkmark,
        text: 'Unlimited amount of accounts'
      },
      {
        icon: icons.checkmark,
        text: 'Unlimited amount of workspaces'
      }
    ]
  }
]

export const SERVICES_LINKS = [
  {
    title: 'Key FEATURES',
    links: [
      'Securely store login information',
      'Auto-fill passwords',
      'User information security',
      'Easy account management',
      'Remember account information across multiple devices',
      'Organize information by categories',
      'Securely share information',
      'Account usage statistics',
      'Update and sync information',
      '24/7 customer support'
    ]
  },
  {
    title: 'Others',
    links: [
      'About Us',
      'Careers',
      'Contact Us',
      'Security Solutions',
      'Technology Innovation',
      'Our Activities',
      'Partnerships',
      'Blog'
    ]
  }
]

export const SOCIAL_MEDIA = [
  {
    href: '#facebook',
    icon: icons.facebook
  },
  {
    href: '#twitter',
    icon: icons.twitter
  },
  {
    href: '#instagram',
    icon: icons.instagram
  },
  {
    href: '#linkedin',
    icon: icons.linkedin
  }
]
