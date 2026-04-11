'use client';

import { apiRequest } from '@/lib';
import { useEffect, useState, useCallback } from 'react';
import LoginRequired from '@/components/LoginRequired/LoginRequired';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import {
  Pagination as PagingUI, PaginationContent, PaginationItem, PaginationPrevious,
  PaginationNext, PaginationLink,
} from "@/components/ui/pagination";
import toast from 'react-hot-toast';
import { FaWarehouse, FaPlus, FaTrash, FaSync, FaSearch } from 'react-icons/fa';
import { Stock } from '@/types';

export default function ManagingPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [form, setForm] = useState({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);



  const checkAuth = useCallback(async () => {
    try {
      const result = await apiRequest('/api/auth/profile');
      if (result) {
        setIsAuthenticated(true);
        loadData(1);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loadData = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/stocks', { page: pageNum, size: 10 });
      setStocks(data || []);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpsert = async (item?: Partial<Stock>) => {
    try {
      const payload = item?.id ? item : {
        ...form,
        quantity: parseInt(form.quantity),
        cost: parseFloat(form.cost),
        sellingPrice: parseFloat(form.sellingPrice)
      };

      await apiRequest('/api/stocks', payload);
      toast.success(item?.id ? 'Record updated' : 'Item added');
      setForm({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
      loadData(page);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiRequest('/api/stocks', { id, status: 0 });
      toast.success('Item deleted');
      loadData(page);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  if (isAuthenticated === false) return <LoginRequired />;
  if (isAuthenticated === null) return null;

  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <FaWarehouse className="text-primary" /> Inventory Central
          </h1>
          <p className="text-muted-foreground mt-1">Manage global crop assets and warehouse logistics.</p>
        </div>
      </div>

      {/* 🚀 New Entry Form Card */}
      <Card className="p-8 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaPlus className="text-green-500" /> New Stock Entry
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase opacity-60 px-1">Product Name</label>
            <Input className="bg-background/50" placeholder="e.g. Wheat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase opacity-60 px-1">Quantity</label>
            <Input className="bg-background/50" type="number" placeholder="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase opacity-60 px-1">Warehouse</label>
            <Input className="bg-background/50" placeholder="A-101" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase opacity-60 px-1">Cost (₹)</label>
            <Input className="bg-background/50" type="number" placeholder="0.00" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase opacity-60 px-1">Price (₹)</label>
            <Input className="bg-background/50" type="number" placeholder="0.00" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} />
          </div>
          <Button onClick={() => handleUpsert()} className="h-10 rounded-xl font-bold shadow-lg shadow-primary/20">
            Submit Record
          </Button>
        </div>
      </Card>

      {/* 📊 Inventory Table */}
      <Card className="overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl">
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm">
            <FaSearch className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search by product name..."
              className="pl-10 bg-background/50 border-none rounded-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => loadData(page)} className="rounded-full">
              <FaSync className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50">
              <TableHead className="font-bold">Product</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Cost</TableHead>
              <TableHead className="font-bold">Selling Price</TableHead>
              <TableHead className="text-right font-bold px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length > 0 ? stocks.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((stock) => (
              <TableRow key={stock.id} className="hover:bg-primary/5 transition-colors border-border/50">
                <TableCell className="font-bold text-lg">{stock.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-20 bg-background/40 border-none text-center"
                    value={stock.quantity}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setStocks(prev => prev.map(s => s.id === stock.id ? { ...s, quantity: val } : s));
                    }}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">{stock.location}</TableCell>
                <TableCell>₹{stock.cost}</TableCell>
                <TableCell>₹{stock.sellingPrice}</TableCell>
                <TableCell className="text-right px-6 space-x-2">
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => handleUpsert(stock)}>
                    <FaSync />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(stock.id)}>
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 opacity-40 italic">
                  No stock records found in this warehouse.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border/50 bg-muted/10">
          <PagingUI>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={e => { e.preventDefault(); if (page > 1) loadData(page - 1); }} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={e => { e.preventDefault(); loadData(page + 1); }} />
              </PaginationItem>
            </PaginationContent>
          </PagingUI>
        </div>
      </Card>
    </div>
  );
}
