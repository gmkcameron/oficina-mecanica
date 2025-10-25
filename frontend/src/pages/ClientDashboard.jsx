import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../api/orderApi';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statusLabels = useMemo(
    () => ({
      aberta: 'Aberta',
      em_andamento: 'Em andamento',
      concluida: 'Concluída',
    }),
    []
  );

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders();
        setOrders(response.data);
      } catch (error) {
        setErrorMessage('Não foi possível carregar as ordens.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let data = orders;

    if (user?.role === 'client') {
      data = data.filter((order) => order.client?._id === user.id);
    }

    if (statusFilter !== 'todos') {
      data = data.filter((order) => order.status === statusFilter);
    }

    return data;
  }, [orders, user, statusFilter]);

  return (
    <div className="client-dashboard">
      <Navbar title="Minhas Ordens de Serviço" onLogout={signOut} />
      <main className="client-dashboard__content">
        <header className="client-dashboard__header">
          <div>
            <h2 className="page-title">Bem-vindo, {user?.name}</h2>
            <p className="subtitle">Acompanhe o status das suas ordens de serviço.</p>
          </div>

          <div className="filters">
            <label htmlFor="status-filter">Filtrar por status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="todos">Todos</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {loading ? (
          <div className="loading-state">Carregando ordens...</div>
        ) : (
          <section className="orders-grid">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">Nenhuma ordem encontrada.</div>
            ) : (
              filteredOrders.map((order) => {
                return (
                  <article key={order._id} className="card order-card">
                    <header className="order-card__header">
                      <h3>Ordem #{order._id.slice(-6)}</h3>
                      <span className={`badge ${order.status}`}>
                        {statusLabels[order.status]}
                      </span>
                    </header>

                    <div className="order-card__body">
                      <div className="order-section">
                        <h4>Peças utilizadas</h4>
                        <ul>
                          {order.pieces.map((item, index) => (
                            <li key={`${order._id}-item-${index}`}>
                              {item.piece?.name || 'Peça removida'} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="order-section">
                        <h4>Descrição</h4>
                        <p>{order.description || 'Sem descrição adicional.'}</p>
                      </div>

                      <div className="order-section">
                        <h4>Cliente</h4>
                        <p>{order.client?.name || 'Cliente removido'}</p>
                      </div>
                    </div>

                    <footer className="order-card__footer">
                      <small>
                        Criada em:{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('pt-BR')
                          : '-'}
                      </small>
                      <small>
                        Atualizada em:{' '}
                        {order.updatedAt
                          ? new Date(order.updatedAt).toLocaleDateString('pt-BR')
                          : '-'}
                      </small>
                    </footer>
                  </article>
                );
              })
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;
