import { useState } from 'react'
import { useItems, type Item } from '@/hooks/useItems'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Pencil, Check, X } from 'lucide-react'

export default function ItemsDemo() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useItems()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    await addItem(t, body.trim() || undefined)
    setTitle('')
    setBody('')
  }

  const startEdit = (item: Item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditBody(item.body ?? '')
  }

  const saveEdit = async () => {
    if (!editingId) return
    await updateItem(editingId, { title: editTitle.trim(), body: editBody.trim() || null })
    setEditingId(null)
  }

  return (
    <section id="shared-items" className="max-w-2xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notas compartidas (Supabase realtime)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onAdd} className="space-y-2">
            <Input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Mensaje (opcional)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={!title.trim()}>
              Añadir
            </Button>
          </form>

          {error && (
            <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
              <p className="font-semibold">Error de Supabase:</p>
              <p className="font-mono text-xs mt-1 break-all">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay notas. Añadí la primera ✨</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <CardContent className="pt-6">
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <Textarea
                        rows={3}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4 mr-1" /> Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        {item.body && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.body}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(item)} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteItem(item.id)}
                          aria-label="Borrar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
