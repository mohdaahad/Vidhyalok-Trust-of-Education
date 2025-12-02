import { LayoutDashboard, FolderKanban, Users, Calendar, LogOut, Mail, MessageSquare, DollarSign } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
  { icon: Users, label: "Volunteers", path: "/admin/volunteers" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: DollarSign, label: "Donations", path: "/admin/donations" },
  { icon: MessageSquare, label: "Contacts", path: "/admin/contacts" },
  { icon: Mail, label: "Newsletters", path: "/admin/newsletters" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex flex-col items-center gap-2">
          <img
            src="/logo.png"
            alt="Vidhyalok Trust of Education"
            className="h-12 w-auto"
          />
          <div className="text-center">
            <p className="font-bold text-sm text-foreground">Vidhyalok Trust</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
