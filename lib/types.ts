// ============ Project Types ============
export interface Project {
  id: string;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  order: number;
  createdAt: string;
}

// ============ Testimonial Types ============
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  image: string;
  order: number;
  createdAt: string;
}

// ============ Work Experience Types ============
export interface WorkExperience {
  id: string;
  title: string;
  desc: string;
  className: string;
  thumbnail: string;
  order: number;
  createdAt: string;
}

// ============ Blog Post Types ============
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ============ Skill Types ============
export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number; // 0-100
  icon: string;
  order: number;
}

// ============ Site Settings Types ============
export interface NavItem {
  name: string;
  link: string;
}

export interface SocialLink {
  id: number;
  img: string;
  link: string;
}

export interface GridItem {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName: string;
  titleClassName: string;
  img: string;
  spareImg: string;
}

export interface Company {
  id: number;
  name: string;
  img: string;
  nameImg: string;
}

export interface SiteSettings {
  navItems: NavItem[];
  socialMedia: SocialLink[];
  gridItems: GridItem[];
  companies: Company[];
  email: string;
  resumeUrl: string;
  aboutText: string;
  heroTagline: string;
  heroSubtitle: string;
}

// ============ Admin User Types ============
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "editor";
  createdAt: string;
}

// ============ Contact Form Types ============
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}
