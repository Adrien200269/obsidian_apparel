"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { Collection } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Layers,
  Upload,
  Compass,
  Video as VideoIcon,
  Image as ImageIcon,
  Play,
  Sparkles,
} from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import { uploadToUploadcare } from "@/lib/uploadcare";
import { getVideoInfo } from "@/lib/video-utils";

export default function AdminCollectionsPage() {
  const { collections, addCollection, updateCollection, deleteCollection, products, getMediaSlot, mediaSlots } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [volumeNumber, setVolumeNumber] = useState("VOLUME III");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverSlotKey, setCoverSlotKey] = useState<string>("");

  const modalMediaSrc = coverImageUrl || (coverSlotKey ? getMediaSlot(coverSlotKey)?.imageUrl : null);
  const modalVideoInfo = getVideoInfo(modalMediaSrc);

  const openCreate = () => {
    setEditingCollection(null);
    setTitle("");
    setSlug("");
    setVolumeNumber(`VOLUME 0${collections.length + 1}`);
    setDescription("");
    setCoverImageUrl(null);
    setCoverSlotKey("");
    setIsModalOpen(true);
  };

  const openEdit = (col: Collection) => {
    setEditingCollection(col);
    setTitle(col.title);
    setSlug(col.slug);
    setVolumeNumber(col.volumeNumber);
    setDescription(col.description);
    setCoverImageUrl(col.coverImageUrl);
    setCoverSlotKey(col.coverSlotKey || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSaving(true);
    try {
      const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      if (editingCollection) {
        await updateCollection(editingCollection.id, {
          title,
          slug: finalSlug,
          volumeNumber,
          description,
          coverImageUrl: coverImageUrl || null,
          coverSlotKey: coverSlotKey.trim() || undefined,
        });
      } else {
        await addCollection({
          title,
          slug: finalSlug,
          volumeNumber,
          description,
          coverImageUrl: coverImageUrl || null,
          coverSlotKey: coverSlotKey.trim() || undefined,
          isActive: true,
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save collection error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadToUploadcare(file);
      setCoverImageUrl(res.cdnUrl);
    } catch (err) {
      console.warn("Uploadcare direct upload failed, checking local compression:", err);
      if (file.type.startsWith("image/")) {
        try {
          const dataUrl = await compressImage(file, 2000, 1500, 0.82);
          setCoverImageUrl(dataUrl);
        } catch (compErr) {
          console.error("Local compression error:", compErr);
        }
      } else {
        alert("Video upload failed. Please verify your connection or public key, or paste a video URL directly.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              OBSIDIAN ARCHIVE CURATION
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              VOLUMES & COLLECTIONS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Organize garments into numbered seasonal drops, capsule releases, and campaign narratives with custom video reels and editorial photos.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW VOLUME</span>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {collections.map((col) => {
            const count = products.filter((p) => p.collectionId === col.id).length;
            const resolvedMedia = col.coverImageUrl || (col.coverSlotKey ? getMediaSlot(col.coverSlotKey)?.imageUrl : null);
            const videoInfo = getVideoInfo(resolvedMedia);

            return (
              <div
                key={col.id}
                className="bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder p-6 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold mb-2">
                    <span>{col.volumeNumber}</span>
                    <span className="text-luga-muted">{count} GARMENTS</span>
                  </div>

                  <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
                    {col.title}
                  </h3>

                  <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                {/* Preview Frame with Active Video/Image Status Badge */}
                <div className="relative aspect-[16/9] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/50 overflow-hidden group">
                  <ManagedImage
                    src={col.coverImageUrl || (col.coverSlotKey ? getMediaSlot(col.coverSlotKey)?.imageUrl : undefined)}
                    slotKey={col.coverSlotKey}
                    slotName={`COLLECTION_${col.id}`}
                    aspectRatio="16:9"
                    resolution="1600×900px"
                    alt={col.title}
                    showInfo={false}
                    className="w-full h-full border-none"
                  />

                  {/* Active Media Status Badges */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 pointer-events-none">
                    {resolvedMedia ? (
                      <div className="px-2 py-0.5 bg-black/85 backdrop-blur-sm border border-white/20 text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        {videoInfo.isVideo ? (
                          <>
                            <VideoIcon className="w-3 h-3 text-amber-400" />
                            <span>VIDEO ({videoInfo.providerLabel.toUpperCase()})</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3 text-emerald-400" />
                            <span>IMAGE ACTIVE</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-amber-600/90 text-white font-mono text-[9px] uppercase tracking-wider shadow-sm">
                        WIREFRAME
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-luga-border dark:border-luga-darkBorder flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-luga-muted">SLUG: /{col.slug}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(col)}
                      className="p-1.5 border border-luga-border hover:border-luga-ink text-luga-ink dark:text-luga-darkInk transition-colors"
                      title="Edit Volume"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete volume "${col.title}"?`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="p-1.5 border border-luga-border hover:border-red-500 hover:text-red-500 text-luga-muted transition-colors"
                      title="Delete Volume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-luga-bg dark:bg-[#121212] border border-luga-border dark:border-luga-darkBorder max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative my-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-luga-muted hover:text-luga-ink"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-editorial text-2xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mb-6 flex items-center gap-2">
                <span>{editingCollection ? "EDIT VOLUME" : "CREATE NEW VOLUME"}</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">VOLUME TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volume III: Mustang Monolith"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">VOLUME NUMBER TAG</label>
                    <input
                      type="text"
                      placeholder="e.g. VOLUME III"
                      value={volumeNumber}
                      onChange={(e) => setVolumeNumber(e.target.value)}
                      className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">URL SLUG</label>
                    <input
                      type="text"
                      placeholder="e.g. volume-3-mustang"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">EDITORIAL NARRATIVE</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the concept and inspiration behind this volume..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                {/* Cover Media (Video or Photo) */}
                <div className="space-y-3 pt-3 border-t border-luga-border">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-luga-muted uppercase font-bold tracking-wider">
                      VOLUME COVER MEDIA (VIDEO OR PHOTO)
                    </label>
                    {modalVideoInfo.isVideo ? (
                      <span className="text-amber-500 text-[10px] flex items-center gap-1">
                        <VideoIcon className="w-3 h-3" />
                        <span>VIDEO DETECTED ({modalVideoInfo.providerLabel.toUpperCase()})</span>
                      </span>
                    ) : modalMediaSrc ? (
                      <span className="text-emerald-500 text-[10px] flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>IMAGE DETECTED</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Live Interactive Preview Frame */}
                  {modalMediaSrc && (
                    <div className="relative aspect-video w-full bg-black border border-luga-border overflow-hidden">
                      <ManagedImage
                        src={modalMediaSrc}
                        slotKey={coverSlotKey}
                        aspectRatio="16:9"
                        alt="Volume Cover Preview"
                        className="w-full h-full border-none"
                      />
                    </div>
                  )}

                  {/* Upload Local Video/Photo or Paste URL */}
                  <div className="flex gap-2">
                    <label className="cursor-pointer py-2 px-3 border border-luga-border hover:border-luga-ink text-[10px] uppercase flex items-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "UPLOADING..." : "UPLOAD FILE"}</span>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Paste YouTube, Vimeo, MP4, WebM, or Uploadcare URL..."
                      value={coverImageUrl || ""}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                    />
                    {coverImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl(null)}
                        className="px-2.5 py-1 border border-luga-border text-luga-muted hover:text-luga-ink text-[10px] uppercase"
                        title="Clear URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <span className="text-[9.5px] text-luga-muted block">
                    Supports direct MP4/WebM videos, YouTube (watch, shorts, embed), Vimeo, and photos.
                  </span>

                  {/* Optional: Link to Global Site Media Slot */}
                  <div className="pt-2 border-t border-luga-border/50">
                    <label className="text-[9.5px] text-luga-muted uppercase block mb-1">
                      OR LINK TO AN EXISTING SITE MEDIA SLOT (OPTIONAL)
                    </label>
                    <select
                      value={coverSlotKey}
                      onChange={(e) => setCoverSlotKey(e.target.value)}
                      className="w-full bg-transparent border border-luga-border p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    >
                      <option value="" className="bg-luga-bg dark:bg-[#121212]">
                        -- None (Use Custom Upload / URL Above) --
                      </option>
                      {Object.values(mediaSlots).map((slot) => (
                        <option
                          key={slot.slotKey}
                          value={slot.slotKey}
                          className="bg-luga-bg dark:bg-[#121212]"
                        >
                          {slot.slotKey} - {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-luga-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 border border-luga-border uppercase text-center hover:border-luga-ink transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra text-center flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <Compass className="w-3.5 h-3.5 animate-spin-slow text-luga-crimson dark:text-luga-gold" />
                        <span>SYNCING TO DATABASE...</span>
                      </>
                    ) : (
                      <span>SAVE VOLUME</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
