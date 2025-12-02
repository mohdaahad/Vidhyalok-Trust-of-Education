import { useState, useEffect } from "react";
import { Search, Mail, Phone, DollarSign, Eye, Calendar, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { donationService, Donation } from "@/services/donation.service";

const ManageDonations = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        loadDonations();
    }, [statusFilter]);

    const loadDonations = async () => {
        try {
            setIsLoading(true);
            const status = statusFilter === "all" ? undefined : statusFilter;
            const response = await donationService.getAdminDonations(status);
            setDonations(response.data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to load donations",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await donationService.updateDonation(id, { status: newStatus });
            toast({
                title: "Success",
                description: "Donation status updated successfully",
            });
            loadDonations();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const handleGenerateReceipt = async (donationId: number) => {
        try {
            const response = await donationService.generateReceipt(donationId);

            // If response is a blob (PDF), download it
            if (response instanceof Blob) {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement("a");
                link.href = url;
                link.download = `donation-receipt-${donationId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast({
                    title: "Success",
                    description: "Receipt downloaded successfully",
                });
            } else {
                // If JSON response, show info
                toast({
                    title: "Info",
                    description: response.message || "Receipt generation is being implemented",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate receipt",
                variant: "destructive",
            });
        }
    };

    const handleGenerateTaxCertificate = async (donationId: number) => {
        try {
            const response = await donationService.generateTaxCertificate(donationId);

            // If response is a blob (PDF), download it
            if (response instanceof Blob) {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement("a");
                link.href = url;
                link.download = `tax-certificate-${donationId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast({
                    title: "Success",
                    description: "Tax certificate downloaded successfully",
                });
            } else {
                // If JSON response, show info
                toast({
                    title: "Info",
                    description: response.message || "Tax certificate generation is being implemented",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to generate tax certificate",
                variant: "destructive",
            });
        }
    };

    const filteredDonations = donations.filter(
        (donation) =>
            donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.donor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusOptions = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
    ];

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "completed":
                return "default";
            case "pending":
                return "secondary";
            case "failed":
                return "destructive";
            case "refunded":
                return "outline";
            default:
                return "outline";
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const stats = {
        total: donations.length,
        completed: donations.filter((d) => d.status === "completed").length,
        pending: donations.filter((d) => d.status === "pending").length,
        totalAmount: donations
            .filter((d) => d.status === "completed")
            .reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0),
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Manage Donations</h1>
                <p className="text-muted-foreground mt-2">View and manage all donation transactions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Donations</div>
                </Card>
                <Card className="p-6">
                    <div className="text-2xl font-bold text-primary mb-1">{stats.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                </Card>
                <Card className="p-6">
                    <div className="text-2xl font-bold text-secondary mb-1">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                </Card>
                <Card className="p-6">
                    <div className="text-2xl font-bold text-muted-foreground mb-1">
                        {formatCurrency(stats.totalAmount)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by donor name, email, or transaction ID..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Table */}
            <Card>
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : filteredDonations.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-muted-foreground">No donations found.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Donor</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDonations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell>
                                        <div className="font-mono text-sm">{donation.transaction_id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {donation.donor_email}
                                            </div>
                                            {donation.donor_phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {donation.donor_phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-primary">{formatCurrency(parseFloat(donation.amount.toString()))}</div>
                                        <div className="text-xs text-muted-foreground">{donation.donation_type}</div>
                                    </TableCell>
                                    <TableCell>
                                        {donation.project ? (
                                            <div className="text-sm">{donation.project.title}</div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">General</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={donation.status}
                                            onValueChange={(value) => handleStatusChange(donation.id, value)}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.slice(1).map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {donation.created_at && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(donation.created_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedDonation(donation)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {donation.status === "completed" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Generate Receipt"
                                                        onClick={() => handleGenerateReceipt(donation.id)}
                                                    >
                                                        <Receipt className="w-4 h-4" />
                                                    </Button>
                                                    {donation.pan_number && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Generate Tax Certificate"
                                                            onClick={() => handleGenerateTaxCertificate(donation.id)}
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* View Donation Dialog */}
            {selectedDonation && (
                <Dialog open={!!selectedDonation} onOpenChange={(open) => !open && setSelectedDonation(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader>
                            <DialogTitle>Donation Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</p>
                                    <p className="font-mono text-sm">{selectedDonation.transaction_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
                                    <p className="text-foreground font-bold text-lg">
                                        {formatCurrency(parseFloat(selectedDonation.amount.toString()))}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Donor Name</p>
                                <p className="text-foreground">
                                    {selectedDonation.is_anonymous ? "Anonymous" : selectedDonation.donor_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <p className="text-foreground">{selectedDonation.donor_email}</p>
                                </div>
                            </div>
                            {selectedDonation.donor_phone && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-foreground">{selectedDonation.donor_phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Donation Type</p>
                                    <Badge variant="outline">{selectedDonation.donation_type}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Payment Method</p>
                                    <Badge variant="outline">{selectedDonation.payment_method}</Badge>
                                </div>
                            </div>
                            {selectedDonation.project && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Project</p>
                                    <p className="text-foreground">{selectedDonation.project.title}</p>
                                </div>
                            )}
                            {selectedDonation.message && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Message</p>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <p className="text-foreground whitespace-pre-wrap">{selectedDonation.message}</p>
                                    </div>
                                </div>
                            )}
                            {selectedDonation.pan_number && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">PAN Number</p>
                                    <p className="text-foreground font-mono">{selectedDonation.pan_number}</p>
                                </div>
                            )}
                            {selectedDonation.razorpay_order_id && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Razorpay Order ID</p>
                                    <p className="text-foreground font-mono text-sm">{selectedDonation.razorpay_order_id}</p>
                                </div>
                            )}
                            {selectedDonation.razorpay_payment_id && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Razorpay Payment ID</p>
                                    <p className="text-foreground font-mono text-sm">{selectedDonation.razorpay_payment_id}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                    <Badge variant={getStatusBadgeVariant(selectedDonation.status)}>
                                        {selectedDonation.status}
                                    </Badge>
                                </div>
                                {selectedDonation.created_at && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(selectedDonation.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ManageDonations;

