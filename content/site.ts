export const site = {
  name: "Divya Darsheel Sharma",
  role: "Founder & Full Stack Developer",
  domain: "https://divyadsharma.com.np",
  email: "hello@divyadsharma.com.np",
  location: { city: "Kathmandu, Nepal", lat: 27.7172, lng: 85.324 },
  nav: [
    { label: "Work", href: "#work" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Let's Build", href: "#contact" },
  socials: {
    github: "https://github.com/divyadsharma",
    linkedin: "https://linkedin.com/in/divyadsharma",
    x: "https://x.com/divyadsharma",
  },
  resume: "/resume.pdf",
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
};

export const SHOW_TESTIMONIALS = false;
