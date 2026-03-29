import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { supportService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { X } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    message: string;
    status: string;
    reply: string | null;
    createdAt: string;
    user: { full_name: string; email: string };
}

export const AdminSupport: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyText, setReplyText] = useState('');
    const { showToast } = useToast();

    const fetchTickets = async () => {
        try {
            const data = await supportService.getTickets();
            setTickets(data);
        } catch (error) {
            console.error(error);
            showToast('Failed to load support tickets', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        try {
            await supportService.replyTicket(selectedTicket.id, replyText, 'resolved');
            showToast('Reply sent successfully', 'success');
            fetchTickets();
            setSelectedTicket(null);
        } catch (error) {
            console.error(error);
            showToast('Failed to send reply', 'error');
        }
    };

    if (loading) return <div>Loading tickets...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm h-[600px] flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">Inbox</div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {tickets.map(ticket => (
                            <div 
                                key={ticket.id} 
                                onClick={() => { setSelectedTicket(ticket); setReplyText(ticket.reply || ''); }}
                                className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedTicket?.id === ticket.id ? 'bg-primary-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-slate-900 truncate pr-2">{ticket.subject}</h3>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{ticket.user?.full_name}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                        {tickets.length === 0 && <div className="p-8 text-center text-slate-500">No tickets found.</div>}
                    </div>
                </div>

                <div className="lg:col-span-2 border border-slate-200 rounded-2xl bg-white shadow-sm min-h-[600px] flex flex-col relative overflow-hidden">
                    {selectedTicket ? (
                        <>
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedTicket.subject}</h2>
                                    <p className="text-sm text-slate-500">From: {selectedTicket.user?.full_name} ({selectedTicket.user?.email})</p>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] mb-8 text-sm text-slate-700 whitespace-pre-wrap">
                                    {selectedTicket.message}
                                </div>
                                
                                {selectedTicket.reply && (
                                    <div className="bg-primary-100 text-primary-900 rounded-2xl rounded-tr-none p-4 max-w-[80%] ml-auto text-sm whitespace-pre-wrap">
                                        <div className="font-bold text-xs mb-1 opacity-50 uppercase">Your reply</div>
                                        {selectedTicket.reply}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6 border-t border-slate-100 bg-white">
                                <form onSubmit={handleReply} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Write Reply</label>
                                        <textarea
                                            rows={3}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 resize-none text-sm"
                                            placeholder="Type your response here..."
                                        />
                                    </div>
                                    <Button type="submit" disabled={!replyText.trim() || selectedTicket.status === 'resolved'} className="rounded-xl px-8 h-[74px]">
                                        Send Reply
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4 p-8 text-center">
                            <span className="text-6xl text-slate-200">📬</span>
                            <p>Select a support ticket from the inbox to view details and reply.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
