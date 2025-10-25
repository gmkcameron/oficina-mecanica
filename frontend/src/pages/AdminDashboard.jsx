import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import {
  getPieces,
  createPiece,
  updatePiece,
  deletePiece,
} from '../api/pieceApi';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from '../api/clientApi';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../api/orderApi';
import './AdminDashboard.css';

const defaultPiece = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  description: '',
};

const defaultClient = {
  name: '',
  email: '',
  phone: '',
};

const defaultOrder = {
  client: '',
  pieces: [],
  description: '',
  status: 'aberta',
};

const AdminDashboard = () => {
  const { signOut } = useAuth();

  const [pieces, setPieces] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeTab, setActiveTab] = useState('pieces');

  const [pieceForm, setPieceForm] = useState(defaultPiece);
  const [editingPieceId, setEditingPieceId] = useState(null);

  const [clientForm, setClientForm] = useState(defaultClient);
  const [editingClientId, setEditingClientId] = useState(null);

  const [orderForm, setOrderForm] = useState(defaultOrder);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [piecesResponse, clientsResponse, ordersResponse] = await Promise.all([
        getPieces(),
        getClients(),
        getOrders(),
      ]);

      setPieces(piecesResponse.data);
      setClients(clientsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      setErrorMessage('Não foi possível carregar os dados iniciais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handlePieceSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingPieceId) {
        await updatePiece(editingPieceId, {
          ...pieceForm,
          price: Number(pieceForm.price),
          quantity: Number(pieceForm.quantity),
        });
      } else {
        await createPiece({
          ...pieceForm,
          price: Number(pieceForm.price),
          quantity: Number(pieceForm.quantity),
        });
      }
      await loadAllData();
      setPieceForm(defaultPiece);
      setEditingPieceId(null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao salvar peça.';
      setErrorMessage(message);
    }
  };

  const handlePieceEdit = (piece) => {
    setPieceForm({
      name: piece.name,
      category: piece.category,
      price: piece.price,
      quantity: piece.quantity,
      description: piece.description || '',
    });
    setEditingPieceId(piece._id);
  };

  const handlePieceDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover esta peça?')) return;
    try {
      await deletePiece(id);
      await loadAllData();
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao remover peça.';
      setErrorMessage(message);
    }
  };

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingClientId) {
        await updateClient(editingClientId, clientForm);
      } else {
        await createClient(clientForm);
      }
      await loadAllData();
      setClientForm(defaultClient);
      setEditingClientId(null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao salvar cliente.';
      setErrorMessage(message);
    }
  };

  const handleClientEdit = (client) => {
    setClientForm({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
    });
    setEditingClientId(client._id);
  };

  const handleClientDelete = async (id) => {
    if (!window.confirm('Deseja remover este cliente?')) return;
    try {
      await deleteClient(id);
      await loadAllData();
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao remover cliente.';
      setErrorMessage(message);
    }
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...orderForm,
      pieces: orderForm.pieces.map((item) => ({
        piece: item.piece,
        quantity: Number(item.quantity),
      })),
    };

    try {
      if (editingOrderId) {
        await updateOrder(editingOrderId, payload);
      } else {
        await createOrder(payload);
      }
      await loadAllData();
      setOrderForm(defaultOrder);
      setEditingOrderId(null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao salvar ordem.';
      setErrorMessage(message);
    }
  };

  const handleOrderEdit = (order) => {
    setOrderForm({
      client: order.client?._id || '',
      pieces: order.pieces.map((item) => ({
        piece: item.piece?._id || '',
        quantity: item.quantity,
      })),
      description: order.description || '',
      status: order.status,
    });
    setEditingOrderId(order._id);
  };

  const handleOrderDelete = async (id) => {
    if (!window.confirm('Deseja remover esta ordem?')) return;
    try {
      await deleteOrder(id);
      await loadAllData();
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao remover ordem.';
      setErrorMessage(message);
    }
  };

  const addOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      pieces: [...prev.pieces, { piece: '', quantity: 1 }],
    }));
  };

  const updateOrderItem = (index, field, value) => {
    setOrderForm((prev) => ({
      ...prev,
      pieces: prev.pieces.map((item, idx) => {
        if (idx === index) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const removeOrderItem = (index) => {
    setOrderForm((prev) => ({
      ...prev,
      pieces: prev.pieces.filter((_, idx) => idx !== index),
    }));
  };

  const orderStatusLabels = useMemo(
    () => ({
      aberta: 'Aberta',
      em_andamento: 'Em andamento',
      concluida: 'Concluída',
    }),
    []
  );

  return (
    <div className="dashboard">
      <Navbar title="Painel Administrativo" onLogout={signOut} />

      <main className="dashboard__content">
        <div className="tabs">
          <button
            type="button"
            className={activeTab === 'pieces' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('pieces')}
          >
            Peças
          </button>
          <button
            type="button"
            className={activeTab === 'clients' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('clients')}
          >
            Clientes
          </button>
          <button
            type="button"
            className={activeTab === 'orders' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('orders')}
          >
            Ordens de Serviço
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : (
          <>
            {activeTab === 'pieces' && (
              <section>
                <h2 className="page-title">Peças</h2>

                <div className="card">
                  <h3>{editingPieceId ? 'Editar peça' : 'Cadastrar nova peça'}</h3>
                  <form className="form-grid two-columns" onSubmit={handlePieceSubmit}>
                    <div className="input-field">
                      <label htmlFor="piece-name">Nome</label>
                      <input
                        id="piece-name"
                        value={pieceForm.name}
                        onChange={(event) => setPieceForm({ ...pieceForm, name: event.target.value })}
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="piece-category">Categoria</label>
                      <input
                        id="piece-category"
                        value={pieceForm.category}
                        onChange={(event) =>
                          setPieceForm({ ...pieceForm, category: event.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="piece-price">Preço</label>
                      <input
                        id="piece-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={pieceForm.price}
                        onChange={(event) => setPieceForm({ ...pieceForm, price: event.target.value })}
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="piece-quantity">Quantidade</label>
                      <input
                        id="piece-quantity"
                        type="number"
                        min="0"
                        value={pieceForm.quantity}
                        onChange={(event) =>
                          setPieceForm({ ...pieceForm, quantity: event.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="input-field" style={{ gridColumn: 'span 2' }}>
                      <label htmlFor="piece-description">Descrição</label>
                      <textarea
                        id="piece-description"
                        rows="3"
                        value={pieceForm.description}
                        onChange={(event) =>
                          setPieceForm({ ...pieceForm, description: event.target.value })
                        }
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="button">
                        {editingPieceId ? 'Atualizar peça' : 'Cadastrar peça'}
                      </button>
                      {editingPieceId && (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => setPieceForm(defaultPiece)}
                        >
                          Cancelar edição
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="card">
                  <h3>Peças cadastradas</h3>
                  {pieces.length === 0 ? (
                    <div className="empty-state">Nenhuma peça cadastrada.</div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Categoria</th>
                          <th>Preço</th>
                          <th>Quantidade</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pieces.map((piece) => (
                          <tr key={piece._id}>
                            <td>{piece.name}</td>
                            <td>{piece.category}</td>
                            <td>R$ {Number(piece.price).toFixed(2)}</td>
                            <td>{piece.quantity}</td>
                            <td className="actions">
                              <button
                                type="button"
                                className="button secondary"
                                onClick={() => handlePieceEdit(piece)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="button danger"
                                onClick={() => handlePieceDelete(piece._id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'clients' && (
              <section>
                <h2 className="page-title">Clientes</h2>
                <div className="card">
                  <h3>{editingClientId ? 'Editar cliente' : 'Cadastrar novo cliente'}</h3>
                  <form className="form-grid two-columns" onSubmit={handleClientSubmit}>
                    <div className="input-field">
                      <label htmlFor="client-name">Nome</label>
                      <input
                        id="client-name"
                        value={clientForm.name}
                        onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })}
                        required
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="client-email">E-mail</label>
                      <input
                        id="client-email"
                        type="email"
                        value={clientForm.email}
                        onChange={(event) => setClientForm({ ...clientForm, email: event.target.value })}
                      />
                    </div>
                    <div className="input-field">
                      <label htmlFor="client-phone">Telefone</label>
                      <input
                        id="client-phone"
                        value={clientForm.phone}
                        onChange={(event) => setClientForm({ ...clientForm, phone: event.target.value })}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="button">
                        {editingClientId ? 'Atualizar cliente' : 'Cadastrar cliente'}
                      </button>
                      {editingClientId && (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => setClientForm(defaultClient)}
                        >
                          Cancelar edição
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="card">
                  <h3>Clientes cadastrados</h3>
                  {clients.length === 0 ? (
                    <div className="empty-state">Nenhum cliente cadastrado.</div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>E-mail</th>
                          <th>Telefone</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client._id}>
                            <td>{client.name}</td>
                            <td>{client.email || '-'}</td>
                            <td>{client.phone || '-'}</td>
                            <td className="actions">
                              <button
                                type="button"
                                className="button secondary"
                                onClick={() => handleClientEdit(client)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="button danger"
                                onClick={() => handleClientDelete(client._id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'orders' && (
              <section>
                <h2 className="page-title">Ordens de Serviço</h2>
                <div className="card">
                  <h3>{editingOrderId ? 'Editar ordem' : 'Cadastrar nova ordem'}</h3>
                  <form className="form-grid" onSubmit={handleOrderSubmit}>
                    <div className="input-field">
                      <label htmlFor="order-client">Cliente</label>
                      <select
                        id="order-client"
                        value={orderForm.client}
                        onChange={(event) =>
                          setOrderForm({ ...orderForm, client: event.target.value })
                        }
                        required
                      >
                        <option value="">Selecione um cliente</option>
                        {clients.map((client) => (
                          <option key={client._id} value={client._id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="order-items">
                      <div className="order-items__header">
                        <span>Peças utilizadas</span>
                        <button
                          type="button"
                          className="button secondary"
                          onClick={addOrderItem}
                        >
                          Adicionar peça
                        </button>
                      </div>

                      {orderForm.pieces.length === 0 ? (
                        <div className="empty-state">Nenhuma peça adicionada.</div>
                      ) : (
                        orderForm.pieces.map((item, index) => (
                          <div key={`order-item-${index}`} className="order-item-row">
                            <select
                              value={item.piece}
                              onChange={(event) => updateOrderItem(index, 'piece', event.target.value)}
                              required
                            >
                              <option value="">Selecione uma peça</option>
                              {pieces.map((piece) => (
                                <option key={piece._id} value={piece._id}>
                                  {piece.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) => updateOrderItem(index, 'quantity', event.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="button danger"
                              onClick={() => removeOrderItem(index)}
                            >
                              Remover
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="input-field">
                      <label htmlFor="order-description">Descrição</label>
                      <textarea
                        id="order-description"
                        rows="4"
                        value={orderForm.description}
                        onChange={(event) =>
                          setOrderForm({ ...orderForm, description: event.target.value })
                        }
                      />
                    </div>

                    <div className="input-field">
                      <label htmlFor="order-status">Status</label>
                      <select
                        id="order-status"
                        value={orderForm.status}
                        onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value })}
                      >
                        {Object.entries(orderStatusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="button">
                        {editingOrderId ? 'Atualizar ordem' : 'Cadastrar ordem'}
                      </button>
                      {editingOrderId && (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => setOrderForm(defaultOrder)}
                        >
                          Cancelar edição
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="card">
                  <h3>Ordens registradas</h3>
                  {orders.length === 0 ? (
                    <div className="empty-state">Nenhuma ordem registrada.</div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Peças</th>
                          <th>Status</th>
                          <th>Descrição</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>{order.client?.name || 'Cliente removido'}</td>
                            <td>
                              <ul className="order-pieces-list">
                                {order.pieces.map((item, index) => (
                                  <li key={`${order._id}-piece-${index}`}>
                                    {item.piece?.name || 'Peça removida'} (x{item.quantity})
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <span className={`badge ${order.status}`}>{orderStatusLabels[order.status]}</span>
                            </td>
                            <td>{order.description || '-'}</td>
                            <td className="actions">
                              <button
                                type="button"
                                className="button secondary"
                                onClick={() => handleOrderEdit(order)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="button danger"
                                onClick={() => handleOrderDelete(order._id)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
