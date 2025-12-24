// Portal cards data
export const PORTAL_CARDS = [
  {
    id: "patient",
    title: "Patient Portal",
    description:
      "View test results, schedule appointments, message your doctor, and pay bills securely from any device.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    icon: (
      <svg
        className="w-8 h-8 text-teal-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    iconBgColor: "bg-teal-100",
    buttonColor: "bg-teal-600",
    buttonHoverColor: "hover:bg-teal-700",
    href: "/patient",
  },
  {
    id: "staff",
    title: "Staff Portal",
    description:
      "Access patient records, manage clinic schedules, and coordinate care with advanced clinical tools.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop",
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    iconBgColor: "bg-blue-100",
    buttonColor: "bg-blue-600",
    buttonHoverColor: "hover:bg-blue-700",
    href: "/staff",
  },
];
