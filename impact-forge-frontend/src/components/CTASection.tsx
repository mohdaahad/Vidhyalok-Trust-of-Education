import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 gradient-trust relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-light rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-primary-foreground mb-6">Make a Difference Today</h2>
          <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed">
            Your support can transform lives. Whether through donations or volunteering,
            every contribution brings us closer to a better world.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/20">
                <Heart className="w-12 h-12 text-primary-foreground mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-primary-foreground mb-2">Donate</h3>
                <p className="text-primary-foreground/80 mb-4 text-sm">
                  Support our projects financially
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/donate">Give Now</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary-foreground/10 backdrop-blur-sm p-6 rounded-2xl border border-primary-foreground/20">
                <Users className="w-12 h-12 text-primary-foreground mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-primary-foreground mb-2">Volunteer</h3>
                <p className="text-primary-foreground/80 mb-4 text-sm">
                  Join our team of changemakers
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/volunteer">Join Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
