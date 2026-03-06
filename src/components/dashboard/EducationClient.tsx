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
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/actions/education";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X, GraduationCap } from "lucide-react";
import { Education } from "@prisma/client";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

const schema = z.object({
  institution: z.string().min(1, "Nama institusi wajib diisi"),
  degree: z.string().min(1, "Jurusan/gelar wajib diisi"),
  period: z.string().min(1, "Periode wajib diisi"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EducationClient({ initialData }: { initialData: Education[] }) {
  const [items, setItems] = useState<Education[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { institution: "", degree: "", period: "", description: "", logoUrl: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ institution: "", degree: "", period: "", description: "", logoUrl: "" });
    setIsFormOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditingId(item.id);
    form.reset({
      institution: item.institution,
      degree: item.degree,
      period: item.period,
      description: item.description || "",
      logoUrl: item.logoUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data pendidikan ini?")) return;
    try {
      await deleteEducation(id);
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
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined
      };
      if (editingId) {
        const result = await updateEducation(editingId, payload);
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...(result.education as Education) } : i)));
        toast.success("Data diperbarui");
      } else {
        const result = await createEducation(payload);
        setItems((prev) => [result.education as Education, ...prev]);
        toast.success("Data ditambahkan");
      }
      setIsFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={openCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Tambah
        </Button>
      </div>

      {isFormOpen && (
        <div className="p-6 border rounded-xl bg-card relative">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsFormOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Pendidikan" : "Tambah Pendidikan"}</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="institution" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Institusi / Sekolah</FormLabel>
                  <FormControl><Input placeholder="Universitas Sriwijaya / SMKN 11 Bogor" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="degree" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurusan / Gelar</FormLabel>
                    <FormControl><Input placeholder="Sistem Informasi — S1 / Teknik Komputer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="period" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periode</FormLabel>
                    <FormControl><Input placeholder="2023 – Present" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan / Deskripsi (opsional)</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" placeholder="Fokus studi, prestasi, kegiatan akademis..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (opsional)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      folder="education"
                    />
                  </FormControl>
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
        {items.length === 0 ? (
          <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
            Belum ada data pendidikan.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 border rounded-xl bg-card flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                {item.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.logoUrl} alt="Logo" className="size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain bg-white" />
                ) : (
                  <div className="size-10 p-1 border rounded-full shadow ring-2 ring-border bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-none">{item.institution}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.degree}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.period}</p>
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
