import React, { useState } from 'react';
import {
  X,
  Package,
  ShoppingBag,
  Scissors,
  Building2,
  Settings as SettingsIcon,
  BarChart3,
  Search,
  Plus,
  Edit2,
  Trash2,
  Printer,
  FileSpreadsheet,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, CustomOrderQuote, WholesaleRequest, UniformCategory } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onViewOrderReceipt,
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    customQuotes,
    updateCustomQuoteStatus,
    wholesaleRequests,
    updateWholesaleStatus,
    settings,
    updateSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'custom' | 'wholesale' | 'reports' | 'settings'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product editing modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [backendApps, setBackendApps] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/institutional-applications')
        .then(r => r.json())
        .then(d => {
          if (d.success && Array.isArray(d.applications)) {
            setBackendApps(d.applications);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate volume reports
  const totalGarmentsBooked = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const inProductionCount = orders.filter(
    ord => ord.status === 'In Production' || ord.status === 'Quality Check'
  ).length;
  const pendingOrdersCount = orders.filter(ord => ord.status === 'Pending').length;
  const readyOrDispatchedCount = orders.filter(
    ord => ord.status === 'Ready for Dispatch' || ord.status === 'Dispatched'
  ).length;

  const exportOrdersCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Total Garments', 'Status'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.date,
      `"${o.customerName}"`,
      o.phone,
      o.city,
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zain_uniforms_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'In Production',
    'Quality Check',
    'Ready for Dispatch',
    'Dispatched',
    'Delivered',
    'Cancelled',
    'On Hold',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-6xl w-full h-[95vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Top Navbar of Admin */}
        <div className="px-6 py-3.5 bg-[#0F1E36] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#C5A869] text-[#0F1E36] font-bold flex items-center justify-center text-xs">
              ZU
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Zain Uniforms — Operations Portal</h2>
              <span className="text-[10px] text-slate-400">Factory, Stitching & Order Management</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Products', icon: Package, count: products.length },
            { id: 'custom', label: 'Custom Quotes', icon: Scissors, count: customQuotes.length },
            { id: 'wholesale', label: 'Wholesale B2B', icon: Building2, count: wholesaleRequests.length },
            { id: 'reports', label: 'Workshop Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#0F1E36] text-[#0F1E36] bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-[#C5A869]" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search Order # or Phone..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
                  >
                    <option value="all">All Statuses</option>
                    {allStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={exportOrdersCSV}
                  className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5">Order # / Date</th>
                      <th className="py-3 px-3.5">Customer & City</th>
                      <th className="py-3 px-3.5">Items Summary</th>
                      <th className="py-3 px-3.5">Total Units</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => {
                        const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-3.5">
                              <span className="font-mono font-bold text-[#0F1E36] block">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{order.date}</span>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="font-semibold text-slate-900 block">{order.customerName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{order.phone} ({order.city})</span>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="text-[11px] text-slate-600">
                                {order.items.length} item line(s) (
                                {order.items.map(i => `${i.product.name.slice(0, 14)}..`).join(', ')}
                                )
                              </span>
                            </td>
                            <td className="py-3 px-3.5 font-mono font-bold text-slate-800">
                              {totalUnits} pieces
                            </td>
                            <td className="py-3 px-3.5">
                              <select
                                value={order.status}
                                onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="px-2 py-1 rounded text-[11px] font-bold border border-slate-300 bg-white"
                              >
                                {allStatuses.map(st => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-3.5 text-right">
                              <button
                                onClick={() => onViewOrderReceipt(order)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 inline-flex items-center gap-1 cursor-pointer"
                                title="Print / View Receipt"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Slip</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-[#0F1E36]">
                  Catalog Uniforms ({products.length})
                </span>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="px-4 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C5A869]" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">{prod.sku}</span>
                        <h4 className="text-xs font-bold text-[#0F1E36] line-clamp-1">{prod.name}</h4>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Category: <span className="font-semibold text-slate-700">{prod.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-2">
                      <div className="flex justify-between">
                        <span>Stock Units:</span>
                        <span className="font-mono font-semibold text-slate-700">{prod.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Wholesale MOQ:</span>
                        <span className="font-mono text-slate-700">{prod.minWholesaleQty} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Made to Order:</span>
                        <span className="text-slate-700">{prod.isMadeToOrder ? 'Yes' : 'Ready Stock'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product ${prod.name}?`)) deleteProduct(prod.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM ORDERS */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-[#0F1E36]">
                  Custom Stitching & Bespoke Quotation Requests ({customQuotes.length})
                </span>
              </div>

              <div className="space-y-3">
                {customQuotes.map(quote => (
                  <div
                    key={quote.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold font-mono text-[#0F1E36]">
                          {quote.quoteNumber}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {quote.date} · {quote.customerName} ({quote.phone})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={quote.status}
                          onChange={e => updateCustomQuoteStatus(quote.id, e.target.value as any)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-semibold"
                        >
                          <option value="Received">Received</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Approved">Approved</option>
                          <option value="In Production">In Production</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Garment & Quantity:</span>
                        <span className="font-semibold text-slate-800">
                          {quote.uniformType} ({quote.gender}) · Qty: {quote.quantity}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">School: {quote.schoolName || 'Individual'}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Fabric & Colour:</span>
                        <span className="font-semibold text-slate-800">{quote.fabric}</span>
                        <p className="text-[11px] text-slate-500 mt-1">Color: {quote.color}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Master Tailor Notes:</span>
                        <input
                          type="text"
                          placeholder="e.g. Approved pattern cut"
                          defaultValue={quote.adminNotes || ''}
                          onBlur={e => updateCustomQuoteStatus(quote.id, quote.status, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Measurements Display if present */}
                    {quote.measurements && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                        <span className="font-bold text-[#0F1E36] block mb-1">
                          Bespoke Measurements ({quote.measurements.unit}):
                        </span>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono text-[11px] text-slate-700">
                          <div>Chest: {quote.measurements.chest || '-'}</div>
                          <div>Shoulder: {quote.measurements.shoulder || '-'}</div>
                          <div>Length: {quote.measurements.shirtLength || '-'}</div>
                          <div>Sleeve: {quote.measurements.sleeveLength || '-'}</div>
                          <div>Waist: {quote.measurements.waist || '-'}</div>
                          <div>Trouser: {quote.measurements.trouserLength || '-'}</div>
                          <div>Hip: {quote.measurements.hip || '-'}</div>
                          <div>Collar: {quote.measurements.collar || '-'}</div>
                        </div>
                        {quote.specialInstructions && (
                          <p className="text-[11px] text-amber-900 mt-2 font-sans">
                            <strong>Note: </strong> {quote.specialInstructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WHOLESALE B2B */}
          {activeTab === 'wholesale' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F1E36]">
                    Institutional Supply Applications & Leads ({backendApps.length + wholesaleRequests.length})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Connected with Google Sheets worksheet "Institutional Applications"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Google Sheets Backend Active
                  </span>
                </div>
              </div>

              {/* Backend Applications from Google Sheets pipeline */}
              {backendApps.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A869]">
                    Website Form Submissions ({backendApps.length})
                  </div>
                  {backendApps.map((app, idx) => (
                    <div key={app.applicationId || idx} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-[#0F1E36] bg-slate-100 px-2 py-0.5 rounded">
                            {app.applicationId}
                          </span>
                          <span className="text-xs text-slate-600 font-semibold">
                            {app.schoolOrBusinessName}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {app.submissionDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {app.applicationStatus || 'New'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block">Contact & Designation:</span>
                          <span className="font-semibold text-slate-800">
                            {app.contactPersonName} {app.designation ? `(${app.designation})` : ''}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            Phone: {app.phone} · WA: {app.whatsapp || app.phone}
                          </p>
                          {app.email && (
                            <p className="text-[11px] text-slate-500">Email: {app.email}</p>
                          )}
                        </div>

                        <div>
                          <span className="text-slate-400 block">Order Volume & Target:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {app.estimatedQuantity} sets ({app.city})
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Required By: {app.deliveryDeadline}
                          </p>
                          {(app.boysCount || app.girlsCount) && (
                            <p className="text-[11px] text-slate-400">
                              Boys: {app.boysCount || 0} / Girls: {app.girlsCount || 0}
                            </p>
                          )}
                        </div>

                        <div>
                          <span className="text-slate-400 block">Specifications:</span>
                          <span className="text-slate-700 font-medium block">
                            {app.uniformType}
                          </span>
                          {app.fabricPreference && (
                            <p className="text-[11px] text-slate-500">Fabric: {app.fabricPreference}</p>
                          )}
                          {app.colourPalette && (
                            <p className="text-[11px] text-slate-500">Palette: {app.colourPalette}</p>
                          )}
                          {app.referenceFileUrl && (
                            <div className="mt-1">
                              <a
                                href={app.referenceFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-semibold text-[11px]"
                              >
                                View Monogram / Spec File
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {app.embroideryDetails && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                          <strong>Embroidery & Crest Details: </strong> {app.embroideryDetails}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {wholesaleRequests.map(req => (
                  <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold font-mono text-[#0F1E36]">{req.requestNumber}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          {req.date} · {req.schoolOrBusinessName} ({req.city})
                        </span>
                      </div>

                      <select
                        value={req.status}
                        onChange={e => updateWholesaleStatus(req.id, e.target.value as any)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-semibold"
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Sample Dispatched">Sample Dispatched</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Contact Officer:</span>
                        <span className="font-semibold text-slate-800">{req.contactPerson}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Phone: {req.phone} · {req.email}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Volume & Allocation:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {req.estimatedQuantity} sets ({req.boysCount} Boys / {req.girlsCount} Girls)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">Required By: {req.requiredDeliveryDate}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Internal Workshop Note:</span>
                        <input
                          type="text"
                          placeholder="e.g. Swatches dispatched"
                          defaultValue={req.adminNotes || ''}
                          onBlur={e => updateWholesaleStatus(req.id, req.status, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs mt-1"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <strong>Design Specifications: </strong>
                      {req.designDetails || 'Standard institutional cuts with school monogram embroidery.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WORKSHOP ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Total Garments Booked
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1E36] mt-1">
                    {totalGarmentsBooked} pieces
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Active In Production
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#C5A869] mt-1">
                    {inProductionCount} orders
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Pending Verification
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 mt-1">
                    {pendingOrdersCount} orders
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                    Dispatched / Ready
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 mt-1">
                    {readyOrDispatchedCount} orders
                  </div>
                </div>
              </div>

              {/* Inventory Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Core Uniform Inventory & Stock Allocation
                </h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {products.map(p => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{p.name}</span>
                        <span className="text-slate-400 font-mono text-[11px] ml-2">({p.sku})</span>
                      </div>
                      <div className="font-mono text-slate-700">
                        Category: {p.category} · Stock: {p.stock} units · Wholesale MOQ: {p.minWholesaleQty}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0F1E36]">Business Information & Operations Settings</h3>
                <p className="text-xs text-slate-500">Edit business name, contact channels, announcements, and workshop address.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Business Display Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={e => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Customer Service Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      WhatsApp Number (for wa.me links)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcement}
                    onChange={e => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Workshop & Display Center Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      updateSettings(settingsForm);
                      alert('Settings saved successfully!');
                    }}
                    className="px-6 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#C5A869]" />
                    <span>Save Website Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Add / Edit Modal Drawer */}
        {(editingProduct || isAddingProduct) && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-[#0F1E36]">
                  {editingProduct ? 'Edit Product' : 'Add New Uniform Product'}
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingProduct(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Form without any pricing fields */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.target as any;
                  const newP: Partial<Product> = {
                    name: form.pName.value,
                    nameUrdu: form.pNameUrdu.value || form.pName.value,
                    sku: form.pSku.value,
                    category: form.pCat.value,
                    gender: form.pGender.value,
                    stock: parseInt(form.pStock.value) || 50,
                    minWholesaleQty: parseInt(form.pMoq.value) || 30,
                    isMadeToOrder: form.pMadeToOrder.checked,
                    image: editingProduct?.image || '/src/assets/images/product_formal_shirt_1791745342211.jpg',
                    description: form.pDesc.value,
                    descriptionUrdu: form.pDesc.value,
                    fabrics: ['Oxford Cotton', 'Twill Blend'],
                    colors: [{ name: 'Navy', hex: '#0F1E36' }, { name: 'White', hex: '#FFFFFF' }],
                    sizes: ['S', 'M', 'L', 'XL', 'Custom'],
                    stitchingOption: 'Both',
                    productionDays: parseInt(form.pDays.value) || 3,
                    deliveryDaysEstimate: '2-4 days',
                    featured: true,
                  };

                  if (editingProduct) {
                    updateProduct({ ...editingProduct, ...newP } as Product);
                    setEditingProduct(null);
                  } else {
                    addProduct(newP as Omit<Product, 'id'>);
                    setIsAddingProduct(false);
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Name</label>
                  <input
                    name="pName"
                    defaultValue={editingProduct?.name || ''}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">SKU</label>
                    <input
                      name="pSku"
                      defaultValue={editingProduct?.sku || 'ZU-SHT-99'}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      name="pCat"
                      defaultValue={editingProduct?.category || 'School Shirts'}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded"
                    >
                      {['School Shirts', 'Trousers & Pants', 'Skirts & Pinafores', 'Blazers & Sweaters', 'Sports Uniforms', 'Accessories'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input
                      name="pStock"
                      type="number"
                      defaultValue={editingProduct?.stock || 50}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Wholesale MOQ</label>
                    <input
                      name="pMoq"
                      type="number"
                      defaultValue={editingProduct?.minWholesaleQty || 30}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prod. Days</label>
                    <input
                      name="pDays"
                      type="number"
                      defaultValue={editingProduct?.productionDays || 3}
                      required
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
                    <select name="pGender" defaultValue={editingProduct?.gender || 'Boys'} className="w-full px-3 py-1.5 border border-slate-300 rounded">
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="pMadeToOrder"
                        defaultChecked={editingProduct?.isMadeToOrder}
                      />
                      <span>Made-to-Order</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    name="pDesc"
                    rows={2}
                    defaultValue={editingProduct?.description || ''}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Urdu Name (optional)</label>
                  <input
                    name="pNameUrdu"
                    defaultValue={editingProduct?.nameUrdu || ''}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(false);
                    }}
                    className="px-4 py-2 border rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F1E36] text-white rounded text-xs font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
