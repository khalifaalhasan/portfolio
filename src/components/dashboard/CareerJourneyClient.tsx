"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createCareerJourney,
  updateCareerJourney,
  deleteCareerJourney,
} from "@/actions/careerJourney";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X, Briefcase, Building2 } from "lucide-react";
import { CareerJourney, CareerCategory } from "@prisma/client";
import { ImageUpload } from "./ImageUpload";

const schema = z.object({
  category: z.nativeEnum(CareerCategory),
  place: z.string().min(1, "Nama tempat wajib diisi"),
  role: z.string().min(1, "Posisi / jabatan wajib diisi"),
  period: z.string().min(1, "Periode wajib diisi"),
  description: z.string().optional(),
  location: z.string().optional(),
  logoUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const categoryLabel: Record<CareerCategory, string> = {
  work: "Pengalaman Kerja",
  organization: "Organisasi",
};

export function CareerJourneyClient({ initialData }: { initialData: CareerJourney[] }) {
  const [items, setItems] = useState<CareerJourney[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<CareerCategory | "all">("all");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "work", place: "", role: "", period: "", description: "", location: "", logoUrl: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ category: "work", place: "", role: "", period: "", description: "", location: "", logoUrl: "" });
    setIsFormOpen(true);
  };

  const openEdit = (item: CareerJourney) => {
    setEditingId(item.id);
    form.reset({
      category: item.category,
      place: item.place,
      role: item.role,
      period: item.period,
      description: item.description || "",
      location: item.location || "",
      logoUrl: item.logoUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data karir ini?")) return;
    try {
      await deleteCareerJourney(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Data dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        logoUrl: data.logoUrl || undefined,
        location: data.location || undefined,
        description: data.description || undefined,
      };
      if (editingId) {
        const result = await updateCareerJourney(editingId, payload);
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...(result.career as CareerJourney) } : i)));
        toast.success("Data diperbarui");
      } else {
        const result = await createCareerJourney(payload);
        setItems((prev) => [result.career as CareerJourney, ...prev]);
        toast.success("Data ditambahkan");
      }
      setIsFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Career Journey</h2>
        <Button onClick={openCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Tambah
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "work", "organization"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-muted"
            }`}
          >
            {f === "all" ? "Semua" : categoryLabel[f]}
          </button>
        ))}
      </div>

      {isFormOpen && (
        <div className="p-6 border rounded-xl bg-card relative">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsFormOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Data Karir" : "Tambah Data Karir"}</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="work">Pengalaman Kerja</option>
                      <option value="organization">Organisasi</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="place" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan / Organisasi</FormLabel>
                    <FormControl><Input placeholder="PT. Maju Jaya / GDGoC UNSRI" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posisi / Jabatan</FormLabel>
                    <FormControl><Input placeholder="Full Stack Developer / Tech Lead" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="period" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periode (bebas format)</FormLabel>
                    <FormControl><Input placeholder="Jan 2024 – Present" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi (opsional)</FormLabel>
                    <FormControl><Input placeholder="Remote / Palembang" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Perusahaan / Institusi (opsional)</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value || ""} 
                      onChange={field.onChange} 
                      folder="logos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl><Textarea className="min-h-[120px]" placeholder="Apa yang kamu lakukan di sini..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
            Belum ada data. Tambahkan yang pertama!
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="p-4 border rounded-xl bg-card flex items-start gap-4">
              <div className="shrink-0 mt-0.5 size-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {item.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.logoUrl} alt={item.place} className="size-full object-contain p-1" />
                ) : item.category === "work" ? (
                  <Briefcase className="h-4 w-4 text-primary" />
                ) : (
                  <Building2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold leading-none">{item.place}</p>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                    item.category === "work"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-green-500/10 text-green-600"
                  }`}>
                    {categoryLabel[item.category]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{item.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.period}{item.location ? ` · ${item.location}` : ""}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
