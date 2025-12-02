import { useState, useEffect } from "react";
import { DollarSign, Users, FolderKanban, TrendingUp, Calendar, Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/admin.service";

interface DashboardStats {
  totalDonations: number;
  totalDonationsCount: number;
  totalVolunteers: number;
  activeVolunteers: number;
  activeProjects: number;
  totalProjects: number;
  upcomingEvents: number;
  totalEvents: number;
  newContacts: number;
  totalNewsletters: number;
  monthlyDonations: Array<{ month: string; amount: number }>;
  projectDistribution: Array<{ name: string; value: number }>;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard stats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const dashboardStats = stats
    ? [
        {
          label: "Total Donations",
          value: formatCurrency(stats.totalDonations),
          count: stats.totalDonationsCount,
          icon: DollarSign,
          color: "text-primary",
        },
        {
          label: "Active Volunteers",
          value: stats.activeVolunteers.toString(),
          count: stats.totalVolunteers,
          icon: Users,
          color: "text-secondary",
        },
        {
          label: "Active Projects",
          value: stats.activeProjects.toString(),
          count: stats.totalProjects,
          icon: FolderKanban,
          color: "text-accent",
        },
        {
          label: "Upcoming Events",
          value: stats.upcomingEvents.toString(),
          count: stats.totalEvents,
          icon: Calendar,
          color: "text-primary",
        },
      ]
    : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your organization.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-16 w-full" />
              </Card>
            ))
          : dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    {stat.count !== undefined && (
                      <span className="text-sm text-muted-foreground">Total: {stat.count}</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
      </div>

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">New Contact Submissions</h3>
            </div>
            <div className="text-3xl font-bold text-primary">{stats.newContacts}</div>
            <p className="text-sm text-muted-foreground mt-1">Requires attention</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Newsletter Subscribers</h3>
            </div>
            <div className="text-3xl font-bold text-primary">{stats.totalNewsletters}</div>
            <p className="text-sm text-muted-foreground mt-1">Active subscribers</p>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {stats.monthlyDonations && stats.monthlyDonations.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Monthly Donations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {stats.projectDistribution && stats.projectDistribution.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Project Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.projectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} projects`}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      {/* Loading state for charts */}
      {isLoading && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
