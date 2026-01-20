import { Users, Target, Award, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We lead with empathy and understanding in everything we do.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building strong partnerships with local communities is our foundation.",
  },
  {
    icon: Target,
    title: "Impact",
    description: "We focus on creating measurable, sustainable change.",
  },
  {
    icon: Globe,
    title: "Inclusivity",
    description: "We serve all people regardless of background or circumstances.",
  },
];

const team = [
  { name: "Dr. Sarah Johnson", role: "Executive Director", image: "https://i.pravatar.cc/300?img=1" },
  { name: "Michael Chen", role: "Program Director", image: "https://i.pravatar.cc/300?img=13" },
  { name: "Aisha Patel", role: "Finance Director", image: "https://i.pravatar.cc/300?img=5" },
  { name: "James Rodriguez", role: "Community Outreach", image: "https://i.pravatar.cc/300?img=12" },
];

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-primary-foreground mb-6">About Vidhyalok Trust of Education</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Since 2024, we've been dedicated to creating positive change through sustainable
              development, education, and healthcare initiatives across India.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-foreground mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4 leading-relaxed">
                Vidhyalok Trust of Education was founded with a simple belief: every person deserves the opportunity
                to thrive through quality education. What started as a small group of volunteers has grown into a
                movement of changemakers dedicated to transforming lives through education.
              </p>
              <p className="mb-4 leading-relaxed">
                Today, we work in over 30 countries, partnering with local communities to address
                critical needs in education, healthcare, and economic development. Our approach is
                collaborative, sustainable, and always community-led.
              </p>
              <p className="leading-relaxed">
                With the support of thousands of donors and volunteers worldwide, we're building
                a future where everyone has the chance to live with dignity and hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center transition-smooth hover:shadow-lg hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-center">Our Partners</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We're proud to collaborate with leading organizations and institutions to maximize our impact.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((partner) => (
              <div
                key={partner}
                className="bg-muted/50 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${partner * 0.05}s` }}
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Partner {partner}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Awards Section */}
      {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-foreground mb-6">Recognition & Awards</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our work has been recognized by leading humanitarian organizations worldwide,
              including the Global Impact Award (2023), the Community Excellence Prize (2022),
              and the Sustainable Development Recognition (2021).
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

import { Heart } from "lucide-react";

export default About;
