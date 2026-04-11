'use client';

import { api } from '@/lib';
import { useAuth } from '@/context/AuthContext';
import LoginRequired from '@/components/LoginRequired/LoginRequired';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import {
    FaBox, FaUsers, FaPlus, FaTrash, FaSync, FaSearch,
    FaIdBadge, FaEnvelope, FaTractor
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Stock, Worker } from '@/types';

export default function ManagingDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [stockForm, setStockForm] = useState({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
    const [workerForm, setWorkerForm] = useState({ name: '', email: '', username: '', farm: '', role: '' });

    // Search
    const [stockSearch, setStockSearch] = useState('');
    const [workerSearch, setWorkerSearch] = useState('');

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [stockRes, workerRes] = await Promise.all([
                api('/api/stocks', { page: 1, size: 50 }).post(),
                api('/api/workers', { page: 1, size: 50 }).post()
            ]);
            setStocks((stockRes as Stock[]) || []);
            setWorkers((workerRes as Worker[]) || []);
        } catch {
            toast.error("Sync failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStock = async () => {
        try {
            await api('/api/stocks', {
                ...stockForm,
                quantity: Number(stockForm.quantity),
                cost: stockForm.cost,
                sellingPrice: stockForm.sellingPrice
            }).post();
            toast.success("Stock Added");
            setStockForm({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
            fetchData();
        } catch {
            toast.error("Failed to add stock");
        }
    };

    const handleAddWorker = async () => {
        try {
            await api('/api/workers', workerForm).post();
            toast.success("Worker Account Created");
            setWorkerForm({ name: '', email: '', username: '', farm: '', role: '' });
            fetchData();
        } catch (err) {
            toast.error((err as Error).message || "Failed to create worker");
        }
    };

    const handleDelete = async (type: 'stocks' | 'workers', id: number) => {
        try {
            await api(`/api/${type}`, { id, status: 0 }).post();
            toast.success("Deleted successfully");
            fetchData();
        } catch {
            toast.error("Delete failed");
        }
    };

    if (authLoading) return null;
    if (!user) return <LoginRequired />;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-500">
                        Resource Control
                    </h1>
                    <p className="text-muted-foreground font-medium">Manage your physical assets and workforce from a unified command center.</p>
                </div>
                <Button onClick={fetchData} variant="outline" className="rounded-full gap-2 backdrop-blur-md">
                    <FaSync className={loading ? "animate-spin" : ""} /> Sync Data
                </Button>
            </div>

            <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-2xl mb-8 space-x-2">
                    <TabsTrigger value="inventory" className="rounded-xl px-8 font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">
                        <FaBox className="mr-2" /> Inventory
                    </TabsTrigger>
                    <TabsTrigger value="labour" className="rounded-xl px-8 font-bold data-[state=active]:bg-sky-600 data-[state=active]:text-white transition-all">
                        <FaUsers className="mr-2" /> Labour
                    </TabsTrigger>
                </TabsList>

                {/* INVENTORY SECTION */}
                <TabsContent value="inventory" className="space-y-8 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Add Form */}
                        <Card className="p-6 col-span-1 bg-card/40 backdrop-blur-xl border-emerald-500/20 shadow-xl rounded-[2rem] h-fit">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
                                <FaPlus /> Add Asset
                            </h2>
                            <div className="space-y-4">
                                <Input placeholder="Item Name" value={stockForm.name} onChange={e => setStockForm({ ...stockForm, name: e.target.value })} className="rounded-xl" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Qty" type="number" value={stockForm.quantity} onChange={e => setStockForm({ ...stockForm, quantity: e.target.value })} className="rounded-xl" />
                                    <Input placeholder="Loc" value={stockForm.location} onChange={e => setStockForm({ ...stockForm, location: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Cost (₹)" value={stockForm.cost} onChange={e => setStockForm({ ...stockForm, cost: e.target.value })} className="rounded-xl" />
                                    <Input placeholder="Sale (₹)" value={stockForm.sellingPrice} onChange={e => setStockForm({ ...stockForm, sellingPrice: e.target.value })} className="rounded-xl" />
                                </div>
                                <Button onClick={handleAddStock} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                    Register Item
                                </Button>
                            </div>
                        </Card>

                        {/* List View */}
                        <Card className="p-8 col-span-1 lg:col-span-3 bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="relative w-full max-w-sm">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search inventory..."
                                        className="pl-12 rounded-full bg-background/50 border-none ring-1 ring-border shadow-inner"
                                        value={stockSearch}
                                        onChange={e => setStockSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="font-bold">ITEM</TableHead>
                                        <TableHead className="font-bold">STATUS</TableHead>
                                        <TableHead className="font-bold">QUANTITY</TableHead>
                                        <TableHead className="font-bold">VALUATION</TableHead>
                                        <TableHead className="text-right font-bold">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {stocks.filter((s: Stock) => s.name.toLowerCase().includes(stockSearch.toLowerCase())).map((stock: Stock) => (
                                            <motion.tr
                                                key={stock.id}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="group border-border/40 hover:bg-emerald-500/5 transition-all"
                                            >
                                                <TableCell className="font-bold text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        {stock.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full">Active</Badge>
                                                </TableCell>
                                                <TableCell className="font-mono">{stock.quantity} Units</TableCell>
                                                <TableCell className="font-bold">₹{stock.sellingPrice}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => handleDelete('stocks', stock.id)}
                                                        variant="ghost" size="icon"
                                                        className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </TabsContent>

                {/* LABOUR SECTION */}
                <TabsContent value="labour" className="space-y-8 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Add Form */}
                        <Card className="p-6 col-span-1 bg-card/40 backdrop-blur-xl border-sky-500/20 shadow-xl rounded-[2rem] h-fit">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-sky-600">
                                <FaIdBadge /> Hire Worker
                            </h2>
                            <div className="space-y-4">
                                <Input placeholder="Full Name" value={workerForm.name} onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })} className="rounded-xl" />
                                <Input placeholder="Email Address" value={workerForm.email} onChange={e => setWorkerForm({ ...workerForm, email: e.target.value })} className="rounded-xl" />
                                <Input placeholder="Username (Optional)" value={workerForm.username} onChange={e => setWorkerForm({ ...workerForm, username: e.target.value })} className="rounded-xl" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="Farm name" value={workerForm.farm} onChange={e => setWorkerForm({ ...workerForm, farm: e.target.value })} className="rounded-xl" />
                                    <Input placeholder="Role (Driver, etc)" value={workerForm.role} onChange={e => setWorkerForm({ ...workerForm, role: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 text-[10px] text-sky-700 font-bold uppercase tracking-widest leading-relaxed">
                                    ⚠️ Creating a worker will generate a user account with role &quot;WORKER&quot; and default password &quot;Welcome@123&quot;.
                                </div>
                                <Button onClick={handleAddWorker} className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-500/20">
                                    Onboard Worker
                                </Button>
                            </div>
                        </Card>

                        {/* List View */}
                        <Card className="p-8 col-span-1 lg:col-span-3 bg-card/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="relative w-full max-w-sm">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search workforce..."
                                        className="pl-12 rounded-full bg-background/50 border-none ring-1 ring-border shadow-inner"
                                        value={workerSearch}
                                        onChange={e => setWorkerSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="font-bold">WORKER</TableHead>
                                        <TableHead className="font-bold">ROLE & FARM</TableHead>
                                        <TableHead className="font-bold">CONTACT</TableHead>
                                        <TableHead className="text-right font-bold">ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {workers.filter((w: Worker) => w.user && w.user.name && w.user.name.toLowerCase().includes(workerSearch.toLowerCase())).map((worker: Worker) => (
                                            <motion.tr
                                                key={worker.id}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="group border-border/40 hover:bg-sky-500/5 transition-all"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-600 font-black">
                                                            {worker.user.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg leading-none mb-1">{worker.user.name}</p>
                                                            <p className="text-xs text-muted-foreground font-medium">@{worker.user.username}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <FaTractor className="text-sky-500" />
                                                        <span className="font-bold">{worker.role || 'General'}</span>
                                                        <span className="text-muted-foreground">at</span>
                                                        <Badge variant="secondary" className="rounded-full">{worker.farm || 'Global'}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <FaEnvelope /> {worker.user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => handleDelete('workers', worker.id)}
                                                        variant="ghost" size="icon"
                                                        className="rounded-full hover:bg-red-500/10 hover:text-red-500"
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
