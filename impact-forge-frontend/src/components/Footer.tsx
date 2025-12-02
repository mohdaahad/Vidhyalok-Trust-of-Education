import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { newsletterService } from "@/services/newsletter.service";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await newsletterService.subscribeToNewsletter(email);
      toast({
        title: "Subscribed! ✓",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/logo.png" 
                alt="Vidhyalok Trust of Education" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Empowering communities through education and transforming lives with compassion and action.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/vidhyaloktrust" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/vidhyaloktrust" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/vidhyaloktrust" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary transition-smooth">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/vidhyaloktrust" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary transition-smooth">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Hope Street, Charity City, CC 12345</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@vidhyaloktrust.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Stay updated with our latest news and projects.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 Vidhyalok Trust of Education. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
