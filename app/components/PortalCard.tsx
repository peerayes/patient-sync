import Link from "next/link";

interface PortalCardProps {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  buttonColor: string;
  buttonHoverColor: string;
  iconBgColor: string;
  href: string;
}

export default function PortalCard({
  title,
  description,
  image,
  icon,
  buttonColor,
  buttonHoverColor,
  iconBgColor,
  href,
}: PortalCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="h-64 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Icon */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${iconBgColor} rounded-2xl`}
          >
            {icon}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

        {/* Button */}
        <Link href={href}>
          <button
            className={`w-full ${buttonColor} ${buttonHoverColor} text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer`}
          >
            Access Portal
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
