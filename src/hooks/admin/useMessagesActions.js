import { supabase } from '../../lib/supabaseClient'

export function useMessagesActions({ messages, setMessages, pushToast, setConfirm }) {
  const setRead = async (id, is_read) => {
    const { error } = await supabase.from('messages').update({ is_read }).eq('id', id)
    if (!error) setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, is_read } : m)))
  }

  const markAllRead = async () => {
    const ids = messages.filter((m) => !m.is_read).map((m) => m.id)
    if (!ids.length) {
      pushToast('Inbox is already clear.')
      return
    }
    const { error } = await supabase.from('messages').update({ is_read: true }).in('id', ids)
    if (error) pushToast(error.message, 'error')
    else {
      setMessages((ms) => ms.map((m) => ({ ...m, is_read: true })))
      pushToast(`${ids.length} message(s) marked read.`, 'success')
    }
  }

  const deleteRead = () => {
    const ids = messages.filter((m) => m.is_read).map((m) => m.id)
    if (!ids.length) {
      pushToast('No read messages to delete.')
      return
    }
    setConfirm({
      title: `Delete ${ids.length} read message(s)?`,
      message: 'This cannot be undone.',
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('messages').delete().in('id', ids)
        if (error) pushToast(error.message, 'error')
        else {
          setMessages((ms) => ms.filter((m) => !m.is_read))
          pushToast('Read messages deleted.', 'success')
        }
      },
    })
  }

  const askDeleteMessage = (id) =>
    setConfirm({
      title: 'Delete message?',
      message: 'The sender copy stays in email; this removes the inbox row.',
      onConfirm: async () => {
        setConfirm(null)
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (!error) setMessages((ms) => ms.filter((m) => m.id !== id))
      },
    })

  return { setRead, markAllRead, deleteRead, askDeleteMessage }
}
