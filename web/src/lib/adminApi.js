import { supabase, PHOTO_BUCKET } from './supabase'

/* ---------- Konten (site_content) ---------- */
export async function loadContentRow(key) {
  const { data, error } = await supabase
    .from('site_content').select('value,updated_at,updated_by').eq('key', key).maybeSingle()
  if (error) throw error
  return data // null bila belum pernah disimpan
}
export async function saveContentRow(key, value) {
  const { error } = await supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}
export async function deleteContentRow(key) {
  const { error } = await supabase.from('site_content').delete().eq('key', key)
  if (error) throw error
}
export async function listContentMeta() {
  const { data, error } = await supabase.from('site_content').select('key,updated_at,updated_by')
  if (error) throw error
  return data || []
}

/* ---------- Kritik & Saran ---------- */
export async function listFeedback() {
  const { data, error } = await supabase
    .from('feedback').select('*').order('created_at', { ascending: false }).limit(500)
  if (error) throw error
  return data || []
}
export async function countFeedback() {
  const total = await supabase.from('feedback').select('id', { count: 'exact', head: true })
  const unread = await supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('is_read', false)
  if (total.error) throw total.error
  if (unread.error) throw unread.error
  return { total: total.count || 0, unread: unread.count || 0 }
}
// update/delete yang ditolak RLS tidak error, hanya 0 baris → dianggap gagal
const mustAffect = (data) => {
  if (!data || data.length === 0) throw new Error('Tidak ada yang berubah (akses ditolak atau data sudah tidak ada).')
}
export async function setFeedbackRead(id, isRead) {
  const { data, error } = await supabase.from('feedback').update({ is_read: isRead }).eq('id', id).select('id')
  if (error) throw error
  mustAffect(data)
}
export async function deleteFeedback(id) {
  const { data, error } = await supabase.from('feedback').delete().eq('id', id).select('id')
  if (error) throw error
  mustAffect(data)
}

/* ---------- Foto dokumentasi (Storage) ---------- */
const MAX_INPUT_BYTES = 25 * 1024 * 1024

// Perkecil foto (maks 1600 px, JPEG) supaya cepat dimuat & hemat kuota Supabase gratis
async function compressImage(file, maxSide = 1600, quality = 0.82) {
  let bmp
  try { bmp = await createImageBitmap(file) } catch { throw new Error('Format foto tidak didukung. Gunakan JPG, PNG, atau WebP.') }
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const w = Math.max(1, Math.round(bmp.width * scale))
  const h = Math.max(1, Math.round(bmp.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h)
  ctx.drawImage(bmp, 0, 0, w, h)
  bmp.close?.()
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality))
  if (!blob) throw new Error('Gagal memproses foto.')
  return blob
}

export async function uploadPhoto(file, folder = 'programs') {
  if (!file.type.startsWith('image/')) throw new Error(`"${file.name}" bukan file gambar.`)
  if (file.size > MAX_INPUT_BYTES) throw new Error(`"${file.name}" terlalu besar (maks 25 MB).`)
  const blob = await compressImage(file)
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}
export async function removePhotos(paths) {
  const list = (paths || []).filter(Boolean)
  if (!list.length) return
  await supabase.storage.from(PHOTO_BUCKET).remove(list)
}

export async function markAllFeedbackRead() {
  const { error } = await supabase.from('feedback').update({ is_read: true }).eq('is_read', false)
  if (error) throw error
}
