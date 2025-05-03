export interface Project {
  title: string;
  tags?: string[];
  shortDescription: string;
  description: string;
  collaborators?: number | string;
  highlights?: string[];
  image?: string; // Keeping the original image field for now
  images?: string[]; // Added list of image paths
  githubLink?: string;
  year?: number | string;
}

export const projects: Project[] = [
  {
    title: "WeDoLaundry",
    tags: ["C#", ".NET", "ADO.NET", "ASP.NET MVC", "SLQ", "HTML", "CSS", "Javascript"],
    shortDescription: "Comprehensive laundry service solution with customer website, staff app, and courier system.",
    description: "WeDoLaundry is a comprehensive laundry service solution designed to eliminate one of life's most time-consuming chores. This multi-platform project included a customer-facing website, staff management desktop application, and courier logistics system to create a seamless end-to-end service experience.",
    collaborators: 4,
    highlights: [
      "Flexible service options including one-time bookings and subscription plans",
      "Secure user authentication and profile management",
      "Intuitive scheduling system with real-time availability",
      "Automated notification system for order status updates",
      "Comprehensive admin dashboard for business analytics and operations management"
    ],
    year: 2022,
    githubLink: undefined,
    images: ["/images/projects/wedolaundry.png", "/images/projects/wedolaundry.png", "/images/projects/wedolaundry.png"]
  },
  {
    title: "Weather & Vessel Operation Prediction software",
    tags: ["Nuxt.js", "MongoDB", "TypeScript", "Python", "Vue.js", "Pinia", "Chart.js", "Tailwind CSS"],
    shortDescription: "Provides insights and decision support for vessel operations using historical data visualization.",
    description: "Project collaboration with DECK1. Weather & Vessel Operation Prediction software to provide new insights and decision support for multiple stakeholders such as charterers, procurement managers, operators, brokers and more. The main emphasis was on the significance of accurate visualisation of evaluated asset performance based on historical data and its crucial role in optimising operational efficiency.",
    collaborators: 5,
    highlights: [
      "Support in complex decision-making processes",
      "Possibly reduced likelihood of incorrect decisions occuring in operations and procurement",
      "Minimization of potential health hazards",
      "Enhanced workflow efficiency",
      "Improved economic analysis and overview",
      "Opportunity to decrease operational expenses",
      "Accuracy and speed of calculations"
    ],
    year: 2023,
    githubLink: "https://github.com/deck1-org/DECK1",
    images: ["/images/projects/deck1.png"]
  },
  {
    title: "BidHub",
    tags: ["Amazon S3", "C#", ".NET", "Docker", "SQL server", "Entity framework", "React.js", "TypeScript"],
    shortDescription: "Platform connecting artists and collectors globally, empowering them to buy, sell, and celebrate art.",
    description: "• How can we ensure that artists have an intuitive and efficient interface for showcasing their work, regardless of their technical expertise?In what manner does this platform align with broader industry trends and innovations, and how might it contribute to shaping the future landscape of online art markets?\n\n“To connect artists and collectors from all over the world, and to make it easier for people to buy and sell art.”\n“To empower artists and collectors to connect and celebrate the world's art, through innovation and technology.”",
    collaborators: 5,
    highlights: [
      "Adopted AWS and DigitalOcean, gaining hands-on experience with industry-standard cloud technologies.",
      "Integrated Amazon S3 for secure and scalable image storage.",
      "Conducted thorough backend testing to ensure reliability and code quality."
    ],
    year: 2023,
    githubLink: "https://github.com/SickerTeam/dom-aukcyjny",
    images: ["/images/projects/bidhub.png"]
  },
  {
    title: "Nowire internship",
    tags: ["Vue.js", ".NET", "C#", "SQL Server"],
    shortDescription: "Internal ticket management system streamlining operations and enhancing team collaboration within an organization.",
    description: "Collaboration on the development of an internal ticket management system, a critical tool for streamlining operations within an organization. This software helps with keeping track of requests and makes sure they get dealt with properly. A benefit of this system is that it helps everyone on the team collaborate more efficiently. It keeps all the tickets in a centralized location, so everyone within the organization can see what work currently needs to be done. For example, in a scenario where multiple departments are involved in resolving a complex issue, each team can view and contribute to the ticket's progress. The purpose of this project was also to make those things faster and make sure all employees can take responsibility.",
    collaborators: 2,
    highlights: [
      "Implemented a robust testing strategy to ensure application stability and reliability.",
      "Developed a dashboard with analytics and statistics on ticket trends for insights."
    ],
    year: 2023,
    githubLink: undefined,
    images: ["/images/projects/ticketsystem.png"]
  },
  {
    title: "getNoise",
    tags: ["Python", "selenium", "batch script"],
    shortDescription: "Python script converts Spotify track links to high-quality M4A audio files.",
    description: "This Python script allows users to convert any Spotify track link into a high-quality M4A audio file. By integrating the Spotify API, Selenium, and yt-dlp with FFmpeg, the script retrieves track details, searches YouTube for the corresponding audio, and downloads it in the desired format. Designed for efficiency and ease of use, this tool streamlines the process of obtaining DRM-free audio files from Spotify links for offline listening or personal use.",
    collaborators: 1,
    highlights: [
      "Converts Spotify tracks to high-quality, DRM-free M4A audio files efficiently.",
      "Integrates Spotify API, Selenium, yt-dlp, and FFmpeg for seamless automation.",
      "Streamlines retrieval, search, and download of music with minimal user input.",
      "Designed for simplicity, enabling easy offline listening from any Spotify link"
    ],
    year: 2023,
    githubLink: undefined,
    images: ["/images/projects/getnoise.png"]
  },
  {
    title: "Sternula - Professional projects",
    tags: ["Java", "Python", "Flask", "InfluxDB", "Grafana", "Tomcat", "Shell"],
    shortDescription: "Implementation of alerting system, data management tool, and backend for maritime service.",
    description: "1. Implementation of an alerting system using Python, Grafana, and InfluxDB\n2. Implementation of an integrated data management tool using Python\n3. Implementation of back-end for Maritime Messaging Service Edge Router in Java\n4. Work on interactive visualization of satellite telemetry data",
    collaborators: "1-3",
    highlights: ["none"],
    year: "2022-2024",
    githubLink: undefined,
    images: ["/images/projects/sternula.png"]
  },
  {
    title: "Streamlined Enrollment Platform",
    tags: ["Figma"],
    shortDescription: "Figma prototype to streamline enrollment for international and Erasmus students.",
    description: "Figma prototype created during the Skill Integration Lab 2 to streamline the enrollment process for international and Erasmus students at Thomas More. The existing system relied on scattered website information and inefficient email communication, often resulting in confusion. Our client requested a centralized platform to consolidate all enrollment-related tasks. The prototype enables users to submit applications, request or register as a buddy or landlord, apply for a bike, and communicate directly through an integrated chat. This project provided valuable experience in client collaboration and resulted in a user-friendly, organized solution tailored to the needs of international students.",
    collaborators: 5,
    highlights: [
      "Demonstrated prototyping skills to quickly visualize and refine user flows",
      "Utilized UML diagrams to clearly communicate system structure and requirements.",
      "Thorough project analysis to ensure an efficient and user-centered solution."
    ],
    year: 2024,
    githubLink: undefined,
    images: ["/images/projects/skill21.png"]
  },
  {
    title: "Skill Integration: Training Session Management",
    tags: ["PHP", "Laravel", "MySQL", "Tailwind CSS", "Alpine.js", "Lifewire"],
    shortDescription: "Web platform streamlining training session assignments for students and teachers.",
    description: "Skill Integration is a web-based platform designed to streamline the management of training session assignments for both students and teachers. The platform allows students to form teams, select clients, prepare and upload lesson materials, and organize all work in a centralized, structured interface. For teachers, Skill Integration offers real-time progress tracking, live notifications, and a dedicated dashboard for monitoring and grading team submissions, making assignment management more efficient. Developed collaboratively during my second-semester Skill Integration Lab, my contributions included building the database, developing the progress tracking and upload features, integrating live notifications, implementing secure role-based access and email verification, and deploying the application to skill2.bragi.be.",
    collaborators: 6,
    highlights: [
      "Delivered a modern, intuitive interface with a clean and professional design.",
      "Implemented seamless dark mode for comfortable use in any environment.",
      "Added language selection to support a diverse, international user base.",
      "Developed real-time progress tracking and live notifications for efficient assignment management.",
      "Ensured secure, role-based access and smooth deployment on a live platform."
    ],
    year: 2025,
    githubLink: undefined,
    images: ["/images/projects/skill22.png"]
  },
  {
    title: "Dormify",
    tags: ["Java", "Swing", "SQL Server"],
    shortDescription: "System to streamline inventory, tenant data, and paperwork for student housing.",
    description: "Our team partnered with UC House Aps, a student housing provider in Aalborg, Denmark, to identify and address operational challenges through client interviews and needs analysis. Based on our findings, we defined the project scope and developed a tailored system to streamline the organization of inventory, tenant data and paperwork. The new system enables faster and more efficient completion of administrative tasks, improving overall management for UC House",
    collaborators: 3,
    highlights: [
      "Collaborated directly with a real-world client to deliver a practical solution.",
      "Conducted thorough needs analysis and client interviews to define project scope.",
      "Developed a user-friendly system for efficient inventory and tenant management.",
      "Enabled faster, more organized completion of administrative tasks for UC House.",
      "Gained valuable experience in client communication, project scoping, and solution delivery."
    ],
    year: 2022,
    githubLink: undefined,
    images: ["/images/projects/dormify.png"]
  }
];