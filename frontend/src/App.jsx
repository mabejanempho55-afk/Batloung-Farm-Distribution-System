
import { useState } from 'react';
import './App.css';
import Modal from './Modal';

function App() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    const [showModal, setShowModal] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingSupplier, setDeletingSupplier] = useState(null);

    const [fruits, setFruits] = useState([]);
    const [showFruitModal, setShowFruitModal] = useState(false);
    const [editingFruit, setEditingFruit] = useState(null);
    const [showFruitDeleteModal, setShowFruitDeleteModal] = useState(false);
    const [deletingFruit, setDeletingFruit] = useState(null);

    const [vendors, setVendors] = useState([]);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [vendorSearchTerm, setVendorSearchTerm] = useState('');

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseForm, setPurchaseForm] = useState({
        supplier_id: '',
        items: [
            {
                fruit_id: '',
                packaging_size: 'Small',
                quantity: '',
                unit_cost: ''
            }
        ]
    });
    const [lastPurchase, setLastPurchase] = useState(null);

    const [showSaleModal, setShowSaleModal] = useState(false);
    const [saleForm, setSaleForm] = useState({
        vendor_id: '',
        payment_method: 'CASH',
        amount_paid: '0',
        items: [
            {
                fruit_id: '',
                packaging_size: 'Small',
                quantity: ''
            }
        ]
    });
    const [lastSale, setLastSale] = useState(null);
    const [stock, setStock] = useState([]);

    const [topFruits, setTopFruits] = useState([]);
    const [revenueReport, setRevenueReport] = useState(null);
    const [topVendor, setTopVendor] = useState(null);
    const [reportStock, setReportStock] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [form, setForm] = useState({
        business_name: '',
        contact_person: '',
        phone: '',
        province: '',
        address: ''
    });

    const [fruitForm, setFruitForm] = useState({
        fruit_name: '',
        description: '',
        status: 'Available',
        small_selling_price: '',
        medium_selling_price: '',
        large_selling_price: ''
    });

    const [vendorForm, setVendorForm] = useState({
        vendor_name: '',
        phone_number: '',
        location: '',
        registration_date: ''
    });

    const tabs = [
        'Dashboard',
        'Suppliers',
        'Fruits',
        'Vendors',
        'Purchases',
        'Sales',
        'Stock',
        'Reports'
    ];

    const resetForm = () => {
        setForm({
            business_name: '',
            contact_person: '',
            phone: '',
            province: '',
            address: ''
        });
    };

    const resetFruitForm = () => {
        setFruitForm({
            fruit_name: '',
            description: '',
            status: 'Available',
            small_selling_price: '',
            medium_selling_price: '',
            large_selling_price: ''
        });
    };

    const resetVendorForm = () => {
        setVendorForm({
            vendor_name: '',
            phone_number: '',
            location: '',
            registration_date: ''
        });
    };

    const resetPurchaseForm = () => {
        setPurchaseForm({
            supplier_id: '',
            items: [
                {
                    fruit_id: '',
                    packaging_size: 'Small',
                    quantity: '',
                    unit_cost: ''
                }
            ]
        });
    };

    const resetSaleForm = () => {
        setSaleForm({
            vendor_id: '',
            payment_method: 'CASH',
            amount_paid: '0',
            items: [
                {
                    fruit_id: '',
                    packaging_size: 'Small',
                    quantity: ''
                }
            ]
        });
    };

    const handleSaleItemChange = (index, event) => {
        const updatedItems = [...saleForm.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [event.target.name]: event.target.value
        };

        setSaleForm({
            ...saleForm,
            items: updatedItems
        });
    };

    const addSaleItem = () => {
        setSaleForm({
            ...saleForm,
            items: [
                ...saleForm.items,
                {
                    fruit_id: '',
                    packaging_size: 'Small',
                    quantity: ''
                }
            ]
        });
    };

    const removeSaleItem = (index) => {
        if (saleForm.items.length === 1) {
            alert('A sale must contain at least one item.');
            return;
        }

        setSaleForm({
            ...saleForm,
            items: saleForm.items.filter((item, itemIndex) => itemIndex !== index)
        });
    };

    const getSaleUnitPrice = (item) => {
        const fruit = fruits.find(
            (currentFruit) => Number(currentFruit.fruit_id) === Number(item.fruit_id)
        );

        if (!fruit) return 0;

        const priceField = {
            Small: 'small_selling_price',
            Medium: 'medium_selling_price',
            Large: 'large_selling_price'
        }[item.packaging_size];

        return Number(fruit[priceField]) || 0;
    };

    const saleTotal = saleForm.items.reduce((total, item) => {
        return total + (Number(item.quantity) || 0) * getSaleUnitPrice(item);
    }, 0);

    const outstandingBalance = saleTotal - (Number(saleForm.amount_paid) || 0);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleFruitChange = (event) => {
        setFruitForm({
            ...fruitForm,
            [event.target.name]: event.target.value
        });
    };

    const handleVendorChange = (event) => {
        setVendorForm({
            ...vendorForm,
            [event.target.name]: event.target.value
        });
    };

    const handlePurchaseItemChange = (index, event) => {
        const updatedItems = [...purchaseForm.items];

        updatedItems[index] = {
            ...updatedItems[index],
            [event.target.name]: event.target.value
        };

        setPurchaseForm({
            ...purchaseForm,
            items: updatedItems
        });
    };

    const addPurchaseItem = () => {
        setPurchaseForm({
            ...purchaseForm,
            items: [
                ...purchaseForm.items,
                {
                    fruit_id: '',
                    packaging_size: 'Small',
                    quantity: '',
                    unit_cost: ''
                }
            ]
        });
    };

    const removePurchaseItem = (index) => {
        if (purchaseForm.items.length === 1) {
            alert('A purchase must contain at least one item.');
            return;
        }

        setPurchaseForm({
            ...purchaseForm,
            items: purchaseForm.items.filter((item, itemIndex) => itemIndex !== index)
        });
    };

    const purchaseTotal = purchaseForm.items.reduce((total, item) => {
        return total + (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0);
    }, 0);

    const loadSuppliers = async () => {
        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/suppliers');
            const result = await response.json();

            if (response.ok) {
                setSuppliers(result.data);
            } else {
                alert(result.message || 'Could not load suppliers.');
            }
        } catch (error) {
            alert('Could not load suppliers.');
        }
    };

    const addSupplier = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Supplier added successfully!');
            resetForm();
            setShowModal(false);
            loadSuppliers();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);

        setForm({
            business_name: supplier.business_name,
            contact_person: supplier.contact_person,
            phone: supplier.phone,
            province: supplier.province,
            address: supplier.address
        });
    };

    const editSupplier = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/suppliers/${editingSupplier.supplier_id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Supplier updated successfully!');
            setEditingSupplier(null);
            resetForm();
            loadSuppliers();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const deleteSupplier = async () => {
        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/suppliers/${deletingSupplier.supplier_id}`,
                {
                    method: 'DELETE'
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Supplier deleted successfully!');
            setShowDeleteModal(false);
            setDeletingSupplier(null);
            loadSuppliers();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const loadFruits = async () => {
        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/fruits');
            const result = await response.json();

            if (response.ok) {
                setFruits(result.data);
            } else {
                alert(result.message || 'Could not load fruits.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const loadStock = async () => {
        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/fruits/stock');
            const result = await response.json();

            if (response.ok) {
                setStock(result.data);
            } else {
                alert(result.message || 'Could not load stock.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const loadReports = async () => {
        try {
            const [fruitsResponse, vendorResponse, stockResponse] = await Promise.all([
                fetch('https://batloung-farm-backend.onrender.com/api/reports/top-fruits'),
                fetch('https://batloung-farm-backend.onrender.com/api/reports/top-vendor'),
                fetch('https://batloung-farm-backend.onrender.com/api/reports/stock')
            ]);

            const [fruitsResult, vendorResult, stockResult] = await Promise.all([
                fruitsResponse.json(),
                vendorResponse.json(),
                stockResponse.json()
            ]);

            if (!fruitsResponse.ok || !vendorResponse.ok || !stockResponse.ok) {
                alert('Could not load all reports. Please check that the backend server is running.');
                return;
            }

            setTopFruits(Array.isArray(fruitsResult.data) ? fruitsResult.data : []);
            setTopVendor(
                Array.isArray(vendorResult.data)
                    ? vendorResult.data[0] || null
                    : vendorResult.data || null
            );
            setReportStock(Array.isArray(stockResult.data) ? stockResult.data : []);
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const generateRevenueReport = async (event) => {
        event.preventDefault();

        if (!startDate || !endDate) {
            alert('Please select both a start date and an end date.');
            return;
        }

        if (startDate > endDate) {
            alert('The start date cannot be after the end date.');
            return;
        }

        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/reports/revenue?start_date=${startDate}&end_date=${endDate}`
            );
            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Could not generate the revenue report.');
                return;
            }

            setRevenueReport(result);
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const addFruit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/fruits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fruitForm)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Fruit added successfully!');
            resetFruitForm();
            setShowFruitModal(false);
            loadFruits();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const openFruitEditModal = (fruit) => {
        setEditingFruit(fruit);

        setFruitForm({
            fruit_name: fruit.fruit_name,
            description: fruit.description || '',
            status: fruit.status,
            small_selling_price: fruit.small_selling_price,
            medium_selling_price: fruit.medium_selling_price,
            large_selling_price: fruit.large_selling_price
        });
    };

    const editFruit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/fruits/${editingFruit.fruit_id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fruitForm)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Fruit updated successfully!');
            setEditingFruit(null);
            resetFruitForm();
            loadFruits();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const deleteFruit = async () => {
        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/fruits/${deletingFruit.fruit_id}`,
                {
                    method: 'DELETE'
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Fruit deleted successfully!');
            setShowFruitDeleteModal(false);
            setDeletingFruit(null);
            loadFruits();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const loadVendors = async (term = '') => {
        try {
            const url = term.trim()
                ? `https://batloung-farm-backend.onrender.com/api/vendors/search?term=${encodeURIComponent(term)}`
                : 'https://batloung-farm-backend.onrender.com/api/vendors';

            const response = await fetch(url);
            const result = await response.json();

            if (response.ok) {
                setVendors(result.data);
            } else {
                alert(result.message || 'Could not load vendors.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const addVendor = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://batloung-farm-backend.onrender.com/api/vendors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vendorForm)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Vendor registered successfully!');
            resetVendorForm();
            setShowVendorModal(false);
            setVendorSearchTerm('');
            loadVendors();
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const openVendorEditModal = (vendor) => {
        setEditingVendor(vendor);

        setVendorForm({
            vendor_name: vendor.vendor_name,
            phone_number: vendor.phone_number,
            location: vendor.location,
            registration_date: vendor.registration_date
                ? String(vendor.registration_date).slice(0, 10)
                : ''
        });
    };

    const editVendor = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `https://batloung-farm-backend.onrender.com/api/vendors/${editingVendor.vendor_id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(vendorForm)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert('Vendor updated successfully!');
            setEditingVendor(null);
            resetVendorForm();
            loadVendors(vendorSearchTerm);
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const addPurchase = async (event) => {
        event.preventDefault();

        const itemsAreValid = purchaseForm.items.every((item) => {
            return (
                item.fruit_id &&
                Number(item.quantity) > 0 &&
                Number.isInteger(Number(item.quantity)) &&
                item.unit_cost !== '' &&
                Number(item.unit_cost) >= 0
            );
        });

        if (!itemsAreValid) {
            alert('Please complete all purchase item fields correctly.');
            return;
        }

        try {
            const purchaseData = {
                supplier_id: Number(purchaseForm.supplier_id),
                items: purchaseForm.items.map((item) => ({
                    fruit_id: Number(item.fruit_id),
                    packaging_size: item.packaging_size,
                    quantity: Number(item.quantity),
                    unit_cost: Number(item.unit_cost)
                }))
            };

            const response = await fetch('https://batloung-farm-backend.onrender.com/api/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Could not record purchase.');
                return;
            }

            setLastPurchase(result.data);
            alert(
                `Purchase recorded successfully!\nPurchase ID: ${result.data.purchase_id}\nTotal: M${Number(result.data.total_amount).toFixed(2)}\nStock has been updated.`
            );

            resetPurchaseForm();
            setShowPurchaseModal(false);
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    const addSale = async (event) => {
        event.preventDefault();

        const itemsAreValid = saleForm.items.every((item) => {
            return (
                item.fruit_id &&
                Number.isInteger(Number(item.quantity)) &&
                Number(item.quantity) > 0
            );
        });

        if (!saleForm.vendor_id) {
            alert('Please select a vendor.');
            return;
        }

        if (!itemsAreValid) {
            alert('Please complete all sale item fields correctly.');
            return;
        }

        if (
            !Number.isFinite(Number(saleForm.amount_paid)) ||
            Number(saleForm.amount_paid) < 0 ||
            Number(saleForm.amount_paid) > saleTotal
        ) {
            alert('Amount paid must be between zero and the sale total.');
            return;
        }

        try {
            const saleData = {
                vendor_id: Number(saleForm.vendor_id),
                payment_method: saleForm.payment_method,
                amount_paid: Number(saleForm.amount_paid),
                items: saleForm.items.map((item) => ({
                    fruit_id: Number(item.fruit_id),
                    packaging_size: item.packaging_size,
                    quantity: Number(item.quantity)
                }))
            };

            const response = await fetch('https://batloung-farm-backend.onrender.com/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saleData)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Could not record sale.');
                return;
            }

            setLastSale(result.data);
            alert(
                `Sale recorded successfully!\nSale ID: ${result.data.sale_id}\nTotal: M${Number(result.data.total_amount).toFixed(2)}\nAmount Paid: M${Number(result.data.amount_paid).toFixed(2)}\nOutstanding Balance: M${Number(result.data.outstanding_balance).toFixed(2)}\nPayment Status: ${result.data.payment_status}\nStock has been updated.`
            );

            resetSaleForm();
            setShowSaleModal(false);
        } catch (error) {
            alert('Could not connect to the server.');
        }
    };

    return (
        <div className="app">
            <header className="header">
                <h1>Batloung Farm Distribution System</h1>
                <p>Manage your fruit distribution business</p>
            </header>

            <div className="layout">
                <aside className="sidebar">
                    <h2>Menu</h2>

                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'active' : ''}
                            onClick={() => {
                                setActiveTab(tab);

                                if (tab === 'Suppliers') loadSuppliers();
                                if (tab === 'Fruits') loadFruits();
                                if (tab === 'Stock') loadStock();
                                if (tab === 'Reports') loadReports();

                                if (tab === 'Vendors') {
                                    setVendorSearchTerm('');
                                    loadVendors();
                                }

                                if (tab === 'Purchases') {
                                    loadSuppliers();
                                    loadFruits();
                                }

                                if (tab === 'Sales') {
                                    loadVendors();
                                    loadFruits();
                                }
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </aside>

                <main className="content">
                    <h2>{activeTab}</h2>

                    {activeTab === 'Dashboard' && (
                        <>
                            <p>Welcome back! Here is an overview of your business.</p>

                            <div className="dashboard-cards">
                                <div className="dashboard-card">
                                    <h3>Total Suppliers</h3>
                                    <h2>8</h2>
                                    <p>Registered suppliers</p>
                                </div>

                                <div className="dashboard-card">
                                    <h3>Total Fruits</h3>
                                    <h2>5</h2>
                                    <p>Available fruit types</p>
                                </div>

                                <div className="dashboard-card">
                                    <h3>Total Vendors</h3>
                                    <h2>5</h2>
                                    <p>Registered vendors</p>
                                </div>

                                <div className="dashboard-card">
                                    <h3>Stock Records</h3>
                                    <h2>6</h2>
                                    <p>Fruit packaging records</p>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'Suppliers' && (
                        <>
                            <button
                                className="add-button"
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                            >
                                + Add Supplier
                            </button>

                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Business Name</th>
                                        <th>Contact Person</th>
                                        <th>Phone</th>
                                        <th>Province</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {suppliers.map((supplier) => (
                                        <tr key={supplier.supplier_id}>
                                            <td>{supplier.supplier_id}</td>
                                            <td>{supplier.business_name}</td>
                                            <td>{supplier.contact_person}</td>
                                            <td>{supplier.phone}</td>
                                            <td>{supplier.province}</td>
                                            <td>{supplier.address}</td>
                                            <td>
                                                <button
                                                    className="add-button"
                                                    onClick={() => openEditModal(supplier)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="cancel-button"
                                                    onClick={() => {
                                                        setDeletingSupplier(supplier);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {suppliers.length === 0 && (
                                        <tr>
                                            <td colSpan="7">No suppliers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {activeTab === 'Fruits' && (
                        <>
                            <button
                                className="add-button"
                                onClick={() => {
                                    resetFruitForm();
                                    setShowFruitModal(true);
                                }}
                            >
                                + Add Fruit
                            </button>

                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fruit Name</th>
                                        <th>Description</th>
                                        <th>Small Price</th>
                                        <th>Medium Price</th>
                                        <th>Large Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fruits.map((fruit) => (
                                        <tr key={fruit.fruit_id}>
                                            <td>{fruit.fruit_id}</td>
                                            <td>{fruit.fruit_name}</td>
                                            <td>{fruit.description}</td>
                                            <td>M{Number(fruit.small_selling_price).toFixed(2)}</td>
                                            <td>M{Number(fruit.medium_selling_price).toFixed(2)}</td>
                                            <td>M{Number(fruit.large_selling_price).toFixed(2)}</td>
                                            <td>{fruit.status}</td>
                                            <td>
                                                <button
                                                    className="add-button"
                                                    onClick={() => openFruitEditModal(fruit)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="cancel-button"
                                                    onClick={() => {
                                                        setDeletingFruit(fruit);
                                                        setShowFruitDeleteModal(true);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {fruits.length === 0 && (
                                        <tr>
                                            <td colSpan="8">No fruits found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {activeTab === 'Vendors' && (
                        <>
                            <button
                                className="add-button"
                                onClick={() => {
                                    resetVendorForm();
                                    setShowVendorModal(true);
                                }}
                            >
                                + Register Vendor
                            </button>

                            <form
                                className="vendor-search"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    loadVendors(vendorSearchTerm);
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search by vendor name, phone or location"
                                    value={vendorSearchTerm}
                                    onChange={(event) => setVendorSearchTerm(event.target.value)}
                                />

                                <button type="submit" className="add-button">Search</button>

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {
                                        setVendorSearchTerm('');
                                        loadVendors();
                                    }}
                                >
                                    Clear
                                </button>
                            </form>

                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Vendor Name</th>
                                        <th>Phone Number</th>
                                        <th>Location</th>
                                        <th>Registration Date</th>
                                        <th>Outstanding Balance</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {vendors.map((vendor) => (
                                        <tr key={vendor.vendor_id}>
                                            <td>{vendor.vendor_id}</td>
                                            <td>{vendor.vendor_name}</td>
                                            <td>{vendor.phone_number}</td>
                                            <td>{vendor.location}</td>
                                            <td>{vendor.registration_date ? String(vendor.registration_date).slice(0, 10) : ''}</td>
                                            <td>M{Number(vendor.outstanding_balance || 0).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="add-button"
                                                    onClick={() => openVendorEditModal(vendor)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {vendors.length === 0 && (
                                        <tr>
                                            <td colSpan="7">No vendors found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {activeTab === 'Purchases' && (
                        <>
                            <p>Record purchases from suppliers and automatically update fruit stock.</p>

                            <button
                                className="add-button"
                                onClick={() => {
                                    resetPurchaseForm();
                                    loadSuppliers();
                                    loadFruits();
                                    setShowPurchaseModal(true);
                                }}
                            >
                                + Record Purchase
                            </button>

                            {lastPurchase && (
                                <div className="dashboard-card">
                                    <h3>Last Purchase Recorded</h3>
                                    <h2>#{lastPurchase.purchase_id}</h2>
                                    <p>
                                        Total Amount: M{Number(lastPurchase.total_amount).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'Sales' && (
                        <>
                            <p>Record vendor sales, calculate payments and automatically reduce fruit stock.</p>

                            <button
                                className="add-button"
                                onClick={() => {
                                    resetSaleForm();
                                    loadVendors();
                                    loadFruits();
                                    setShowSaleModal(true);
                                }}
                            >
                                + Record Sale
                            </button>

                            {lastSale && (
                                <div className="dashboard-card">
                                    <h3>Last Sale Recorded</h3>
                                    <h2>#{lastSale.sale_id}</h2>
                                    <p>Total Amount: M{Number(lastSale.total_amount).toFixed(2)}</p>
                                    <p>Amount Paid: M{Number(lastSale.amount_paid).toFixed(2)}</p>
                                    <p>Outstanding Balance: M{Number(lastSale.outstanding_balance).toFixed(2)}</p>
                                    <p>Payment Status: {lastSale.payment_status}</p>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'Stock' && (
                        <>
                            <p>View the available quantity of each fruit by packaging size.</p>

                            <button className="add-button" onClick={loadStock}>
                                Refresh Stock
                            </button>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Fruit</th>
                                        <th>Packaging Size</th>
                                        <th>Available Quantity</th>
                                        <th>Stock Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stock.map((item, index) => (
                                        <tr key={`${item.fruit_id}-${item.packaging_size}-${index}`}>
                                            <td>{item.fruit_name}</td>
                                            <td>{item.packaging_size}</td>
                                            <td>{item.available_quantity}</td>
                                            <td>
                                                {Number(item.available_quantity) <= 10
                                                    ? 'Low Stock'
                                                    : 'In Stock'}
                                            </td>
                                        </tr>
                                    ))}

                                    {stock.length === 0 && (
                                        <tr>
                                            <td colSpan="4">No stock records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {activeTab === 'Reports' && (
                        <>
                            <p>View sales performance, revenue, vendor activity and current stock reports.</p>

                            <button className="add-button" onClick={loadReports}>
                                Refresh Reports
                            </button>

                            <div className="dashboard-card">
                                <h3>Top 5 Fruits Sold</h3>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fruit</th>
                                            <th>Boxes Sold</th>
                                            <th>Total Revenue</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {topFruits.map((item, index) => (
                                            <tr key={item.fruit_id || item.fruit_name || index}>
                                                <td>{item.fruit_name}</td>
                                                <td>{item.total_boxes ?? item.boxes_sold ?? item.total_quantity ?? 0}</td>
                                                <td>M{Number(item.total_revenue ?? item.revenue ?? 0).toFixed(2)}</td>
                                            </tr>
                                        ))}

                                        {topFruits.length === 0 && (
                                            <tr>
                                                <td colSpan="3">No fruit sales report available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="dashboard-card" style={{ marginTop: '20px' }}>
                                <h3>Revenue Report</h3>
                                <p>Select a date range to calculate total sales revenue.</p>

                                <form
                                    onSubmit={generateRevenueReport}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        flexWrap: 'wrap',
                                        alignItems: 'end'
                                    }}
                                >
                                    <div>
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(event) => setStartDate(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(event) => setEndDate(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="add-button">
                                        Generate Revenue
                                    </button>
                                </form>

                                {revenueReport && (
                                    <div style={{ marginTop: '15px' }}>
                                        <h3>
                                            Total Revenue: M{Number(
                                                revenueReport.total_revenue ??
                                                revenueReport.totalRevenue ??
                                                revenueReport.revenue ??
                                                revenueReport.total_sales ??
                                                revenueReport.data?.total_revenue ??
                                                revenueReport.data?.totalRevenue ??
                                                0
                                            ).toFixed(2)}
                                        </h3>
                                        <p>Period: {startDate} to {endDate}</p>
                                    </div>
                                )}
                            </div>

                            <div className="dashboard-card" style={{ marginTop: '20px' }}>
                                <h3>Top Vendor</h3>

                                {topVendor ? (
                                    <>
                                        <p>Vendor: {topVendor.vendor_name || topVendor.name || 'Not available'}</p>
                                        <p>Vendor ID: {topVendor.vendor_id ?? 'Not available'}</p>
                                        <p>
                                            Total Boxes Purchased: {
                                                topVendor.total_boxes ??
                                                topVendor.boxes_purchased ??
                                                topVendor.total_quantity ??
                                                0
                                            }
                                        </p>
                                    </>
                                ) : (
                                    <p>No vendor report available.</p>
                                )}
                            </div>

                            <div className="dashboard-card" style={{ marginTop: '20px' }}>
                                <h3>Current Stock Report</h3>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fruit</th>
                                            <th>Packaging Size</th>
                                            <th>Available Quantity</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reportStock.map((item, index) => (
                                            <tr key={`${item.fruit_id}-${item.packaging_size}-${index}`}>
                                                <td>{item.fruit_name}</td>
                                                <td>{item.packaging_size}</td>
                                                <td>{item.available_quantity}</td>
                                            </tr>
                                        ))}

                                        {reportStock.length === 0 && (
                                            <tr>
                                                <td colSpan="3">No stock report available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {showModal && (
                <Modal title="Add New Supplier" onClose={() => setShowModal(false)}>
                    <form onSubmit={addSupplier}>
                        <input name="business_name" placeholder="Business Name" value={form.business_name} onChange={handleChange} required />
                        <input name="contact_person" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} required />
                        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />

                        <select name="province" value={form.province} onChange={handleChange} required>
                            <option value="">Select Province</option>
                            <option>Gauteng</option>
                            <option>Free State</option>
                            <option>KwaZulu-Natal</option>
                            <option>Western Cape</option>
                            <option>Eastern Cape</option>
                            <option>Limpopo</option>
                            <option>Mpumalanga</option>
                            <option>North West</option>
                        </select>

                        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
                        <button type="submit">Save Supplier</button>
                        <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                    </form>
                </Modal>
            )}

            {editingSupplier && (
                <Modal
                    title="Edit Supplier"
                    onClose={() => {
                        setEditingSupplier(null);
                        resetForm();
                    }}
                >
                    <form onSubmit={editSupplier}>
                        <input name="business_name" placeholder="Business Name" value={form.business_name} onChange={handleChange} required />
                        <input name="contact_person" placeholder="Contact Person" value={form.contact_person} onChange={handleChange} required />
                        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />

                        <select name="province" value={form.province} onChange={handleChange} required>
                            <option value="">Select Province</option>
                            <option>Gauteng</option>
                            <option>Free State</option>
                            <option>KwaZulu-Natal</option>
                            <option>Western Cape</option>
                            <option>Eastern Cape</option>
                            <option>Limpopo</option>
                            <option>Mpumalanga</option>
                            <option>North West</option>
                        </select>

                        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
                        <button type="submit">Update Supplier</button>
                        <button type="button" className="cancel-button" onClick={() => {
                            setEditingSupplier(null);
                            resetForm();
                        }}>
                            Cancel
                        </button>
                    </form>
                </Modal>
            )}

            {showDeleteModal && deletingSupplier && (
                <Modal
                    title="Delete Supplier"
                    onClose={() => {
                        setShowDeleteModal(false);
                        setDeletingSupplier(null);
                    }}
                >
                    <p>Are you sure you want to delete {deletingSupplier.business_name}?</p>
                    <button type="button" className="cancel-button" onClick={deleteSupplier}>Yes, Delete</button>
                    <button type="button" className="add-button" onClick={() => {
                        setShowDeleteModal(false);
                        setDeletingSupplier(null);
                    }}>
                        Cancel
                    </button>
                </Modal>
            )}

            {showFruitModal && (
                <Modal title="Add New Fruit" onClose={() => setShowFruitModal(false)}>
                    <form onSubmit={addFruit}>
                        <input name="fruit_name" placeholder="Fruit Name" value={fruitForm.fruit_name} onChange={handleFruitChange} required />
                        <textarea name="description" placeholder="Fruit Description" value={fruitForm.description} onChange={handleFruitChange} />
                        <input type="number" name="small_selling_price" placeholder="Small Box Selling Price" value={fruitForm.small_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />
                        <input type="number" name="medium_selling_price" placeholder="Medium Box Selling Price" value={fruitForm.medium_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />
                        <input type="number" name="large_selling_price" placeholder="Large Box Selling Price" value={fruitForm.large_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />

                        <select name="status" value={fruitForm.status} onChange={handleFruitChange} required>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>

                        <button type="submit">Save Fruit</button>
                        <button type="button" className="cancel-button" onClick={() => setShowFruitModal(false)}>Cancel</button>
                    </form>
                </Modal>
            )}

            {editingFruit && (
                <Modal
                    title="Edit Fruit"
                    onClose={() => {
                        setEditingFruit(null);
                        resetFruitForm();
                    }}
                >
                    <form onSubmit={editFruit}>
                        <input name="fruit_name" placeholder="Fruit Name" value={fruitForm.fruit_name} onChange={handleFruitChange} required />
                        <textarea name="description" placeholder="Fruit Description" value={fruitForm.description} onChange={handleFruitChange} />
                        <input type="number" name="small_selling_price" placeholder="Small Box Selling Price" value={fruitForm.small_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />
                        <input type="number" name="medium_selling_price" placeholder="Medium Box Selling Price" value={fruitForm.medium_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />
                        <input type="number" name="large_selling_price" placeholder="Large Box Selling Price" value={fruitForm.large_selling_price} onChange={handleFruitChange} min="0" step="0.01" required />

                        <select name="status" value={fruitForm.status} onChange={handleFruitChange} required>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>

                        <button type="submit">Update Fruit</button>
                        <button type="button" className="cancel-button" onClick={() => {
                            setEditingFruit(null);
                            resetFruitForm();
                        }}>
                            Cancel
                        </button>
                    </form>
                </Modal>
            )}

            {showFruitDeleteModal && deletingFruit && (
                <Modal
                    title="Delete Fruit"
                    onClose={() => {
                        setShowFruitDeleteModal(false);
                        setDeletingFruit(null);
                    }}
                >
                    <p>Are you sure you want to delete {deletingFruit.fruit_name}?</p>
                    <button type="button" className="cancel-button" onClick={deleteFruit}>Yes, Delete</button>
                    <button type="button" className="add-button" onClick={() => {
                        setShowFruitDeleteModal(false);
                        setDeletingFruit(null);
                    }}>
                        Cancel
                    </button>
                </Modal>
            )}

            {showVendorModal && (
                <Modal title="Register New Vendor" onClose={() => setShowVendorModal(false)}>
                    <form onSubmit={addVendor}>
                        <input name="vendor_name" placeholder="Vendor Name" value={vendorForm.vendor_name} onChange={handleVendorChange} required />
                        <input name="phone_number" placeholder="Phone Number" value={vendorForm.phone_number} onChange={handleVendorChange} required />
                        <input name="location" placeholder="Location" value={vendorForm.location} onChange={handleVendorChange} required />
                        <label>Registration Date</label>
                        <input type="date" name="registration_date" value={vendorForm.registration_date} onChange={handleVendorChange} required />
                        <button type="submit">Register Vendor</button>
                        <button type="button" className="cancel-button" onClick={() => setShowVendorModal(false)}>Cancel</button>
                    </form>
                </Modal>
            )}

            {editingVendor && (
                <Modal
                    title="Edit Vendor"
                    onClose={() => {
                        setEditingVendor(null);
                        resetVendorForm();
                    }}
                >
                    <form onSubmit={editVendor}>
                        <input name="vendor_name" placeholder="Vendor Name" value={vendorForm.vendor_name} onChange={handleVendorChange} required />
                        <input name="phone_number" placeholder="Phone Number" value={vendorForm.phone_number} onChange={handleVendorChange} required />
                        <input name="location" placeholder="Location" value={vendorForm.location} onChange={handleVendorChange} required />
                        <label>Registration Date</label>
                        <input type="date" name="registration_date" value={vendorForm.registration_date} onChange={handleVendorChange} required />
                        <button type="submit">Update Vendor</button>
                        <button type="button" className="cancel-button" onClick={() => {
                            setEditingVendor(null);
                            resetVendorForm();
                        }}>
                            Cancel
                        </button>
                    </form>
                </Modal>
            )}

            {showPurchaseModal && (
                <Modal
                    title="Record New Purchase"
                    onClose={() => setShowPurchaseModal(false)}
                >
                    <form onSubmit={addPurchase}>
                        <label>Select Supplier</label>

                        <select
                            value={purchaseForm.supplier_id}
                            onChange={(event) => setPurchaseForm({
                                ...purchaseForm,
                                supplier_id: event.target.value
                            })}
                            required
                        >
                            <option value="">Choose a supplier</option>
                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.supplier_id}
                                    value={supplier.supplier_id}
                                >
                                    {supplier.business_name}
                                </option>
                            ))}
                        </select>

                        <h3>Purchase Items</h3>

                        {purchaseForm.items.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #DED3EB',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}
                            >
                                <h4>Item {index + 1}</h4>

                                <label>Fruit</label>
                                <select
                                    name="fruit_id"
                                    value={item.fruit_id}
                                    onChange={(event) => handlePurchaseItemChange(index, event)}
                                    required
                                >
                                    <option value="">Select Fruit</option>
                                    {fruits.map((fruit) => (
                                        <option
                                            key={fruit.fruit_id}
                                            value={fruit.fruit_id}
                                        >
                                            {fruit.fruit_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Packaging Size</label>
                                <select
                                    name="packaging_size"
                                    value={item.packaging_size}
                                    onChange={(event) => handlePurchaseItemChange(index, event)}
                                    required
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>

                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity of boxes"
                                    min="1"
                                    step="1"
                                    value={item.quantity}
                                    onChange={(event) => handlePurchaseItemChange(index, event)}
                                    required
                                />

                                <label>Cost Per Box (M)</label>
                                <input
                                    type="number"
                                    name="unit_cost"
                                    placeholder="Cost per box"
                                    min="0"
                                    step="0.01"
                                    value={item.unit_cost}
                                    onChange={(event) => handlePurchaseItemChange(index, event)}
                                    required
                                />

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => removePurchaseItem(index)}
                                >
                                    Remove Item
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-button"
                            onClick={addPurchaseItem}
                        >
                            + Add Another Fruit
                        </button>

                        <div className="dashboard-card">
                            <h3>Purchase Total</h3>
                            <h2>M{purchaseTotal.toFixed(2)}</h2>
                        </div>

                        <button type="submit">Save Purchase</button>

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowPurchaseModal(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </Modal>
            )}

            {showSaleModal && (
                <Modal
                    title="Record New Sale"
                    onClose={() => setShowSaleModal(false)}
                >
                    <form onSubmit={addSale}>
                        <label>Select Vendor</label>

                        <select
                            value={saleForm.vendor_id}
                            onChange={(event) => setSaleForm({
                                ...saleForm,
                                vendor_id: event.target.value
                            })}
                            required
                        >
                            <option value="">Choose a vendor</option>
                            {vendors.map((vendor) => (
                                <option
                                    key={vendor.vendor_id}
                                    value={vendor.vendor_id}
                                >
                                    {vendor.vendor_name}
                                </option>
                            ))}
                        </select>

                        <h3>Sale Items</h3>

                        {saleForm.items.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    border: '1px solid #DED3EB',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}
                            >
                                <h4>Item {index + 1}</h4>

                                <label>Fruit</label>
                                <select
                                    name="fruit_id"
                                    value={item.fruit_id}
                                    onChange={(event) => handleSaleItemChange(index, event)}
                                    required
                                >
                                    <option value="">Select Fruit</option>
                                    {fruits.filter((fruit) => fruit.status === 'Available').map((fruit) => (
                                        <option
                                            key={fruit.fruit_id}
                                            value={fruit.fruit_id}
                                        >
                                            {fruit.fruit_name}
                                        </option>
                                    ))}
                                </select>

                                <label>Packaging Size</label>
                                <select
                                    name="packaging_size"
                                    value={item.packaging_size}
                                    onChange={(event) => handleSaleItemChange(index, event)}
                                    required
                                >
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>

                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity of boxes"
                                    min="1"
                                    step="1"
                                    value={item.quantity}
                                    onChange={(event) => handleSaleItemChange(index, event)}
                                    required
                                />

                                <p>Price Per Box: M{getSaleUnitPrice(item).toFixed(2)}</p>
                                <p>Item Total: M{(Number(item.quantity || 0) * getSaleUnitPrice(item)).toFixed(2)}</p>

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => removeSaleItem(index)}
                                >
                                    Remove Item
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-button"
                            onClick={addSaleItem}
                        >
                            + Add Another Fruit
                        </button>

                        <div className="dashboard-card">
                            <h3>Sale Total</h3>
                            <h2>M{saleTotal.toFixed(2)}</h2>
                        </div>

                        <label>Payment Method</label>

                        <select
                            value={saleForm.payment_method}
                            onChange={(event) => setSaleForm({
                                ...saleForm,
                                payment_method: event.target.value
                            })}
                            required
                        >
                            <option value="CASH">Cash</option>
                            <option value="MOBILE_MONEY">Mobile Money</option>
                            <option value="CREDIT">Credit</option>
                        </select>

                        <label>Amount Paid (M)</label>

                        <input
                            type="number"
                            min="0"
                            max={saleTotal}
                            step="0.01"
                            value={saleForm.amount_paid}
                            onChange={(event) => setSaleForm({
                                ...saleForm,
                                amount_paid: event.target.value
                            })}
                            required
                        />

                        <div className="dashboard-card">
                            <h3>Outstanding Balance</h3>
                            <h2>M{outstandingBalance.toFixed(2)}</h2>
                            <p>
                                Payment Status: {
                                    Number(saleForm.amount_paid) >= saleTotal && saleTotal > 0
                                        ? 'PAID'
                                        : Number(saleForm.amount_paid) > 0
                                            ? 'PARTIALLY_PAID'
                                            : 'UNPAID'
                                }
                            </p>
                        </div>

                        <button type="submit">Save Sale</button>

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowSaleModal(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
}

export default App;
