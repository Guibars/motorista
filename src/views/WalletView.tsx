import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, QrCode, Plus } from 'lucide-react';

export function WalletView() {
  const [balance, setBalance] = useState<number>(125.50);
  const [transactions, setTransactions] = useState<any[]>([
    { id: '1', type: 'charge', amount: -32.50, date: new Date().toISOString(), title: 'Recarga - Eletroposto Paulista' },
    { id: '2', type: 'deposit', amount: 100.00, date: new Date(Date.now() - 86400000).toISOString(), title: 'Adição de Saldo (Cartão)' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = () => {
    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) return;
    setIsProcessing(true);
    
    // Simulate Stripe API call
    setTimeout(() => {
      const amount = Number(addAmount);
      setBalance(prev => prev + amount);
      setTransactions([{
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        date: new Date().toISOString(),
        title: 'Adição de Saldo (Cartão/Stripe)'
      }, ...transactions]);
      
      setIsProcessing(false);
      setShowAddModal(false);
      setAddAmount('');
    }, 2000);
  };

  return (
    <div className="pt-[5.5rem] px-4 pb-28 h-full overflow-y-auto relative z-10 no-scrollbar">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e7e7e7] to-[#b0b0b0] mb-8 tracking-tight drop-shadow-md">Carteira</h2>

      <div className="liquid-glass rounded-[2rem] p-8 mb-8 text-[#e7e7e7] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#0D518E]/30 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FAB515]/20 blur-2xl rounded-full -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <p className="text-[#b0b0b0] text-sm font-bold uppercase tracking-widest mb-2">Saldo Disponível</p>
          <h2 className="text-5xl font-extrabold mb-8 tracking-tighter drop-shadow-md">R$ {balance.toFixed(2).replace('.', ',')}</h2>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all py-4 rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-[0_8px_24px_rgba(13,81,142,0.4)] hover:scale-[1.02]"
            >
              <Plus size={20} className="text-[#FAB515]" />
              <span>Adicionar Saldo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#e7e7e7]">Histórico</h3>
        <button className="text-[#FAB515] text-sm font-bold flex items-center hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          Ver tudo
        </button>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-[#b0b0b0] text-sm text-center py-8 bg-white/5 rounded-2xl border border-white/10">Nenhuma transação encontrada.</p>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="liquid-glass rounded-2xl p-5 flex items-center justify-between liquid-glass-hover">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner border ${tx.type === 'deposit' ? 'bg-[#0D518E]/20 text-[#FAB515] border-[#0D518E]/30' : 'bg-white/5 text-[#b0b0b0] border-white/10'}`}>
                  {tx.type === 'deposit' ? <ArrowDownLeft size={24} /> : <ZapIcon />}
                </div>
                <div>
                  <p className="font-bold text-[#e7e7e7]">{tx.title}</p>
                  <p className="text-xs text-[#b0b0b0] mt-1 font-medium">{new Date(tx.date).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <span className={`font-extrabold text-lg ${tx.type === 'deposit' ? 'text-[#FAB515] drop-shadow-[0_0_8px_rgba(250,181,21,0.5)]' : 'text-[#e7e7e7]'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Add Balance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in">
          <div className="liquid-glass border border-white/20 rounded-[2rem] p-8 w-full max-w-sm shadow-[0_16px_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
            <h3 className="text-2xl font-extrabold text-[#e7e7e7] mb-2">Adicionar Saldo</h3>
            <p className="text-[#b0b0b0] text-sm mb-8 leading-relaxed">Insira o valor que deseja adicionar à sua carteira via Stripe.</p>
            
            <div className="mb-8">
              <label className="block text-xs font-bold text-[#b0b0b0] mb-2 uppercase tracking-widest">Valor (R$)</label>
              <input 
                type="number" 
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="50.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-bold text-[#e7e7e7] focus:outline-none focus:border-[#FAB515] focus:bg-white/10 transition-all backdrop-blur-md text-center"
              />
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-[#b0b0b0] bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                onClick={handleStripePayment}
                disabled={isProcessing || !addAmount}
                className="flex-1 bg-gradient-to-r from-[#0D518E] to-[#0b4275] text-[#e7e7e7] py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(13,81,142,0.6)] transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_8px_24px_rgba(13,81,142,0.4)]"
              >
                {isProcessing ? 'Processando...' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ZapIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
}
