import { Target, Users, Heart, TrendingUp } from "lucide-react";
import missionIcon from "@/assets/mission-icon.jpg";

const stats = [
  { icon: Users, value: "50K+", label: "Lives Impacted" },
  { icon: Heart, value: "1000+", label: "Active Volunteers" },
  { icon: Target, value: "200+", label: "Projects Completed" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
];

const MissionSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative animate-fade-in">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <img
                src={missionIcon}
                alt="Our mission of compassion"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground p-8 rounded-2xl shadow-lg">
              <p className="text-4xl font-bold">15+</p>
              <p className="text-sm">Years of Impact</p>
            </div>
          </div>

          {/* Right - Content */}
          <div className="animate-fade-in-up">
            <h2 className="text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Vidhyalok Trust of Education is dedicated to empowering communities through sustainable development,
              education, and healthcare initiatives. We believe every person deserves access to
              quality education and opportunities for growth.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Through collaborative partnerships and innovative solutions, we're building a world
              where compassion meets action, creating lasting positive change.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-xl shadow-md border border-border transition-smooth hover:shadow-lg hover:-translate-y-1"
                  >
                    <Icon className="w-8 h-8 text-primary mb-3" />
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
