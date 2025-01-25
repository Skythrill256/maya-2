export const networkStates = [
  {
    id: 1,
    name: "DeSci",
    memberCount: "12k Members",
    description: "Join DeSci: Tap in to Maya's Global technocracy to access the World's global talent virtually.",
    createdAt: "08.08.2024",
    logo: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=200&h=200&fit=crop"
  },
]

export const trendingPolls = [
  {
    id: 1,
    networkState: "DeSci",
    logo: "https://images.unsplash.com/photo-1494172892981-ce47ca685eea?w=200&h=200&fit=crop",
    question: "How do you view your country's relationship with China?",
    votingEnds: "10:00:30",
    votes: 1692
  },
  {
    id: 2,
    networkState: "Tech Innovators",
    logo: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=200&h=200&fit=crop",
    question: "What is the future of AI in our daily lives?",
    votingEnds: "12:00:00",
    votes: 850
  },
  {
    id: 3,
    networkState: "Green Earth",
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop",
    question: "Should we ban single-use plastics?",
    votingEnds: "14:30:00",
    votes: 1200
  },
  {
    id: 4,
    networkState: "Health & Wellness",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop",
    question: "Is mental health awareness improving in society?",
    votingEnds: "09:00:00",
    votes: 600
  }
]

export const discussions = [
  {
    id: 1,
    author: "Dr. Sarah Chen",
    username: "@sarahchen",
    timeAgo: "2h",
    avatar: "/placeholder.svg",
    content: "The integration of blockchain technology in scientific research could revolutionize how we handle data integrity and reproducibility. What are your thoughts on implementing this in our current research framework?",
    reactions: ["🤔", "💡", "👍"],
    replies: 15,
    shares: 8,
    likes: 42
  },
  {
    id: 2,
    author: "Alex Thompson",
    username: "@alexthompson",
    timeAgo: "4h",
    avatar: "/placeholder.svg",
    content: "Our latest quantum computing simulation showed promising results in molecular modeling. Looking forward to sharing the detailed findings with the community.",
    reactions: ["🎉", "🔬", "💫"],
    replies: 23,
    shares: 12,
    likes: 67
  },
  {
    id: 3,
    author: "Maria Garcia",
    username: "@mariagarcia",
    timeAgo: "6h",
    avatar: "/placeholder.svg",
    content: "The new carbon credit tracking system has shown a 40% improvement in transparency. Here's how we can further enhance it using smart contracts.",
    reactions: ["🌱", "💚", "📈"],
    replies: 18,
    shares: 15,
    likes: 89
  },
  {
    id: 4,
    author: "Dr. James Wilson",
    username: "@jameswilson",
    timeAgo: "8h",
    avatar: "/placeholder.svg",
    content: "Exciting breakthrough in our AI ethics framework! We've developed a new approach to bias detection in machine learning models.",
    reactions: ["🤖", "🎯", "👏"],
    replies: 31,
    shares: 24,
    likes: 112
  },
  {
    id: 5,
    author: "Emily Zhang",
    username: "@emilyzhang",
    timeAgo: "12h",
    avatar: "/placeholder.svg",
    content: "Just published our findings on quantum error correction. The results suggest a 30% improvement in qubit stability.",
    reactions: ["⚛️", "🔬", "🎉"],
    replies: 27,
    shares: 19,
    likes: 95
  }
]

export interface Proposal {
  id: number
  question: string
  description: string
  startTime: string
  endTime: string
  votes: number
  networkState: string
  logo: string
  votingEnds: string
}

export const proposals: Proposal[] = [
  {
    id: 1,
    question: "Should we implement a decentralized peer review system?",
    description: "Proposal to create a blockchain-based peer review system for scientific papers.",
    startTime: "2024-03-15T10:00:00",
    endTime: "2024-03-22T10:00:00",
    votes: 1250,
    networkState: "DeSci",
    logo: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=200&h=200&fit=crop",
    votingEnds: "7 days"
  },
  {
    id: 2,
    question: "Implementation of Carbon Credits Trading Platform",
    description: "Develop a platform for transparent carbon credits trading using blockchain technology.",
    startTime: "2024-03-16T14:00:00",
    endTime: "2024-03-23T14:00:00",
    votes: 890,
    networkState: "Green Earth",
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop",
    votingEnds: "6 days"
  },
  {
    id: 3,
    question: "AI Safety Guidelines Implementation",
    description: "Establish comprehensive guidelines for AI development and deployment.",
    startTime: "2024-03-17T09:00:00",
    endTime: "2024-03-24T09:00:00",
    votes: 2100,
    networkState: "AI Ethics",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop",
    votingEnds: "5 days"
  },
  {
    id: 4,
    question: "Quantum Computing Research Fund Allocation",
    description: "Proposal to allocate resources for quantum computing research initiatives.",
    startTime: "2024-03-18T11:00:00",
    endTime: "2024-03-25T11:00:00",
    votes: 750,
    networkState: "Quantum Computing",
    logo: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop",
    votingEnds: "4 days"
  }
]
