export const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Tech Conference 2026",
    description: "Annual technology conference featuring the latest innovations in software, AI, and hardware. Join industry leaders and developers for inspiring talks, workshops, and networking opportunities.",
    shortDesc: "Annual technology conference featuring the latest innovations",
    date: "2026-04-15",
    time: "09:00",
    location: "Convention Center Hall A",
    capacity: 200,
    registered: 45,
    category: "Conference",
    organizer: "TechCorp Inc.",
    image: "🖥️",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Web Development Workshop",
    description: "Hands-on workshop covering modern web development practices including React, TypeScript, and cloud deployment. Perfect for intermediate developers looking to level up their skills.",
    shortDesc: "Hands-on workshop covering modern web development practices",
    date: "2026-04-20",
    time: "14:00",
    location: "Tech Hub Room 301",
    capacity: 50,
    registered: 48,
    category: "Workshop",
    organizer: "DevAcademy",
    image: "🌐",
    color: "#10b981",
  },
  {
    id: 3,
    title: "AI & Machine Learning Summit",
    description: "Explore the future of AI and machine learning technologies. Featuring keynotes from leading researchers, live demos, and panel discussions on ethical AI and real-world applications.",
    shortDesc: "Explore the future of AI and machine learning technologies",
    date: "2026-05-10",
    time: "10:00",
    location: "Grand Auditorium",
    capacity: 150,
    registered: 62,
    category: "Summit",
    organizer: "AI Institute",
    image: "🤖",
    color: "#8b5cf6",
  },
  {
    id: 4,
    title: "UX Design Bootcamp",
    description: "A two-day intensive bootcamp on user experience design principles, prototyping tools, and usability testing. Work on real projects and get feedback from senior designers.",
    shortDesc: "Intensive bootcamp on UX design principles and prototyping",
    date: "2026-06-03",
    time: "08:30",
    location: "Design Studio, Floor 2",
    capacity: 30,
    registered: 12,
    category: "Bootcamp",
    organizer: "UX Guild",
    image: "🎨",
    color: "#f59e0b",
  },
];

export const INITIAL_USER = { name: "John Doe", email: "john.doe@example.com", role: "user" };
export const ORGANIZER = { name: "Admin User", email: "admin@eventportal.com", role: "organizer" };

export const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

export const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

export const generateTicketId = () => "TKT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

export const seatsLeft = (e) => e.capacity - e.registered;
export const seatsPercent = (e) => Math.round((e.registered / e.capacity) * 100);

export const categoryColor = {
  Conference: "#3b82f6",
  Workshop: "#10b981",
  Summit: "#8b5cf6",
  Bootcamp: "#f59e0b",
  Seminar: "#ec4899",
  Networking: "#06b6d4",
};
