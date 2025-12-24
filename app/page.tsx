import PortalCard from "@/app/components/PortalCard";
import { PORTAL_CARDS } from "@/app/constants/portalCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Patient Sync</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A smarter way to manage your health journey. Please select your
            portal to continue.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {PORTAL_CARDS.map((portal) => (
            <PortalCard
              key={portal.id}
              title={portal.title}
              description={portal.description}
              image={portal.image}
              icon={portal.icon}
              iconBgColor={portal.iconBgColor}
              buttonColor={portal.buttonColor}
              buttonHoverColor={portal.buttonHoverColor}
              href={portal.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
