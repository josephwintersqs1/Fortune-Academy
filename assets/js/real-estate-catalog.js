/**
 * Real Estate catalog carousel
 * Builds state-filtered course cards with tabbed categories and slick carousel.
 */
(function ($) {
  if (typeof $ === "undefined") {
    return;
  }

  var GLOBAL_STATE_DATA = window.FA_STATE_DATA || null;
  var FEATURED_STATES = GLOBAL_STATE_DATA && Array.isArray(GLOBAL_STATE_DATA.featured)
    ? GLOBAL_STATE_DATA.featured.slice()
    : ["Georgia", "North Carolina", "South Carolina"];
  var ALL_STATES = GLOBAL_STATE_DATA && Array.isArray(GLOBAL_STATE_DATA.all)
    ? GLOBAL_STATE_DATA.all.slice()
    : [
        "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
        "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
        "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
        "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
        "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
        "Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
        "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
      ];

  var TAB_LABELS = {
    "pre-license": "Pre-Licensing",
    upgrade: "Upgrade Licensing",
    ce: "Continuing Education",
    post: "Post Licensing",
    exam: "Exam Prep"
  };

var DEFAULT_COURSES = {
  "pre-license": [],
  upgrade: [],
  ce: [],
  post: [],
  exam: []
};

var COURSE_DATA = {
    "North Carolina": {
      "pre-license": [
        {
          title: "75-Hour North Carolina Broker Pre-License",
          description: "Complete your NC broker requirement with comprehensive real estate principles and law.",
          price: "$299.00",
          originalPrice: "$349.00",
          primaryCta: { label: "Book Now", href: "#" },
          secondaryCta: { label: "Wishlist", href: "#" },
          badge: "Best Seller",
          image: "assets/images/real_estate_products/AdobeStock_107150476_Preview.jpeg",
          duration: "75 Hours",
          format: "Online + Live",
          focus: "North Carolina",
          licenses: ["Real Estate Broker"]
        },
        {
          title: "Instructor-led NC Broker Licensing Live Virtual",
          description: "Instructor-led live virtual training with Q&A sessions and exam prep included.",
          price: "$349.00",
          originalPrice: "$389.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          badge: "Live Virtual",
          image: "assets/images/real_estate_products/AdobeStock_134349439_Preview.jpeg",
          duration: "8 Weeks",
          format: "Live Virtual",
          focus: "North Carolina",
          licenses: ["Real Estate Broker"]
        },
        {
          title: "NC Broker Weekend Intensive Course",
          description: "Fast-track weekend program with comprehensive exam prep and practice tests.",
          price: "$379.00",
          originalPrice: "$429.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_134395876_Preview.jpeg",
          duration: "4 Days",
          format: "In-Person",
          focus: "Charlotte",
          licenses: ["Real Estate Broker"]
        },
        {
          title: "Self-Paced NC Broker Pre-License",
          description: "Study at your own pace with interactive modules, videos, and flashcards.",
          price: "$279.00",
          originalPrice: "$319.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_1528048619_Preview.jpeg",
          duration: "12 Weeks",
          format: "Self-Paced",
          focus: "North Carolina",
          licenses: ["Real Estate Broker"]
        }
      ],
      "post": [],
      "ce": [],
      "upgrade": [],
      "exam": []
    },
    "South Carolina": {
      "pre-license": [
        {
          title: "90-Hour South Carolina Salesperson Pre-License",
          description: "Complete your SC salesperson requirement with real estate principles, law, and contracts.",
          price: "$329.00",
          originalPrice: "$379.00",
          primaryCta: { label: "Book Now", href: "#" },
          secondaryCta: { label: "Wishlist", href: "#" },
          badge: "Best Seller",
          image: "assets/images/real_estate_products/AdobeStock_153406782_Preview.jpeg",
          duration: "90 Hours",
          format: "Hybrid",
          focus: "South Carolina",
          licenses: ["Salesperson"]
        },
        {
          title: "SC Salesperson Weekend Bootcamp",
          description: "Intensive weekend training with practice exams and instructor support.",
          price: "$379.00",
          originalPrice: "$429.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_181368102_Preview.jpeg",
          duration: "2 Weekends",
          format: "In-Person",
          focus: "Columbia",
          licenses: ["Salesperson"]
        },
        {
          title: "60 + 30-Hour SC Broker-in-Charge Package",
          description: "Complete the Unit I (60hr) and Unit II (30hr) requirements for broker-in-charge.",
          price: "$279.00",
          originalPrice: "$319.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_193907694_Preview.jpeg",
          duration: "10 Weeks",
          format: "Online",
          focus: "South Carolina",
          licenses: ["Broker-in-Charge"]
        },
        {
          title: "SC Salesperson Self-Paced Course",
          description: "Interactive self-paced modules with quizzes and mobile-friendly access.",
          price: "$299.00",
          originalPrice: "$349.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_227656591_Preview.jpeg",
          duration: "6-12 Weeks",
          format: "Self-Paced",
          focus: "South Carolina",
          licenses: ["Salesperson"]
        }
      ],
      "post": [],
      "ce": [],
      "upgrade": [],
      "exam": []
    },
    Georgia: {
      "pre-license": [
        {
          title: "75-Hour Georgia Salesperson Pre-License Package",
          description: "Complete your 75-hour requirement with on-demand videos, exam prep, and instructor Q&A.",
          price: "$299.00",
          originalPrice: "$349.00",
          primaryCta: { label: "Book Now", href: "#" },
          secondaryCta: { label: "Wishlist", href: "#" },
          badge: "Best Seller",
          image: "assets/images/real_estate_products/AdobeStock_232729870_Preview.jpeg",
          duration: "8-10 Weeks",
          format: "Online + Live",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Premium GA Pre-License + Exam Cram Workshop",
          description: "Hybrid delivery with weekend live drills, accountability coach, and simulation exams.",
          price: "$399.00",
          originalPrice: "$459.00",
          primaryCta: { label: "Book Now", href: "#" },
          secondaryCta: { label: "Wishlist", href: "#" },
          badge: "Most Comprehensive",
          image: "assets/images/real_estate_products/AdobeStock_236878502_Preview.jpeg",
          duration: "10 Weeks",
          format: "Hybrid",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Georgia Pre-License Fast Track (Evening)",
          description: "Evening livestream series with recorded replays and instructor Q&A.",
          price: "$329.00",
          originalPrice: "$379.00",
          primaryCta: { label: "Reserve Seat", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          badge: "Evenings",
          image: "assets/images/real_estate_products/AdobeStock_267829154_Preview.jpeg",
          duration: "6 Weeks",
          format: "Live Virtual",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Self-Paced Salesperson Licensing Essentials",
          description: "Interactive self-paced modules with quizzes, flashcards, and mobile access.",
          price: "$249.00",
          originalPrice: "$289.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_279679766_Preview.jpeg",
          duration: "4-12 Weeks",
          format: "Self-Paced",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Weekend GA Pre-License Bootcamp",
          description: "Two weekend intensive with instructor support and practice exams.",
          price: "$359.00",
          originalPrice: "$399.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_282051680_Preview.jpeg",
          duration: "4 Days",
          format: "In-Person",
          focus: "Atlanta",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "GA Pre-License + Career Starter Bundle",
          description: "Includes pre-license, exam prep, and first-year business planning toolkit.",
          price: "$429.00",
          originalPrice: "$499.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Syllabus", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_292561185_Preview.jpeg",
          duration: "12 Weeks",
          format: "Hybrid",
          focus: "Statewide",
          licenses: ["Real Estate Agent", "Property Manager"]
        },
        {
          title: "Spanish GA Salesperson Licensing",
          description: "Complete 75-hour requirement with Spanish-speaking instructors and resources.",
          price: "$319.00",
          originalPrice: "$379.00",
          primaryCta: { label: "Reservar", href: "#" },
          secondaryCta: { label: "Detalles", href: "#" },
          badge: "Spanish",
          image: "assets/images/real_estate_products/AdobeStock_302582460_Preview.jpeg",
          duration: "8 Weeks",
          format: "Live Virtual",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Real Estate Math Mastery Add-On",
          description: "Supplemental math labs for license candidates needing extra practice.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Add To Cart", href: "#" },
          secondaryCta: { label: "Syllabus", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_330758315_Preview.jpeg",
          duration: "10 Hours",
          format: "Online",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Military Spouse Licensing Express",
          description: "Flexible schedule with tuition assistance guidance for military families.",
          price: "$279.00",
          originalPrice: "$329.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Benefits", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_374540173_Preview.jpeg",
          duration: "6-10 Weeks",
          format: "Self-Paced",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Agent Launch Pre-License + Mentorship",
          description: "Includes live licensing sessions plus 3 months of mentorship onboarding.",
          price: "$489.00",
          originalPrice: "$559.00",
          primaryCta: { label: "Join Cohort", href: "#" },
          secondaryCta: { label: "Mentor Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_429544384_Preview.jpeg",
          duration: "12 Weeks",
          format: "Hybrid",
          focus: "Georgia",
          licenses: ["Real Estate Agent"]
        }
      ],
      upgrade: [
        {
          title: "Broker Upgrade Accelerator (60-Hour)",
          description: "Meet Georgia broker requirements with finance, management, and trust account training.",
          price: "$289.00",
          originalPrice: "$329.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          badge: "New",
          image: "assets/images/real_estate_products/AdobeStock_461502029_Preview.jpeg",
          duration: "60 Hours",
          format: "Online",
          focus: "Broker Upgrade",
          licenses: ["Broker"]
        },
        {
          title: "GA Broker-in-Charge Leadership Lab",
          description: "Scenario-based leadership skills for supervising brokers and managers.",
          price: "$229.00",
          originalPrice: "$269.00",
          primaryCta: { label: "Join Lab", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_461557983_Preview.jpeg",
          duration: "24 Hours",
          format: "Live Virtual",
          focus: "Leadership",
          licenses: ["Broker"]
        },
        {
          title: "Commercial Broker Foundations (GA)",
          description: "Transition to commercial brokerage with valuation, underwriting, and leasing modules.",
          price: "$349.00",
          originalPrice: "$399.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Syllabus", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_51741413_Preview.jpeg",
          duration: "30 Hours",
          format: "Online",
          focus: "Commercial",
          licenses: ["Broker"]
        },
        {
          title: "Property Management Broker Course",
          description: "Broker-level requirements for property management oversight and compliance.",
          price: "$259.00",
          originalPrice: "$299.00",
          primaryCta: { label: "Start Course", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_538839062_Preview.jpeg",
          duration: "25 Hours",
          format: "Self-Paced",
          focus: "Property Mgmt",
          licenses: ["Broker", "Property Manager"]
        },
        {
          title: "Luxury & Boutique Brokerage Masterclass",
          description: "Differentiate your boutique brokerage with branding, marketing, and service frameworks.",
          price: "$199.00",
          originalPrice: "$239.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Curriculum", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_611092934_Preview.jpeg",
          duration: "18 Hours",
          format: "Live Virtual",
          focus: "Luxury",
          licenses: ["Broker"]
        },
        {
          title: "Broker Technology Stack Intensive",
          description: "Learn to evaluate CRMs, transaction management tools, and AI assistants for your brokerage.",
          price: "$149.00",
          originalPrice: "$189.00",
          primaryCta: { label: "Reserve Seat", href: "#" },
          secondaryCta: { label: "Agenda", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_64747679_Preview.jpeg",
          duration: "12 Hours",
          format: "Online",
          focus: "Tech Stack",
          licenses: ["Broker"]
        },
        {
          title: "Team Leader Broker Bootcamp",
          description: "Scaling teams, recruiting agents, coaching, and accountability frameworks.",
          price: "$239.00",
          originalPrice: "$279.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_107150476_Preview.jpeg",
          duration: "20 Hours",
          format: "Hybrid",
          focus: "Team Leadership",
          licenses: ["Broker"]
        },
        {
          title: "Managing Broker Compliance Clinic",
          description: "Deep dive into trust accounts, advertising policies, and supervision checklists.",
          price: "$209.00",
          originalPrice: "$249.00",
          primaryCta: { label: "Register", href: "#" },
          secondaryCta: { label: "Checklist", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_134349439_Preview.jpeg",
          duration: "16 Hours",
          format: "Live Virtual",
          focus: "Compliance",
          licenses: ["Broker"]
        },
        {
          title: "Georgia Brokerage Finance Workshop",
          description: "Build brokerage P&L models, forecast expenses, and optimize profitability.",
          price: "$179.00",
          originalPrice: "$219.00",
          primaryCta: { label: "Join Workshop", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_134395876_Preview.jpeg",
          duration: "12 Hours",
          format: "Self-Paced",
          focus: "Finance",
          licenses: ["Broker"]
        },
        {
          title: "Recruiting Accelerator for Brokers",
          description: "Attract, onboard, and retain agents with proven recruiting campaigns.",
          price: "$199.00",
          originalPrice: "$239.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Toolkit", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_1528048619_Preview.jpeg",
          duration: "15 Hours",
          format: "Live Virtual",
          focus: "Recruiting",
          licenses: ["Broker"]
        }
      ],
      ce: [
        {
          title: "Georgia 36-Hour CE Subscription",
          description: "Unlimited elective CE + mandatory topics in a single subscription for the next renewal cycle.",
          price: "$159.00",
          originalPrice: "$189.00",
          primaryCta: { label: "Subscribe", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          badge: "Subscriber Favorite",
          image: "assets/images/real_estate_products/AdobeStock_153406782_Preview.jpeg",
          duration: "36 Hours",
          format: "Self-paced",
          focus: "Georgia CE",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Risk Management Essentials (12-Hour CE)",
          description: "Stay compliant with contract, advertising, and fair housing updates.",
          price: "$129.00",
          originalPrice: "$149.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          badge: "Trending",
          image: "assets/images/real_estate_products/AdobeStock_181368102_Preview.jpeg",
          duration: "12 Hours",
          format: "Online",
          focus: "Risk Management",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Ethics & Fair Housing Update (4-Hour)",
          description: "Meets license law modules with real-world case studies and interactive scenarios.",
          price: "$55.00",
          originalPrice: "$69.00",
          primaryCta: { label: "Start Course", href: "#" },
          secondaryCta: { label: "Syllabus", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_193907694_Preview.jpeg",
          duration: "4 Hours",
          format: "Self-Paced",
          focus: "Ethics",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Contracts & Agency Refresher (6-Hour)",
          description: "Deepen contract knowledge with scenarios on dual agency, disclosures, and amendments.",
          price: "$79.00",
          originalPrice: "$95.00",
          primaryCta: { label: "Begin", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_227656591_Preview.jpeg",
          duration: "6 Hours",
          format: "Live Virtual",
          focus: "Contracts",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Property Management CE Essentials",
          description: "Stay current on landlord-tenant law, habitability, and trust accounting for PM.",
          price: "$89.00",
          originalPrice: "$109.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_232729870_Preview.jpeg",
          duration: "6 Hours",
          format: "Self-Paced",
          focus: "Property Mgmt",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Marketing & Social Media Compliance",
          description: "Avoid social media pitfalls while leveraging digital marketing to grow business.",
          price: "$75.00",
          originalPrice: "$95.00",
          primaryCta: { label: "Start Course", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_236878502_Preview.jpeg",
          duration: "4 Hours",
          format: "Online",
          focus: "Marketing",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Commercial CE: Lease Negotiations",
          description: "Advanced negotiation tactics and clauses for commercial leasing transactions.",
          price: "$95.00",
          originalPrice: "$115.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_267829154_Preview.jpeg",
          duration: "6 Hours",
          format: "Self-Paced",
          focus: "Commercial",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Luxury Listing Strategies CE",
          description: "Understand luxury buyer expectations, marketing plans, and presentation techniques.",
          price: "$89.00",
          originalPrice: "$109.00",
          primaryCta: { label: "Join Class", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_279679766_Preview.jpeg",
          duration: "6 Hours",
          format: "Live Virtual",
          focus: "Luxury",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "Investor & 1031 Exchange CE",
          description: "Serve investor clients with tax strategies, 1031 exchanges, and portfolio planning.",
          price: "$89.00",
          originalPrice: "$109.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_282051680_Preview.jpeg",
          duration: "6 Hours",
          format: "Self-Paced",
          focus: "Investors",
          licenses: ["Real Estate Agent", "Broker"]
        },
        {
          title: "CE Subscription: Teams & Leadership Bundle",
          description: "Annual CE covering leadership, team structures, and productivity coaching.",
          price: "$149.00",
          originalPrice: "$179.00",
          primaryCta: { label: "Subscribe", href: "#" },
          secondaryCta: { label: "Curriculum", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_292561185_Preview.jpeg",
          duration: "12 Hours",
          format: "Self-Paced",
          focus: "Leadership",
          licenses: ["Real Estate Agent", "Broker"]
        }
      ],
      post: [
        {
          title: "Georgia 25-Hour Post-License + Coaching",
          description: "Fulfill post-license hours and get production skills from practicing brokers.",
          price: "$189.00",
          originalPrice: "$219.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_302582460_Preview.jpeg",
          duration: "25 Hours",
          format: "Live Virtual",
          focus: "Post License",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Contracts in Practice",
          description: "Dive deeper into agency agreements, purchase contracts, and negotiation strategies.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_330758315_Preview.jpeg",
          duration: "12 Hours",
          format: "Self-Paced",
          focus: "Contracts",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Business Planning & Marketing",
          description: "Build lead funnels, content calendars, and transaction tracking for new agents.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Start Course", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_374540173_Preview.jpeg",
          duration: "12 Hours",
          format: "Self-Paced",
          focus: "Business Planning",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: License Law & Risk Management",
          description: "Understand Georgia license law, disciplinary cases, and risk management practices.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Syllabus", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_429544384_Preview.jpeg",
          duration: "12 Hours",
          format: "Self-Paced",
          focus: "Risk Management",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Working with Sellers",
          description: "Listing consultations, staging, marketing plans, and offer negotiations.",
          price: "$139.00",
          originalPrice: "$169.00",
          primaryCta: { label: "Join Class", href: "#" },
          secondaryCta: { label: "Curriculum", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_461502029_Preview.jpeg",
          duration: "12 Hours",
          format: "Live Virtual",
          focus: "Sellers",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Working with Buyers",
          description: "Buyer consultations, financing, offer writing, and loyalty-building strategies.",
          price: "$139.00",
          originalPrice: "$169.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_461557983_Preview.jpeg",
          duration: "12 Hours",
          format: "Live Virtual",
          focus: "Buyers",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Smart Growth Playbook",
          description: "Organize your CRM, open house strategy, and referral systems for year one.",
          price: "$149.00",
          originalPrice: "$179.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_51741413_Preview.jpeg",
          duration: "10 Hours",
          format: "Self-Paced",
          focus: "Business Systems",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Negotiation Mastery",
          description: "Master negotiation frameworks, objection handling, and win-win outcomes for new agents.",
          price: "$149.00",
          originalPrice: "$179.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Curriculum", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_538839062_Preview.jpeg",
          duration: "10 Hours",
          format: "Live Virtual",
          focus: "Negotiation",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Lead Generation Playbook",
          description: "Implement geo-farming, digital ads, and referral strategies tailored to Georgia markets.",
          price: "$149.00",
          originalPrice: "$179.00",
          primaryCta: { label: "Start Now", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_611092934_Preview.jpeg",
          duration: "10 Hours",
          format: "Self-Paced",
          focus: "Lead Gen",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Transaction Coordination 101",
          description: "Learn timelines, contract deadlines, and communication systems to keep deals on track.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_64747679_Preview.jpeg",
          duration: "8 Hours",
          format: "Self-Paced",
          focus: "Operations",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Referral & Sphere Strategies",
          description: "Create nurturing campaigns, client events, and value touches to grow your sphere.",
          price: "$139.00",
          originalPrice: "$169.00",
          primaryCta: { label: "Join Class", href: "#" },
          secondaryCta: { label: "Toolkit", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_107150476_Preview.jpeg",
          duration: "10 Hours",
          format: "Live Virtual",
          focus: "Sphere Building",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: Investment Fundamentals",
          description: "Help investor clients analyze deals, cap rates, and financing structures confidently.",
          price: "$149.00",
          originalPrice: "$189.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_134349439_Preview.jpeg",
          duration: "10 Hours",
          format: "Self-Paced",
          focus: "Investors",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Post-License: New Construction Toolkit",
          description: "Navigate builder contracts, selections, and walkthroughs with confidence.",
          price: "$139.00",
          originalPrice: "$169.00",
          primaryCta: { label: "Enroll", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_134395876_Preview.jpeg",
          duration: "9 Hours",
          format: "Self-Paced",
          focus: "New Construction",
          licenses: ["Real Estate Agent"]
        }
      ],
      exam: [
        {
          title: "Georgia State Exam Prep Edge",
          description: "Adaptive practice exams, topic drills, and instructor chat support until you pass.",
          price: "$99.00",
          originalPrice: "$129.00",
          primaryCta: { label: "Start Prep", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_1528048619_Preview.jpeg",
          duration: "Self-Paced",
          format: "Online",
          focus: "Exam Prep",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Georgia Exam Cram Weekend",
          description: "Live two-day review covering Georgia-specific license law and practice questions.",
          price: "$149.00",
          originalPrice: "$189.00",
          primaryCta: { label: "Reserve Seat", href: "#" },
          secondaryCta: { label: "Agenda", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_153406782_Preview.jpeg",
          duration: "2 Days",
          format: "Live Virtual",
          focus: "Georgia Law",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "National Concepts Drill Deck",
          description: "Over 500 national practice questions categorized by topic with explanations.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Start Drills", href: "#" },
          secondaryCta: { label: "Sample", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_181368102_Preview.jpeg",
          duration: "Self-Paced",
          format: "Online",
          focus: "National",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Math Mini-Camp for GA Exam",
          description: "Targeted math workshops covering proration, commissions, and finance problems.",
          price: "$89.00",
          originalPrice: "$109.00",
          primaryCta: { label: "Join Camp", href: "#" },
          secondaryCta: { label: "Outline", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_193907694_Preview.jpeg",
          duration: "6 Hours",
          format: "Live Virtual",
          focus: "Math",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Exam Prep Flashcard App Access",
          description: "Mobile flashcards synced across devices with spaced repetition reminders.",
          price: "$49.00",
          originalPrice: "$69.00",
          primaryCta: { label: "Download", href: "#" },
          secondaryCta: { label: "Preview", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_227656591_Preview.jpeg",
          duration: "Self-Paced",
          format: "Mobile",
          focus: "Flashcards",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Live Exam Coaching Sessions",
          description: "Weekly live coaching calls with instructors to review tough topics and answer questions.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Book Session", href: "#" },
          secondaryCta: { label: "Schedule", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_232729870_Preview.jpeg",
          duration: "3 Weeks",
          format: "Live Virtual",
          focus: "Coaching",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Exam Simulation Bundle",
          description: "Simulate the testing center with timed exams and detailed scoring analytics.",
          price: "$109.00",
          originalPrice: "$139.00",
          primaryCta: { label: "Simulate", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_236878502_Preview.jpeg",
          duration: "Self-Paced",
          format: "Online",
          focus: "Simulation",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Exam Prep Audio Companion",
          description: "Listen to key concepts and exam tips on the go with downloadable audio lessons.",
          price: "$59.00",
          originalPrice: "$79.00",
          primaryCta: { label: "Download", href: "#" },
          secondaryCta: { label: "Sample", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_267829154_Preview.jpeg",
          duration: "Self-Paced",
          format: "Audio",
          focus: "Audio Review",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Exam Prep Intensive (One-on-One)",
          description: "Personalized coaching package with custom study plan and instructor support.",
          price: "$249.00",
          originalPrice: "$299.00",
          primaryCta: { label: "Book Coach", href: "#" },
          secondaryCta: { label: "Details", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_279679766_Preview.jpeg",
          duration: "4 Weeks",
          format: "Coaching",
          focus: "Personal Coaching",
          licenses: ["Real Estate Agent"]
        },
        {
          title: "Last-Minute Exam Blitz",
          description: "Final 48-hour review schedule with checklists, quick reference sheets, and live Q&A.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Start Blitz", href: "#" },
          secondaryCta: { label: "Checklist", href: "#" },
          image: "assets/images/real_estate_products/AdobeStock_282051680_Preview.jpeg",
          duration: "2 Days",
          format: "Live Virtual",
          focus: "Final Review",
          licenses: ["Real Estate Agent"]
        }
      ]
    },
    // Mortgage Industry Data
    "Mortgage": {
      "pre-license": [
        {
          title: "20-Hour SAFE MLO Pre-License",
          description: "Complete federal NMLS requirements for mortgage loan originator licensing with comprehensive coursework.",
          price: "$199.00",
          originalPrice: "$249.00",
          primaryCta: { label: "Enroll Now", href: "#" },
          badge: "NMLS Approved",
          image: "assets/images/img23.jpg",
          duration: "20 Hours",
          format: "Online",
          focus: "Federal",
          licenses: ["MLO"]
        },
        {
          title: "Georgia MLO State-Specific Licensing",
          description: "Master Georgia mortgage regulations, state law, and licensing requirements for MLO certification.",
          price: "$249.00",
          originalPrice: "$299.00",
          primaryCta: { label: "Start Course", href: "#" },
          badge: "State Required",
          image: "assets/images/img24.jpg",
          duration: "3-5 Days",
          format: "Hybrid",
          focus: "Georgia",
          licenses: ["MLO"]
        },
        {
          title: "MLO Exam Prep Intensive",
          description: "Practice tests, exam strategies, and last-minute review sessions to pass the NMLS exam on your first try.",
          price: "$299.00",
          originalPrice: "$349.00",
          primaryCta: { label: "Register", href: "#" },
          badge: "Best Value",
          image: "assets/images/img25.jpg",
          duration: "2 Weeks",
          format: "Live Virtual",
          focus: "Exam Prep",
          licenses: ["MLO"]
        },
        {
          title: "Mortgage Fundamentals Bundle",
          description: "Comprehensive package combining federal pre-license, state requirements, and 8 hours of CE credits.",
          price: "$399.00",
          originalPrice: "$499.00",
          primaryCta: { label: "View Bundle", href: "#" },
          badge: "Popular",
          image: "assets/images/img26.jpg",
          duration: "30 Hours",
          format: "Self-Paced",
          focus: "Complete Package",
          licenses: ["MLO"]
        },
        {
          title: "Fast-Track MLO Certification",
          description: "Accelerated evening and weekend format designed for working professionals seeking quick licensure.",
          price: "$349.00",
          originalPrice: "$399.00",
          primaryCta: { label: "Join Class", href: "#" },
          badge: "Evenings",
          image: "assets/images/img27.jpg",
          duration: "10 Days",
          format: "Hybrid",
          focus: "Accelerated",
          licenses: ["MLO"]
        },
        {
          title: "Spanish MLO Pre-License Course",
          description: "Complete NMLS pre-license education delivered in Spanish with bilingual support materials.",
          price: "$299.00",
          originalPrice: "$349.00",
          primaryCta: { label: "Inscribirse", href: "#" },
          badge: "Bilingual",
          image: "assets/images/img28.jpg",
          duration: "20 Hours",
          format: "Live Virtual",
          focus: "Spanish",
          licenses: ["MLO"]
        }
      ],
      "exam": [],
      "upgrade": [],
      "post": [],
      "ce": []
    },
    // Appraisal Industry Data
    "Appraisal": {
      "pre-license": [
        {
          title: "Trainee Appraiser Qualifying Education",
          description: "75-hour foundational course covering appraisal principles, procedures, and federal regulations.",
          price: "$349.00",
          originalPrice: "$399.00",
          primaryCta: { label: "Start Learning", href: "#" },
          badge: "AQB Approved",
          image: "assets/images/img29.jpg",
          duration: "75 Hours",
          format: "Online + Live",
          focus: "Trainee Level",
          licenses: ["Trainee Appraiser"]
        },
        {
          title: "Licensed Residential Appraiser Package",
          description: "Complete 150-hour program with residential market analysis, URAR reporting, and valuation techniques.",
          price: "$599.00",
          originalPrice: "$699.00",
          primaryCta: { label: "View Details", href: "#" },
          badge: "Most Comprehensive",
          image: "assets/images/img30.jpg",
          duration: "150 Hours",
          format: "Self-Paced",
          focus: "Residential",
          licenses: ["Licensed Appraiser"]
        },
        {
          title: "FHA Appraiser Certification",
          description: "Federal Housing Administration requirements, property standards, and appraisal guidelines for FHA loans.",
          price: "$449.00",
          originalPrice: "$499.00",
          primaryCta: { label: "Enroll Now", href: "#" },
          badge: "FHA Approved",
          image: "assets/images/img31.jpg",
          duration: "40 Hours",
          format: "Hybrid",
          focus: "FHA Certification",
          licenses: ["FHA Appraiser"]
        },
        {
          title: "Commercial Appraisal Fundamentals",
          description: "Income approach mastery, cap rate analysis, and commercial property valuation techniques.",
          price: "$549.00",
          originalPrice: "$649.00",
          primaryCta: { label: "Register", href: "#" },
          badge: "Advanced",
          image: "assets/images/img32.jpg",
          duration: "8 Weeks",
          format: "Live Virtual",
          focus: "Commercial",
          licenses: ["Commercial Appraiser"]
        },
        {
          title: "Appraisal Report Writing Mastery",
          description: "URAR forms, narrative reports, and professional documentation standards for residential appraisers.",
          price: "$399.00",
          originalPrice: "$449.00",
          primaryCta: { label: "Start Course", href: "#" },
          badge: "Popular",
          image: "assets/images/img33.jpg",
          duration: "5 Days",
          format: "Online",
          focus: "Report Writing",
          licenses: ["Licensed Appraiser"]
        },
        {
          title: "Appraisal Exam Prep Bootcamp",
          description: "Intensive review with practice exams, case studies, and test-taking strategies for state certification.",
          price: "$379.00",
          originalPrice: "$429.00",
          primaryCta: { label: "Join Bootcamp", href: "#" },
          badge: "Exam Prep",
          image: "assets/images/img34.jpg",
          duration: "3 Days",
          format: "In-Person",
          focus: "Exam Preparation",
          licenses: ["All Levels"]
        }
      ],
      "exam": [],
      "upgrade": [],
      "post": [],
      "ce": []
    },
    // OSHA Safety Industry Data
    "OSHA": {
      "pre-license": [
        {
          title: "OSHA 10-Hour Construction Safety",
          description: "DOL-authorized training for construction workers covering fall protection, electrical safety, and PPE requirements.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Get Certified", href: "#" },
          badge: "OSHA Approved",
          image: "assets/images/img35.jpg",
          duration: "10 Hours",
          format: "Online",
          focus: "Construction",
          licenses: ["OSHA 10"]
        },
        {
          title: "OSHA 10-Hour General Industry",
          description: "Manufacturing and warehouse safety training including machine guarding, lockout/tagout, and hazard communication.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Start Training", href: "#" },
          badge: "OSHA Approved",
          image: "assets/images/img36.jpg",
          duration: "10 Hours",
          format: "Online",
          focus: "General Industry",
          licenses: ["OSHA 10"]
        },
        {
          title: "Construction Safety Fundamentals",
          description: "In-depth coverage of fall protection systems, scaffolding safety, and hazard recognition for job sites.",
          price: "$149.00",
          originalPrice: "$179.00",
          primaryCta: { label: "Register Now", href: "#" },
          badge: "Popular",
          image: "assets/images/img37.jpg",
          duration: "2 Days",
          format: "In-Person",
          focus: "Job Site Safety",
          licenses: ["OSHA 10"]
        },
        {
          title: "Spanish OSHA 10-Hour Construction",
          description: "OSHA construction safety training delivered entirely in Spanish with bilingual certification card.",
          price: "$89.00",
          originalPrice: "$109.00",
          primaryCta: { label: "Inscribirse", href: "#" },
          badge: "Bilingual",
          image: "assets/images/img38.jpg",
          duration: "10 Hours",
          format: "Live Virtual",
          focus: "Spanish Language",
          licenses: ["OSHA 10"]
        },
        {
          title: "OSHA 10 + First Aid Bundle",
          description: "Complete safety package combining OSHA 10-Hour with CPR, First Aid, and emergency response training.",
          price: "$199.00",
          originalPrice: "$249.00",
          primaryCta: { label: "View Bundle", href: "#" },
          badge: "Best Value",
          image: "assets/images/img39.jpg",
          duration: "12 Hours",
          format: "Hybrid",
          focus: "Emergency Prep",
          licenses: ["OSHA 10", "First Aid"]
        },
        {
          title: "OSHA 10 On-Site Group Training",
          description: "Bring OSHA safety training to your workplace with customized group sessions for your team.",
          price: "$1,499.00",
          originalPrice: "$1,799.00",
          primaryCta: { label: "Request Quote", href: "#" },
          badge: "Group Rate",
          image: "assets/images/img40.jpg",
          duration: "1 Day",
          format: "On-Site",
          focus: "Group Training",
          licenses: ["OSHA 10"]
        }
      ],
      "exam": [],
      "upgrade": [],
      "post": [],
      "ce": []
    },
    // Healthcare Industry Data
    "Healthcare": {
      "pre-license": [
        {
          title: "Healthcare Compliance Essentials",
          description: "HIPAA privacy, OSHA safety, infection control, and all mandatory compliance training for healthcare workers.",
          price: "$149.00",
          originalPrice: "$199.00",
          primaryCta: { label: "Start Training", href: "#" },
          badge: "Complete Bundle",
          image: "assets/images/img41.jpg",
          duration: "8 Hours",
          format: "Online",
          focus: "All Staff",
          licenses: ["Healthcare Worker"]
        },
        {
          title: "Annual Staff Compliance Bundle",
          description: "All required yearly training in one convenient package including HIPAA, safety, and infection control updates.",
          price: "$99.00",
          originalPrice: "$129.00",
          primaryCta: { label: "Renew Now", href: "#" },
          badge: "Annual Required",
          image: "assets/images/img42.jpg",
          duration: "6 Hours",
          format: "Self-Paced",
          focus: "Annual Training",
          licenses: ["All Staff"]
        },
        {
          title: "HIPAA Privacy & Security Training",
          description: "Protect patient data with comprehensive training on HIPAA regulations, breach prevention, and compliance.",
          price: "$49.00",
          originalPrice: "$69.00",
          primaryCta: { label: "Get Certified", href: "#" },
          badge: "HIPAA Required",
          image: "assets/images/img43.jpg",
          duration: "2 Hours",
          format: "Online",
          focus: "Data Privacy",
          licenses: ["All Staff"]
        },
        {
          title: "Bloodborne Pathogens Certification",
          description: "OSHA-mandated training for healthcare workers at risk of exposure to blood and bodily fluids.",
          price: "$39.00",
          originalPrice: "$49.00",
          primaryCta: { label: "Enroll Now", href: "#" },
          badge: "OSHA Required",
          image: "assets/images/img44.png",
          duration: "2 Hours",
          format: "Online",
          focus: "Safety Training",
          licenses: ["Clinical Staff"]
        },
        {
          title: "Infection Control & Prevention",
          description: "Standard precautions, hand hygiene, PPE protocols, and infection prevention strategies for patient care.",
          price: "$79.00",
          originalPrice: "$99.00",
          primaryCta: { label: "Start Course", href: "#" },
          badge: "Popular",
          image: "assets/images/img45.png",
          duration: "4 Hours",
          format: "Self-Paced",
          focus: "Infection Control",
          licenses: ["Clinical Staff"]
        },
        {
          title: "Emergency Preparedness for Healthcare",
          description: "Disaster response, evacuation procedures, and emergency management protocols for healthcare facilities.",
          price: "$129.00",
          originalPrice: "$159.00",
          primaryCta: { label: "Register", href: "#" },
          badge: "Joint Commission",
          image: "assets/images/img46.png",
          duration: "6 Hours",
          format: "Live Virtual",
          focus: "Emergency Response",
          licenses: ["All Staff"]
        }
      ],
      "exam": [],
      "upgrade": [],
      "post": [],
      "ce": []
    },
    // HR Compliance Industry Data
    "HR Compliance": {
      "pre-license": [
        {
          title: "Employment Law Fundamentals",
          description: "Essential federal and state employment law covering discrimination, harassment, wage and hour, and leave management.",
          price: "$199.00",
          originalPrice: "$249.00",
          primaryCta: { label: "Start Learning", href: "#" },
          badge: "HR Essential",
          image: "assets/images/img47.png",
          duration: "6 Hours",
          format: "Online",
          focus: "Legal Compliance",
          licenses: ["HR Professional"]
        },
        {
          title: "HR Compliance for Small Business",
          description: "Build compliant policies, procedures, and employee handbooks tailored for small business operations.",
          price: "$149.00",
          originalPrice: "$199.00",
          primaryCta: { label: "Get Started", href: "#" },
          badge: "Small Business",
          image: "assets/images/img48.png",
          duration: "4 Hours",
          format: "Self-Paced",
          focus: "Small Business",
          licenses: ["Business Owner"]
        },
        {
          title: "Workplace Investigations Training",
          description: "Conduct thorough, legally defensible investigations of harassment, discrimination, and policy violation complaints.",
          price: "$249.00",
          originalPrice: "$299.00",
          primaryCta: { label: "Enroll Now", href: "#" },
          badge: "Advanced",
          image: "assets/images/img49.png",
          duration: "8 Hours",
          format: "Live Virtual",
          focus: "Investigations",
          licenses: ["HR Manager"]
        },
        {
          title: "FMLA & Leave Management",
          description: "Navigate Family Medical Leave Act requirements, ADA accommodations, and state leave law administration.",
          price: "$179.00",
          originalPrice: "$229.00",
          primaryCta: { label: "Register", href: "#" },
          badge: "Popular",
          image: "assets/images/img50.jpg",
          duration: "4 Hours",
          format: "Online",
          focus: "Leave Administration",
          licenses: ["HR Professional"]
        },
        {
          title: "I-9 Compliance & E-Verify",
          description: "Master Form I-9 requirements, E-Verify procedures, and immigration compliance to avoid costly penalties.",
          price: "$99.00",
          originalPrice: "$129.00",
          primaryCta: { label: "Start Course", href: "#" },
          badge: "Compliance Required",
          image: "assets/images/img51.jpg",
          duration: "3 Hours",
          format: "Self-Paced",
          focus: "Immigration",
          licenses: ["HR Professional"]
        },
        {
          title: "Wage & Hour Law Essentials",
          description: "FLSA compliance including overtime calculations, exempt vs non-exempt, recordkeeping, and audit preparation.",
          price: "$229.00",
          originalPrice: "$279.00",
          primaryCta: { label: "View Details", href: "#" },
          badge: "DOL Compliance",
          image: "assets/images/img52.png",
          duration: "6 Hours",
          format: "Hybrid",
          focus: "Wage & Hour",
          licenses: ["HR Manager"]
        }
      ],
      "exam": [],
      "upgrade": [],
      "post": [],
      "ce": []
    }
  };

  var DEFAULT_STATE = GLOBAL_STATE_DATA && GLOBAL_STATE_DATA.defaultState
    ? GLOBAL_STATE_DATA.defaultState
    : (FEATURED_STATES[0] || ALL_STATES[0]);
  var DEFAULT_TAB = "pre-license";

  function ensureOption(select, label) {
    var option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    select.appendChild(option);
  }

  function populateStates() {
    var input = document.getElementById("reCatalogState");
    var dropdown = document.querySelector(".re-catalog__select-dropdown");
    var groupsContainer = document.querySelector(".re-catalog__select-groups");
    if (!input || !dropdown || !groupsContainer) return;

    groupsContainer.innerHTML = "";

    function renderGroup(title, states, featured) {
      if (!states.length) return;
      var groupTitle = document.createElement("div");
      groupTitle.className = "re-catalog__group-title";
      groupTitle.textContent = title;
      groupsContainer.appendChild(groupTitle);

      states.forEach(function (state) {
        var option = document.createElement("div");
        option.className = "re-catalog__option" + (featured ? " re-catalog__option--featured" : "");
        option.setAttribute("data-state", state);
        option.textContent = state;
        groupsContainer.appendChild(option);
      });
    }

    renderGroup("Featured", FEATURED_STATES, true);

    var remaining = ALL_STATES.filter(function (state) {
      return FEATURED_STATES.indexOf(state) === -1;
    }).sort();

    renderGroup("All States", remaining, false);

    input.value = DEFAULT_STATE;
    dropdown.setAttribute("hidden", "hidden");
  }

function getCourses(state, tab) {
  // Detect current industry from body class or use state for Real Estate
  var industryKey = state;
  
  // Check if we're on a non-Real Estate industry page
  if (document.body.classList.contains('industry-mortgage')) {
    industryKey = "Mortgage";
  } else if (document.body.classList.contains('industry-appraisal')) {
    industryKey = "Appraisal";
  } else if (document.body.classList.contains('industry-osha')) {
    industryKey = "OSHA";
  } else if (document.body.classList.contains('industry-healthcare')) {
    industryKey = "Healthcare";
  } else if (document.body.classList.contains('industry-compliance')) {
    industryKey = "HR Compliance";
  }
  
  var stateData = COURSE_DATA[industryKey] || DEFAULT_COURSES;
  var tabData = stateData[tab] || [];

    if (tabData.length === 0) {
      return [
        {
          empty: true,
          title: "Courses coming soon",
          description: "We're finalizing offerings for this state and category. Check back shortly or contact our team for custom options."
        }
      ];
    }

    return tabData;
  }

  function renderStars(count) {
    if (!count) return "";
    var max = 5;
    var full = Math.min(count, max);
    var stars = "";
    for (var i = 0; i < full; i++) {
      stars += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    return '<div class="re-card__rating" aria-hidden="true">' + stars + "</div>";
  }

  function createCard(course) {
    if (course.empty) {
      return (
        '<div class="col-lg-12 empty-state">' +
          '<div class="package-wrap empty-card">' +
            '<p>' + course.description + '</p>' +
          '</div>' +
        '</div>'
      );
    }

    var badge = course.badge ? '<span class="package-badge">' + course.badge + '</span>' : '';
    var image = course.image || 'assets/images/home/real-estate.jpg';
    var primaryCta = course.primaryCta || { label: 'Enroll Now', href: '#' };
    var secondaryCta = course.secondaryCta || { label: 'Details', href: '#' };
    
    // Price formatting for display under description (stacked, centered)
    var priceHTML = '';
    if (course.originalPrice) {
      priceHTML = '<div class="course-pricing">' +
        '<span class="price-current">' + course.price + '</span>' +
        '<span class="price-original">' + course.originalPrice + '</span>' +
      '</div>';
    } else {
      priceHTML = '<div class="course-pricing">' +
        '<span class="price-current">' + course.price + '</span>' +
      '</div>';
    }
    
    return (
      '<div class="col-lg-4 col-md-6">' +
        '<div class="package-wrap">' +
          '<figure class="feature-image">' +
            '<a href="' + primaryCta.href + '">' +
              '<img src="' + image + '" alt="' + course.title + '">' +
            '</a>' +
            badge +
          '</figure>' +
          '<div class="package-content-wrap">' +
            '<div class="package-meta text-center">' +
              '<ul>' +
                (course.duration ? '<li><i class="far fa-clock"></i>' + course.duration + '</li>' : '') +
                (course.format ? '<li><i class="fas fa-laptop"></i>' + course.format + '</li>' : '') +
              '</ul>' +
            '</div>' +
            '<div class="package-content">' +
              '<h3><a href="' + primaryCta.href + '">' + course.title + '</a></h3>' +
              '<p>' + course.description + '</p>' +
              priceHTML +
              '<div class="btn-wrap">' +
                '<a href="' + primaryCta.href + '" class="button-primary">View Details</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function updateHelper(state) {
    var helper = document.getElementById("reCatalogHelper");
    if (!helper) return;
    helper.innerHTML = 'Showing featured courses for <strong>' + state + "</strong>.";
  }

  function buildCarousel(state, tab) {
    var $carousel = $(".re-catalog__carousel");
    if (!$carousel.length) return;

    var courses = getCourses(state, tab);
    var slides = courses.map(createCard).join("");

    if ($carousel.hasClass("slick-initialized")) {
      $carousel.slick("unslick");
    }

    $carousel.html(slides);

    var $shell = $(".re-catalog__carousel-shell");
    $carousel.slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: false,
      dots: false,
      adaptiveHeight: false,
      prevArrow:
        '<button type="button" class="re-catalog__nav re-catalog__nav--prev" aria-label="Previous courses"><i class="fas fa-chevron-left"></i></button>',
      nextArrow:
        '<button type="button" class="re-catalog__nav re-catalog__nav--next" aria-label="Next courses"><i class="fas fa-chevron-right"></i></button>',
      appendArrows: $shell,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true } }
      ]
    });

    var cardCount = courses.length;
    var showArrows = cardCount > 1;
    var $arrows = $shell.find(".re-catalog__nav");
    $arrows.toggle(showArrows);
  }

  function handleTabChange(state, tab) {
    $(".re-catalog__tab").each(function () {
      var $btn = $(this);
      var isActive = $btn.data("tab") === tab;
      $btn.toggleClass("active", isActive);
      $btn.attr("aria-selected", isActive ? "true" : "false");
    });
    updateHelper(state);
    buildCarousel(state, tab);
  }

  function init() {
    var stateInput = document.getElementById("reCatalogState");
    var dropdown = document.querySelector(".re-catalog__select-dropdown");
    var searchInput = document.querySelector(".re-catalog__select-search input");
    if (!stateInput || !dropdown || !searchInput) return;

    populateStates();
    updateHelper(DEFAULT_STATE);
    buildCarousel(DEFAULT_STATE, DEFAULT_TAB);

    function openDropdown() {
      dropdown.removeAttribute("hidden");
      searchInput.value = "";
      searchInput.focus();
      filterOptions("");
    }

    function closeDropdown() {
      dropdown.setAttribute("hidden", "hidden");
    }

    function filterOptions(query) {
      query = query.toLowerCase();
      dropdown.querySelectorAll(".re-catalog__option").forEach(function (option) {
        var state = option.getAttribute("data-state");
        option.hidden = query && !state.toLowerCase().includes(query);
      });
    }

    $(".re-catalog__tab").on("click keypress", function (evt) {
      if (evt.type === "keypress" && evt.which !== 13 && evt.which !== 32) {
        return;
      }
      evt.preventDefault();
      var tab = $(this).data("tab");
      var currentState = stateInput.value || DEFAULT_STATE;
      handleTabChange(currentState, tab);
    });

    $(".re-catalog__state-picker .re-catalog__state-select-wrapper").on("click", function (evt) {
      evt.stopPropagation();
      if (dropdown.hasAttribute("hidden")) {
        openDropdown();
      } else {
        closeDropdown();
      }
    });

    searchInput.addEventListener("input", function () {
      filterOptions(this.value);
    });

    document.addEventListener("click", function (evt) {
      if (!dropdown.contains(evt.target) && evt.target !== stateInput) {
        closeDropdown();
      }
    });

    function attachOptionHandlers() {
      dropdown.querySelectorAll(".re-catalog__option").forEach(function (option) {
        option.addEventListener("click", function () {
          var newState = this.getAttribute("data-state") || DEFAULT_STATE;
          stateInput.value = newState;
          closeDropdown();
          var currentTab = $(".re-catalog__tab.active").data("tab") || DEFAULT_TAB;
          handleTabChange(newState, currentTab);
        });
      });
    }
    attachOptionHandlers();

    document.addEventListener("keydown", function (evt) {
      if (evt.key === "Escape") {
        closeDropdown();
      }
    });

    handleTabChange(DEFAULT_STATE, DEFAULT_TAB);
  }

  $(document).ready(init);
})(window.jQuery);

