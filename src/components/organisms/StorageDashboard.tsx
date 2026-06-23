"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStorage, type StoredFile } from "@/lib/hooks/useStorage";
import { FileGlyph } from "@/components/atoms/FileGlyph";
import { HippoLoader } from "@/components/atoms/HippoLoader";
import { Modal } from "@/components/molecules/Modal";
import { fileKindFromName, formatBytes, cn } from "@/lib/utils";
import type { FileKind } from "@/lib/types";

const FREE_LIMIT = 1024 * 1024 * 1024; // 1 GB
const CATEGORIES = ["Papers", "IDs", "Bills", "Payments", "Certificates", "Receipts", "Other"];

const glyphFor = (name: string) => (name.split(".").pop() || "ZIP").toUpperCase();
const fmtDate = (s: string) => (s ? new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");

const TABS: { id: "all" | FileKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pdf", label: "PDFs" },
  { id: "image", label: "Images" },
  { id: "doc", label: "Docs" },
  { id: "other", label: "Other" },
];

const Eye = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
const Info = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>;
const Trash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>;

export function StorageDashboard() {
  const { files, used, loading, error, upload, remove, updateMeta, previewUrl } = useStorage();
  const inputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<"all" | FileKind>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"date" | "name" | "size">("date");
  const [page, setPage] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [pending, setPending] = useState<File[] | null>(null);
  const [pCategory, setPCategory] = useState("Papers");
  const [pTags, setPTags] = useState("");
  const [pName, setPName] = useState("");
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);

  const [details, setDetails] = useState<StoredFile | null>(null);
  const [preview, setPreview] = useState<{ file: StoredFile; url: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: files.length, pdf: 0, image: 0, doc: 0, other: 0 };
    files.forEach((f) => (c[fileKindFromName(f.name)] = (c[fileKindFromName(f.name)] ?? 0) + 1));
    return c;
  }, [files]);

  const visible = useMemo(() => {
    let list = tab === "all" ? files : files.filter((f) => fileKindFromName(f.name) === tab);
    const q = query.toLowerCase().trim();
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)));
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "size") return b.size - a.size;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [files, tab, query, sort]);

  const pageSize = view === "grid" ? 9 : 8;
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  useEffect(() => { setPage(0); }, [tab, query, sort, view]);
  const pageItems = visible.slice(page * pageSize, page * pageSize + pageSize);
  const pct = Math.min(100, Math.round((used / FREE_LIMIT) * 100));
  const notReady = error && /not found|does not exist|bucket/i.test(error);

  function onPicked(list: FileList | null) {
    const arr = Array.from(list ?? []);
    if (!arr.length) return;
    setPending(arr);
    setPName(arr.length === 1 ? arr[0]!.name : "");
    setPCategory("Papers");
    setPTags("");
  }

  async function confirmUpload() {
    if (!pending) return;
    const arr = pending;
    const meta = { category: pCategory, tags: pTags.split(",").map((t) => t.trim()).filter(Boolean) };
    setPending(null);
    setUploading({ done: 0, total: arr.length });
    let ok = 0;
    for (let i = 0; i < arr.length; i++) {
      try {
        await upload(arr[i]!, { ...meta, name: arr.length === 1 ? pName : undefined });
        ok++;
      } catch (e) { setMsg(e instanceof Error ? e.message : "Upload failed."); }
      setUploading({ done: i + 1, total: arr.length });
    }
    setUploading(null);
    if (ok) setMsg(`${ok} file${ok === 1 ? "" : "s"} added.`);
  }

  async function openPreview(f: StoredFile) {
    setPreviewLoading(true);
    setPreview({ file: f, url: "" });
    const url = await previewUrl(f.path);
    url ? setPreview({ file: f, url }) : setPreview(null);
    setPreviewLoading(false);
  }

  const previewKind = preview ? fileKindFromName(preview.file.name) : "other";

  const FileActions = ({ f }: { f: StoredFile }) => (
    <div className="flex items-center gap-0.5">
      <button title="Preview" aria-label="Preview" onClick={(e) => { e.stopPropagation(); openPreview(f); }} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 hover:bg-white/10 hover:text-white"><Eye /></button>
      <button title="Details" aria-label="Details" onClick={(e) => { e.stopPropagation(); setDetails(f); }} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 hover:bg-white/10 hover:text-white"><Info /></button>
      <button title="Delete" aria-label="Delete" onClick={(e) => { e.stopPropagation(); remove(f.path); }} className="grid h-7 w-7 place-items-center rounded-[8px] text-white/45 hover:bg-white/10 hover:text-file-pdf"><Trash /></button>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a12]/95 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div className="h-[3px] w-full bg-[linear-gradient(90deg,var(--a1),var(--a2),var(--a3))]" />
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="font-mono text-xs text-white/40">my-stash</span>
        <div className="relative ml-2 min-w-[180px] flex-1">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, category or tag…" className="h-9 w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-accent-cyan/50 focus:outline-none" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-9 rounded-[10px] border border-white/10 bg-[#0a0a12] px-2.5 text-xs text-white/70 focus:outline-none">
          <option value="date">Newest</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
        </select>
        <div className="flex rounded-[10px] border border-white/10 p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-label={`${v} view`} className={cn("grid h-7 w-7 place-items-center rounded-[7px]", view === v ? "bg-white/10 text-white" : "text-white/40")}>
              {v === "grid"
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="3" rx="1" /><rect x="3" y="10.5" width="18" height="3" rx="1" /><rect x="3" y="17" width="18" height="3" rx="1" /></svg>}
            </button>
          ))}
        </div>
        <button onClick={() => inputRef.current?.click()} className="btn-primary flex h-9 items-center gap-1.5 rounded-[10px] px-3.5 text-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>
          Add files
        </button>
        <input ref={inputRef} type="file" multiple className="sr-only" aria-label="Upload files" onChange={(e) => onPicked(e.target.files)} />
      </div>

      <div className="p-5">
        {/* tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", on ? "border-accent-cyan/50 bg-accent-cyan/10 text-white" : "border-white/10 text-white/55 hover:text-white")}>
                {t.label} <span className={on ? "text-accent-cyan" : "text-white/35"}>{counts[t.id] ?? 0}</span>
              </button>
            );
          })}
        </div>

        {msg && <p className="mb-3 rounded-[10px] bg-white/[0.05] px-3 py-2 text-xs text-white/70">{msg}</p>}
        {notReady && <p className="mb-3 rounded-[10px] bg-amber-400/10 px-3 py-2 text-xs text-amber-300">Storage isn&apos;t enabled — the <code>user-files</code> bucket is missing.</p>}

        {/* dropzone (compact) */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onPicked(e.dataTransfer.files); }}
          className={cn("mb-4 cursor-pointer rounded-[12px] border border-dashed py-3 text-center text-xs transition-colors", dragging ? "border-accent-cyan/70 bg-accent-cyan/[0.06] text-white" : "border-white/12 text-white/40 hover:border-white/25")}
        >
          {uploading ? <HippoLoader size={40} label={`Uploading ${uploading.done}/${uploading.total}…`} /> : "Drag & drop files here, or use “Add files”"}
        </div>

        {/* files */}
        <div className="min-h-[200px]">
          {loading ? (
            <div className="grid place-items-center py-10"><HippoLoader size={48} label="Loading your files…" /></div>
          ) : visible.length === 0 ? (
            <div className="grid place-items-center py-12 text-center text-sm text-white/40">{files.length === 0 ? "Your stash is empty — add your first file." : "Nothing matches your filters."}</div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {pageItems.map((f) => (
                  <motion.div key={f.path} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                    onClick={() => setDetails(f)}
                    className="group cursor-pointer rounded-[14px] border border-white/[0.06] bg-white/[0.03] p-3.5 transition-colors hover:border-white/20">
                    <div className="mb-3 flex items-start justify-between">
                      <FileGlyph format={glyphFor(f.name)} size={36} showLabel={false} />
                      <div className="opacity-0 transition-opacity group-hover:opacity-100"><FileActions f={f} /></div>
                    </div>
                    <div className="truncate text-sm font-medium text-white">{f.name}</div>
                    <div className="mt-0.5 text-xs text-white/40">{formatBytes(f.size)}</div>
                    {f.category && <span className="mt-2 inline-block rounded-full bg-accent-cyan/10 px-2 py-0.5 text-[10px] font-medium text-accent-cyan">{f.category}</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {pageItems.map((f) => (
                  <motion.div key={f.path} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                    onClick={() => setDetails(f)}
                    className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 hover:border-white/20">
                    <FileGlyph format={glyphFor(f.name)} size={30} showLabel={false} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-white">{f.name}</div>
                      <div className="text-xs text-white/40">{formatBytes(f.size)} · {fmtDate(f.createdAt)}{f.category && ` · ${f.category}`}</div>
                    </div>
                    <FileActions f={f} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* pagination */}
        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-[8px] border border-white/10 px-3 py-1.5 text-white/70 disabled:opacity-40">Prev</button>
            <span className="text-white/50">{page + 1} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1} className="rounded-[8px] border border-white/10 px-3 py-1.5 text-white/70 disabled:opacity-40">Next</button>
          </div>
        )}

        {/* storage meter */}
        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Storage</span>
            <span className="text-white/50">{formatBytes(used)} <span className="text-white/30">of 1 GB</span></span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-blue" animate={{ width: `${pct}%` }} transition={{ ease: "easeOut" }} />
          </div>
        </div>
      </div>

      {/* upload-with-details modal */}
      <Modal open={!!pending} onClose={() => setPending(null)} title={`Add ${pending?.length ?? 0} file${pending?.length === 1 ? "" : "s"}`}>
        <div className="flex flex-col gap-3.5">
          {pending?.length === 1 && (
            <div>
              <label className="mb-1 block text-xs text-white/50">File name</label>
              <input value={pName} onChange={(e) => setPName(e.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white focus:border-accent-cyan/60 focus:outline-none" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs text-white/50">Category</label>
            <select value={pCategory} onChange={(e) => setPCategory(e.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-[#0d0d16] px-3 text-sm text-white focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Tags <span className="text-white/30">(comma separated)</span></label>
            <input value={pTags} onChange={(e) => setPTags(e.target.value)} placeholder="2024, tax, important" className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white placeholder:text-white/25 focus:border-accent-cyan/60 focus:outline-none" />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button onClick={() => setPending(null)} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white">Cancel</button>
            <button onClick={confirmUpload} className="btn-primary rounded-[12px] px-5 py-2.5 text-sm">Upload {pending?.length}</button>
          </div>
        </div>
      </Modal>

      {/* details modal */}
      <Modal open={!!details} onClose={() => setDetails(null)} title="File details">
        {details && <FileDetails key={details.path} file={details} onClose={() => setDetails(null)} onSave={updateMeta} onDelete={(p) => { remove(p); setDetails(null); }} onPreview={() => { const f = details; setDetails(null); openPreview(f); }} />}
      </Modal>

      {/* preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.file.name} size="lg">
        <div className="grid max-h-[78vh] min-h-[300px] place-items-center overflow-auto bg-black/30 p-3">
          {previewLoading || !preview?.url ? <HippoLoader size={52} label="Opening preview…" />
            : previewKind === "image" ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={preview.url} alt={preview.file.name} className="max-w-full rounded-[10px]" />)
            : previewKind === "pdf" ? <iframe src={preview.url} title={preview.file.name} className="h-[74vh] w-full rounded-[10px] bg-white" />
            : <div className="p-10 text-center"><FileGlyph format={glyphFor(preview.file.name)} size={56} showLabel={false} className="mx-auto" /><p className="mt-4 text-sm text-white/55">No inline preview for this type.</p><a href={preview.url} download={preview.file.name} className="btn-primary mt-4 inline-flex rounded-[12px] px-5 py-2.5 text-sm">Download</a></div>}
        </div>
      </Modal>
    </div>
  );
}

function FileDetails({ file, onSave, onDelete, onPreview, onClose }: {
  file: StoredFile;
  onSave: (path: string, meta: { name?: string; category?: string; tags?: string[] }) => Promise<void>;
  onDelete: (path: string) => void;
  onPreview: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(file.name);
  const [category, setCategory] = useState(file.category || "Other");
  const [tags, setTags] = useState(file.tags.join(", "));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave(file.path, { name, category, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) });
    setSaving(false);
    onClose();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FileGlyph format={glyphFor(file.name)} size={40} showLabel={false} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{file.name}</div>
          <div className="text-xs text-white/45">{formatBytes(file.size)} · {fmtDate(file.createdAt)}</div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-white/50">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white focus:border-accent-cyan/60 focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs text-white/50">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 w-full rounded-[12px] border border-white/10 bg-[#0d0d16] px-3 text-sm text-white focus:outline-none">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-white/50">Tags</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma separated" className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-white placeholder:text-white/25 focus:border-accent-cyan/60 focus:outline-none" />
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <button onClick={onPreview} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.08]">Preview</button>
        <button onClick={() => onDelete(file.path)} className="rounded-[12px] border border-file-pdf/30 bg-file-pdf/[0.08] px-4 py-2.5 text-sm font-semibold text-file-pdf hover:bg-file-pdf/15">Delete</button>
        <button onClick={save} disabled={saving} className="btn-primary ml-auto rounded-[12px] px-5 py-2.5 text-sm disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
      </div>
    </div>
  );
}
