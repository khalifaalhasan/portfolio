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
  createCompetition,
  updateCompetition,
  deleteCompetition,
} from "@/actions/competition";
import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, X, Trophy, ExternalLink, Github } from "lucide-react";
import { Competition } from "@prisma/client";

const schema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  organizer: z.string().min(1, "Penyelenggara wajib diisi"),
  dateDisplay: z.string().min(1, "Tanggal wajib diisi"),
  description: z.string().optional(),
  websiteUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  repoUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function CompetitionClient({ initialData }: { initialData: Competition[] }) {
  const [items, setItems] = useState<Competition[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", organizer: "", dateDisplay: "", description: "", websiteUrl: "", repoUrl: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ title: "", organizer: "", dateDisplay: "", description: "", websiteUrl: "", repoUrl: "" });
    setIsFormOpen(true);
  };

  const openEdit = (item: Competition) => {
    setEditingId(item.id);
    form.reset({
      title: item.title,
      organizer: item.organizer,
      dateDisplay: item.dateDisplay,
      description: item.description || "",
      websiteUrl: item.websiteUrl || "",
      repoUrl: item.repoUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kompetisi ini?")) return;
    try {
      await deleteCompetition(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Kompetisi dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        websiteUrl: data.websiteUrl || undefined,
        repoUrl: data.repoUrl || undefined,
        description: data.description || undefined,
      };
      if (editingId) {
        const result = await updateCompetition(editingId, payload);
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...(result.competition as Competition) } : i)));
        toast.success("Kompetisi diperbarui");
      } else {
        const result = await createCompetition(payload);
        setItems((prev) => [result.competition as Competition, ...prev]);
        toast.success("Kompetisi ditambahkan");
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
        <h2 className="text-xl font-semibold">Competitions & Achievements</h2>
        <Button onClick={openCreate} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" /> Tambah
        </Button>
      </div>

      {isFormOpen && (
        <div className="p-6 border rounded-xl bg-card relative">
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setIsFormOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Kompetisi" : "Tambah Kompetisi"}</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Event / Kompetisi</FormLabel>
                    <FormControl><Input placeholder="Hackathon GDGoC 2024" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="organizer" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penyelenggara</FormLabel>
                    <FormControl><Input placeholder="Google Developer Group" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="dateDisplay" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal (tampil bebas, misal: "November 2024")</FormLabel>
                  <FormControl><Input placeholder="November 2024" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" placeholder="Apa yang kamu buat / capai..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Website (opsional)</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="repoUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Repo (opsional)</FormLabel>
                    <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

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
            Belum ada data kompetisi. Tambahkan yang pertama!
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 border rounded-xl bg-card flex items-start gap-4">
              <div className="shrink-0 mt-0.5 size-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.organizer} · {item.dateDisplay}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-3 mt-2">
                  {item.websiteUrl && (
                    <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 hover:underline">
                      <ExternalLink className="h-3 w-3" /> Website
                    </a>
                  )}
                  {item.repoUrl && (
                    <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 hover:underline">
                      <Github className="h-3 w-3" /> Repo
                    </a>
                  )}
                </div>
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
